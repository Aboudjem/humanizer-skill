# Humanizer

A standalone Claude Code skill that transforms AI-generated text into natural human writing. Drop it into any plugin. No dependencies, no MCP server, no configuration.

## What it does

- Detects **43 AI writing patterns** (P1-P43, based on Wikipedia's "Signs of AI Writing" + 2025-2026 community research)
- Rewrites text to sound like a specific human wrote it
- Injects authentic voice using burstiness and perplexity principles
- Three modes: scan-only, full rewrite, in-place file editing
- 5 voice profiles: casual, professional, technical, warm, blunt
- Zero dependencies. Pure Markdown. Works in every editor that reads skill files.

## Installation

### As a standalone skill

```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md ~/.claude/skills/humanizer/
```

### Inside a plugin

Copy `SKILL.md` into your plugin's `skills/humanizer/` directory. Add to your plugin's skill registry if applicable.

### Usage

```
# Full rewrite (default)
/humanizer "Your AI-sounding text goes here"

# Scan only: report patterns without changing text
/humanizer "text" --mode detect

# Score the AI-tell density (0-100, lower is more human)
/humanizer "text" --mode detect --score

# Edit a file in place
/humanizer --mode edit --file src/docs/README.md

# Specify voice
/humanizer "text" --voice casual

# Aggressive mode + iterate to convergence (max 3 passes)
/humanizer "text" --aggressive --iterate 3

# Layer purpose-specific rules on top of voice
/humanizer "text" --voice warm --purpose marketing
```

### Voice options

| Voice | Best for |
|---|---|
| `casual` | Blog posts, social media, informal docs |
| `professional` | Business communication, formal docs |
| `technical` | API docs, READMEs, code comments |
| `warm` | Tutorials, onboarding, support content |
| `blunt` | Internal comms, reviews, direct feedback |

### Purpose presets (`--purpose`)

Layered on top of voice. Add content-type rules without losing voice flavor.

| Purpose | Effect |
|---|---|
| `essay` | No contractions, formal headings, structured arguments |
| `email` | Greetings allowed, signoff allowed, no markdown |
| `marketing` | Short paragraphs, concrete benefits, one CTA at end |
| `technical` | Code blocks preserved, precise jargon retained |
| `general` | No purpose-specific overrides (default) |

### Brand voice file

Drop a `humanizer-context.md` at the project root with your samples and banned phrases. Auto-loaded if present.

## How it works

1. **Parse**: Extracts text and flags from arguments
2. **Detect**: Scans for 43 AI patterns across 5 categories (content, language, style, communication, filler) + emerging 2026 patterns
3. **Inject**: Applies voice profile, varies sentence length (burstiness), increases word unpredictability (perplexity)
4. **Verify**: Checks output against detection patterns, sentence variance, and the "who wrote this?" test
5. **Output**: Clean text with change summary

## Pattern categories

| Category | Patterns | Examples |
|---|---|---|
| Content | P1-P8 | Significance inflation, notability name-dropping, -ing phrases, copula avoidance |
| Language & Style | P9-P18 | Negative parallelisms, em dash overuse, bold abuse, list syndrome |
| Communication | P19-P21 | Chatbot artifacts, disclaimers, sycophancy |
| Filler & Hedging | P22-P30 | Filler phrases, hedging, generic conclusions, uniform sentence length |
| Emerging (2026) | P31-P37 | Elegant variation, citeturn markup leaks, utm_source=chatgpt URLs, register shifts |

## Credits

Built from research across:
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- Softaworks agent-toolkit humanizer by @blader
- Davila7 claude-code-templates (humanizer + writing-clearly-and-concisely)
- William Strunk Jr., *The Elements of Style* (1918)
- Community research from Reddit, HackerNews, and writing communities

## License

MIT
