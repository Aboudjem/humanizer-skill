'use strict';

const { stripMarked, splitSentences, wordTokens, countSyllables } = require('./tokenize');
const { lexicalTells } = require('./vocabulary');

function mean(xs) {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = xs.reduce((a, b) => a + (b - m) * (b - m), 0) / xs.length;
  return Math.sqrt(v);
}

/** Type-token ratio: unique words / total words. */
function typeTokenRatio(tokens) {
  if (!tokens.length) return 0;
  return new Set(tokens).size / tokens.length;
}

/**
 * Moving-average TTR over a window, which is far less length-sensitive than raw
 * TTR. Falls back to raw TTR for short texts.
 */
function mattr(tokens, window = 50) {
  if (tokens.length <= window) return typeTokenRatio(tokens);
  let sum = 0;
  let n = 0;
  for (let i = 0; i + window <= tokens.length; i++) {
    sum += new Set(tokens.slice(i, i + window)).size / window;
    n++;
  }
  return sum / n;
}

/** Fraction of word-trigrams that are repeats (0 = all unique, higher = more repetition). */
function trigramRepetition(tokens) {
  if (tokens.length < 3) return 0;
  const grams = [];
  for (let i = 0; i + 3 <= tokens.length; i++) {
    grams.push(tokens[i] + ' ' + tokens[i + 1] + ' ' + tokens[i + 2]);
  }
  const unique = new Set(grams).size;
  return 1 - unique / grams.length;
}

/** Goh-Barabasi burstiness of sentence lengths, bounded [-1, 1]. */
function burstinessGB(sentenceLengths) {
  const s = stdev(sentenceLengths);
  const m = mean(sentenceLengths);
  if (s + m === 0) return 0;
  return (s - m) / (s + m);
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Compute all metrics for a piece of text.
 * options: { ignoreCode, ignoreQuotes }
 */
function analyze(rawText, options = {}) {
  const text = stripMarked(String(rawText || ''), options);
  const sentences = splitSentences(text);
  const tokens = wordTokens(text);
  const sentenceLengths = sentences.map((s) => wordTokens(s).length);
  const syllables = tokens.reduce((a, w) => a + countSyllables(w), 0);

  const wordCount = tokens.length;
  const sentenceCount = sentences.length;
  const meanLen = mean(sentenceLengths);
  const sd = stdev(sentenceLengths);
  const cov = meanLen === 0 ? 0 : sd / meanLen;
  const ttr = typeTokenRatio(tokens);
  const mattrVal = mattr(tokens);
  const trigrams = trigramRepetition(tokens);
  const wps = sentenceCount === 0 ? 0 : wordCount / sentenceCount;
  const spw = wordCount === 0 ? 0 : syllables / wordCount;
  const fkGrade = wordCount === 0 ? 0 : 0.39 * wps + 11.8 * spw - 15.59;
  const fkEase = wordCount === 0 ? 0 : 206.835 - 1.015 * wps - 84.6 * spw;

  const tooShort = wordCount < 40;
  const lex = lexicalTells(text, tokens);

  return {
    wordCount,
    sentenceCount,
    meanSentenceLength: round(meanLen, 2),
    sentenceLengthStdev: round(sd, 2),
    sentenceLengthCoV: round(cov, 3),
    burstiness: round(cov, 3), // sentence-length CoV, the human-vs-AI proxy
    burstinessGB: round(burstinessGB(sentenceLengths), 3),
    typeTokenRatio: round(ttr, 3),
    mattr: round(mattrVal, 3),
    trigramRepetition: round(trigrams, 3),
    fleschKincaidGrade: round(fkGrade, 1),
    fleschReadingEase: round(fkEase, 1),
    vocabTells: lex.tier1 + lex.tier2 + lex.phrases,
    vocabTellDensity: round(lex.density, 4),
    shortSample: tooShort,
  };
}

function round(x, places) {
  const f = Math.pow(10, places);
  return Math.round(x * f) / f;
}

// Anchor points for mapping raw metrics to 0..1 AI-likelihood components.
// Documented and adjustable. These are heuristics, not trained thresholds.
const ANCHORS = {
  covHuman: 0.66, // CoV at or above this reads fully human on the burstiness axis
  ttrLow: 0.3, // MATTR at or below this is maximally low-diversity
  ttrHigh: 0.72, // MATTR at or above this reads fully human
  repMax: 0.18, // trigram repetition at or above this is maximally repetitive
  vocabMax: 0.035, // weighted AI-vocab density at or above this is maximally lexical
};

// Composite weights. Lexical tells carry the most signal on realistic prose;
// structure fills in the rest. Must sum to 1.
const WEIGHTS = { burstiness: 0.28, diversity: 0.18, repetition: 0.14, lexical: 0.4 };

/**
 * Transparent weighted composite AI-tell score, 0-100 (higher = more AI smell).
 * lowBurstiness + lowDiversity + highRepetition + lexicalDensity.
 */
function aiTellScore(m, anchors = ANCHORS) {
  const lowBurstiness = clamp((anchors.covHuman - m.burstiness) / anchors.covHuman, 0, 1);
  const lowDiversity = clamp(
    (anchors.ttrHigh - m.mattr) / (anchors.ttrHigh - anchors.ttrLow),
    0,
    1
  );
  const highRepetition = clamp(m.trigramRepetition / anchors.repMax, 0, 1);
  const lexical = clamp((m.vocabTellDensity || 0) / anchors.vocabMax, 0, 1);
  const raw =
    WEIGHTS.burstiness * lowBurstiness +
    WEIGHTS.diversity * lowDiversity +
    WEIGHTS.repetition * highRepetition +
    WEIGHTS.lexical * lexical;
  return Math.round(100 * raw);
}

function verdict(score) {
  if (score <= 20) return 'Pristine';
  if (score <= 40) return 'Mostly human';
  if (score <= 60) return 'Mixed';
  if (score <= 80) return 'AI-leaning';
  return 'Pure AI smell';
}

function scoreText(rawText, options = {}) {
  const metrics = analyze(rawText, options);
  const score = aiTellScore(metrics);
  return { metrics, score, verdict: verdict(score) };
}

module.exports = {
  mean,
  stdev,
  typeTokenRatio,
  mattr,
  trigramRepetition,
  burstinessGB,
  analyze,
  aiTellScore,
  verdict,
  scoreText,
  ANCHORS,
  WEIGHTS,
};
