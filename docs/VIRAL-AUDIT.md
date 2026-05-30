# Viral-Readiness Audit — humanizer-skill

**Engine:** supernova CLI v1 · **Date:** 2026-05-30 · **Repo:** `Aboudjem/humanizer-skill`

---

## Score

| Field | Value |
|:------|:------|
| **Score** | 60/100 → target ≥85 (Tier 1) |
| **Tier** | Tier 3 — functional but low-trust; needs work |
| **Type** | `skill` |
| **Packaging decision** | `skill+plugin` — wrap in a thin Claude Code plugin (plugin.json + marketplace.json) |
| **Earned** | 58/96 scorable points |

---

## Signals present (strengths)

| Signal | Key | Weight |
|:-------|:----|:-------|
| README at root | has_readme | 5 |
| README hero (sentence + badge/image above the fold) | readme_has_hero | 6 |
| README demo asset (GIF/screenshot) | readme_has_demo_asset | 7 |
| README copy-paste install snippet | readme_has_install_snippet | 8 |
| LICENSE present | has_license | 7 |
| CI workflow present | has_ci | 8 |
| CONTRIBUTING.md present | has_contributing | 4 |
| GitHub topics set (≥3) | topics_set | 5 |
| SECURITY.md present | has_security_md | 3 |
| CHANGELOG present | has_changelog | 5 |

---

## Gaps (before this PR)

| Priority | Signal | Key | Weight | Fix applied |
|:---------|:-------|:----|:-------|:------------|
| HIGH | Tests present | has_tests | 8 | NOT FAKED — see note below |
| HIGH | Manifest present | has_manifest | 7 | `.claude-plugin/plugin.json` added |
| MEDIUM | Manifest complete | manifest_complete | 6 | `.claude-plugin/plugin.json` complete |
| MEDIUM | CLAUDE.md or AGENTS.md present | has_claude_md | 5 | `AGENTS.md` added |
| MEDIUM | GitHub description quality | description_quality | 5 | Set via `gh repo edit` |
| MEDIUM | examples/ directory present | has_examples_dir | 4 | `examples/blog-post/` added |
| LOW | Issue templates present | has_issue_templates | 3 | `.github/ISSUE_TEMPLATE/` added |

---

## Tests gap — honest note

This is a pure-Markdown skill. There is no executable code, no test runner, and no test framework that applies. The `has_tests` signal (weight 8) cannot be satisfied without faking a test — which this PR deliberately avoids.

**The right fix:** the supernova rubric should detect `repoType === "skill"` and either skip `has_tests` or substitute a skill-specific check (e.g. presence of `examples/` with annotated before/after, or a CI step that runs the skill against a sample input via Claude Code). The `examples/blog-post/` directory added in this PR serves as the closest functional equivalent — a documented reference case that a CI linter could validate.

---

## Expected score after this PR

Gaps fixed: `has_manifest` (+7), `manifest_complete` (+6), `has_claude_md` (+5), `description_quality` (+5), `has_examples_dir` (+4), `has_issue_templates` (+3) = **+30 points**.

`has_tests` remains a gap (-8). Net expected score: **~83/100 (Tier 2 / borderline Tier 1)**.

---

## Engine notes (iteration feedback)

The engine correctly identified this repo as `type=skill` and recommended `packaging=skill+plugin`. Both calls are accurate.

One candidate false gap: `has_tests` is flagged as HIGH priority for a skill repo, but there is no meaningful test artifact a pure-Markdown skill can produce. The rubric should conditionally downweight or skip this signal when `repoType === "skill"`. This feeds back to the supernova engine iteration log.

No other false gaps observed. The engine's type detection, packaging recommendation, and signal weights are well-calibrated for this repo.
