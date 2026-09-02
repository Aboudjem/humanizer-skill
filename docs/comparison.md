# How Humanizer compares

Three kinds of tool sit in this space, and they answer different questions.

| | Humanizer | Hosted rewrite tools | AI detectors | Editing it yourself |
|:--|:--|:--|:--|:--|
| Open source | Yes | No | No | Not applicable |
| Runs with no account and no network | Yes | No | No | Yes |
| Names what it found | 55 numbered patterns | No | A score, rarely a reason | Yes |
| Rewrites in a voice you choose | 5 voice profiles | Usually one | No | Yes |
| Score you can reproduce | Yes, the CLI is deterministic | No | No, models change | No |
| Speed on a long document | Seconds to minutes | Seconds | Seconds | Hours |

Prices are left out on purpose. Hosted tools change their plans often, and any figure written here
would be stale within a quarter.

## The one-line difference

A hosted rewriter swaps words. Humanizer changes the structure, which is the part that actually
carries the tell, and it tells you which of the 55 patterns it changed and why.

## What it does not do

- **It does not call a detector.** No GPTZero, Originality, or Copyleaks API. Your draft never leaves
  the machine, so no third party sees it and no score comes back from one.
- **It does not promise to beat any detector.** Detectors are moving targets and their accuracy on
  paraphrased text is contested. Writing that is genuinely less repetitive tends to score better
  everywhere, which is the durable version of the same outcome.
- **It does not invent facts.** The rewrite rules forbid adding names, dates, or numbers that are not
  in the source, and `compare --check-facts` fails a rewrite that dropped one.
- **It does not flatten a real voice.** A false-positive guard protects hard-to-fabricate specifics,
  lived detail, and deliberate imperfection, with explicit guardrails for non-native English writers
  and for low-variance prose from neurodivergent writers.

## Neighbours worth knowing

- [blader/humanizer](https://github.com/blader/humanizer) is the original agent skill for this job and
  by far the most installed. Ours is the longer catalog, with a score, a CLI, and a commit gate.
- [crabin/paper-humanizer-skill](https://github.com/crabin/paper-humanizer-skill) targets academic
  polishing with strict factual preservation, in Chinese and English.
- [elements-of-style](https://github.com/anthropics/skills) and similar prose-craft skills teach
  general writing quality. They pair well with this one rather than competing with it.

Read [what the score measures](science.md) for the research the rewrite rules are built on.
