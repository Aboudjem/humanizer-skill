"use strict";

// The README translations must stay full translations of README.md.
// Prose is translated, but code blocks and the heading structure are not:
// every fenced block must match the English one byte for byte, and the
// sequence of heading levels must be the same.

const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const LANGS = ["fr", "es", "ja", "zh-CN"];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// Returns { blocks: [string], headings: [number] } for a Markdown file.
// A fenced block is kept whole, fence line and info string included.
function structure(md) {
  const blocks = [];
  const headings = [];
  const lines = md.split("\n");
  let fence = null;
  let current = [];
  for (const line of lines) {
    if (fence) {
      current.push(line);
      if (line.trim() === fence) {
        blocks.push(current.join("\n"));
        fence = null;
        current = [];
      }
      continue;
    }
    const open = line.match(/^\s*(`{3,}|~{3,})/);
    if (open) {
      fence = open[1];
      current = [line];
      continue;
    }
    const h = line.match(/^(#{1,6})\s+\S/);
    if (h) headings.push(h[1].length);
  }
  assert.strictEqual(fence, null, "unclosed code fence");
  return { blocks, headings };
}

const english = structure(read("README.md"));

test("the English README has code blocks and headings to compare against", () => {
  assert.ok(english.blocks.length >= 5, "expected at least 5 fenced blocks");
  assert.ok(english.headings.length >= 5, "expected at least 5 headings");
});

for (const lang of LANGS) {
  const rel = `READMEs/${lang}.md`;

  test(`${rel}: fenced code blocks are identical to README.md`, () => {
    const t = structure(read(rel));
    assert.strictEqual(
      t.blocks.length,
      english.blocks.length,
      `${rel} has ${t.blocks.length} fenced blocks, README.md has ${english.blocks.length}`,
    );
    english.blocks.forEach((block, i) => {
      assert.strictEqual(
        t.blocks[i],
        block,
        `${rel}: fenced block ${i + 1} differs from English`,
      );
    });
  });

  test(`${rel}: heading levels match README.md`, () => {
    const t = structure(read(rel));
    assert.deepStrictEqual(
      t.headings,
      english.headings,
      `${rel}: heading levels differ from English`,
    );
  });

  test(`${rel}: ends with the machine-assisted translation note`, () => {
    const lastLine = read(rel).trimEnd().split("\n").pop();
    assert.match(
      lastLine,
      /\.\.\/README\.md/,
      `${rel}: last line must link the English original`,
    );
  });
}
