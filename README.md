<p align="center">
  <h1 align="center">Humanizer</h1>
  <p align="center">
    <strong>The open-source skill that makes AI text undetectable.</strong>
  </p>
  <p align="center">
    Drop-in Claude Code skill &bull; 30 AI patterns &bull; 5 voice profiles &bull; Zero dependencies
  </p>
  <p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
    <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-30-orange.svg" alt="30 AI Patterns"></a>
    <a href="#voice-profiles"><img src="https://img.shields.io/badge/voices-5-green.svg" alt="5 Voice Profiles"></a>
    <a href="#"><img src="https://img.shields.io/badge/dependencies-0-brightgreen.svg" alt="Zero Dependencies"></a>
    <a href="#"><img src="https://img.shields.io/badge/Claude_Code-skill-blueviolet.svg" alt="Claude Code Skill"></a>
  </p>
</p>

---

> **"AI detectors don't catch good writing. They catch lazy writing."**

Most "humanizers" swap words. This one rewrites with a pulse — it injects the burstiness, perplexity, and voice that make text read like a thinking human wrote it.

Built from 90+ research sources including Wikipedia's [Signs of AI Writing][wiki-ai], academic papers from NeurIPS/ICLR/ACL 2024, the Washington Post's 328,744-message ChatGPT analysis, and battle-tested techniques from Reddit, HackerNews, and professional editorial firms.

---

## Why this exists

Every AI detector measures the same things:

| Signal | Human | AI | What it means |
|--------|-------|----|---------------|
| **Perplexity** | >85 (surprising words) | <85 (predictable) | AI picks the most likely next word. Humans don't. |
| **Burstiness** | HIGH (3-word sentence, then 40) | LOW (every sentence ~18 words) | AI writes in monotone rhythm. |
| **Type-Token Ratio** | 55.3 (diverse vocab) | 45.5 (repetitive) | AI recycles the same words. |

Word-swapping tools don't fix these. You need structural transformation. That's what this does.

---

## Install

> [!TIP]
> The skill is a single file. No config, no setup, no dependencies. Claude Code picks it up automatically.

**Option 1 — Project-scoped** (recommended, travels with your repo):

```bash
git clone https://github.com/Aboudjem/humanizer-skill.git
cp -r humanizer-skill/skills/humanizer .claude/skills/
rm -rf humanizer-skill
```

**Option 2 — Global** (available in every project):

```bash
mkdir -p ~/.claude/skills/humanizer
curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o ~/.claude/skills/humanizer/SKILL.md
```

**Option 3 — Inside an existing plugin:**

```bash
cp -r skills/humanizer /path/to/your-plugin/skills/
```

> [!NOTE]
> Claude Code detects skills in `.claude/skills/`, `~/.claude/skills/`, or any plugin's `skills/` directory. No restart needed.

---

## Usage

```bash
# Rewrite AI-sounding text (default)
/humanizer "Your AI-generated text here"

# Scan for AI patterns without changing anything
/humanizer "text" --mode detect

# Edit a file in place
/humanizer --mode edit --file docs/blog-post.md

# Pick a voice
/humanizer "text" --voice casual
/humanizer "text" --voice blunt --aggressive

```

---

## Before & After

### Technical docs

> **Before:**
> This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience. Additionally, it features a pivotal role-based access control system that serves as a testament to our commitment to security.

> **After** (`--voice technical`):
> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role — admin, editor, and viewer each see different data. The token rotation logic is in `src/auth/refresh.ts` if you need to change the expiry windows.

*Killed 9 AI patterns. Added real details. Cut word count by 40%.*

---

### Blog post

> **Before:**
> In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history, one that underscores the intricate interplay between innovation and artistic expression.

> **After** (`--voice casual`):
> I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are technically impressive — I got a portrait last week that looked better than anything I could paint in a year. But there's something missing. It's like eating a perfect-looking meal that has no flavor.

*Replaced abstract commentary with personal experience. Sentence lengths: 8, 31, 22, 4, 13 words. That's burstiness.*

---

### LinkedIn post

> **Before:**
> Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. I'm deeply grateful to my amazing network for their unwavering support. #NewBeginnings #Innovation #Leadership #Grateful

> **After** (`--voice professional`):
> Started a new job at TechCorp this week. I'm leading their developer tools team — 12 engineers building internal tooling that currently serves about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out. Nervous and excited in roughly equal measure.

