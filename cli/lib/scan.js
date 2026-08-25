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
 * Scan a directory (or single file) and score every matching file.
 * Returns { files: [{ file, score, verdict, metrics }], meanScore, maxScore }.
 */
function scanPath(target, options = {}) {
  const exts = options.exts && options.exts.length ? options.exts : DEFAULT_EXTS;
  let paths;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    paths = collectFiles(target, exts).sort();
  } else {
    paths = [target];
  }
  const files = paths.map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const { score, verdict, metrics } = scoreText(text, options);
    return { file, score, verdict, metrics };
  });
  const scores = files.map((f) => f.score);
  return {
    files,
    meanScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    maxScore: scores.length ? Math.max(...scores) : 0,
  };
}

module.exports = { scanPath, collectFiles, DEFAULT_EXTS };
