#!/usr/bin/env node
'use strict';

// humanizer CLI: computes deterministic writing metrics and an AI-tell score.
// Zero dependencies (Node stdlib only). Optional companion to the Markdown skill;
// the skill itself needs none of this.

const fs = require('fs');
const { scoreText, ANCHORS } = require('./lib/metrics');
const { scanPath } = require('./lib/scan');
const { diffFacts } = require('./lib/facts');
const { formatScore, formatScan, formatCompare, formatFacts } = require('./lib/report');

const USAGE = `humanizer-metrics - compute writing metrics and an AI-tell score

Usage:
  humanizer-metrics score <file>      [options]   Score one file
  humanizer-metrics score -           [options]   Score stdin
  humanizer-metrics scan <dir|file>   [options]   Score every .md/.txt file under a path
  humanizer-metrics compare --before <file> --after <file>   Show metric deltas

Options:
  --fail-above <N>        Exit 1 if score > N (CI gate)
  --baseline <file>       Baseline JSON of {path: score}
  --write-baseline        Write current scores to --baseline and exit 0
  --fail-on-regression    Exit 1 if any file scores worse than its baseline
  --ext <csv>             Extensions for scan (default: md,markdown,txt)
  --ignore-code           Mask fenced/inline code before scoring
  --ignore-quotes         Mask Markdown block quotes before scoring
  --check-facts           On compare, exit 1 if the rewrite lost a fact
  --json                  Machine-readable JSON output
  -h, --help              Show this help

Exit codes: 0 ok/gate pass, 1 gate fail, 2 usage or IO error.`;

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--ignore-code') opts.ignoreCode = true;
    else if (a === '--ignore-quotes') opts.ignoreQuotes = true;
    else if (a === '--check-facts') opts.checkFacts = true;
    else if (a === '--write-baseline') opts.writeBaseline = true;
    else if (a === '--fail-on-regression') opts.failOnRegression = true;
    else if (a === '--fail-above') {
      const v = Number(argv[++i]);
      if (!Number.isFinite(v)) throw new UsageError('--fail-above requires a number');
      opts.failAbove = v;
    }
    else if (a === '--baseline') opts.baseline = argv[++i];
    else if (a === '--before') opts.before = argv[++i];
    else if (a === '--after') opts.after = argv[++i];
    else if (a === '--ext') opts.ext = argv[++i];
    else if (a.startsWith('--')) throw new UsageError('Unknown option: ' + a);
    else opts._.push(a);
  }
  return opts;
}

class UsageError extends Error {}

function readInput(target) {
  if (target === '-') return fs.readFileSync(0, 'utf8');
  return fs.readFileSync(target, 'utf8');
}

function loadBaseline(p) {
  if (!p || !fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    throw new UsageError('Cannot parse baseline JSON: ' + p);
  }
}

function run(argv) {
  const opts = parseArgs(argv);
  if (opts.help || opts._.length === 0) {
    process.stdout.write(USAGE + '\n');
    return opts._.length === 0 && !opts.help ? 2 : 0;
  }
  const cmd = opts._[0];
  const scoreOpts = { ignoreCode: opts.ignoreCode, ignoreQuotes: opts.ignoreQuotes };

  if (cmd === 'score') {
    const target = opts._[1];
    if (!target) throw new UsageError('score needs a file (or - for stdin)');
    const text = readInput(target);
    const result = scoreText(text, scoreOpts);
    if (opts.writeBaseline && opts.baseline) {
      const base = loadBaseline(opts.baseline);
      base[target] = result.score;
      fs.writeFileSync(opts.baseline, JSON.stringify(base, null, 2) + '\n');
    }
    if (opts.json) process.stdout.write(JSON.stringify(result) + '\n');
    else process.stdout.write(formatScore(result, target === '-' ? 'stdin' : target) + '\n');
    return gate(result.score, target, opts);
  }

  if (cmd === 'scan') {
    const target = opts._[1];
    if (!target) throw new UsageError('scan needs a directory or file');
    const exts = opts.ext ? opts.ext.split(',').map((s) => s.trim().toLowerCase()) : undefined;
    const scan = scanPath(target, { ...scoreOpts, exts });
    if (opts.writeBaseline && opts.baseline) {
      const base = {};
      for (const f of scan.files) base[f.file] = f.score;
      fs.writeFileSync(opts.baseline, JSON.stringify(base, null, 2) + '\n');
      process.stdout.write(`Wrote baseline for ${scan.files.length} file(s) to ${opts.baseline}\n`);
      return 0;
    }
    if (opts.json) process.stdout.write(JSON.stringify(scan) + '\n');
    else process.stdout.write(formatScan(scan, { failAbove: opts.failAbove }) + '\n');
    return gateScan(scan, opts);
  }

  if (cmd === 'compare') {
    if (!opts.before || !opts.after) throw new UsageError('compare needs --before and --after');
    // Fact extraction reads the raw text, not the masked text: a number inside a
    // code fence is still a fact the rewrite must keep.
    const beforeRaw = readInput(opts.before);
    const afterRaw = readInput(opts.after);
    const before = scoreText(beforeRaw, scoreOpts);
    const after = scoreText(afterRaw, scoreOpts);
    const facts = opts.checkFacts ? diffFacts(beforeRaw, afterRaw) : null;
    if (opts.json) {
      process.stdout.write(JSON.stringify(facts ? { before, after, facts } : { before, after }) + '\n');
    } else {
      const body = formatCompare(before, after);
      process.stdout.write((facts ? body + '\n\n' + formatFacts(facts) : body) + '\n');
    }
    if (facts && !facts.ok) {
      process.stderr.write(`FAIL: ${facts.lost.length} fact(s) lost in the rewrite\n`);
      return 1;
    }
    return 0;
  }

  throw new UsageError('Unknown command: ' + cmd);
}

function gate(score, target, opts) {
  let code = 0;
  if (opts.failAbove != null && score > opts.failAbove) {
    process.stderr.write(`FAIL: score ${score} > --fail-above ${opts.failAbove}\n`);
    code = 1;
  }
  if (opts.failOnRegression && opts.baseline) {
    const base = loadBaseline(opts.baseline);
    if (base[target] != null && score > base[target]) {
      process.stderr.write(`FAIL: regression on ${target}: ${base[target]} -> ${score}\n`);
      code = 1;
    }
  }
  return code;
}

function gateScan(scan, opts) {
  let code = 0;
  if (opts.failAbove != null) {
    const bad = scan.files.filter((f) => f.score > opts.failAbove);
    if (bad.length) {
      process.stderr.write(`FAIL: ${bad.length} file(s) above --fail-above ${opts.failAbove}\n`);
      code = 1;
    }
  }
  if (opts.failOnRegression && opts.baseline) {
    const base = loadBaseline(opts.baseline);
    const regressed = scan.files.filter((f) => base[f.file] != null && f.score > base[f.file]);
    if (regressed.length) {
      for (const f of regressed) {
        process.stderr.write(`FAIL: regression on ${f.file}: ${base[f.file]} -> ${f.score}\n`);
      }
      code = 1;
    }
  }
  return code;
}

if (require.main === module) {
  try {
    process.exit(run(process.argv.slice(2)));
  } catch (e) {
    if (e instanceof UsageError) {
      process.stderr.write('error: ' + e.message + '\n\n' + USAGE + '\n');
      process.exit(2);
    }
    process.stderr.write('error: ' + e.message + '\n');
    process.exit(2);
  }
}

module.exports = { run, parseArgs, UsageError, ANCHORS };
