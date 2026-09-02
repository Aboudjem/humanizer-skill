# humanizer-metrics (optional CLI)

A small, **zero-dependency** Node tool that *computes* the writing signals the skill talks about, so you can score docs deterministically and gate them in CI.

The pure-Markdown skill in `../skills/humanizer/SKILL.md` needs none of this. This directory is a separate, optional layer for power users and teams. Nothing here runs unless you run it.

## What it computes

For any text it reports:

- **Burstiness** (coefficient of variation of sentence length) and Goh-Barabasi burstiness
- **Type-token ratio** and **MATTR** (length-stable lexical diversity)
- **Trigram repetition** (the treadmill signal, P43)
- **AI-vocabulary tell density** (tiered blacklist, mirrors P7 and the tiered vocab in the skill)
- **Flesch-Kincaid** grade and reading ease
- A transparent weighted **0-100 AI-tell score** (higher = more AI smell)

The score is a deterministic proxy: `0.28 low-burstiness + 0.18 low-diversity + 0.14 high-repetition + 0.40 lexical-tells`. It is not a trained detector and does not call any network. The `/humanizer` skill's LLM-estimated score is more holistic; this one is fast and reproducible. Use them together.

## Requirements

Node 18 or newer. No `npm install` needed.

## Usage

```bash
# Score one file (or - for stdin)
node cli/index.js score README.md
cat draft.md | node cli/index.js score -

# Ignore code fences and quoted examples so they don't inflate the score
node cli/index.js score docs/api.md --ignore-code --ignore-quotes

# Scan a whole tree
node cli/index.js scan docs/

# Show the before/after delta
node cli/index.js compare --before draft.md --after final.md

# JSON for tooling
node cli/index.js score README.md --json
```

## CI quality gate

Fail the build when docs get too AI-flavored, or only when they regress against a saved baseline:

```bash
# Hard threshold
node cli/index.js scan docs/ --fail-above 40

# Save a baseline once, then fail only on regressions (existing debt is grandfathered)
node cli/index.js scan docs/ --baseline .humanizer-baseline.json --write-baseline
node cli/index.js scan docs/ --baseline .humanizer-baseline.json --fail-on-regression
```

Exit codes: `0` pass, `1` gate failed, `2` usage or IO error.

### GitHub Action

A reusable composite action lives at `.github/actions/humanizer-gate`:

```yaml
- uses: Aboudjem/humanizer-skill/.github/actions/humanizer-gate@main
  with:
    path: docs/
    fail-above: '40'
```

### Pre-commit hook

For a fast local gate (the GitHub Action above is the CI-side backstop), the repo ships a `.pre-commit-hooks.yaml` for the Python [`pre-commit`](https://pre-commit.com) framework. It wraps the same zero-dependency CLI, `language: script` (no install step, just Node), and re-scans the repo on every commit that touches a Markdown or text file.

Add this to your own repo's `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/Aboudjem/humanizer-skill
    rev: main  # pin to a tagged release or commit SHA in production; `pre-commit autoupdate` will not update a mutable ref
    hooks:
      - id: humanizer-scan
```

Then `pre-commit install` once. The hook fails the commit if any scanned file scores above 40; adjust the threshold by overriding `entry` in your own config, e.g. `entry: cli/index.js scan . --fail-above 60`.

Not using the Python `pre-commit` framework? Husky (the most common JS-native alternative) works too. The CLI is not published to npm today (see below), so vendor it, for example as a git submodule at `tools/humanizer-skill`, then add one line to `.husky/pre-commit`:

```bash
node tools/humanizer-skill/cli/index.js scan . --fail-above 40
```

## Tests

```bash
cd cli && node --test
```

50 tests, no dependencies. Covers tokenization, every metric, the composite score and its per-signal breakdown, code/quote masking, the vocabulary layer, fact extraction and the fact-loss diff, and CLI exit codes (threshold gate, baseline regression, fact check, bad input).

## Linting

```bash
cd cli && npm install && npm run lint
```

ESLint is a devDependency only, used for local and CI linting; it never ships with the published package and does not affect the CLI's zero-runtime-dependency claim.
