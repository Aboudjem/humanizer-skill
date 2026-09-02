# Install Humanizer in your editor

Humanizer is a skill, not a server. There is no MCP server, no daemon, and no API key. Installing
it means putting one Markdown file (`skills/humanizer/SKILL.md`) where your agent looks for skills.

## Claude Code

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

## Any other agent, one line

The [`skills` CLI](https://github.com/vercel-labs/skills) from vercel-labs copies the skill into
the right directory for the agent you name. Version 1.5.23 lists 77 agent codes; the nine below are
the ones this table covers.

```bash
npx skills add Aboudjem/humanizer-skill -a <agent>
```

| Agent | `-a` code | Project path | Global path |
| --- | --- | --- | --- |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.codex/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| Windsurf | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| Zed | `zed` | `.agents/skills/` | `~/.agents/skills/` |
| Kimi Code CLI | `kimi-code-cli` | `.agents/skills/` | `~/.agents/skills/` |

Paths and codes come from the `Supported Agents` table in the
[vercel-labs/skills README](https://github.com/vercel-labs/skills#supported-agents), read
2026-09-02.

Useful flags: `-g` installs globally instead of into the current project, `-y` skips the
confirmation prompt, `-l` lists what the repo offers without installing, and `--copy` copies files
instead of symlinking.

```bash
npx skills add Aboudjem/humanizer-skill -a cursor -g -y
npx skills add Aboudjem/humanizer-skill --list
```

## Manual copy

Any agent that reads `SKILL.md` files works without the CLI. Clone the repo and copy the one skill
directory into whichever path the table above lists for your agent.

```bash
git clone https://github.com/Aboudjem/humanizer-skill.git
mkdir -p ~/.agents/skills
cp -r humanizer-skill/skills/humanizer ~/.agents/skills/
```

`~/.agents/skills/` is the shared convention that Cursor, Codex, Copilot, Gemini CLI, OpenCode, Zed
and Kimi Code CLI all read, so one copy usually covers several agents at once.

## Editor plugin manifests

`.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json` and `.copilot-plugin/plugin.json` all
declare the same single skill and the same version. Claude Code reads its manifest at install time.
Cursor and Copilot discover skills by walking their skills directories rather than by reading a
manifest, so those two files are there for tooling that wants a machine-readable description, not
because either editor requires them.

## The optional metrics CLI

The skill never calls it and does not need it. If you want a reproducible number instead of a
model's estimate, `cli/` is a separate zero-dependency Node package:

```bash
node cli/index.js score README.md
node cli/index.js scan docs --fail-above 40
```

See [`pre-commit.md`](pre-commit.md) for gating commits on the score.
