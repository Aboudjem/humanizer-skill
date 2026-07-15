---
sidebar_position: 7
title: Optional metrics CLI
---

# Optional metrics CLI

The skill is all you need to rewrite text. If you also want to *measure* documents and gate them in CI, the repo ships a small, zero-dependency Node CLI that computes the signals the skill describes: burstiness, type-token ratio, sentence-length coefficient of variation, trigram repetition, AI-vocabulary density, Flesch-Kincaid, and a transparent 0-100 score.

:::info[Separate, optional layer]
The CLI is not required to use the skill, and the skill never calls it. It is plain Node with zero third-party dependencies, fully offline. If you only want the skill, you never touch the CLI.
:::

## Score a file

```bash
node cli/index.js score README.md
```

Pass `-` to read from standard input.

## Compare a rewrite

```bash
node cli/index.js compare --before draft.md --after final.md
```

See exactly which signals a rewrite improved.

## Gate a directory in CI

```bash
node cli/index.js scan docs/ --fail-above 40
```

Fail only on regression against a saved baseline:

```bash
node cli/index.js scan docs/ --baseline .humanizer-baseline.json --fail-on-regression
```

## GitHub Action

Drop the bundled reusable Action into any workflow:

```yaml
- uses: Aboudjem/humanizer-skill/.github/actions/humanizer-gate@main
  with:
    path: docs/
    fail-above: '40'
```

:::caution[It is a proxy, not a detector]
The CLI score is a deterministic proxy for how AI-flavored text reads, not a trained AI detector. It is fast and reproducible, and it complements the skill's holistic language-model score. Treat both as signals; the real gate is a careful human reader.
:::

Full options are documented in [`cli/README.md`](https://github.com/Aboudjem/humanizer-skill/blob/main/cli/README.md).
