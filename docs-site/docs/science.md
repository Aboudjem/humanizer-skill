---
sidebar_position: 6
title: The science
---

# The science

AI detectors do not use magic. They measure two things, and both are well documented.

## Burstiness

Burstiness is sentence-length variation. Humans write a 3-word sentence, then a 40-word one, then a 12-word one. AI averages every sentence around 18 words. Detectors measure that variance; low variance reads as AI.

Humanizer restores burstiness on purpose: it mixes short punches, medium sentences, and the occasional long thought that winds through a qualification before it lands. Fragments included.

## Perplexity

Perplexity is word predictability. AI picks the most statistically likely next word every time. Humans reach for the second or third word that comes to mind, use domain slang, and make unexpected analogies from lived experience. Higher perplexity reads as human.

Word-swap tools like QuillBot change individual words but leave rhythm and predictability untouched. That is why they fail: detectors care about structure, not synonyms. You need structural transformation.

## What the research says

| Technique | Source | Finding |
|:----------|:-------|:--------|
| Burstiness injection | GPTZero | Human sentence length varies wildly; AI does not. |
| Perplexity increase | GPTZero | AI picks the most statistically likely next word. |
| Vocabulary diversity | SSRN stylometric study | Human type-token ratio 55.3 vs AI 45.5 |
| Kill negative parallelism | Washington Post | "It's not X, it's Y" is the top AI tell across 328K messages |
| Structural paraphrasing | RAID benchmark, ACL 2024 | Drops DetectGPT accuracy from 70.3% to 4.6% |
| Intrinsic dimension | NeurIPS 2023 | Human text about 9 dimensions vs AI about 7.5 |

## The HC3 corpus

The Human ChatGPT Comparison Corpus (Guo et al. 2023, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597)) pairs human and ChatGPT answers to the same questions. It is bilingual, roughly 40,000 question sets, and it grounds several of the claims above:

- **Length.** English human answers average 142.5 words vs ChatGPT 198.1, about 39% longer.
- **Vocabulary diversity.** Humans use a larger unique-word set (79,157 vs 66,622) and higher diversity ratios.
- **Perplexity.** ChatGPT text has lower perplexity at both the text and sentence level; human perplexity is long-tailed.
- **Indicating words.** Its top-discriminating ChatGPT markers ("There are several ways", "In general") became pattern P53.

:::note[Cite, do not benchmark]
The HC3 dataset is CC-BY-SA-4.0, cited here with attribution as corroborating evidence. Humanizer does not claim to have benchmarked against any detector; the optional [CLI](/cli) computes a transparent, deterministic proxy, not a trained model.
:::
