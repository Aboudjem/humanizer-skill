# Humanizer

A standalone Claude Code skill that transforms AI-generated text into natural human writing. Drop it into any plugin - no dependencies, no MCP server, no configuration.

## What it does

- Detects 30+ AI writing patterns (based on Wikipedia's "Signs of AI Writing" + community research)
- Rewrites text to sound like a specific human wrote it
- Injects authentic voice using burstiness and perplexity principles
- Three modes: scan-only, full rewrite, in-place file editing

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

# Scan only - report patterns without changing text
/humanizer "text" --mode detect

# Edit a file in place
/humanizer --mode edit --file src/docs/README.md

# Specify voice
/humanizer "text" --voice casual

# Aggressive mode - maximum humanization
/humanizer "text" --aggressive
```

### Voice options

| Voice | Best for |
|---|---|
| `casual` | Blog posts, social media, informal docs |
| `professional` | Business communication, formal docs |
| `technical` | API docs, READMEs, code comments |
| `warm` | Tutorials, onboarding, support content |
| `blunt` | Internal comms, reviews, direct feedback |

## How it works

1. **Parse** - Extracts text and flags from arguments
2. **Detect** - Scans for 30 AI patterns across 5 categories (content, language, style, communication, filler)
3. **Inject** - Applies voice profile, varies sentence length (burstiness), increases word unpredictability (perplexity)
4. **Verify** - Checks output against detection patterns, sentence variance, and the "who wrote this?" test
5. **Output** - Clean text with change summary

## Pattern categories

| Category | Patterns | Examples |
|---|---|---|
| Content | P1-P6 | Significance inflation, notability name-dropping, -ing phrases |
| Language | P7-P12 | AI vocabulary, copula avoidance, synonym cycling |
| Style | P13-P18 | Em dash overuse, bold abuse, list syndrome |
| Communication | P19-P21 | Chatbot artifacts, disclaimers, sycophancy |
| Filler | P22-P30 | Filler phrases, hedging, generic conclusions, uniform sentences |

## Credits

Built from research across:
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- Softaworks agent-toolkit humanizer by @blader
- Davila7 claude-code-templates (humanizer + writing-clearly-and-concisely)
- William Strunk Jr., *The Elements of Style* (1918)
- Community research from Reddit, HackerNews, and writing communities

## License

MIT
