<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/hero-light.svg">
  <img alt="humanizer. AI writing humanizer and detector. Reads like a person wrote it. 55 patterns, 5 voices, zero setup, and nothing leaves your machine." src=".github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=00D4FF" alt="GitHub stars"></a>
</p>

<p align="center">
  <b>English</b> · <a href="READMEs/zh-CN.md">简体中文</a> · <a href="READMEs/ja.md">日本語</a> · <a href="READMEs/es.md">Español</a> · <a href="READMEs/fr.md">Français</a>
</p>

<p align="center"><b>Humanizer is a free, open-source AI writing humanizer and detector.</b></p>

<p align="center">
  <a href="#what-it-does">What it does</a> · <a href="#install">Install</a> · <a href="#use-it">Use it</a> · <a href="#works-in-your-editor">Works in your editor</a> · <a href="#learn-more">Learn more</a>
</p>

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

## What it does

AI writing has a fingerprint. Sentences all run about the same length, the same safe words keep
coming back, and filler like "in today's landscape" pads the gaps. Humanizer names 55 of those
habits, finds the ones in your text, and rewrites it in a voice you pick. The CLI scores the text
0 to 100 from four measurable signals, not from a count of the 55.

Two words worth a gloss. *Burstiness* is how much your sentence lengths vary, and an *AI tell* is
one of those giveaway habits.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/demo-burstiness-light.svg">
  <img alt="Sentence-length chart. The AI line is flat and uniform. The human line runs from 3 to 31 words. Humanizer restores the variation." src=".github/assets/demo-burstiness-light.svg" width="100%">
</picture>

## Install

In Claude Code, through the 10x marketplace:

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

In 70+ other agents, one line. The [skills CLI](https://github.com/vercel-labs/skills) links the
skill into the directory your agent reads, or copies it with `--copy`:

```bash
npx skills add Aboudjem/humanizer-skill
```

<details>
<summary>Install without the installer (curl, or a per-editor path)</summary>

Project-scoped, so it travels with your repo:

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Swap the folder for another editor: `.cursor/skills/`, `.github/skills/` for Copilot, `.codex/skills/`,
`.gemini/skills/`, `.windsurf/skills/`, `.continue/skills/`. Use `~/.claude/skills/` for a global
install. Full paths per agent are in [docs/editors.md](docs/editors.md).

</details>

## Use it

**1. Score something you already wrote.** This scans, it does not change the file:

```bash
node cli/index.js score examples/blog-post/before.md
```

```text
examples/blog-post/before.md
Score: 46/100  (Mixed)
  Signal breakdown (points out of 100):
    lexical     40.0   weight 0.4   vocabTellDensity 0.0818
    repetition  6.0    weight 0.14  trigramRepetition 0.077
    burstiness  0.0    weight 0.28  burstiness 0.798
    diversity   0.0    weight 0.18  mattr 0.866
  words:                        391
  sentences:                    11
  mean sentence length:         35.55
  ... plus 9 more metric lines
```

Lower is more human. The breakdown says which signal cost the points, so you know what to fix first.

**2. Rewrite it in a voice.** In your editor, call the skill on your own draft:

```text
/humanizer --file draft.md --voice technical
```

> **Before:** This comprehensive guide delves into the intricacies of our authentication system.
>
> **After:** This guide explains how our authentication system works.

The rewrite cuts the tells. It never adds a fact the source did not have.

**3. Check the rewrite kept the facts.** A rewrite that quietly drops a number is the real risk:

```bash
node cli/index.js compare --before examples/blog-post/before.md \
  --after examples/blog-post/after.md --check-facts
```

It exits 1 and names anything lost: a number, a percentage, a URL, a date, a version, or an acronym.

## What you get

- **A 0 to 100 AI-tell score** with a five-band verdict, from Pristine to Pure AI smell.
- **A per-signal breakdown** from the `score` command, so a bad number points at a specific cause.
- **A rewrite in one of five voices**: `casual`, `professional`, `technical`, `warm`, `blunt`.
- **A fact check** that fails a rewrite which lost a number, percentage, URL, date, version, or acronym.
- **An exit code** for CI, and a [pre-commit hook](docs/pre-commit.md) that scores only the files you staged.

<details>
<summary>All 55 patterns, by category</summary>

| IDs | Category | Examples |
|:----|:---------|:---------|
| P1-P8 | Content | Significance inflation, promotional language, AI vocabulary ("delve", "leverage") |
| P9-P18 | Language and style | Negative parallelisms, em dash overuse, structured-list syndrome |
| P19-P21 | Communication | Chatbot artifacts, knowledge-cutoff disclaimers, sycophantic tone |
| P22-P30 | Filler and hedging | Filler phrases, generic conclusions, uniform sentence length |
| P31-P43 | Emerging | Elegant variation, placeholder text, chatbot markup leaks, infomercial hooks |
| P44-P55 | Craft and forensic | False agency, aphorism formulas, unicode obfuscation, leftover hedge debris |

Every pattern has a write-up and its trigger list in [`SKILL.md`](skills/humanizer/SKILL.md). In
[`references/patterns.md`](skills/humanizer/references/patterns.md), 34 of the 55 also carry a
before/after pair, one per pattern that benefits from one.
The core catalog (P1-P30) draws on
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (CC BY-SA).

</details>

## Works in your editor

Works in Claude Code, Cursor, Codex, Copilot, Gemini CLI, and 70+ other agents through `npx skills add`.

| Agent | One-line install |
|:--|:--|
| Claude Code | `claude plugin install humanizer@10x` |
| Any of 70+ agents | `npx skills add Aboudjem/humanizer-skill` |
| One named agent (Cursor, Codex, Copilot, Gemini CLI, OpenCode, Zed) | add `-a <agent>` to that line |
| Everything else | the table in [docs/editors.md](docs/editors.md) |

The skill is Markdown, so it runs on whatever model your editor points at.

## Good to know

> [!IMPORTANT]
> Nothing leaves your machine. The skill is one Markdown file your editor reads locally, and the
> optional metrics CLI is plain Node with no dependencies and no network calls. No telemetry, no
> account, no API key.

- **Writing better** is the goal, not beating a detector. Clean prose skips the lazy habits
  detectors look for, so fixing the writing sorts the detection out on its own.
- **False positives happen.** Detectors misfire on non-native English writing
  ([Liang et al.](https://arxiv.org/abs/2304.02819)), and low sentence-length variation is a habit
  some people simply have. A false-positive guard protects lived detail and deliberate imperfection.
- **The number is a stand-in**, not a verdict. It is reproducible, which is what makes it a usable
  gate, but it reads signals rather than meaning. 64 tests pin its behaviour.

## Learn more

- [The skill itself](skills/humanizer/SKILL.md), and the [pattern deep dives](skills/humanizer/references/patterns.md)
- [What the score measures](docs/science.md), the research behind the rewrite rules
- [Install in your editor](docs/editors.md), [gate commits](docs/pre-commit.md), [FAQ](docs/faq.md), [how it compares](docs/comparison.md)
- [The metrics CLI](cli/README.md), the [CHANGELOG](CHANGELOG.md), the [LICENSE](LICENSE)

<p align="center">
  <sub>Built by <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · MIT License · No telemetry, no data collection</sub>
</p>
