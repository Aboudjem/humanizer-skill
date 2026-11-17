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

```text
examples/blog-post/after.md
Score: 6/100  (Pristine)
Nothing to fix first: the score is in the lowest band (0 to 20).
Detail:
  Signal breakdown (points out of 100):
    burstiness  5.3    weight 0.28  burstiness 0.534
    repetition  0.5    weight 0.14  trigramRepetition 0.007
    diversity   0.0    weight 0.18  mattr 0.831
```

A file over the lowest band gets a "Fix first" list right under the score. Each line names the
words or sentences that cost the points. The breakdown under `Detail:` shows the arithmetic.

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

## Skipping a file that is meant to score high

A specimen or a quoted sample can score high on purpose. Leave it out by name:

```bash
node cli/index.js scan . --fail-above 40 --exclude examples/blog-post/before.md
```

`--exclude` takes a file, a folder, or a name with `*`, and a comma-separated list of them.
A file under 40 words is listed but never fails the gate, because its score is low-confidence.
This repo runs that exact gate on itself in CI (`npm run scan`).
