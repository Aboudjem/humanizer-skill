#!/usr/bin/env node
"use strict";

// Writes the hero images and the social preview card from one layout.
//   node tools/build-visuals.js
// Then render the PNG with headless Chrome (see the comment at the end).
// Every line of terminal text below is real output of:
//   node cli/index.js compare --before examples/blog-post/before.md \
//     --after examples/blog-post/after.md --check-facts

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", ".github", "assets");

const THEMES = {
  dark: {
    bg1: "#171029",
    bg2: "#0A0F1C",
    ink: "#F4F0FF",
    sub: "#B9B2D6",
    card: "#121829",
    line: "#2C3352",
    pink: "#FF4D8D",
    violet: "#C77DFF",
    green: "#5EE6A0",
    track: "#262C45",
    chip: "#1B1630",
  },
  light: {
    bg1: "#F6EEFF",
    bg2: "#FFFFFF",
    ink: "#17122B",
    sub: "#4A4466",
    card: "#FFFFFF",
    line: "#DCD0F0",
    pink: "#C2185B",
    violet: "#6A1FB0",
    green: "#11795A",
    track: "#ECE6F7",
    chip: "#F3ECFF",
  },
};

const SANS =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const CH = 0.602; // advance of one monospace character, in em

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// One terminal card: a title line, a score bar, and the text lines.
// marks: [lineIndex, startChar, length] spans to underline.
function card(t, x, y, w, h, title, score, color, lines, marks) {
  const fs_ = 20;
  const cw = fs_ * CH;
  const tx = x + 28;
  let s = `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${t.card}" stroke="${t.line}" stroke-width="2"/>
  <circle cx="${x + 26}" cy="${y + 24}" r="6" fill="${t.line}"/>
  <circle cx="${x + 46}" cy="${y + 24}" r="6" fill="${t.line}"/>
  <circle cx="${x + 66}" cy="${y + 24}" r="6" fill="${t.line}"/>
  <text x="${tx}" y="${y + 76}" font-family="${MONO}" font-size="28" font-weight="700" fill="${t.ink}" xml:space="preserve">${esc(title)}</text>
  <rect x="${tx}" y="${y + 94}" width="${w - 56}" height="12" rx="6" fill="${t.track}"/>
  <rect x="${tx}" y="${y + 94}" width="${Math.max(12, ((w - 56) * score) / 100)}" height="12" rx="6" fill="${color}"/>\n`;
  lines.forEach((ln, i) => {
    const by = y + 146 + i * 32;
    s += `  <text x="${tx}" y="${by}" font-family="${MONO}" font-size="${fs_}" fill="${t.sub}" xml:space="preserve">${esc(ln)}</text>\n`;
  });
  for (const [li, start, len] of marks) {
    const by = y + 146 + li * 32;
    s += `  <rect x="${(tx + start * cw).toFixed(1)}" y="${by + 6}" width="${(len * cw).toFixed(1)}" height="4" rx="2" fill="${t.pink}"/>\n`;
  }
  return s + "</g>\n";
}

function chip(t, x, y, label) {
  const w = Math.round(label.length * 13.2 + 48);
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="48" rx="24" fill="${t.chip}" stroke="${t.violet}" stroke-width="2"/>
<text x="${x + w / 2}" y="${y + 32}" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="600" fill="${t.ink}">${esc(label)}</text>\n`,
  };
}

function build(theme, label) {
  const t = THEMES[theme];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640" role="img"
     aria-label="${esc(label)}">
  <title>humanizer</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/>
      <stop offset="1" stop-color="${t.bg2}"/>
    </linearGradient>
    <linearGradient id="word" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.violet}"/>
      <stop offset="1" stop-color="${t.pink}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="640" fill="url(#bg)"/>
  <text x="64" y="70" font-family="${SANS}" font-size="32" font-weight="800" fill="url(#word)">humanizer</text>
  <text x="64" y="148" font-family="${SANS}" font-size="72" font-weight="800" fill="${t.ink}">See why it sounds like AI</text>
`;
  svg += card(
    t, 64, 176, 560, 236,
    "Before   57/100", 57, t.pink,
    [
      "In today's rapidly evolving technological",
      "landscape, artificial intelligence is",
      "reshaping how we think about...",
    ],
    [[0, 0, 10], [0, 11, 16]],
  );
  svg += card(
    t, 656, 176, 560, 236,
    "After     6/100", 6, t.green,
    ["Stable Diffusion 1.4 was released on", "22 August 2022."],
    [],
  );
  svg += `  <text x="64" y="452" font-family="${MONO}" font-size="22" font-weight="700" fill="${t.green}">Fact check: OK. All 7 fact(s) in the original survive the rewrite.</text>\n`;
  let cx = 64;
  for (const c of ["Know which words", "Reads more human", "Facts kept"]) {
    const ch = chip(t, cx, 478, c);
    svg += ch.svg;
    cx += ch.w + 16;
  }
  svg += `  <rect x="64" y="554" width="628" height="54" rx="12" fill="${t.card}" stroke="${t.line}" stroke-width="2"/>
  <text x="84" y="589" font-family="${MONO}" font-size="22" fill="${t.ink}" xml:space="preserve"><tspan fill="${t.violet}">$</tspan> npx skills add Aboudjem/humanizer-skill -g</text>
  <text x="1216" y="576" text-anchor="end" font-family="${SANS}" font-size="19" font-weight="600" fill="${t.ink}">Agent skills: Claude Code, Codex CLI, Cursor, Gemini CLI</text>
  <text x="1216" y="604" text-anchor="end" font-family="${SANS}" font-size="20" fill="${t.sub}">Runs on your agent's model</text>
</svg>
`;
  return svg;
}

const ALT =
  "humanizer: See why it sounds like AI. Before, 57 out of 100, with stock phrases underlined. " +
  "After, 6 out of 100. Fact check OK, all 7 facts kept.";

fs.writeFileSync(path.join(OUT, "hero-dark.svg"), build("dark", ALT));
fs.writeFileSync(path.join(OUT, "hero-light.svg"), build("light", ALT));
fs.writeFileSync(path.join(OUT, "social-preview.svg"), build("dark", ALT));
console.log("wrote hero-dark.svg, hero-light.svg, social-preview.svg");

// PNG render (macOS, headless Chrome):
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
//     --hide-scrollbars --window-size=1280,640 \
//     --screenshot=.github/social-preview.png .github/assets/social-preview.svg
