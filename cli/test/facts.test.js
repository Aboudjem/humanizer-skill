'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { extractFacts, diffFacts, factsInUrls, KINDS } = require('../lib/facts');
const { run } = require('../index');

const BEFORE =
  'We cut the bill from $5,400 to 2200 a month, a 59% drop, on 2026-04-16.\n' +
  'The runbook lives at https://example.com/runbook?id=42 and pins AWS SDK v0.7.0.\n' +
  'RDS stayed up the whole time.\n';

// Same facts, completely different wording. This is what a good rewrite looks like.
const AFTER_CLEAN =
  'On 16 April 2026 the monthly bill went from $5400 down to 2,200. That is 59%.\n' +
  'Version 0.7.0 of the AWS SDK is pinned, and the runbook is at\n' +
  'https://example.com/runbook?id=42. RDS never went down.\n';

// Drops a figure, mangles the URL, moves the date, downgrades the version.
const AFTER_LOSSY =
  'We cut the bill from $5,400 to a much lower number, a big drop, on 2026-04-17.\n' +
  'The runbook lives at https://example.com/runbooks?id=42 and pins AWS SDK v0.6.2.\n' +
  'RDS stayed up the whole time.\n';

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

function capture(fn) {
  let out = '';
  const so = process.stdout.write;
  const se = process.stderr.write;
  process.stdout.write = (s) => {
    out += s;
    return true;
  };
  process.stderr.write = () => true;
  try {
    fn();
  } finally {
    process.stdout.write = so;
    process.stderr.write = se;
  }
  return out;
}

function tmpPair(before, after) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-facts-'));
  const b = path.join(dir, 'before.md');
  const a = path.join(dir, 'after.md');
  fs.writeFileSync(b, before);
  fs.writeFileSync(a, after);
  return { dir, b, a };
}

test('extractFacts finds every kind and normalizes it', () => {
  const f = extractFacts(BEFORE);
  assert.deepStrictEqual(Object.keys(f).sort(), [...KINDS].sort());
  assert.ok(f.numbers.includes('5400'), 'thousands separator stripped');
  assert.ok(f.numbers.includes('2200'));
  assert.ok(f.percentages.includes('59%'));
  assert.ok(f.dates.includes('2026-04-16'));
  assert.ok(f.versions.includes('0.7.0'), 'v prefix stripped');
  assert.ok(f.urls.includes('https://example.com/runbook?id=42'));
  assert.ok(f.acronyms.includes('AWS'));
  assert.ok(f.acronyms.includes('RDS'));
});

test('a URL does not leak its digits into the number list', () => {
  const f = extractFacts('See https://example.com/a/12345/b for the 7 rules.');
  assert.deepStrictEqual(f.urls, ['https://example.com/a/12345/b']);
  assert.deepStrictEqual(f.numbers, ['7']);
});

test('a version is one token, not three numbers', () => {
  const f = extractFacts('Pinned at 0.7.0 with 12.5 seconds of headroom.');
  assert.deepStrictEqual(f.versions, ['0.7.0']);
  assert.deepStrictEqual(f.numbers, ['12.5'], 'a bare decimal stays a number');
});

test('a percentage is not read as a version', () => {
  const f = extractFacts('Accuracy fell to 12.5% overnight.');
  assert.deepStrictEqual(f.percentages, ['12.5%']);
  assert.deepStrictEqual(f.versions, []);
  assert.deepStrictEqual(f.numbers, []);
});

test('the three date spellings normalize to one token', () => {
  assert.deepStrictEqual(extractFacts('on 2026-04-16.').dates, ['2026-04-16']);
  assert.deepStrictEqual(extractFacts('on April 16, 2026.').dates, ['2026-04-16']);
  assert.deepStrictEqual(extractFacts('on 16 April 2026.').dates, ['2026-04-16']);
});

test('markup shouting is not a fact', () => {
  const f = extractFacts('> [!IMPORTANT]\n> TODO: check the AWS bill. OK?');
  assert.deepStrictEqual(f.acronyms, ['AWS']);
});

test('extraction is stable across two calls', () => {
  assert.deepStrictEqual(extractFacts(BEFORE), extractFacts(BEFORE));
});

test('a clean rewrite loses nothing even when every word changed', () => {
  const d = diffFacts(BEFORE, AFTER_CLEAN);
  assert.deepStrictEqual(d.lost, []);
  assert.strictEqual(d.ok, true);
});

