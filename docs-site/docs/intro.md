---
slug: /
sidebar_position: 1
title: Humanizer, an AI writing humanizer and detector for Claude Code
description: Humanizer is a free, open-source AI writing humanizer skill that detects 55 AI writing patterns and rewrites text in 5 voice profiles, with a 0-100 AI-tell score, zero dependencies, and no network calls.
---

# Humanizer: an AI writing humanizer and detector

Humanizer is an open-source [Claude Code](https://github.com/Aboudjem/humanizer-skill) skill, an **AI writing humanizer**, that detects **55 AI writing patterns** and rewrites text in **5 voice profiles**, scoring every draft on a 0-100 AI-tell scale. The skill core is a single Markdown file with zero dependencies and no network calls, so nothing you paste ever leaves your machine.

AI text scores about 0.00 burstiness, according to GPTZero's own detection research. Human writing scores around plus 0.70. Humanizer rewrites the gap: it strips the mechanical tells and restores the sentence-length variation and specificity that make writing read like a person wrote it.

:::tip[Why it exists]
Readers can feel when text was written by a machine. Humanizer names the specific tells (the em-dash pileups, the rule-of-three cadence, the vague attributions, the "delves into" energy) so you can strip them out while keeping your own voice.
:::

## How it works

Point the skill at a piece of writing with `/humanizer "your text"`. It runs a four-step pass:

1. **Parse** the text and any flags.
2. **Detect** which of the 55 patterns are present, across six categories.
3. **Inject** a chosen voice profile, varying sentence length (burstiness) and word choice (perplexity).
4. **Verify** the rewrite against the detection patterns and a final "who wrote this?" test.

You can also run `--mode detect --score` to get a report and a 0-100 number without changing a word.

:::note[Not detection evasion]
This is about writing quality, not fooling detectors. Good writing does not trip AI detectors, because it does not carry the lazy patterns detectors look for. Fix the writing and the detection problem takes care of itself. Humanizer ships a false-positive guard so it sharpens human prose instead of laundering it flat.
:::

## The evidence behind it

Humanizer's approach is not a guess. It is built on a specific, citable set of findings:

- **Wikipedia's "Signs of AI writing" guide** is the source for most of the P1-P30 catalog, a living, editor-maintained list of AI-writing tells.
- **According to a Washington Post analysis of 328,000 messages** (2025), phrases like "it's not X, it's Y" are among the AI tells that analysis surfaced, alongside emoji use and the em dash, which is why Humanizer treats negative parallelisms as a top-priority pattern.
- **According to the RAID benchmark** (ACL 2024), structural paraphrasing, not just word-swapping, drops DetectGPT's detection accuracy from 70.3% to 4.6%, which is why Humanizer rewrites structure and rhythm instead of only substituting synonyms the way tools like QuillBot or Undetectable.ai do.
- **According to the HC3 corpus study** (Guo et al., [arXiv 2301.07597](https://arxiv.org/abs/2301.07597)), human answers average 142.5 words versus ChatGPT's 198.1 across roughly 40,000 paired answers, and humans draw from a measurably larger vocabulary. Humanizer's Perplexity Principle and word-choice guidance lean on this finding directly.
- **Pindrop's ACL 2026 study** found trained human judges score only 45 to 53 percent accuracy at distinguishing AI from human writing, close to chance, which is why Humanizer treats its own `--score` as a signal, not a verdict.

## What is in the repo

The installable skill is one file. Everything else is optional:

- The skill core: pure Markdown, standalone.
- Reference files: per-pattern deep dives, full trigger lists, and before/after examples.
- An optional zero-dependency metrics CLI, a CI quality-gate, and a `pre-commit` framework hook.
- A hosted, zero-backend browser demo at [humanizer-skill.vercel.app](https://humanizer-skill.vercel.app).
- A provisional native-Chinese pattern appendix.

:::info[Chinese support]
A Simplified-Chinese [README](https://github.com/Aboudjem/humanizer-skill/blob/main/README.zh-CN.md) and a provisional native-Chinese pattern appendix ship in the repo. Note that burstiness and perplexity do not port cleanly to character-based Chinese, so the Chinese appendix is marked experimental and leans on idiom density and clause rhythm instead.
:::

Head to [Installation](/installation) to add it to your editor, or jump straight to [the 55 patterns](/patterns).
