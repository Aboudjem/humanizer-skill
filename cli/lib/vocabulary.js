'use strict';

// Curated AI-vocabulary tells, mirroring the tiered vocabulary in SKILL.md.
// Structural metrics (burstiness, diversity, repetition) miss lexical tells, so
// the composite score also weighs how densely these appear. Deterministic and
// transparent: edit the lists to change behavior.

// Single words (matched on word boundaries, case-insensitive).
const TIER1_WORDS = [
  'delve',
  'delves',
  'delving',
  'tapestry',
  'testament',
  'underscore',
  'underscores',
  'underscoring',
  'leverage',
  'leverages',
  'leveraging',
  'multifaceted',
  'realm',
  'interplay',
  'seamless',
  'seamlessly',
  'groundbreaking',
];

const TIER2_WORDS = [
  'crucial',
  'pivotal',
  'vibrant',
  'robust',
  'foster',
  'fosters',
  'fostering',
  'enhance',
  'enhances',
  'enhancing',
  'showcase',
  'showcases',
  'notably',
  'moreover',
  'furthermore',
  'garner',
  'bolster',
  'utilize',
  'utilizes',
  'reshaping',
  'poised',
  'thrive',
  'thrives',
];

// Multi-word phrase tells (matched as substrings, case-insensitive).
const PHRASES = [
  "it's worth noting",
  'it is worth noting',
  'it is important to note',
  "in today's",
  'rapidly evolving',
  'the future looks bright',
  'in conclusion',
  'cutting-edge',
  'walks of life',
  'push the boundaries',
];

const W_TIER1 = 1.0;
const W_TIER2 = 0.6;
const W_PHRASE = 1.0;

function countWord(tokens, wordSet) {
  let n = 0;
  for (const t of tokens) if (wordSet.has(t)) n++;
  return n;
}

/**
 * Count AI-vocabulary tells in text.
 * Returns { tier1, tier2, phrases, weighted, density } where density is
 * weighted hits divided by word count.
 */
function lexicalTells(text, tokens) {
  const lower = text.toLowerCase();
  const t1set = new Set(TIER1_WORDS);
  const t2set = new Set(TIER2_WORDS);
  const tier1 = countWord(tokens, t1set);
  const tier2 = countWord(tokens, t2set);
  let phrases = 0;
  for (const p of PHRASES) {
    let idx = lower.indexOf(p);
    while (idx !== -1) {
      phrases++;
      idx = lower.indexOf(p, idx + p.length);
    }
  }
  const weighted = tier1 * W_TIER1 + tier2 * W_TIER2 + phrases * W_PHRASE;
  const density = tokens.length ? weighted / tokens.length : 0;
  return { tier1, tier2, phrases, weighted, density };
}

module.exports = { lexicalTells, TIER1_WORDS, TIER2_WORDS, PHRASES };
