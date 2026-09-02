'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
  mean,
  stdev,
  typeTokenRatio,
  trigramRepetition,
  analyze,
  aiTellScore,
  scoreSignals,
  verdict,
  scoreText,
  WEIGHTS,
  ANCHORS,
} = require('../lib/metrics');
const { wordTokens, splitSentences, countSyllables, stripMarked } = require('../lib/tokenize');

// Representative samples. AI text: uniform sentence length, low diversity,
// vocabulary tells. Human text: bursty, specific, varied.
const AI_TEXT =
  "In today's rapidly evolving landscape, artificial intelligence is reshaping how we think about creativity every single day. " +
  'This groundbreaking shift represents a pivotal moment that underscores the intricate interplay between innovation and art. ' +
  'As we delve deeper into this fascinating realm, it becomes crucial to understand the multifaceted implications involved here. ' +
  'Industry experts consistently highlight that this ongoing transformation will foster new forms of collaboration going forward. ' +
  'The future looks incredibly bright for everyone who chooses to embrace this important and lasting meaningful change.';

const HUMAN_TEXT =
  "I've messed with AI image tools for six months. Still can't decide if I love them. " +
  'Last week I got a portrait better than anything I could paint in a year, and it made me a little sick. ' +
  "There's something missing. Flavor, maybe. My friends are split down the middle: half use them daily, half won't touch them. " +
  "Neither side is wrong. What I know is my process changed, and I'm still figuring out how.";

test('mean and stdev', () => {
  assert.strictEqual(mean([1, 2, 3]), 2);
  assert.strictEqual(mean([]), 0);
  assert.strictEqual(stdev([2, 2, 2]), 0);
  assert.ok(stdev([1, 5]) > 0);
});

test('typeTokenRatio', () => {
  assert.strictEqual(typeTokenRatio(['a', 'a', 'b']), 2 / 3);
  assert.strictEqual(typeTokenRatio([]), 0);
});

test('trigramRepetition detects repeats', () => {
  assert.strictEqual(trigramRepetition(['a', 'b']), 0);
  // 'a b c','b c a','c a b','a b c' -> 4 grams, 3 unique -> 0.25
  assert.strictEqual(trigramRepetition(['a', 'b', 'c', 'a', 'b', 'c']), 0.25);
});

test('tokenizers', () => {
  assert.deepStrictEqual(wordTokens('The cat, sat!'), ['the', 'cat', 'sat']);
  assert.strictEqual(splitSentences('One. Two! Three?').length, 3);
  assert.strictEqual(countSyllables('cat'), 1);
  assert.strictEqual(countSyllables('hello'), 2);
  assert.ok(countSyllables('information') >= 3);
});

test('stripMarked removes code and quotes', () => {
  const t = 'Keep this.\n```\ndelve delve delve delve\n```\n> quoted line here\nEnd.';
  const both = stripMarked(t, { ignoreCode: true, ignoreQuotes: true });
  assert.ok(!both.includes('delve'));
  assert.ok(!both.includes('quoted line'));
  assert.ok(both.includes('Keep this'));
});

test('analyze returns all metrics and flags short samples', () => {
  const m = analyze('This is a short sentence.');
  assert.ok(m.shortSample, 'under 40 words should be flagged short');
  assert.ok('burstiness' in m && 'typeTokenRatio' in m && 'trigramRepetition' in m);
  assert.ok('fleschKincaidGrade' in m && 'sentenceLengthCoV' in m);
  assert.strictEqual(m.wordCount, 5);
});

test('ignore-code lowers word count', () => {
  const t = 'The cat sat on the mat and slept all day long here today.\n```\nx x x x x x x x\n```';
  const withCode = analyze(t);
  const withoutCode = analyze(t, { ignoreCode: true });
  assert.ok(withoutCode.wordCount < withCode.wordCount);
});

test('AI text scores higher than human text', () => {
  const ai = scoreText(AI_TEXT);
  const human = scoreText(HUMAN_TEXT);
  assert.ok(ai.score > human.score, `expected AI(${ai.score}) > human(${human.score})`);
  assert.ok(ai.metrics.burstiness < human.metrics.burstiness, 'AI should have lower burstiness');
});

test('score is deterministic', () => {
  assert.strictEqual(scoreText(AI_TEXT).score, scoreText(AI_TEXT).score);
});

test('score is clamped 0-100 and verdict maps correctly', () => {
  for (const txt of [AI_TEXT, HUMAN_TEXT, '', 'short']) {
    const s = aiTellScore(analyze(txt));
    assert.ok(s >= 0 && s <= 100, `score ${s} out of range`);
  }
  assert.strictEqual(verdict(0), 'Pristine');
  assert.strictEqual(verdict(50), 'Mixed');
  assert.strictEqual(verdict(100), 'Pure AI smell');
});

test('empty input scores 0 and never reads as AI', () => {
  for (const txt of ['', '   \n\t  ']) {
    const r = scoreText(txt);
    assert.strictEqual(r.metrics.wordCount, 0);
    assert.strictEqual(r.score, 0, 'empty text must score 0, not trip a CI gate');
    assert.strictEqual(r.verdict, 'No text');
  }
});

