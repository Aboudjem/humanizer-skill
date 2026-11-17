# AGENTS.md: humanizer-skill

Context for any coding agent that works in this repo. The human overview is in [README.md](README.md).

## What this repo is

Humanizer shows why a draft sounds like AI, then fixes it. It is one Markdown skill. It names 55 AI writing patterns, rewrites text in one of five voices, and reports a 0 to 100 AI-tell score. The skill is `skills/humanizer/SKILL.md` and needs nothing else. The repo also ships an optional Node CLI in `cli/` that computes the score with no dependency and no network call.

Other repos install this one. Do not rename the skill (`humanizer`), move `skills/humanizer/SKILL.md`, or change the install commands below.

## File map

```text
skills/humanizer/
  SKILL.md                     the skill, the only file an install needs
  README.md                    notes for the skill folder
  references/patterns.md       per-pattern deep dives, loaded on demand
  references/patterns.zh.md    provisional Chinese appendix
  references/always-on-templates.md   blocks to paste into CLAUDE.md and similar files
  evals/evals.json             should-trigger and should-not-trigger cases
cli/                           optional metrics CLI and its node:test suite
tools/check-dashes.js          repo check: no banned dash in any doc or manifest
examples/blog-post/            a specimen, its rewrite, and how both were made
.claude-plugin/                plugin.json, marketplace.json, icon.png
.cursor-plugin/ .copilot-plugin/   the same skill, declared for other tooling
.github/actions/humanizer-gate/    reusable GitHub Action around the CLI
.pre-commit-hooks.yaml         two hooks for the pre-commit framework
docs/                          editors, pre-commit, FAQ, comparison, science
READMEs/                       README translations: zh-CN, ja, es, fr
docs-site/ landing/            documentation site and the static demo page
```

## Commands

Run all of these from the repo root. Node 18 or newer. No install step.

```bash
npm test                 # the full CLI suite, node:test, zero dependencies
npm run selfcheck        # the repo scored by its own CLI, plus the dash check
claude plugin validate . --strict
npx --yes skills@1.9.0 add . --list
```

`npm run selfcheck` must pass before a commit. It runs two things:

- `node cli/index.js scan . --fail-above 40 --ignore-code --exclude examples/blog-post/before.md`
- `node tools/check-dashes.js`

`examples/blog-post/before.md` is the one file allowed to score high. It is the specimen.

## How users install the skill

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

```bash
npx skills add Aboudjem/humanizer-skill -g
```

`-g` installs for all the user's projects. Drop it for one project only.

The repo is also its own single-plugin marketplace (`.claude-plugin/marketplace.json`).

## How users call it

```text
/humanizer "text"
/humanizer "text" --voice casual
/humanizer "text" --mode detect --score
/humanizer --file docs/guide.md --voice technical
```

Modes: `rewrite` (default), `detect` (report only), `edit` (change a Markdown file in place).
Voices: `casual`, `professional`, `technical`, `warm`, `blunt`.

## Rules for changes

- Patterns are numbered P1 to P55 in `SKILL.md`. A new pattern takes the next number.
- A new pattern needs a name, its triggers, a fix, and a before and after pair. Long notes and sources go in `references/patterns.md`.
- The README badge (`patterns-55`), `EXPECTED` in `.github/workflows/ci.yml` and the CHANGELOG move together.
- Every manifest carries the same version: the three `plugin.json` files, `package.json` and `cli/package.json`. CI fails when they differ.
- No em dash (U+2014) in any doc, manifest, YAML or SVG. A file that documents the character names it or gives its code point. `tools/check-dashes.js` lists the forms it rejects.
- A CLI change ships with tests in `cli/test/`. Do not weaken a test to make it pass.
- The README sample outputs are real runs. When the report format or an example changes, re-run the command and paste the new output.
- Sentences of 25 words at most in `README.md`. No star count, no invented number.
- Commits carry no AI attribution line. CI rejects one.

## Release

1. Bump the version in the five manifests.
2. Add a dated entry to `CHANGELOG.md`.
3. Push to `main` and wait for CI.
4. Push a `vX.Y.Z` tag. `release.yml` creates the GitHub release from the CHANGELOG entry and tells the 10x marketplace to sync.
