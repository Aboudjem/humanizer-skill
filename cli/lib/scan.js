'use strict';

const fs = require('fs');
const path = require('path');
const { scoreText } = require('./metrics');

const DEFAULT_EXTS = ['md', 'markdown', 'txt'];
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.vercel',
  'vendor',
]);

/** Recursively collect files under dir matching one of the extensions. */
function collectFiles(dir, exts) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...collectFiles(full, exts));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).slice(1).toLowerCase();
      if (exts.includes(ext)) out.push(full);
    }
  }
  return out;
}

/**
 * Expand one target into the list of files to score. A directory is walked and
 * filtered by extension; an explicit file path is always scored, whatever its
 * extension, because naming a file is an instruction.
 */
function expand(target, exts) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) return collectFiles(target, exts).sort();
  return [target];
}

/** Forward slashes and no leading "./", so one pattern matches on every platform. */
function normalize(p) {
  return p.replace(/\\/g, '/').replace(/^(\.\/)+/, '');
}

/**
 * True when a file is excluded. A pattern matches the whole path, a leading
 * directory of it, or a path that ends with it on a directory boundary. A `*`
 * matches inside one path segment. No pattern reaches outside what was asked:
 * "before.md" excludes every before.md, "docs/drafts" excludes that folder.
 */
function isExcluded(file, patterns) {
  if (!patterns || !patterns.length) return false;
  const f = normalize(file);
  return patterns.some((raw) => {
    const pat = normalize(raw).replace(/\/+$/, '');
    if (!pat) return false;
    const body = pat
      .split('*')
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
      .join('[^/]*');
    return new RegExp('(^|/)' + body + '(/|$)').test(f);
  });
}

/**
 * Scan one or more directories and files and score every matching file.
 * Returns { files: [{ file, score, verdict, shortSample, metrics }], meanScore, maxScore }.
 * options.exclude is a list of patterns for isExcluded.
 * A file reachable from two targets is scored once. A target that does not exist
 * throws, so a typo fails loudly instead of silently scanning less than asked.
 */
function scanPaths(targets, options = {}) {
  const exts = options.exts && options.exts.length ? options.exts : DEFAULT_EXTS;
  const seen = new Set();
  const paths = [];
  for (const target of targets) {
    for (const file of expand(target, exts)) {
      if (isExcluded(file, options.exclude)) continue;
      if (seen.has(file)) continue;
      seen.add(file);
      paths.push(file);
    }
  }
  const files = paths.map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const { score, verdict, metrics } = scoreText(text, options);
    return { file, score, verdict, shortSample: metrics.shortSample, metrics };
  });
  const scores = files.map((f) => f.score);
  return {
    files,
    meanScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    maxScore: scores.length ? Math.max(...scores) : 0,
  };
}

/** One-target form, kept so existing callers and imports are unchanged. */
function scanPath(target, options = {}) {
  return scanPaths([target], options);
}

module.exports = { scanPaths, scanPath, collectFiles, isExcluded, DEFAULT_EXTS };