test('a lossy rewrite reports one entry per lost fact', () => {
  const d = diffFacts(BEFORE, AFTER_LOSSY);
  assert.strictEqual(d.ok, false);
  const lost = d.lost.map((x) => `${x.kind}:${x.value}`);
  assert.ok(lost.includes('numbers:2200'), 'dropped figure');
  assert.ok(lost.includes('percentages:59%'), 'dropped percentage');
  assert.ok(lost.includes('dates:2026-04-16'), 'changed date');
  assert.ok(lost.includes('versions:0.7.0'), 'downgraded version');
  assert.ok(
    lost.includes('urls:https://example.com/runbook?id=42'),
    'mangled URL'
  );
});

test('adding a fact is not a loss', () => {
  const d = diffFacts('We saw 3 errors.', 'We saw 3 errors across 2 regions on 2026-09-02.');
  assert.strictEqual(d.ok, true);
});

test('compare --check-facts exits 1 on a lossy rewrite and 0 on a clean one', () => {
  const lossy = tmpPair(BEFORE, AFTER_LOSSY);
  const clean = tmpPair(BEFORE, AFTER_CLEAN);
  assert.strictEqual(
    silent(() => run(['compare', '--before', lossy.b, '--after', lossy.a, '--check-facts'])),
    1
  );
  assert.strictEqual(
    silent(() => run(['compare', '--before', clean.b, '--after', clean.a, '--check-facts'])),
    0
  );
});

test('compare without --check-facts still always exits 0', () => {
  const lossy = tmpPair(BEFORE, AFTER_LOSSY);
  assert.strictEqual(
    silent(() => run(['compare', '--before', lossy.b, '--after', lossy.a])),
    0
  );
});

test('the human output names the lost facts, and says OK when there are none', () => {
  const lossy = tmpPair(BEFORE, AFTER_LOSSY);
  const bad = capture(() =>
    run(['compare', '--before', lossy.b, '--after', lossy.a, '--check-facts'])
  );
  assert.match(bad, /Fact check:/);
  assert.match(bad, /fact\(s\) lost or changed/);
  assert.match(bad, /2200/);

  const clean = tmpPair(BEFORE, AFTER_CLEAN);
  const good = capture(() =>
    run(['compare', '--before', clean.b, '--after', clean.a, '--check-facts'])
  );
  assert.match(good, /Fact check:/);
  assert.match(good, /survive the rewrite/);
});

test('compare --json carries the facts block only when asked', () => {
  const lossy = tmpPair(BEFORE, AFTER_LOSSY);
  const withFlag = JSON.parse(
    capture(() =>
      run(['compare', '--before', lossy.b, '--after', lossy.a, '--check-facts', '--json'])
    )
  );
  assert.strictEqual(withFlag.facts.ok, false);
  assert.ok(Array.isArray(withFlag.facts.lost));

  const without = JSON.parse(
    capture(() => run(['compare', '--before', lossy.b, '--after', lossy.a, '--json']))
  );
  assert.strictEqual(without.facts, undefined);
});

test('a fact inside a code fence still counts, even with --ignore-code', () => {
  const before = 'Set the cap.\n\n```\nMAX_RETRIES = 5\n```\n';
  const after = 'Set the cap.\n\n```\nMAX_RETRIES = 9\n```\n';
  const pair = tmpPair(before, after);
  assert.strictEqual(
    silent(() =>
      run([
        'compare',
        '--before',
        pair.b,
        '--after',
        pair.a,
        '--check-facts',
        '--ignore-code',
      ])
    ),
    1
  );
});

test('a fact the rewrite moved into a link is not reported lost', () => {
  // The URL pass swallows whole links, so without the nested lookup a linkified
  // version reads as a dropped fact.
  const moved = diffFacts('Ship v1.2 now.', 'Ship https://example.com/release/v1.2?q=99 now.');
  assert.deepStrictEqual(moved.lost, []);
});

test('a link that changes the fact is still reported lost', () => {
  const changed = diffFacts('Ship v1.2 now.', 'Ship https://example.com/release/v9.9 now.');
  assert.deepStrictEqual(changed.lost, [{ kind: 'versions', value: '1.2' }]);
});

test('factsInUrls reads inside links and nowhere else', () => {
  const f = extractFacts('See https://example.com/v2.1.0/report-2026-04-16 and note 7.');
  const inner = factsInUrls(f);
  assert.ok(inner.versions.includes('2.1.0'));
  assert.ok(inner.dates.includes('2026-04-16'));
  assert.deepStrictEqual(factsInUrls({ urls: [] }).numbers, []);
});
