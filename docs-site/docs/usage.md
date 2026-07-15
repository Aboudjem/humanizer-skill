---
sidebar_position: 3
title: Usage
---

# Usage

Invoke the skill with `/humanizer` followed by your text and any flags.

```text
/humanizer "text"                                   rewrite with the default voice
/humanizer "text" --voice casual                    pick a voice profile
/humanizer "text" --mode detect --score             scan only, add a 0-100 score
/humanizer --file docs/README.md --voice technical  edit a file in place
/humanizer "text" --aggressive --iterate 3          heavy rewrite, converge to zero patterns
```

## Modes

| Mode | What it does |
|:-----|:-------------|
| `rewrite` | Full transformation with voice injection. The default, so you never have to name it. |
| `detect` | Scan-only report with pattern counts and an optional score. Changes nothing. |
| `edit` | In-place file editing with minimal, targeted changes via the editor's edit tool. |

## Flags

| Flag | Effect |
|:-----|:-------|
| `--voice` | One of `casual`, `professional`, `technical`, `warm`, `blunt`. See [Voice profiles](/voice-profiles). |
| `--score` | Prepend a `[Score: NN/100]` AI-tell density header. Lower is more human. |
| `--iterate N` | Loop detect, rewrite, detect until convergence (maximum three passes). |
| `--aggressive` | Heavier rewrite: shorter sentences, more personality, no hedging. |
| `--purpose` | Layer `essay`, `email`, `marketing`, `technical`, or `general` rules on top of a voice. |
| `--openings N` | Generate N maximally-different opening hooks and surface the strongest. |
| `--ignore-code` | Mask fenced code blocks before detecting and scoring. |
| `--ignore-quotes` | Mask block quotes, so pasted AI examples do not count against you. |

## Score yourself in five seconds

Run detect with `--score` on any text and you get a number you can quote:

```text
/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity." --mode detect --score
```

```text
[Score: 84/100, Pure AI smell]

Patterns found: 5
| P4  | Promotional          | "rapidly evolving landscape" |
| P7  | AI Vocabulary        | "reshaping"                  |
| P22 | Filler               | "In today's"                 |
| P29 | Comprehensive Opening| meta-commentary              |
| P30 | Uniform Length       | sentences avg 19 words       |
```

After rewriting with a voice, the same text scores in the single digits. That delta is the point.

:::tip[Bring your own brand voice]
Drop a `humanizer-context.md` file at your project root with brand samples and banned phrases. The skill auto-loads it as a personal extension of the chosen voice, so the rewrite sounds like you, not a preset.
:::