*No emojis. No hashtags. Real details instead of "pivotal milestone." The coffee machine line is more human than any amount of gratitude signaling.*

---

## How it works

```
Input text
    |
    v
[1. DETECT] ── Scan for 30 AI patterns across 5 categories
    |
    v
[2. STRIP] ─── Remove significance inflation, AI vocabulary,
    |             filler phrases, chatbot artifacts
    v
[3. INJECT] ── Apply voice profile, burstiness variation,
    |             perplexity increase, soul injection
    v
[4. VERIFY] ── Sentence variance, blacklist words,
    |             parallel structure, "who wrote this?" test
    v
Output + change summary
```

---

## Three modes

| Mode | What it does | When to use |
|------|-------------|-------------|
| `rewrite` | Full transformation with voice injection | Content creation, blog posts, social media |
| `detect` | Scan-only report with pattern counts and severity | Auditing existing content, learning what to fix |
| `edit` | In-place file editing with minimal changes | Documentation cleanup, README polishing |

> [!IMPORTANT]
> `rewrite` is the default mode. You don't need to specify it.

---

## Voice profiles

| Voice | Personality | Best for |
|-------|------------|----------|
| `casual` | Contractions, first person, fragments, "And" starters | Blog posts, social media, community docs |
| `professional` | Selective contractions, dry wit, concrete examples | Business comms, reports, formal docs |
| `technical` | Precise terms, code-like clarity, deadpan humor | API docs, READMEs, architecture docs |
| `warm` | "We/our" language, empathy, shorter paragraphs | Tutorials, onboarding, support content |
| `blunt` | Shortest sentences, no hedging, active voice only | Reviews, internal comms, direct feedback |

---

## All 30 patterns

<details>
<summary><strong>Content Patterns (P1-P8)</strong> — The worst offenders</summary>

<br>

| # | Pattern | What to look for |
|---|---------|-----------------|
| P1 | Significance Inflation | "marking a pivotal moment", "is a testament to" |
| P2 | Notability Name-Dropping | "featured in", "active social media presence" |
| P3 | Superficial -ing Phrases | "highlighting", "ensuring", "fostering" |
| P4 | Promotional Language | "cutting-edge", "seamless", "world-class", "nestled" |
| P5 | Vague Attributions | "Experts argue", "Research suggests" (no citation) |
| P6 | Formulaic Challenges | "Despite challenges, continues to thrive" |
| P7 | AI Vocabulary | "delve", "leverage", "multifaceted", "tapestry" |
| P8 | Copula Avoidance | "serves as" instead of "is" |

</details>

<details>
<summary><strong>Language & Style (P9-P18)</strong> — Structural tells</summary>

<br>

| # | Pattern | What to look for |
|---|---------|-----------------|
| P9 | Negative Parallelisms | "It's not just X, it's Y" |
| P10 | Rule of Three | Forced triads: "innovation, inspiration, and insights" |
| P11 | Synonym Cycling | "protagonist" then "main character" then "central figure" |
| P12 | False Ranges | "From X to Y" on non-spectrums |
| P13 | Em Dash Overuse | 3+ em dashes per paragraph |
| P14 | Boldface Overuse | Bold on every noun, emoji headers |
| P15 | Structured List Syndrome | `**Header:** description` bullets for prose content |
| P16 | Title Case Headings | "Strategic Negotiations And Global Partnerships" |
| P17 | Typographic Tells | Curly quotes, consistent Oxford comma |
| P18 | Formal Register Overuse | "it should be noted that", "it is essential to" |

</details>

<details>
<summary><strong>Communication (P19-P21)</strong> — Chatbot residue</summary>

<br>

| # | Pattern | What to look for |
|---|---------|-----------------|
| P19 | Chatbot Artifacts | "I hope this helps!", "Certainly!" |
| P20 | Knowledge-Cutoff Disclaimers | "As of [date]", "based on available information" |
| P21 | Sycophantic Tone | "Great question!", "That's an excellent point!" |

</details>

<details>
<summary><strong>Filler & Hedging (P22-P30)</strong> — Dead weight</summary>

<br>

