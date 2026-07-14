'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { run, parseArgs, UsageError } = require('../index');

const AI_TEXT =
  "In today's rapidly evolving landscape, artificial intelligence is reshaping how we think about creativity every single day. " +
  'This groundbreaking shift represents a pivotal moment that underscores the intricate interplay between innovation and art. ' +
  'As we delve deeper into this fascinating realm, it becomes crucial to understand the multifaceted implications involved here. ' +
  'Industry experts consistently highlight that this ongoing transformation will foster new forms of collaboration going forward.';

const HUMAN_TEXT =
  "I've messed with AI image tools for six months. Still can't decide if I love them. " +
  'Last week I got a portrait better than anything I could paint in a year, and it made me a little sick. ' +
  "There's something missing. Flavor, maybe. My friends are split: half use them daily, half won't touch them. Neither side is wrong.";

// Run the CLI with stdout/stderr suppressed so test output stays clean.
function silent(fn) {
  const so = process.stdout.write;
  const se = process.stderr.write;
  process.stdout.write = () => true;
  process.stderr.write = () => true;
  try {
    return fn();
  } finally {
    process.stdout.write = so;
    process.stderr.write = se;
  }
}

function tmpFile(name, contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-'));
  const p = path.join(dir, name);
  fs.writeFileSync(p, contents);
  return { dir, p };
}

test('parseArgs handles flags and positionals', () => {
  const o = parseArgs(['score', 'a.md', '--fail-above', '30', '--ignore-code']);
  assert.strictEqual(o._[0], 'score');
  assert.strictEqual(o._[1], 'a.md');
  assert.strictEqual(o.failAbove, 30);
  assert.strictEqual(o.ignoreCode, true);
});

test('parseArgs rejects unknown option', () => {
  assert.throws(() => parseArgs(['score', '--nope']), UsageError);
});

test('score command exits 0 on a normal file', () => {
  const { p } = tmpFile('a.md', HUMAN_TEXT);
  const code = silent(() => run(['score', p]));
  assert.strictEqual(code, 0);
});

test('score --json emits parseable JSON', () => {
  const { p } = tmpFile('a.md', AI_TEXT);
  let out = '';
  const so = process.stdout.write;
  process.stdout.write = (s) => {
    out += s;
    return true;
  };
  try {
    run(['score', p, '--json']);
  } finally {
    process.stdout.write = so;
  }
  const parsed = JSON.parse(out);
  assert.ok(typeof parsed.score === 'number');
  assert.ok(parsed.metrics && 'burstiness' in parsed.metrics);
});

test('--fail-above gates on score', () => {
  const { p } = tmpFile('ai.md', AI_TEXT);
  const fail = silent(() => run(['score', p, '--fail-above', '5']));
  const pass = silent(() => run(['score', p, '--fail-above', '99']));
  assert.strictEqual(fail, 1);
  assert.strictEqual(pass, 0);
});

test('scan command scores a directory', () => {
  const { dir } = tmpFile('one.md', AI_TEXT);
  fs.writeFileSync(path.join(dir, 'two.md'), HUMAN_TEXT);
  fs.writeFileSync(path.join(dir, 'ignore.log'), AI_TEXT);
  const code = silent(() => run(['scan', dir]));
  assert.strictEqual(code, 0);
});

test('scan --fail-above gates on the worst file', () => {
  const { dir } = tmpFile('ai.md', AI_TEXT);
  const code = silent(() => run(['scan', dir, '--fail-above', '5']));
  assert.strictEqual(code, 1);
});

test('write-baseline then fail-on-regression detects a worse rewrite', () => {
  const { dir, p } = tmpFile('doc.md', HUMAN_TEXT);
  const baseline = path.join(dir, 'baseline.json');
  // baseline from the clean human version
  silent(() => run(['score', p, '--baseline', baseline, '--write-baseline']));
  assert.ok(fs.existsSync(baseline));
  // regress the file to AI-heavy text
  fs.writeFileSync(p, AI_TEXT);
  const code = silent(() => run(['score', p, '--baseline', baseline, '--fail-on-regression']));
  assert.strictEqual(code, 1);
});

test('compare command exits 0', () => {
  const a = tmpFile('before.md', AI_TEXT);
  const b = tmpFile('after.md', HUMAN_TEXT);
  const code = silent(() => run(['compare', '--before', a.p, '--after', b.p]));
  assert.strictEqual(code, 0);
});

test('help exits 0, no-args exits 2', () => {
  assert.strictEqual(silent(() => run(['--help'])), 0);
  assert.strictEqual(silent(() => run([])), 2);
});

test('missing file throws (handled as exit 2 at top level)', () => {
  assert.throws(() => silent(() => run(['score', '/no/such/file/xyz.md'])));
});

test('unknown command throws UsageError', () => {
  assert.throws(() => silent(() => run(['frobnicate'])), UsageError);
});
