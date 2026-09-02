'use strict';

// Fact preservation check. A rewrite may change every word; it may not change the
// facts. This module pulls a fixed set of hard tokens out of two versions of a text
// and reports anything the rewrite dropped or altered.
//
// Zero dependencies, no network, no filesystem. Pure string work on text the caller
// already read.

const MONTHS = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};
const MONTH_NAMES = Object.keys(MONTHS).join('|');

// ALL-CAPS tokens that are markup or grammar, not facts. GitHub alert markers and
// common shouted words would otherwise read as proper nouns on every document.
const ACRONYM_STOPWORDS = Object.freeze(new Set([
  'OK',
  'TODO',
  'FIXME',
  'NOTE',
  'TIP',
  'WARNING',
  'IMPORTANT',
  'CAUTION',
  'AND',
  'OR',
  'NOT',
  'THE',
  'FOR',
  'YES',
  'NO',
]));

// Order matters: each pass blanks the spans it consumes so a later, broader pattern
// cannot re-read part of an earlier match. Percentages run before versions so 12.5%
// is one percentage and not the version 12.5; dates run before numbers so 2026-09-02
// is one date and not three numbers.
const KINDS = Object.freeze(['urls', 'dates', 'percentages', 'versions', 'numbers', 'acronyms']);

// Categories that describe the same token. A value found in a sibling category still
// counts as present, so a purely cosmetic re-categorization is not a lost fact.
const SIBLINGS = Object.freeze({
  versions: ['numbers'],
  numbers: ['versions'],
});

function blank(match) {
  return ' '.repeat(match.length);
}

/** Collect every match of re, normalize it, and blank the span so later passes skip it. */
function harvest(state, re, normalize) {
  const found = [];
  state.text = state.text.replace(re, (...args) => {
    const match = args[0];
    const value = normalize(...args);
    if (value !== null) found.push(value);
    return blank(match);
  });
  return found;
}

/** Strip trailing punctuation and any closing parenthesis that has no opener. */
function trimUrl(match) {
  let url = match.replace(/[.,;:!?]+$/, '');
  for (;;) {
    if (!url.endsWith(')')) break;
    const opens = (url.match(/\(/g) || []).length;
    const closes = (url.match(/\)/g) || []).length;
    if (closes <= opens) break;
    url = url.slice(0, -1).replace(/[.,;:!?]+$/, '');
  }
  return url;
}

function normalizeDate(match) {
  const iso = match.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const lower = match.toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  const monthFirst = lower.match(new RegExp(`^(${MONTH_NAMES}) (\\d{1,2}) (\\d{4})$`));
  if (monthFirst) {
    return `${monthFirst[3]}-${MONTHS[monthFirst[1]]}-${monthFirst[2].padStart(2, '0')}`;
  }
  const dayFirst = lower.match(new RegExp(`^(\\d{1,2}) (${MONTH_NAMES}) (\\d{4})$`));
  if (dayFirst) {
    return `${dayFirst[3]}-${MONTHS[dayFirst[2]]}-${dayFirst[1].padStart(2, '0')}`;
  }
  return lower;
}

/**
 * Extract fact tokens from text.
 * Returns { urls, dates, percentages, versions, numbers, acronyms }, each a sorted
 * array of unique normalized strings. Deterministic: same input, same output.
 */
function extractFacts(rawText) {
  const state = { text: String(rawText || '') };

  // Trailing sentence punctuation is not part of a URL. Parentheses are allowed
  // inside one, so a path like /foo(123) survives, but an unbalanced closing bracket
  // is stripped so a Markdown link [docs](url) yields the URL and not the bracket.
  const urls = harvest(state, /https?:\/\/[^\s<>[\]"'`]+/g, trimUrl);

  const dates = harvest(
    state,
    new RegExp(
      `\\b\\d{4}-\\d{2}-\\d{2}\\b` +
        `|\\b(?:${MONTH_NAMES})\\s+\\d{1,2},?\\s+\\d{4}\\b` +
        `|\\b\\d{1,2}\\s+(?:${MONTH_NAMES})\\s+\\d{4}\\b`,
      'gi'
    ),
    normalizeDate
  );

  const percentages = harvest(state, /\b\d+(?:\.\d+)?\s?%/g, (m) => m.replace(/\s+/g, ''));

  // Either an explicit v prefix (v1.2, v0.7.0) or three or more dotted parts (0.7.0).
  // A bare two-part decimal such as 12.5 is a number, not a version.
  const versions = harvest(state, /\bv\d+(?:\.\d+)+\b|\b\d+(?:\.\d+){2,}\b/gi, (m) =>
    m.replace(/^v/i, '')
  );

  const numbers = harvest(
    state,
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d+(?:\.\d+)?\b/g,
    (m) => m.replace(/,/g, '')
  );

  const acronyms = harvest(state, /\b[A-Z][A-Z0-9]+\b/g, (m) =>
    ACRONYM_STOPWORDS.has(m) ? null : m
  );

  return {
    urls: unique(urls),
    dates: unique(dates),
    percentages: unique(percentages),
    versions: unique(versions),
    numbers: unique(numbers),
    acronyms: unique(acronyms),
  };
}

function unique(xs) {
  return Array.from(new Set(xs)).sort();
}

/**
 * Facts hiding inside URLs. The URL pass swallows whole links, so a version or a
 * number that the rewrite moved into a link would otherwise read as lost. Stripping
 * the scheme stops the URL pass from re-consuming the string.
 */
function factsInUrls(facts) {
  const inner = {};
  for (const kind of KINDS) inner[kind] = [];
  for (const url of facts.urls) {
    const nested = extractFacts(url.replace(/^https?:\/\//, ' '));
    for (const kind of KINDS) inner[kind] = inner[kind].concat(nested[kind]);
  }
  return inner;
}

/**
 * Compare the facts in two texts.
 * Returns { lost: [{ kind, value }], ok, counts: { before, after } }.
 * A fact present in before and absent from after is lost; a fact the rewrite added
 * is not reported, because adding detail is a writing choice, not a factual error.
 */
function diffFacts(beforeText, afterText) {
  const before = extractFacts(beforeText);
  const after = extractFacts(afterText);
  const nested = factsInUrls(after);
  const lost = [];
  for (const kind of KINDS) {
    const present = new Set([...after[kind], ...nested[kind]]);
    // A version and a number are the same digits wearing a different hat: dropping
    // the v from v1.2 leaves the fact intact, so accept the sibling category.
    for (const sibling of SIBLINGS[kind] || []) {
      for (const v of after[sibling]) present.add(v);
      for (const v of nested[sibling]) present.add(v);
    }
    for (const value of before[kind]) {
      if (!present.has(value)) lost.push({ kind, value });
    }
  }
  return {
    lost,
    ok: lost.length === 0,
    counts: { before: countAll(before), after: countAll(after) },
  };
}

function countAll(facts) {
  return KINDS.reduce((total, kind) => total + facts[kind].length, 0);
}

module.exports = { extractFacts, diffFacts, factsInUrls, KINDS, SIBLINGS, ACRONYM_STOPWORDS };