test('AI-vocabulary tells raise the score and are counted', () => {
  const plain =
    'The cache clears when you edit the config file. The watcher notices the change and rebuilds. ' +
    'You get fresh output in about forty milliseconds, which is fast enough that nobody complains.';
  const telly =
    'We leverage a robust, seamless, cutting-edge cache to foster a pivotal, multifaceted experience. ' +
    'It is worth noting that this delves into the intricate tapestry and underscores our vibrant realm.';
  const a = scoreText(plain);
  const b = scoreText(telly);
  assert.ok(b.metrics.vocabTells > a.metrics.vocabTells, 'telly text should have more tells');
  assert.ok(b.score > a.score, `expected telly(${b.score}) > plain(${a.score})`);
});

test('ignore-quotes drops tells inside block quotes', () => {
  const t = 'You edit the config and the cache clears in forty milliseconds flat.\n> We leverage a seamless, robust, cutting-edge tapestry to foster synergy.';
  const withQuote = scoreText(t);
  const withoutQuote = scoreText(t, { ignoreQuotes: true });
  assert.ok(withoutQuote.metrics.vocabTells < withQuote.metrics.vocabTells);
});

// --- per-signal breakdown ------------------------------------------------------

const SIGNAL_ORDER = ['burstiness', 'diversity', 'repetition', 'lexical'];

test('the breakdown names four signals in a fixed order', () => {
  const r = scoreText(AI_TEXT);
  assert.deepStrictEqual(
    r.signals.map((s) => s.name),
    SIGNAL_ORDER
  );
  for (const s of r.signals) {
    assert.deepStrictEqual(Object.keys(s), [
      'name',
      'metric',
      'raw',
      'normalized',
      'weight',
      'points',
    ]);
    assert.ok(s.normalized >= 0 && s.normalized <= 1, `${s.name} normalized in range`);
    assert.strictEqual(r.metrics[s.metric], s.raw, `${s.name} raw matches its metric`);
  }
});

test('the breakdown sums to the score', () => {
  for (const txt of [AI_TEXT, HUMAN_TEXT, 'Short but real text with a few words in it here.']) {
    const r = scoreText(txt);
    const sum = r.signals.reduce((a, s) => a + s.points, 0);
    // points are rounded to 3 places for display, so the gap is bounded by 4 * 0.0005
    assert.ok(
      Math.abs(sum - r.scoreRaw) <= 0.005,
      `sum ${sum} should match scoreRaw ${r.scoreRaw}`
    );
    assert.strictEqual(Math.round(r.scoreRaw), r.score);
  }
});

test('weights match WEIGHTS and sum to 1', () => {
  const r = scoreText(AI_TEXT);
  for (const s of r.signals) {
    assert.strictEqual(s.weight, WEIGHTS[s.name], `${s.name} weight`);
  }
  const total = r.signals.reduce((a, s) => a + s.weight, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `weights sum to ${total}`);
});

test('the breakdown is stable across two runs', () => {
  assert.deepStrictEqual(scoreText(AI_TEXT).signals, scoreText(AI_TEXT).signals);
  assert.strictEqual(
    JSON.stringify(scoreText(HUMAN_TEXT)),
    JSON.stringify(scoreText(HUMAN_TEXT))
  );
});

test('empty text gives four zero-point signals and score 0', () => {
  const r = scoreText('');
  assert.strictEqual(r.score, 0);
  assert.strictEqual(r.signals.length, 4);
  for (const s of r.signals) {
    assert.strictEqual(s.points, 0, `${s.name} contributes nothing to an empty file`);
    assert.strictEqual(s.normalized, 0);
  }
});

test('scoreSignals is the only score formula, so aiTellScore agrees with it', () => {
  for (const txt of [AI_TEXT, HUMAN_TEXT, '']) {
    const m = analyze(txt);
    const sum = scoreSignals(m).reduce((a, s) => a + s.weight * s.normalized, 0);
    assert.strictEqual(aiTellScore(m), Math.round(100 * sum));
  }
});

test('the refactor did not move the score (no-drift pin)', () => {
  // Exact values measured before scoreSignals existed. If one of these changes, the
  // scoring behaviour changed, and every published threshold has to be revisited.
  assert.strictEqual(scoreText(AI_TEXT).score, 66);
  assert.strictEqual(scoreText(HUMAN_TEXT).score, 0);
});

test('a half-boundary composite still rounds the way it always did', () => {
  // Raw composite is 57.49999999999999 here. Rounding each signal before summing
  // would push it to 58. Regression guard for the display-rounding split.
  const m = {
    wordCount: 1,
    burstiness: 0,
    mattr: 0.3,
    trigramRepetition: 0.045,
    vocabTellDensity: 0.007,
  };
  assert.strictEqual(aiTellScore(m), 57);
  const sum = scoreSignals(m).reduce((a, s) => a + s.weight * s.normalized, 0);
  assert.ok(100 * sum < 57.5, 'the exact composite sits just under the .5 boundary');
});

test('custom anchors move the signals and the score together', () => {
  const m = analyze(AI_TEXT);
  const strict = { ...ANCHORS, vocabMax: 1 };
  const relaxed = scoreSignals(m, strict).find((s) => s.name === 'lexical');
  const normal = scoreSignals(m).find((s) => s.name === 'lexical');
  assert.ok(relaxed.normalized < normal.normalized, 'a higher vocabMax lowers the lexical signal');
  assert.ok(aiTellScore(m, strict) < aiTellScore(m));
});
