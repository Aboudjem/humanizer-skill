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
  verdict,
  scoreText,
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

test('empty input does not throw', () => {
  const r = scoreText('');
  assert.strictEqual(r.metrics.wordCount, 0);
  assert.ok(typeof r.score === 'number');
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
