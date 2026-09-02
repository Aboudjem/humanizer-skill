# Gate commits on the AI-tell score

The repo ships two [pre-commit](https://pre-commit.com/) hooks. Both run the local metrics CLI,
which has no dependencies, makes no network calls, and reads no credentials. Your text never
leaves the machine.

## The two hooks

| id | Scans | Use it when |
| --- | --- | --- |
| `humanizer-scan-staged` | Only the `.md`, `.markdown` and `.txt` files in the commit | Almost always. Fast, and it fails on what you actually changed. |
| `humanizer-scan` | The whole repository, every commit | You want a standing floor for the entire tree, not just the diff. |

Both fail the commit when a file scores above 40 on the 0-100 AI-tell scale.

## Setup

Add this to `.pre-commit-config.yaml` in your own repo:

```yaml
repos:
  - repo: https://github.com/Aboudjem/humanizer-skill
    rev: v0.7.0
    hooks:
      - id: humanizer-scan-staged
```

Then:

```bash
pre-commit install
pre-commit run --all-files
```

`rev` is a git tag on this repository, not the CLI's own package version. Pick a released tag so
your gate does not move under you.

## Choosing a threshold

The hooks ship with `--fail-above 40`, which is the top of the "Mostly human" band. Run the CLI on
a file you are happy with and use the number it prints:

```bash
node cli/index.js score examples/blog-post/after.md
```

```
examples/blog-post/after.md
Score: 21/100  (Mostly human)
  Signal breakdown (points out of 100):
    lexical     19.1   weight 0.4   vocabTellDensity 0.0167
    repetition  1.9    weight 0.14  trigramRepetition 0.024
    burstiness  0.0    weight 0.28  burstiness 1.291
    diversity   0.0    weight 0.18  mattr 0.887
```

The breakdown says where the points came from, so you can see whether a file is failing on
vocabulary, on flat sentence lengths, or on repetition.

To override the threshold, pass your own `args` in `.pre-commit-config.yaml`:

```yaml
      - id: humanizer-scan-staged
        args: [scan, --fail-above, '30']
```

The bands are: 0-20 Pristine, 21-40 Mostly human, 41-60 Mixed, 61-80 AI-leaning, 81-100 Pure AI
smell. Prose written by a person on a normal day lands in the first two bands. A threshold below 20
will fail honest writing.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Every scanned file is at or under the threshold |
| 1 | At least one file is above it |
| 2 | Usage error, or a path that does not exist |

A path that cannot be read is an error, not a skip, so a typo in a config fails loudly instead of
quietly scanning nothing.

## Running it in CI instead

The same gate works without pre-commit:

```bash
node cli/index.js scan docs --fail-above 40
```

Or hold a committed baseline and fail only on files that got worse:

```bash
node cli/index.js scan docs --baseline .humanizer-baseline.json --write-baseline
node cli/index.js scan docs --baseline .humanizer-baseline.json --fail-on-regression
```

There is also a ready-made composite action at `.github/actions/humanizer-gate/action.yml`.
