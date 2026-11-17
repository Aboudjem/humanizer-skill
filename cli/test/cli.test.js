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

// --- verdict-first report -------------------------------------------------------

const { formatScore, formatScan } = require('../lib/report');
const { scoreText } = require('../lib/metrics');
const { scanPaths, isExcluded } = require('../lib/scan');

test('the score report puts the verdict first, then what to fix, then the detail', () => {
  const lines = formatScore(scoreText(AI_TEXT), 'draft.md').split('\n');
  assert.strictEqual(lines[0], 'draft.md');
  assert.match(lines[1], /^Score: \d+\/100 {2}\(/);
  assert.strictEqual(lines[2], 'Fix first:');
  const detail = lines.indexOf('Detail:');
  const actions = lines.slice(3, detail);
  assert.ok(actions.length >= 2, 'at least one signal action and the closing step');
  actions.forEach((l, i) => assert.match(l, new RegExp('^ {2}' + (i + 1) + '\\. \\S')));
  assert.ok(detail > 2 && /Signal breakdown/.test(lines[detail + 1]), 'the breakdown sits under Detail');
});

test('the first action names the stock words it found', () => {
  const r = scoreText(AI_TEXT);
  assert.strictEqual(r.actions[0].signal, 'lexical');
  assert.match(r.actions[0].text, /"in today's"/);
  assert.match(r.actions[0].text, /^Cut the stock AI words: \d+ found/);
});

test('actions are ordered by cost and each one maps to a signal that costs a point', () => {
  const r = scoreText(AI_TEXT);
  const pts = r.actions.map((a) => a.points);
  assert.deepStrictEqual(pts, pts.slice().sort((a, b) => b - a));
  for (const a of r.actions) {
    const s = r.signals.find((x) => x.name === a.signal);
    assert.ok(s && s.points >= 1, a.signal + ' costs at least one point');
  }
  assert.ok(r.actions.length <= 3);
});

test('a repetition action quotes the repeated phrase with its count', () => {
  const text = (
    'The quick brown fox jumps over the lazy dog near the river bank today. ' +
    'Then the quick brown fox jumps over the lazy dog near the river bank again. ' +
    'Later the quick brown fox jumps over the lazy dog near the river bank once more. '
  ).repeat(2);
  const r = scoreText(text);
  const a = r.actions.find((x) => x.signal === 'repetition');
  assert.ok(a, 'repetition is flagged');
  assert.match(a.text, /"[a-z ]+" x\d+/);
});

test('a text in the lowest band gets no action list, and the report says so', () => {
  const r = scoreText(HUMAN_TEXT);
  assert.ok(r.score <= 20);
  assert.deepStrictEqual(r.actions, []);
  const out = formatScore(r, 'a.md');
  assert.match(out, /Nothing to fix first/);
  assert.doesNotMatch(out, /Fix first:/);
});

test('the closing step names the file, and drops --file for stdin', () => {
  assert.match(formatScore(scoreText(AI_TEXT), 'draft.md'), /\/humanizer --file draft\.md\)/);
  const stdin = formatScore(scoreText(AI_TEXT), 'stdin');
  assert.match(stdin, /\(\/humanizer\)/);
  assert.doesNotMatch(stdin, /--file/);
});

test('score --json carries the actions next to the existing fields', () => {
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
  assert.ok(Array.isArray(parsed.actions) && parsed.actions.length > 0);
  for (const k of ['metrics', 'score', 'scoreRaw', 'verdict', 'signals']) assert.ok(k in parsed, k);
});

// --- scan: verdict line, exclude, short samples ---------------------------------

test('scan with a gate opens with PASS or FAIL and lists the worst file first', () => {
  const { dir } = tmpFile('ai.md', AI_TEXT);
  fs.writeFileSync(path.join(dir, 'human.md'), HUMAN_TEXT);
  const scan = scanPaths([dir]);
  const failed = formatScan(scan, { failAbove: 40 }).split('\n');
  assert.match(failed[0], /^Result: FAIL\. 1 of 2 file\(s\) score above 40\.$/);
  assert.match(failed[3], /ai\.md {2}FAIL$/);
  const passed = formatScan(scan, { failAbove: 99 }).split('\n');
  assert.strictEqual(passed[0], 'Result: PASS. No file scores above 99.');
  assert.doesNotMatch(formatScan(scan).split('\n')[0], /^Result:/, 'no gate, no verdict line');
});

