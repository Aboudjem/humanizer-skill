'use strict';

// Zero-dependency text tokenization helpers.
// Deliberately simple and deterministic: the same input always yields the same
// metrics. These are heuristics, not a trained model.

/**
 * Mask fenced code blocks and (optionally) block quotes so their contents do not
 * count toward metrics. Returns the cleaned text.
 */
function stripMarked(text, { ignoreCode = false, ignoreQuotes = false } = {}) {
  let out = text;
  if (ignoreCode) {
    // fenced code blocks (``` ... ```)
    out = out.replace(/```[\s\S]*?```/g, ' ');
    // inline code (`...`)
    out = out.replace(/`[^`\n]*`/g, ' ');
    // indented code blocks (4+ leading spaces)
    out = out.replace(/^( {4,}|\t).*$/gm, ' ');
  }
  if (ignoreQuotes) {
    out = out.replace(/^\s*>.*$/gm, ' ');
  }
  return out;
}

/**
 * Split text into sentences. Naive but stable: breaks on . ! ? followed by
 * whitespace, after collapsing runs of whitespace.
 */
function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => wordTokens(s).length > 0);
}

/** Lowercased word tokens (letters, digits, apostrophes). */
function wordTokens(text) {
  return text.toLowerCase().match(/[a-z0-9][a-z0-9']*/g) || [];
}

/** Heuristic English syllable count for a single word. */
function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let s = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');
  const groups = s.match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

module.exports = { stripMarked, splitSentences, wordTokens, countSyllables };
