---
sidebar_position: 2
title: Installation
---

# Installation

The skill core is a single Markdown file. Install it once and every supported editor picks it up.

## Any agent, one command

The [skills CLI](https://github.com/vercel-labs/skills) auto-discovers the standard `skills/humanizer/SKILL.md` layout and installs it for Claude Code, Cursor, Codex, opencode, and 70+ agents:

```bash
npx skills add Aboudjem/humanizer-skill
```

Target a single agent, or list what the repo ships first:

```bash
npx skills add Aboudjem/humanizer-skill -a claude-code
```

```bash
npx skills add Aboudjem/humanizer-skill --list
```

## Without tooling (curl)

Project-scoped, so the skill travels with your repo:

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Global, so it is available in every project:

```bash
mkdir -p ~/.claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o ~/.claude/skills/humanizer/SKILL.md
```

## Claude Code plugin marketplace

```bash
claude plugin marketplace add Aboudjem/humanizer-skill
```

## Other editors

Same idea, just change the target directory: `.cursor/skills/`, `.github/skills/` for Copilot, `.codex/skills/`, `.gemini/skills/`, `.windsurf/skills/`, `.continue/skills/`. For OpenClaw, run `clawhub install humanizer-skill`.

:::info[Where Claude Code looks]
Claude Code auto-detects skills in `.claude/skills/`, `~/.claude/skills/`, or any plugin's `skills/` directory. No restart is needed. Other editors may require referencing the file in their system prompt or configuration.
:::

Once installed, head to [Usage](/usage).
