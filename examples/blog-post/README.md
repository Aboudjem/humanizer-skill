# Example: a blog post, before and after

Two files, and nothing but the text in each, so the CLI scores the writing and not the notes.

| File                     | What it is                                                  | Score  |
| ------------------------ | ----------------------------------------------------------- | ------ |
| [`before.md`](before.md) | A specimen written to show the patterns. It holds real facts | 57/100 |
| [`after.md`](after.md)   | The skill's rewrite of it, `professional` voice              | 6/100  |

Re-print both numbers from the repo root:

```bash
node cli/index.js compare --before examples/blog-post/before.md --after examples/blog-post/after.md --check-facts
```

```text
Score: 57 -> 6  (delta -51)

  wordCount:            244       -> 155       -89
  burstiness:           0.263     -> 0.534     +0.271
  typeTokenRatio:       0.66      -> 0.729     +0.069
  mattr:                0.843     -> 0.831     -0.012
  trigramRepetition:    0.004     -> 0.007     +0.003
  fleschKincaidGrade:   14.7      -> 5.8       -8.9

Fact check:
  OK. All 7 fact(s) in the original survive the rewrite.
```

## How the rewrite was made

It is a real run, on 2026-11-17, in Claude Code with the Sonnet model:

```text
/humanizer --file before.md --voice professional
```

The first output dropped one fact. It wrote "an image generator" where the specimen said "AI".
The fact check caught it:

```text
Fact check:
  1 fact(s) lost or changed:
  name        AI
```

One word went back in ("an AI image generator"). Nothing else in `after.md` was edited by hand.
That is the loop the README describes: score, rewrite, then check the facts.

## Patterns in the specimen

Quoted phrases are in code spans, so this page does not trip the scan it documents.

| Pattern                         | Where                                                             |
| :------------------------------ | :---------------------------------------------------------------- |
| P1 Significance Inflation       | `pivotal moment in human history`, `testament to human ingenuity` |
| P4 Promotional Language         | `rapidly evolving`, `cutting-edge`, `seamless, user-friendly`     |
| P5 Vague Attributions           | `Experts argue`, with no source                                   |
| P6 Formulaic Challenges         | `Despite the challenges ... continues to thrive`                  |
| P7 AI Vocabulary                | `reshaping`, `leverage`, `foster`                                 |
| P18 Formal Register Overuse     | `It is important to note`, `it is worth noting`                   |
| P22 Filler Phrases              | `In today's`, `Additionally`, `In conclusion`                     |
| P24 Generic Conclusions         | `The future looks bright`, `poised for growth`                    |
| P30 Uniform Sentence Length     | Sentences run from 13 to 37 words, mean 24.4                      |
| P39 "Whether" Paragraph Closers | `Whether you are a seasoned artist or a complete beginner`        |

## What the rewrite did

| Specimen                                    | Rewrite                                                   |
| :------------------------------------------ | :-------------------------------------------------------- |
| Opens on `In today's rapidly evolving...`   | Opens on the release date, the first hard fact            |
| `Experts argue`                             | Cut. No expert was named, so none is claimed              |
| `The future looks bright`                   | `I wouldn't predict where that ends up.`                  |
| `challenges and controversies`              | Kept general. The skill did not invent a specific dispute |
| Sentences of 13 to 37 words                 | Sentences of 4 to 31 words                                |
| A closing recap (`In conclusion...`)        | Cut                                                       |

The specimen carries hard facts on purpose, so the fact check has something to keep. It finds 7:
the date `2022-08-22`, the numbers `1.4` and `10`, and the names `AI`, `GB`, `GPU` and `VRAM`.
