<p align="center">
  <h1 align="center">Humanizer</h1>
  <p align="center">
    <strong>The open-source skill that makes AI text undetectable.</strong>
  </p>
  <p align="center">
    Drop-in Claude Code skill. 30 AI patterns. 5 voice profiles. Zero dependencies.
  </p>
  <p align="center">
    <a href="#quick-start">Quick Start</a> &bull;
    <a href="#before--after">Before & After</a> &bull;
    <a href="#how-it-works">How It Works</a> &bull;
    <a href="#voice-profiles">Voice Profiles</a> &bull;
    <a href="#patterns">All 30 Patterns</a>
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

Most "humanizers" swap words. This one rewrites with a pulse. It doesn't just remove AI patterns — it injects the burstiness, perplexity, and voice that make text read like a thinking human wrote it.

Built from 90+ research sources including Wikipedia's [Signs of AI Writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), academic papers from NeurIPS/ICLR/ACL 2024, the Washington Post's 328,744-message ChatGPT analysis, and battle-tested community techniques from Reddit, HackerNews, and professional editorial firms.

## Why this exists

Every AI detector measures the same things:

| Signal | Human | AI | What it means |
|--------|-------|----|---------------|
| **Perplexity** | >85 (surprising words) | <85 (predictable) | AI picks the most likely next word. Humans don't. |
| **Burstiness** | HIGH (3-word sentence, then 40-word sentence) | LOW (every sentence ~18 words) | AI writes in monotone rhythm. |
| **Type-Token Ratio** | 55.3 (diverse vocabulary) | 45.5 (repetitive) | AI recycles the same words. |

Word-swapping tools don't fix these. You need structural transformation. That's what this does.

## Quick start

### One-line install (global)

```bash
mkdir -p ~/.claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o ~/.claude/skills/humanizer/SKILL.md
```

### Or clone into any plugin

```bash
# Copy into your plugin's skills/ directory
cp -r skills/humanizer /path/to/your-plugin/skills/
```

### Then use it

```bash
# Rewrite AI-sounding text (default mode)
/humanizer "Your AI-generated text here"

# Scan text for AI patterns without changing it
/humanizer "text" --mode detect

# Edit a file in place
/humanizer --mode edit --file docs/blog-post.md

# Choose a voice
/humanizer "text" --voice casual
/humanizer "text" --voice blunt --aggressive

# French support
/humanizer "votre texte" --lang fr
```

## Before & After

### Technical docs

**Before:**
> This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience. Additionally, it features a pivotal role-based access control system that serves as a testament to our commitment to security.

**After** (`--voice technical`):
> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role — admin, editor, and viewer each see different data. The token rotation logic is in `src/auth/refresh.ts` if you need to change the expiry windows.

*Killed 9 AI patterns. Added real details. Cut word count by 40%.*

---

### Blog post

**Before:**
> In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history, one that underscores the intricate interplay between innovation and artistic expression.

**After** (`--voice casual`):
> I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are technically impressive — I got a portrait last week that looked better than anything I could paint in a year. But there's something missing. It's like eating a perfect-looking meal that has no flavor.

*Replaced abstract commentary with personal experience. Sentence lengths: 8, 31, 22, 4, 13 words. That's burstiness.*

---

### LinkedIn post

**Before:**
> Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. I'm deeply grateful to my amazing network for their unwavering support. #NewBeginnings #Innovation #Leadership #Grateful

**After** (`--voice professional`):
> Started a new job at TechCorp this week. I'm leading their developer tools team — 12 engineers building internal tooling that currently serves about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out. Nervous and excited in roughly equal measure.

*No emojis. No hashtags. Real details instead of "pivotal milestone." The coffee machine line is more human than any amount of gratitude signaling.*

## How it works

```
Input text
    |
    v
[1. DETECT] ──── Scan for 30 AI patterns across 5 categories
    |
    v
[2. STRIP] ───── Remove significance inflation, AI vocabulary,
    |              filler phrases, chatbot artifacts
    v
[3. INJECT] ──── Apply voice profile, burstiness variation,
    |              perplexity increase, soul injection
    v
[4. VERIFY] ──── Check sentence variance, blacklist words,
    |              parallel structure, "who wrote this?" test
    v
Output text + change summary
```

## Three modes

| Mode | What it does | When to use |
|------|-------------|-------------|
| `rewrite` (default) | Full transformation with voice injection | Content creation, blog posts, social media |
| `detect` | Scan-only report with pattern counts and severity | Auditing existing content, learning what to fix |
| `edit` | In-place file editing with minimal changes | Documentation cleanup, README polishing |

## Voice profiles

| Voice | Personality | Best for |
|-------|------------|----------|
| `casual` | Contractions, first person, sentence fragments, "And" starters | Blog posts, social media, community docs |
| `professional` | Selective contractions, dry wit, concrete examples | Business comms, reports, formal docs |
| `technical` | Precise terms, code-like clarity, deadpan observations | API docs, READMEs, architecture docs |
| `warm` | "We/our" language, empathy, shorter paragraphs | Tutorials, onboarding, support content |
| `blunt` | Shortest sentences, no hedging, active voice only | Reviews, internal comms, direct feedback |

## Patterns

30 patterns across 5 categories, each with trigger words, explanation, and fix:

<details>
<summary><strong>Content Patterns (P1-P8)</strong> — The worst offenders</summary>

