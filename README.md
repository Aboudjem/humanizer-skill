<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/logo-light.svg">
  <img alt="Humanizer" src=".github/assets/logo-light.svg" width="100%">
</picture>

<p align="center"><b>English</b> | <a href="./README.zh-CN.md">简体中文</a></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1f3a5f?style=flat-square" alt="License: MIT"></a>
  <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-53-1f3a5f?style=flat-square" alt="53 AI patterns"></a>
  <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/voices-5-1f3a5f?style=flat-square" alt="5 voice profiles"></a>
  <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/dependencies-0-1f3a5f?style=flat-square" alt="Zero dependencies"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=c0952f" alt="Stars"></a>
</p>

<p align="center">
  <b>Make AI text sound like a real person wrote it.</b><br/>
  One Markdown file. 53 patterns, 5 voices, zero setup, and nothing leaves your machine.
</p>

<p align="center">
  <a href="https://humanizer-skill.vercel.app"><b>Try it in your browser</b></a>
  &nbsp;&middot;&nbsp;
  <a href="#quickstart">Install in 5 seconds</a>
  &nbsp;&middot;&nbsp;
  <a href="skills/humanizer/SKILL.md">Read the source</a>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/demo-burstiness-light.svg">
  <img alt="Sentence-length chart: AI writing is flat and uniform; human writing varies from 3 to 31 words. Humanizer restores the variation." src=".github/assets/demo-burstiness-light.svg" width="100%">
</picture>

<p align="center"><sub>Same idea, two writers. The AI line stays flat. The human line jumps around. That jumpiness is the tell.</sub></p>

---

AI writing has a fingerprint. Every sentence runs about the same length. It reaches for the same safe words, and it pads with filler like "in today's landscape." Two bits of jargon worth knowing: how much your sentence lengths vary is called *burstiness* (people mix short and long, AI keeps them all one size), and those little giveaway habits are called *AI tells*.

Humanizer knows 53 of them. It finds them, scores the text, and rewrites it in a voice you pick. All from a single file your editor reads on your own machine.

## Quickstart

