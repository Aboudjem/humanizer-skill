# AGENTS.md — Humanizer Skill

> Universal harness context file (AAIF/Linux Foundation spec). Auto-discovered by Claude Code, Cursor, Copilot, Codex CLI, Windsurf, Cline, Gemini CLI, Aider, Zed, Jules, RooCode, Factory, and 10+ other harnesses.

## What this repo is

**Humanizer** is a pure-Markdown Claude Code skill that detects 53 AI writing patterns and rewrites text to sound like a human wrote it. It scores text 0-100 (higher = more AI smell), applies one of 5 named voice profiles, and injects sentence-length burstiness. The installable skill core is a single zero-dependency Markdown file: `skills/humanizer/SKILL.md`. The repo also ships optional extras (on-demand reference files and a zero-dependency metrics CLI) that the skill core never requires.

## File map

```
skills/
  humanizer/
    SKILL.md          # the skill — the only file you need to install (zero-dep)
    README.md         # skill-specific docs
    references/
      patterns.md              # per-pattern deep dives and provenance (on demand)
      patterns.zh.md           # provisional native-Chinese appendix
      always-on-templates.md   # copy-paste blocks for CLAUDE.md / SOUL.md / etc.
    evals/
      evals.json               # should-trigger / should-NOT-trigger eval cases
cli/                  # optional zero-dependency metrics + CI gate (Node, node:test)
.github/
  actions/humanizer-gate/      # reusable GitHub Action for CI docs-quality gating
.claude-plugin/
  plugin.json         # Claude Code plugin manifest (name, version, author, keywords)
  marketplace.json    # single-plugin marketplace entry (installable via claude plugin marketplace add)
examples/
  blog-post/
    before.md         # raw AI-generated blog paragraph (high AI-tell score)
    after.md          # humanized output with annotations
docs/
  VIRAL-AUDIT.md      # supernova engine score/tier/gap report
  LAUNCH-PLAN.md      # June 2026 channel-sequenced launch plan
README.zh-CN.md       # Simplified-Chinese README (English-writing wedge)
docs-site/            # full MDX documentation site (Docusaurus, deploy-ready)
landing/              # static landing page (humanizer-skill.vercel.app)
tools/                # demo.sh + demo.tape (VHS terminal demo)
submissions/          # awesome-list / marketplace submission drafts
```

## How to install the skill

**Cross-agent via the skills CLI ([vercel-labs/skills](https://github.com/vercel-labs/skills)):**
```bash
npx skills add Aboudjem/humanizer-skill            # any supported agent
npx skills add Aboudjem/humanizer-skill -a claude-code
```
The repo uses the standard `skills/<name>/SKILL.md` layout the CLI auto-discovers.

**Project-scoped (travels with your repo):**
```bash
mkdir -p .claude/skills/humanizer && curl -sL \
  https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o .claude/skills/humanizer/SKILL.md
```

**Global (available in every project):**
```bash
mkdir -p ~/.claude/skills/humanizer && curl -sL \
  https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o ~/.claude/skills/humanizer/SKILL.md
```

**Via Claude Code plugin marketplace:**
```bash
claude plugin marketplace add Aboudjem/humanizer-skill
```

Claude Code auto-discovers skills in `.claude/skills/`, `~/.claude/skills/`, or any plugin's `skills/` directory. No restart needed.

## How to invoke the skill

```
/humanizer "Your AI-generated text here"
/humanizer "text" --voice casual
/humanizer "text" --mode detect --score
/humanizer --file docs/README.md --voice technical
/humanizer "text" --aggressive --iterate 3
```

The skill is invoked as `/humanizer`. It auto-triggers when a user asks to:
- "make this sound more human"
- "rewrite this to avoid AI detection"
- "check this for AI tells"
- "humanize this text"
- "clean up the AI writing in this"

## Modes

| Mode | What it does |
|:-----|:-------------|
| `rewrite` | Full transformation with voice injection (default) |
| `detect` | Scan-only — reports patterns and score, no rewrite |
| `edit` | In-place file editing with minimal changes |

## Voice profiles

| Voice | Best for |
|:------|:---------|
| `casual` | Blog posts, social media, community docs |
| `professional` | Business comms, reports, formal docs |
| `technical` | API docs, READMEs, architecture docs |
| `warm` | Tutorials, onboarding, support content |
| `blunt` | Reviews, internal comms, direct feedback |

## How to test

The skill itself is pure Markdown, so test it by running it:

1. Install the skill (see above).
2. Open Claude Code in any project.
3. Run: `/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history." --mode detect --score`
4. Expected output: a high score with patterns P1, P4, P7, P29, P30 flagged.
5. Run: `/humanizer "..." --voice casual` — verify the rewrite has shorter/varied sentences and no "pivotal"/"reshaping"/"rapidly evolving".

The optional CLI has an automated suite: `cd cli && node --test` (25 tests, zero dependencies). Smoke it with `node cli/index.js compare --before examples/blog-post/before.md --after examples/blog-post/after.md`. See `examples/blog-post/` for a documented before/after reference case.

## Conventions for contributors

- All 53 patterns are numbered P1-P53 in `SKILL.md`. New patterns continue the sequence.
- Every new pattern needs: a name, what to look for, and a before/after example. Deep dives and sources go in `references/patterns.md`, not the core.
- The badge count in `README.md` (`patterns-53`), the CI threshold (`EXPECTED` in `ci.yml`), and the CHANGELOG must move together when patterns are added.
- No em dashes in `SKILL.md` — the skill bans em dashes (P13), so the skill file enforces its own rules.
- CI runs a markdown lint pass and a self-check that scans `SKILL.md` for its own banned patterns.

## Cross-harness notes

- **Claude Code**: full support via `/humanizer` command.
- **Cursor / Windsurf / Continue.dev**: copy `SKILL.md` to the editor's rules/skills directory and reference in system prompt.
- **Codex CLI / Gemini CLI**: copy to the tool's skills directory (see README for per-editor install).
- **VS Code + Copilot**: paste `SKILL.md` content into your Copilot instructions.
- The skill contains no tool calls to Claude-specific APIs. All instructions are model-agnostic Markdown.

## Author

Adam Boudjemaa — [github.com/Aboudjem](https://github.com/Aboudjem) · [LinkedIn](https://www.linkedin.com/in/adam-boudjemaa/) · [X](https://x.com/AdamBoudj)
