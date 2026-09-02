'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { spawnSync } = require('child_process');

const { run, parseArgs, UsageError } = require('../index');

// CI runs `node --test` with working-directory: cli, so the bin must be resolved from
// this file, never from a repo-relative literal.
const BIN = path.join(__dirname, '..', 'index.js');
const PKG = require('../package.json');

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

test('--fail-above rejects a missing or non-numeric value', () => {
  // missing value (end of args) and a following flag both must error, not silently disable the gate
  assert.throws(() => parseArgs(['score', 'a.md', '--fail-above']), UsageError);
  assert.throws(() => parseArgs(['score', 'a.md', '--fail-above', '--json']), UsageError);
  assert.strictEqual(parseArgs(['score', 'a.md', '--fail-above', '40']).failAbove, 40);
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

// --- multi-path scan -----------------------------------------------------------

test('scan takes more than one path and reports each file once', () => {
  const { dir, p } = tmpFile('one.md', AI_TEXT);
  const two = path.join(dir, 'two.md');
  fs.writeFileSync(two, HUMAN_TEXT);
  let out = '';
  const so = process.stdout.write;
  process.stdout.write = (s) => {
    out += s;
    return true;
  };
  try {
    run(['scan', p, two, two, '--json']);
  } finally {
    process.stdout.write = so;
  }
  const parsed = JSON.parse(out);
  assert.strictEqual(parsed.files.length, 2, 'the repeated path is scored once');
  assert.deepStrictEqual(
    parsed.files.map((f) => f.file),
    [p, two]
  );
});

test('scan gates on the worst of several named files', () => {
  const { dir, p } = tmpFile('human.md', HUMAN_TEXT);
  const bad = path.join(dir, 'ai.md');
  fs.writeFileSync(bad, AI_TEXT);
  assert.strictEqual(silent(() => run(['scan', p, '--fail-above', '40'])), 0);
  assert.strictEqual(silent(() => run(['scan', p, bad, '--fail-above', '40'])), 1);
});

test('scan with no path is a usage error, and a missing path is not skipped', () => {
  assert.throws(() => silent(() => run(['scan'])), UsageError);
  const { p } = tmpFile('a.md', HUMAN_TEXT);
  assert.throws(() => silent(() => run(['scan', p, '/no/such/file/xyz.md'])));
});

// --- the packaged binary -------------------------------------------------------

test('the bin runs as a child process and prints usage', () => {
  const r = spawnSync(process.execPath, [BIN, '--help'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.match(r.stdout, /humanizer-metrics - compute writing metrics/);
  assert.match(r.stdout, /--check-facts/);
});

test('the bin honours --fail-above from a real shell invocation', () => {
  const { p } = tmpFile('ai.md', AI_TEXT);
  assert.strictEqual(spawnSync(process.execPath, [BIN, 'score', p, '--fail-above', '5']).status, 1);
  assert.strictEqual(spawnSync(process.execPath, [BIN, 'score', p, '--fail-above', '99']).status, 0);
  assert.strictEqual(spawnSync(process.execPath, [BIN, 'frobnicate']).status, 2);
});

test('the package is shaped so npm can build a working bin shim', () => {
  assert.strictEqual(PKG.bin['humanizer-metrics'], 'index.js');
  const target = path.join(__dirname, '..', PKG.bin['humanizer-metrics']);
  assert.ok(fs.existsSync(target), 'bin target exists');
  assert.ok(fs.statSync(target).mode & 0o111, 'bin target is executable');
  assert.match(fs.readFileSync(target, 'utf8').split('\n')[0], /^#!.*\bnode\b/, 'node shebang');
  assert.strictEqual(PKG.engines.node, '>=18');
  assert.strictEqual(PKG.dependencies, undefined, 'zero runtime dependencies');
});

test('every shipped module resolves inside the files allowlist', () => {
  // A require that reaches outside index.js and lib/ would break the moment the
  // tarball is installed, and npm pack would not tell us.
  const shipped = ['index.js', ...fs.readdirSync(path.join(__dirname, '..', 'lib')).map((f) => 'lib/' + f)];
  const allowed = new Set(shipped);
  for (const rel of shipped) {
    const src = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
    for (const m of src.matchAll(/require\('([^']+)'\)/g)) {
      const dep = m[1];
      if (!dep.startsWith('.')) continue; // node builtin
      const resolved = path
        .relative(path.join(__dirname, '..'), path.resolve(path.dirname(path.join(__dirname, '..', rel)), dep))
        .replace(/\\/g, '/');
      const withExt = resolved.endsWith('.js') ? resolved : resolved + '.js';
      assert.ok(allowed.has(withExt), `${rel} requires ${dep} -> ${withExt}, which is not shipped`);
    }
  }
});