Install once. It works in Claude Code, Cursor, Codex, opencode, and 70+ other AI editors ([vercel-labs/skills](https://github.com/vercel-labs/skills)):

```bash
npx skills add Aboudjem/humanizer-skill
```

Now score any text right in your editor. This just scans, it doesn't rewrite:

```text
/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity." --mode detect --score
```

You get a number you can quote and the reasons behind it:

```text
[Score: 84/100, Pure AI smell]

Patterns found: 5
| P4  | Promotional          | "rapidly evolving landscape" |
| P7  | AI Vocabulary        | "reshaping"                  |
| P22 | Filler               | "In today's"                 |
| P29 | Comprehensive Opening| meta-commentary              |
| P30 | Uniform Length       | sentences avg 19 words       |
```

The score runs 0 to 100. Lower is more human. Drop the flags and it rewrites instead of scanning: `/humanizer "your text" --voice casual` hands back the same idea in a real voice, and the score falls to single digits.

> [!TIP]
> This is about writing better, not tricking detectors. Clean writing doesn't set off AI detectors, because it skips the lazy habits they look for. Fix the writing and the detection sorts itself out.

---

## Features

- **53 named patterns**, from travel-brochure adjectives to invisible unicode tricks. The biggest open list of its kind.
- **5 voices**: `casual`, `professional`, `technical`, `warm`, `blunt`. Each one changes the rhythm, not just a few words.
- **3 modes**: `detect` (score it), `rewrite` (fix it), `edit` (change a Markdown file in place).
- **A 0 to 100 AI-tell score** on demand, so you can measure before and after.
- **A guard against over-editing**, so it sharpens real writing instead of flattening it.
- **One Markdown file.** No dependencies. No network calls. It runs standalone.
- **Optional metrics CLI and CI check** if you want a computed score in your pipeline.

---

## Usage

```text
/humanizer "text"                                rewrite it with the default voice
/humanizer "text" --voice casual                 pick a voice
/humanizer "text" --mode detect --score          scan only, add a 0 to 100 score
/humanizer --file docs/README.md --voice technical   fix a file in place
/humanizer "text" --aggressive --iterate 3       heavy rewrite, loop until the score bottoms out
```

Rewrite is the default, so you never have to name it.

| Voice | Sounds like | Good for |
|:------|:------------|:---------|
| `casual` | Contractions, "I", fragments, "And" starters | Blogs, social posts |
| `professional` | A few contractions, dry, concrete | Reports, business writing |
| `technical` | Exact terms, plain, deadpan | Docs, READMEs |
| `warm` | "We" and "our", patient, short paragraphs | Tutorials, onboarding |
| `blunt` | Short. No hedging. Active voice. | Reviews, direct feedback |

Other flags: `--mode` picks detect, rewrite, or edit. `--purpose` layers on rules for an essay, email, marketing copy, technical doc, or general text. `--iterate N` runs the scan-rewrite loop up to 3 times. `--aggressive` uses a heavier hand. Drop a `humanizer-context.md` file in your project root with your own writing samples and banned words, and the skill folds it into whichever voice you chose.

---

## More

<details>
<summary><b>Before and after (docs, blog, LinkedIn)</b></summary>

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/demo-typewriter-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/demo-typewriter-light.svg">
  <img alt="Terminal running /humanizer with --voice technical --score: three AI tells (comprehensive, delves into, pivotal) are flagged, struck through, and replaced with clean human prose, dropping the AI-tell score from 84 to 12" src=".github/assets/demo-typewriter-light.svg" width="100%">
</picture>

**Technical docs** (`--voice technical`)

> **Before:** This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience.

> **After:** The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role. The token rotation logic is in `src/auth/refresh.ts`.

*Killed 9 patterns. Added real details. Cut the word count by 40%.*

**Blog post** (`--voice casual`)

> **Before:** In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history.

> **After:** I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are impressive. But there's something missing. It's like eating a perfect-looking meal that has no flavor.

*Traded vague commentary for a lived opinion. Sentence lengths: 8, 31, 22, 4, 13 words. That's burstiness.*

**LinkedIn** (`--voice professional`)

> **Before:** Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. #NewBeginnings #Innovation

> **After:** Started a new job at TechCorp this week. I'm leading their developer tools team, 12 engineers serving about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out.

*No emojis, no hashtags. Real numbers instead of "pivotal milestone."*

</details>

<details>
<summary><b>Install without tooling (curl), and per-editor paths</b></summary>

<br/>

Project-scoped (travels with your repo):

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Global (available in every project):

```bash
mkdir -p ~/.claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o ~/.claude/skills/humanizer/SKILL.md
```

Prefer Claude Code plugins? Add the marketplace instead:

```bash
claude plugin marketplace add Aboudjem/humanizer-skill
```

Same idea for other editors, just change the folder: `.cursor/skills/`, `.github/skills/` (Copilot), `.codex/skills/`, `.gemini/skills/`, `.windsurf/skills/`, `.continue/skills/`. For OpenClaw, run `clawhub install humanizer-skill`.

> [!NOTE]
> Claude Code finds skills in `.claude/skills/`, `~/.claude/skills/`, or any plugin's `skills/` folder. No restart needed. Other editors may need you to point at the file in their config.

</details>

<details>
<summary><b>All 53 patterns</b></summary>

<br/>

| IDs | Category | Examples |
|:----|:---------|:---------|
| P1-P8 | Content | Significance inflation, promotional language, AI vocabulary ("delve", "leverage"), copula avoidance |
| P9-P18 | Language & Style | Negative parallelisms, em dash overuse, structured-list syndrome, title-case headings |
| P19-P21 | Communication | Chatbot artifacts, knowledge-cutoff disclaimers, sycophantic tone |
| P22-P30 | Filler & Hedging | Filler phrases, generic conclusions, comprehensive-overview openers, uniform sentence length |
| P31-P43 | Emerging | Elegant variation, placeholder text, chatbot markup leaks, treadmill effect, infomercial hooks |
| P44-P53 | Craft & Forensic | False agency, diff-anchored writing, aphorism formulas, reasoning-chain artifacts, unicode obfuscation |

Every pattern has a full write-up, its triggers, and a before/after example in [`skills/humanizer/SKILL.md`](skills/humanizer/SKILL.md) and [`references/patterns.md`](skills/humanizer/references/patterns.md).

The core catalog (P1-P30) draws on [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (CC BY-SA), the cited reference list most of those entries come from.

</details>

<details>
<summary><b>The science</b></summary>

<br/>

AI detectors measure two things, and both are well documented.

**Burstiness** is how much sentence length varies. People write a 3-word sentence, then a 40-word one, then a 12-word one. AI parks almost every sentence around 18 words. Flat lengths read as AI.

**Perplexity** is how predictable each word is. AI picks the most likely next word every single time. People reach for the surprising one. Less predictable text reads as human.

Word-swap tools like QuillBot change individual words but leave the rhythm and the predictability alone. You need to change the structure, not just trade synonyms.

| Technique | Source | Finding |
|:----------|:-------|:--------|
| Burstiness injection | GPTZero | Human sentence length varies wildly; AI doesn't. |
| Kill negative parallelism | Washington Post | "It's not X, it's Y" is the #1 AI tell across 328K messages |
| Structural paraphrasing | RAID benchmark, ACL 2024 | Drops DetectGPT accuracy from 70.3% to 4.6% |
| Length and lexical diversity | HC3 corpus, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597) | ~40K pairs: human answers avg 142.5 words vs ChatGPT 198.1; humans use a bigger vocabulary |

</details>

<details>
<summary><b>Optional: computed metrics and a CI check</b></summary>

<br/>

The skill alone is enough to rewrite text. If you also want to *measure* your docs and block bad ones in CI, the repo ships a small Node CLI with zero dependencies that computes the signals the skill describes.

```bash
node cli/index.js score README.md
```

```bash
node cli/index.js scan docs/ --fail-above 40
```

Drop it into a pipeline with the bundled Action:

```yaml
- uses: Aboudjem/humanizer-skill/.github/actions/humanizer-gate@main
  with:
    path: docs/
    fail-above: '40'
```

No API keys, no network, no third-party packages. It's a deterministic stand-in for the skill's holistic score. Details in [`cli/README.md`](cli/README.md).

</details>

<details>
<summary><b>How it compares</b></summary>

<br/>

| Feature | **Humanizer** | QuillBot | Undetectable.ai | Manual editing |
|:--------|:------------:|:--------:|:----------------:|:--------------:|
| Open source | Yes | No | No | N/A |
| Pattern detection | **53** | 0 | 0 | 0 |
| Voice profiles | **5** | 0 | 3 | Manual |
| Works offline | Yes | No | No | Yes |
| Burstiness injection | Yes | No | Partial | No |
| Explains changes | Yes | No | No | No |
| Price | **Free** | $20/mo | $10/mo | Free |

</details>

<details>
<summary><b>Which models it runs on</b></summary>

<br/>

The skill is a Markdown prompt, so it runs on whatever model your editor points at. The patterns and voices don't care which. Only the creativity of the rewrite step shifts a little. Tested on Claude Opus/Sonnet/Haiku 4.x (Sonnet is the daily pick), GPT-4.x and GPT-5 through Codex CLI, and Gemini 2.x through Gemini CLI. Local models work too, with longer prompts and `--aggressive`.

</details>

<details>
<summary><b>Trust</b></summary>

<br/>

No telemetry. No data collection. No API calls. Nothing leaves your machine.

What you install is one Markdown file ([`skills/humanizer/SKILL.md`](skills/humanizer/SKILL.md)) that your editor reads locally. No JavaScript, no binaries, no network. The optional metrics CLI in [`cli/`](cli/README.md) is a separate layer: still plain Node, still zero dependencies, still fully offline, and the skill never calls it.

</details>

---

## Documentation

- Skill source and full pattern catalog: [`skills/humanizer/SKILL.md`](skills/humanizer/SKILL.md)
- Pattern deep dives, triggers, and examples: [`references/patterns.md`](skills/humanizer/references/patterns.md)
- A full docs site (Docusaurus, ready to deploy) lives in [`docs-site/`](docs-site/): `npm --prefix docs-site install && npm --prefix docs-site run build`

## Contributing

Found a new AI pattern, or a cleaner fix? PRs welcome. Add a short entry to `SKILL.md`, put the deep dive and a before/after example in `references/patterns.md`, and keep the badge count, CI threshold, and CHANGELOG in sync. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

<p align="center">
  <a href="https://www.linkedin.com/in/adam-boudjemaa/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://x.com/AdamBoudj"><img src="https://img.shields.io/badge/X-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://adam-boudjemaa.com/"><img src="https://img.shields.io/badge/Website-1f3a5f?style=flat-square&logo=googlechrome&logoColor=white" alt="Website"></a>
</p>

<p align="center">
  <sub>Built by <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · MIT License · No telemetry · No data collection</sub>
</p>