test('scan --exclude skips a file, a folder, and a starred name', () => {
  const { dir } = tmpFile('ai.md', AI_TEXT);
  fs.mkdirSync(path.join(dir, 'drafts'));
  fs.writeFileSync(path.join(dir, 'drafts', 'old.md'), AI_TEXT);
  fs.writeFileSync(path.join(dir, 'keep.md'), HUMAN_TEXT);
  const names = (exclude) => scanPaths([dir], { exclude }).files.map((f) => path.basename(f.file)).sort();
  assert.deepStrictEqual(names(), ['ai.md', 'keep.md', 'old.md']);
  assert.deepStrictEqual(names(['ai.md']), ['keep.md', 'old.md']);
  assert.deepStrictEqual(names(['drafts']), ['ai.md', 'keep.md']);
  assert.deepStrictEqual(names(['drafts/']), ['ai.md', 'keep.md']);
  assert.deepStrictEqual(names(['*.md']), []);
  assert.deepStrictEqual(names(['a*.md', 'drafts/old.md']), ['keep.md']);
  // the gate follows: excluding the two AI files turns a failing scan green
  assert.strictEqual(silent(() => run(['scan', dir, '--fail-above', '40'])), 1);
  assert.strictEqual(silent(() => run(['scan', dir, '--fail-above', '40', '--exclude', 'ai.md,drafts'])), 0);
});

test('an exclude pattern matches on directory boundaries only', () => {
  assert.strictEqual(isExcluded('docs/before.md', ['before.md']), true);
  assert.strictEqual(isExcluded('./docs/before.md', ['docs/before.md']), true);
  assert.strictEqual(isExcluded('docs/not-before.md', ['before.md']), false);
  assert.strictEqual(isExcluded('mydocs/a.md', ['docs']), false);
  assert.strictEqual(isExcluded('docs/a.md', []), false);
  assert.strictEqual(isExcluded('a/b/c.md', ['a/*.md']), false, 'a star stays inside one segment');
});

test('--exclude needs a value', () => {
  assert.throws(() => parseArgs(['scan', '.', '--exclude']), UsageError);
  assert.throws(() => parseArgs(['scan', '.', '--exclude', '--json']), UsageError);
  assert.deepStrictEqual(parseArgs(['scan', '.', '--exclude', 'a.md, b', '--exclude', 'c']).exclude, ['a.md', 'b', 'c']);
});

test('scan lists a sample under 40 words but never gates on it', () => {
  const short = "In today's rapidly evolving landscape, we delve into a pivotal, groundbreaking realm.";
  const { dir, p } = tmpFile('stub.md', short);
  const scan = scanPaths([dir]);
  assert.strictEqual(scan.files[0].shortSample, true);
  assert.ok(scan.files[0].score > 40, 'the stub would trip the gate on its score alone');
  assert.strictEqual(silent(() => run(['scan', dir, '--fail-above', '40'])), 0);
  assert.match(formatScan(scan, { failAbove: 40 }), /stub\.md {2}\(short sample, not gated\)/);
  // score on one named file keeps its old contract: the caller asked about that file
  assert.strictEqual(silent(() => run(['score', p, '--fail-above', '40'])), 1);
});

// --- the bundled example is the README's own demo --------------------------------

test('the bundled example pair: the rewrite scores lower and keeps every fact', () => {
  const root = path.join(__dirname, '..', '..', 'examples', 'blog-post');
  const before = path.join(root, 'before.md');
  const after = path.join(root, 'after.md');
  const b = scoreText(fs.readFileSync(before, 'utf8'));
  const a = scoreText(fs.readFileSync(after, 'utf8'));
  assert.ok(b.score > 40, 'the specimen is over the default gate');
  assert.ok(a.score <= 20, 'the rewrite is in the lowest band');
  const r = spawnSync(process.execPath, [BIN, 'compare', '--before', before, '--after', after, '--check-facts'], {
    encoding: 'utf8',
  });
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /OK\. All \d+ fact\(s\) in the original survive the rewrite\./);
});
