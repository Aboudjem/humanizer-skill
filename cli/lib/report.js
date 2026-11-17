'use strict';

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function formatMetrics(m) {
  const rows = [
    ['words', m.wordCount],
    ['sentences', m.sentenceCount],
    ['mean sentence length', m.meanSentenceLength],
    ['burstiness (CoV)', m.burstiness],
    ['burstiness (Goh-Barabasi)', m.burstinessGB],
    ['type-token ratio', m.typeTokenRatio],
    ['MATTR (window 50)', m.mattr],
    ['trigram repetition', m.trigramRepetition],
    ['AI-vocab tells', m.vocabTells],
    ['AI-vocab density', m.vocabTellDensity],
    ['Flesch-Kincaid grade', m.fleschKincaidGrade],
    ['Flesch reading ease', m.fleschReadingEase],
  ];
  return rows.map(([k, v]) => '  ' + pad(k + ':', 30) + v).join('\n');
}

/** Where the points came from, highest contributor first. */
function formatSignals(signals) {
  const lines = ['  Signal breakdown (points out of 100):'];
  const ordered = signals.slice().sort((a, b) => b.points - a.points);
  for (const s of ordered) {
    lines.push(
      '    ' +
        pad(s.name, 12) +
        pad(s.points.toFixed(1), 7) +
        pad('weight ' + s.weight, 13) +
        s.metric +
        ' ' +
        s.raw
    );
  }
  return lines.join('\n');
}

/**
 * What to do, straight under the verdict. A file with nothing to fix says so in
 * one line, so the reader never has to infer it from an empty list.
 */
function formatActions(result, label) {
  const actions = result.actions || [];
  if (!actions.length) return ['Nothing to fix first: the score is in the lowest band (0 to 20).'];
  const lines = ['Fix first:'];
  actions.forEach((a, i) => {
    lines.push(`  ${i + 1}. ${a.text} Costs ${a.points.toFixed(1)} points (${a.signal}).`);
  });
  // The last step is always the same loop: rewrite, then prove nothing was lost.
  const file = label && label !== 'stdin' ? ` --file ${label}` : '';
  lines.push(
    `  ${actions.length + 1}. Rewrite it with the skill (/humanizer${file}), then run "compare --check-facts" on the pair.`
  );
  return lines;
}

function formatScore(result, label) {
  const lines = [];
  if (label) lines.push(label);
  lines.push(`Score: ${result.score}/100  (${result.verdict})`);
  if (result.metrics.shortSample) {
    lines.push('  note: short sample (< 40 words) - score is low-confidence');
  }
  lines.push(...formatActions(result, label));
  lines.push('Detail:');
  if (result.signals) lines.push(formatSignals(result.signals));
  lines.push(formatMetrics(result.metrics));
  return lines.join('\n');
}

/**
 * Verdict first: with a gate, the first line says PASS or FAIL and how many files
 * are over it. The files follow, worst first, so the ones to fix are on top.
 * A sample under 40 words is listed but never gated: its score is low-confidence.
 */
function formatScan(scan, { failAbove } = {}) {
  const lines = [];
  const gated = failAbove != null;
  const over = (f) => gated && !f.shortSample && f.score > failAbove;
  const bad = scan.files.filter(over);
  if (gated) {
    lines.push(
      bad.length
        ? `Result: FAIL. ${bad.length} of ${scan.files.length} file(s) score above ${failAbove}.`
        : `Result: PASS. No file scores above ${failAbove}.`
    );
  }
  lines.push(`Scanned ${scan.files.length} file(s). mean=${scan.meanScore} max=${scan.maxScore}`);
  lines.push('');
  const ordered = scan.files.slice().sort((a, b) => b.score - a.score || (a.file < b.file ? -1 : 1));
  for (const f of ordered) {
    const flag = over(f) ? '  FAIL' : f.shortSample ? '  (short sample, not gated)' : '';
    lines.push(`  ${pad(f.score + '/100', 8)} ${pad(f.verdict, 14)} ${f.file}${flag}`);
  }
  return lines.join('\n');
}

function formatCompare(before, after) {
  const keys = [
    'wordCount',
    'burstiness',
    'typeTokenRatio',
    'mattr',
    'trigramRepetition',
    'fleschKincaidGrade',
  ];
  const lines = [];
  lines.push(`Score: ${before.score} -> ${after.score}  (delta ${signed(after.score - before.score)})`);
  lines.push('');
  for (const k of keys) {
    const b = before.metrics[k];
    const a = after.metrics[k];
    lines.push('  ' + pad(k + ':', 22) + pad(b, 10) + '-> ' + pad(a, 10) + signed(round(a - b)));
  }
  return lines.join('\n');
}

const FACT_LABELS = {
  urls: 'URL',
  dates: 'date',
  percentages: 'percentage',
  versions: 'version',
  numbers: 'number',
  acronyms: 'name',
};

function formatFacts(facts) {
  const lines = ['Fact check:'];
  if (facts.ok) {
    lines.push(
      `  OK. All ${facts.counts.before} fact(s) in the original survive the rewrite.`
    );
    return lines.join('\n');
  }
  lines.push(`  ${facts.lost.length} fact(s) lost or changed:`);
  for (const f of facts.lost) {
    lines.push('  ' + pad(FACT_LABELS[f.kind] || f.kind, 12) + f.value);
  }
  return lines.join('\n');
}

function signed(n) {
  return n > 0 ? '+' + n : String(n);
}

function round(x) {
  return Math.round(x * 1000) / 1000;
}

module.exports = { formatMetrics, formatSignals, formatActions, formatScore, formatScan, formatCompare, formatFacts };