| # | Pattern | What to look for |
|---|---------|-----------------|
| P22 | Filler Phrases | "In order to", "Due to the fact that", "It's worth noting" |
| P23 | Excessive Hedging | "could potentially possibly" |
| P24 | Generic Conclusions | "The future looks bright", "poised for growth" |
| P25 | Hallucination Markers | Fabricated-feeling dates, phantom citations |
| P26 | Perfect/Error Alternation | Inconsistent quality = partial AI edit |
| P27 | Question-Format Titles | "What makes X unique?", "Why is Y important?" |
| P28 | Markdown Bleeding | `**bold**` in emails, Word docs, social posts |
| P29 | "Comprehensive Overview" | "This guide delves into...", "Let's dive in" |
| P30 | Uniform Sentence Length | Every sentence 15-25 words, no variation |

</details>

---

## The science

> [!NOTE]
> Every technique in this skill is grounded in published research. No guesswork.

| Technique | Source | Finding |
|-----------|--------|---------|
| Burstiness injection | GPTZero[^1] | Human sentence length varies wildly. AI doesn't. |
| Perplexity increase | GPTZero[^1] | AI picks the most statistically likely next word. |
| Vocabulary diversity | SSRN stylometric study[^2] | Human TTR: 55.3 vs AI: 45.5 |
| Kill negative parallelism | Washington Post[^3] | "It's not X, it's Y" confirmed as #1 AI tell across 328K messages |
| Structural paraphrasing | RAID benchmark, ACL 2024[^4] | Drops DetectGPT accuracy from 70.3% to 4.6% |
| Intrinsic dimension | NeurIPS 2023[^5] | Human text ~9 dimensions vs AI ~7.5 |

[^1]: GPTZero detection methodology — perplexity and burstiness as core signals
[^2]: SSRN stylometric study comparing type-token ratios across human and AI corpora
[^3]: Washington Post analysis of 328,744 ChatGPT messages identifying distinctive AI constructs
[^4]: RAID: A Shared Benchmark for Robust Evaluation of Machine-Generated Text Detectors (ACL 2024, 6M+ generations)
[^5]: Tulchinskii et al., NeurIPS 2023 — Intrinsic dimensionality estimation for AI text detection

---

## Comparison

| Feature | **Humanizer** | QuillBot | Undetectable.ai | Prompt hacks |
|---------|:------------:|:--------:|:----------------:|:------------:|
| Open source | **Yes** | No | No | N/A |
| Pattern detection | **30** | 0 | 0 | 0 |
| Voice profiles | **5** | 0 | 3 | Manual |
| Works offline | **Yes** | No | No | No |
| Burstiness injection | **Yes** | No | Partial | No |
| Works in English | **Yes** | Multi | Multi | Manual |
| File editing mode | **Yes** | No | No | No |
| Explains changes | **Yes** | No | No | No |
| Price | **Free** | $20/mo | $10/mo | Free |

---

## File structure

```
your-project/
  .claude/
    skills/
      humanizer/
        SKILL.md    # <- the entire skill, one file
```

> [!TIP]
> The skill works in `.claude/skills/` (project), `~/.claude/skills/` (global), or any plugin's `skills/` directory.

---

## Contributing

Found a new AI pattern? Have a better fix? PRs welcome.

1. Fork the repo
2. Add your pattern to `SKILL.md` (follow the P1-P30 format)
3. Include a before/after example
4. Open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Sources

Built from 90+ sources across academic research, editorial expertise, and community intelligence:

- [Wikipedia: Signs of AI writing][wiki-ai] — 24 pattern categories with real examples
- [Wikipedia FR: Identifier l'usage d'une IA generative][wiki-fr] — Additional AI pattern research
- RAID Benchmark (ACL 2024) — 6M+ generations, 12 detectors evaluated
- NeurIPS 2023 — Intrinsic dimension analysis (Tulchinskii et al.)
- Washington Post — 328,744 ChatGPT message analysis
- Stanford HAI — ESL false positive study
- Max Planck Institute — AI vocabulary frequency spikes
- Softaworks agent-toolkit humanizer by [@blader](https://github.com/softaworks/agent-toolkit)
- William Strunk Jr., *The Elements of Style*
- Gary Provost, David Ogilvy, Ann Handley — professional writing craft

---

<p align="center">
  If this skill saved your writing from sounding like a chatbot, consider giving it a star.
  <br>
  It helps others find it.
</p>

---

[MIT License](LICENSE)

[wiki-ai]: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
[wiki-fr]: https://fr.wikipedia.org/wiki/Aide:Identifier_l%27usage_d%27une_IA_g%C3%A9n%C3%A9rative
