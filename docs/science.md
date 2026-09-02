# What the score measures

AI detectors and this skill look at the same two things. Both are well documented, and neither is
a secret.

**Burstiness** is how much sentence length varies. People write a 3-word sentence, then a 40-word
one, then a 12-word one. AI parks almost every sentence around 18 words. Flat lengths read as AI.

**Perplexity** is how predictable each word is. AI picks the most likely next word every time.
People reach for the surprising one. Less predictable text reads as human.

Word-swap tools change individual words and leave the rhythm and the predictability alone. You have
to change the structure, not trade synonyms.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-typewriter-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-typewriter-light.svg">
  <img alt="A page runs /humanizer with --voice technical --score. Three AI tells (comprehensive, delves into, pivotal) are flagged and struck through, then replaced with plain prose, and the AI-tell score drops from 84 to 12." src="../.github/assets/demo-typewriter-light.svg" width="100%">
</picture>

## The four findings the rewrite rules are built on

| Technique | Source | Finding |
|:----------|:-------|:--------|
| Burstiness injection | GPTZero | Human sentence length varies widely; AI writing does not. |
| Kill negative parallelism | Washington Post | "It's not X, it's Y" is among the AI tells identified across 328,000 messages (2025). |
| Structural paraphrasing | RAID benchmark, ACL 2024 | Drops DetectGPT accuracy from 70.3% to 4.6%. |
| Length and lexical diversity | HC3 corpus, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597) | Roughly 40,000 pairs: human answers average 142.5 words against ChatGPT's 198.1, and humans draw on a bigger vocabulary. |

Structural paraphrasing is the reason the skill rewrites rhythm rather than vocabulary. The RAID
result is the sharpest version of that point: changing sentence structure moves a detector far more
than changing words does.

## How the CLI turns signals into a number

`node cli/index.js score <file>` computes four signals and weights them into a 0 to 100 score.
Lower is more human. The weights are printed with every run, so nothing is hidden:

| Signal | Weight | What it reads |
|:-------|:-------|:--------------|
| `lexical` | 0.40 | Density of AI-vocabulary tells |
| `burstiness` | 0.28 | Coefficient of variation of sentence length |
| `diversity` | 0.18 | MATTR, a moving-window type-token ratio |
| `repetition` | 0.14 | Trigram repetition |

The score is deterministic: the same file scores the same number every time, on any machine, with no
model in the loop. That makes it useful as a gate. It also makes it a stand-in rather than a verdict,
because it cannot read meaning. The skill's own detect mode is the holistic read; the CLI is the
reproducible one.

## Where this catalog is weak

The pattern catalog carries its own limits section, and it is worth reading before you trust a
score: [Honest limits of this catalog](../skills/humanizer/references/patterns.md#honest-limits-of-this-catalog).
The short version is that trained human judges score close to chance at this task, detectors misfire
on non-native English writing (Liang et al., [arXiv:2304.02819](https://arxiv.org/abs/2304.02819)),
and the surface patterns keep drifting as model providers change their alignment recipes.
