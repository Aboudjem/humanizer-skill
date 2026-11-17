#!/usr/bin/env node
'use strict';

// Repo check: every manifest carries one version, and the newest CHANGELOG entry matches it.
// Usage: node tools/check-versions.js      exit 0 when they agree, exit 1 with the list.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const MANIFESTS = [
  '.claude-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.copilot-plugin/plugin.json',
  'package.json',
  'cli/package.json',
];

const found = MANIFESTS.map((rel) => ({
  rel,
  version: JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')).version,
}));
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const entry = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m);
found.push({ rel: 'CHANGELOG.md (newest entry)', version: entry ? entry[1] : undefined });

const versions = new Set(found.map((f) => f.version));
if (versions.size === 1 && !versions.has(undefined)) {
  process.stdout.write(`Result: PASS. ${found.length} files agree on version ${found[0].version}.\n`);
} else {
  process.stdout.write('Result: FAIL. The versions differ.\n');
  for (const f of found) process.stdout.write(`  ${String(f.version).padEnd(10)} ${f.rel}\n`);
  process.exit(1);
}
