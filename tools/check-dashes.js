#!/usr/bin/env node
'use strict';

// Repo check: no banned dash in any doc, manifest, YAML or SVG that git tracks.
// The skill lists dash overuse as pattern P13, so the repo holds itself to it.
//
// The forms are built from code points, never typed, so this file passes its own check:
//   U+2014 (em dash), U+2015 (horizontal bar), U+2E3A (two-em dash),
//   the HTML entities and the JSON escape for U+2014,
//   and U+2013 (en dash) with a space on both sides.
//
// Usage: node tools/check-dashes.js        exit 0 clean, exit 1 with the lines that fail.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const cp = (...codes) => String.fromCharCode(...codes);
const FORMS = [
  `[${cp(0x2014, 0x2015, 0x2e3a)}]`,
  '&mdash;',
  '&#0*8212;',
  '&#x0*2014;',
  cp(0x5c, 0x5c) + 'u2014',
  ` ${cp(0x2013)} `,
];
const BANNED = new RegExp(FORMS.join('|'), 'i');

const DOC_EXT = /\.(md|mdx|markdown|txt|rst|html?|svg|ya?ml)$/i;
const MANIFESTS = new Set(['package.json', 'plugin.json', 'marketplace.json', 'server.json', 'gemini-extension.json']);

function trackedFiles(root) {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  return out.split('\0').filter(Boolean);
}

function check(root) {
  const hits = [];
  for (const rel of trackedFiles(root)) {
    if (!DOC_EXT.test(rel) && !MANIFESTS.has(path.basename(rel))) continue;
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    fs.readFileSync(full, 'utf8')
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (BANNED.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
  }
  return hits;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const hits = check(root);
  if (hits.length) {
    process.stdout.write(`Result: FAIL. ${hits.length} line(s) hold a banned dash (U+2014 or a stand-in).\n`);
    for (const h of hits) process.stdout.write('  ' + h + '\n');
    process.stdout.write('Rewrite the sentence. To document the character, name it or give its code point.\n');
    process.exit(1);
  }
  process.stdout.write('Result: PASS. No banned dash in any tracked doc or manifest.\n');
}

module.exports = { check, BANNED };
