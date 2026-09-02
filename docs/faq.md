# FAQ

## What actually gets installed?

One Markdown file, `skills/humanizer/SKILL.md`, plus two reference files next to it. No JavaScript,
no binary, no background process. Your editor reads the file when you invoke the skill.

## Does anything leave my machine?

No. The skill is a prompt your editor already has, and the optional metrics CLI is plain Node with
no dependencies and no network calls. There is no telemetry, no account, and no API key.

## Which models does it run on?

Whichever one your editor points at. The patterns and the voices are prose rules, so the model only
changes how inventive the rewrite step is. It has been used on Claude Opus, Sonnet and Haiku 4.x,
on GPT models through Codex CLI, and on Gemini through the Gemini CLI. Local models work with longer
prompts and `--aggressive`.

## Will it make my text pass an AI detector?

That is the wrong goal and no honest tool can promise it. Detectors change weekly, and their
accuracy on rewritten text is contested. What holds up is that writing with real variation, concrete
detail, and fewer stock phrases reads better to people and tends to score better everywhere.

## It flagged writing I wrote myself. Is it broken?

Probably not, but it can be wrong about you. Low sentence-length variation is a habit some people
have, not proof of anything, and detectors are known to misfire on non-native English writing
(Liang et al., [arXiv:2304.02819](https://arxiv.org/abs/2304.02819)). The skill carries a
false-positive guard for exactly this: hard-to-fabricate specifics, mixed feelings, lived sensory
detail, deliberate imperfection, and anything written before late 2022. Treat the score as a signal,
not a verdict.

## What are the modes and flags?

Three modes: `detect` scans and reports, `rewrite` transforms (the default), `edit` changes a
Markdown file in place and refuses non-prose targets such as source code and config.

Flags: `--voice`, `--mode`, `--file`, `--score`, `--purpose`, `--aggressive`, `--iterate N`,
`--openings N`, `--ignore-code`, `--ignore-quotes`. The full table is in the
[skill's quick reference](../skills/humanizer/SKILL.md).

## Can I teach it my own voice?

Yes. Drop a `humanizer-context.md` file in your project root with writing samples and a banned-word
list. The skill folds it into whichever voice you picked.

## What is the CLI for, and do I need it?

You do not need it. The skill alone rewrites and scores. The CLI in [`cli/`](../cli/README.md) exists
when you want a number that is reproducible rather than a model's estimate: same file, same score,
every time. That is what makes it usable as a CI gate or a
[pre-commit hook](pre-commit.md). It is a separate zero-dependency Node package and the skill never
calls it.

## Is the CLI on npm?

Not yet. Run it from a clone with `node cli/index.js`. The package is packaging-complete, so the
command will get shorter once it is published, but nothing in the docs assumes that today.

## How do I add a pattern?

Add a short entry to `skills/humanizer/SKILL.md`, put the deep dive and a before/after example in
`skills/humanizer/references/patterns.md`, and update the badge count and the CHANGELOG. CI fails if
the README badge and the catalog disagree. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Is there a Chinese version?

`skills/humanizer/references/patterns.zh.md` is a provisional Chinese appendix and covers a subset of
the catalog, not all 55 patterns. The README is translated into five languages in
[`READMEs/`](../READMEs/).

## Where can I try it without installing?

There is a zero-backend browser demo at [humanizer-skill.vercel.app](https://humanizer-skill.vercel.app).
It runs a client-side subset of the patterns plus burstiness scoring. No API calls, and nothing you
paste leaves the browser.
