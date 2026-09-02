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

function formatScore(result, label) {
  const lines = [];
  if (label) lines.push(label);
  lines.push(`Score: ${result.score}/100  (${result.verdict})`);
  if (result.metrics.shortSample) {
    lines.push('  note: short sample (< 40 words) - score is low-confidence');
  }
  lines.push(formatMetrics(result.metrics));
  return lines.join('\n');
}

function formatScan(scan, { failAbove } = {}) {
  const lines = [];
  lines.push(`Scanned ${scan.files.length} file(s). mean=${scan.meanScore} max=${scan.maxScore}`);
  lines.push('');
  for (const f of scan.files) {
    const flag = failAbove != null && f.score > failAbove ? '  FAIL' : '';
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

module.exports = { formatMetrics, formatScore, formatScan, formatCompare, formatFacts };
