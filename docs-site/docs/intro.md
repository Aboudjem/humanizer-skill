---
slug: /
sidebar_position: 1
title: What is Humanizer
---

# What is Humanizer

Humanizer is an open-source [Claude Code](https://github.com/Aboudjem/humanizer-skill) skill that detects **53 AI writing patterns** and rewrites text in **5 voice profiles**, scoring every draft on a 0-100 AI-tell scale. The skill core is a single Markdown file with zero dependencies and no network calls.

AI text scores about 0.00 burstiness. Human writing scores around plus 0.70. Humanizer rewrites the gap: it strips the mechanical tells and restores the sentence-length variation and specificity that make writing read like a person wrote it.

:::tip[Why it exists]
Readers can feel when text was written by a machine. Humanizer names the specific tells (the em-dash pileups, the rule-of-three cadence, the vague attributions, the "delves into" energy) so you can strip them out while keeping your own voice.
:::

## How it works

Point the skill at a piece of writing with `/humanizer "your text"`. It runs a four-step pass:

1. **Parse** the text and any flags.
2. **Detect** which of the 53 patterns are present, across six categories.
3. **Inject** a chosen voice profile, varying sentence length (burstiness) and word choice (perplexity).
4. **Verify** the rewrite against the detection patterns and a final "who wrote this?" test.

You can also run `--mode detect --score` to get a report and a 0-100 number without changing a word.

:::note[Not detection evasion]
This is about writing quality, not fooling detectors. Good writing does not trip AI detectors, because it does not carry the lazy patterns detectors look for. Fix the writing and the detection problem takes care of itself. Humanizer ships a false-positive guard so it sharpens human prose instead of laundering it flat.
:::

## What is in the repo

The installable skill is one file. Everything else is optional:

- The skill core: pure Markdown, standalone.
- Reference files: per-pattern deep dives, full trigger lists, and before/after examples.
- An optional zero-dependency metrics CLI and a CI quality-gate.
- A provisional native-Chinese pattern appendix.

:::info[Chinese support]
A Simplified-Chinese [README](https://github.com/Aboudjem/humanizer-skill/blob/main/README.zh-CN.md) and a provisional native-Chinese pattern appendix ship in the repo. Note that burstiness and perplexity do not port cleanly to character-based Chinese, so the Chinese appendix is marked experimental and leans on idiom density and clause rhythm instead.
:::

Head to [Installation](/installation) to add it to your editor, or jump straight to [the 53 patterns](/patterns).