| # | Pattern | Example trigger |
|---|---------|----------------|
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

| # | Pattern | Example trigger |
|---|---------|----------------|
| P9 | Negative Parallelisms | "It's not just X, it's Y" |
| P10 | Rule of Three | Forced triads: "innovation, inspiration, and insights" |
| P11 | Synonym Cycling | "protagonist" → "main character" → "central figure" |
| P12 | False Ranges | "From X to Y" on non-spectrums |
| P13 | Em Dash Overuse | 3+ em dashes per paragraph |
| P14 | Boldface Overuse | Bold on every noun |
| P15 | Structured List Syndrome | `**Header:** description` bullets for prose content |
| P16 | Title Case Headings | "Strategic Negotiations And Global Partnerships" |
| P17 | Typographic Tells | Curly quotes, consistent Oxford comma |
| P18 | French-Specific | "Il convient de noter", "force est de constater" |

</details>

<details>
<summary><strong>Communication (P19-P21)</strong> — Chatbot residue</summary>

| # | Pattern | Example trigger |
|---|---------|----------------|
| P19 | Chatbot Artifacts | "I hope this helps!", "Certainly!" |
| P20 | Knowledge-Cutoff Disclaimers | "As of [date]", "based on available information" |
| P21 | Sycophantic Tone | "Great question!", "That's an excellent point!" |

</details>

<details>
<summary><strong>Filler & Hedging (P22-P30)</strong> — Dead weight</summary>

| # | Pattern | Example trigger |
|---|---------|----------------|
| P22 | Filler Phrases | "In order to" → "To", "Due to the fact" → "Because" |
| P23 | Excessive Hedging | "could potentially possibly" |
| P24 | Generic Conclusions | "The future looks bright", "poised for growth" |
| P25 | Hallucination Markers | Fabricated-feeling dates, phantom citations |
| P26 | Perfect/Error Alternation | (FR) Inconsistent quality = partial AI edit |
| P27 | Question-Format Titles | "What makes X unique?" |
| P28 | Markdown Bleeding | `**bold**` in non-Markdown contexts |
| P29 | "Comprehensive Overview" Opening | "This guide delves into...", "Let's dive in" |
| P30 | Uniform Sentence Length | Every sentence 15-25 words |

</details>

## The science behind it

This isn't guesswork. Every technique is grounded in published research:

- **Burstiness** (GPTZero's core signal) — Human sentence length varies wildly. AI doesn't. We force variance.
- **Perplexity** — AI picks the most statistically likely next word. We choose the second or third option.
- **Type-Token Ratio** — Human vocabulary diversity averages 55.3 vs AI's 45.5 (SSRN stylometric study). We diversify.
- **Negative parallelism** — Washington Post analysis of 328,744 ChatGPT messages confirmed "It's not X, it's Y" as the #1 statistical AI tell. We kill it.
- **Paraphrasing defeats detection** — Structural variation drops DetectGPT accuracy from 70.3% to 4.6% (RAID benchmark, ACL 2024).

## Comparison

| Feature | Humanizer | QuillBot | Undetectable.ai | GPT prompt hacks |
|---------|-----------|----------|------------------|-----------------|
| Open source | Yes | No | No | N/A |
| Pattern detection | 30 patterns | 0 | 0 | 0 |
| Voice profiles | 5 | 0 | 3 | Manual |
| Works offline | Yes | No | No | No |
| Burstiness injection | Yes | No | Partial | No |
| Bilingual (EN/FR) | Yes | Multi | Multi | Manual |
| File editing mode | Yes | No | No | No |
| Price | Free | $20/mo | $10/mo | Free |
| Explains changes | Yes | No | No | No |

## Integration

Works with any Claude Code plugin. Zero dependencies. Just copy the SKILL.md file.

```bash
your-plugin/
  skills/
    humanizer/
      SKILL.md    # <- this is the entire skill
```

Compatible with:
- [VoiceForge](https://github.com/Aboudjem/voiceforge-plugin) — Full writing studio
- [OpenClaw](https://github.com/Aboudjem/openclaw-plugin) — AI agent OS
- Any Claude Code plugin with a `skills/` directory

## Contributing

Found a new AI pattern? Have a better fix? PRs welcome.

1. Fork the repo
2. Add your pattern to SKILL.md (follow the P1-P30 format)
3. Include a before/after example
4. Open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Research sources

Built from 90+ sources:

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (24 pattern categories)
- [Wikipedia FR: Identifier l'usage d'une IA generative](https://fr.wikipedia.org/wiki/Aide:Identifier_l%27usage_d%27une_IA_g%C3%A9n%C3%A9rative)
- RAID Benchmark (ACL 2024) — 6M+ generations, 12 detectors evaluated
- NeurIPS 2023: Intrinsic dimension analysis (Tulchinskii et al.)
- Washington Post: 328,744 ChatGPT message analysis
- Stanford HAI: ESL false positive study
- Max Planck Institute: AI vocabulary frequency spikes
- Softaworks agent-toolkit humanizer by [@blader](https://github.com/softaworks/agent-toolkit)
- Davila7 claude-code-templates
- William Strunk Jr., *The Elements of Style*
- Gary Provost (sentence length music)
- David Ogilvy ("write naturally, short words, never jargon")

## Star history

If this skill saved your writing from sounding like a chatbot, star the repo. It helps others find it.

## License

[MIT](LICENSE) — Use it anywhere, in any project, for any purpose.
