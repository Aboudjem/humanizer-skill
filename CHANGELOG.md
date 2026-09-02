# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-09-02

A fact check for rewrites, a score you can read the reasons for, a commit gate, and a new visual
identity with the README and its translations rebuilt around them.

### Added

- **`compare --check-facts`** fails a rewrite that lost a number, name, URL, date, or version. New zero-dependency `cli/lib/facts.js`, six ordered extraction passes, no network and no filesystem access. Covered by 21 cases in `cli/test/facts.test.js`.
- **A per-signal score breakdown** on every `score` run and in `--json`: each signal's raw metric, normalized value, weight, and the points it contributed, plus the unrounded `scoreRaw`. `scoreSignals` in `cli/lib/metrics.js` is now the single definition of the score. Covered by 9 new cases in `cli/test/metrics.test.js`.
- **A `humanizer-scan-staged` pre-commit hook** that scores only the Markdown you staged, with its own `md|markdown|txt` filter. `scan` accepts multiple paths. Documented in `docs/pre-commit.md` and covered by 7 new cases in `cli/test/cli.test.js`.
- **Neon Noir visual identity**: new light and dark hero banners, a PNG logo mark at two sizes, and a repaint of the wordmark, the burstiness chart, the typewriter demo, and the social preview card. Every SVG is hand-authored, script free, and renders in headless Chrome.
- **Four README translations** at `READMEs/{zh-CN,ja,es,fr}.md`, translated from the final English. `README.zh-CN.md` is now a one-line pointer to `READMEs/zh-CN.md`.
- **Install surfaces for other editors**: `.cursor-plugin/plugin.json` and `.copilot-plugin/plugin.json` alongside the Claude Code manifest, a `metadata.description` in `.claude-plugin/marketplace.json`, and `docs/editors.md` with the `npx skills add -a <agent>` table for nine agents and the manual copy path.
- **`docs/faq.md`, `docs/comparison.md`, and `docs/science.md`**, holding the material the README no longer carries inline.
- Release workflow: pushing a `vX.Y.Z` tag now creates the GitHub release and tells the 10x marketplace to re-sync (`.github/workflows/release.yml`).

### Changed

- **README rebuilt** from 382 lines and nine collapsed sections to 181 lines and two: a hero, a four-badge row, a five-language row, the install command above the first heading, then what it does, install, use it, what you get, editor support, limits, and links. The comparison table lost its competitor price row, which was unverifiable and drifting.
- **CI now runs the CLI tests on Node 18 and 20**, so `engines.node >= 18` is tested rather than asserted. Lint stays on 20, since ESLint 10 requires 20.19 or newer.
- **The pre-commit manifest check** in CI now asserts the staged hook's id, its threshold, `pass_filenames`, and its extension filter.
- `cli/package.json` moves to 0.3.0 and is packaging-complete: `LICENSE`, `homepage`, `bugs`, `publishConfig`, and a `prepublishOnly` gate. `npm pack --dry-run` lists exactly 10 files and no tests. The package is still not published, and every documented command runs it as `node cli/index.js`.
- `docs-site/static/img/logo.svg` re-synced from `.github/assets/logo-light.svg`.

### Fixed

- **A fact moved into a Markdown link no longer reads as lost.** `[the docs](https://example.com)` keeps its URL fact when the rewrite linkifies it.
- **Dropping a `v` prefix no longer reads as a lost version.** `v1.2` and `1.2` are the same fact.
- **The URL pattern no longer stops at a parenthesis**, which used to truncate `https://example.com/foo(123)` and resurface `123` as a separate missing number.

## [0.6.2] - 2026-08-27

Punchier animations across the visual system. No pattern, CLI, or docs-content changes.

### Changed

- **The logo's checkmark and correction text now bounce in with an overshoot pop** instead of a plain fade, with a radiating "ping" ring behind the checkmark, and a thicker, faster strikethrough. Light and dark variants both updated.
- **The burstiness chart's two score numbers (`-0.02`, `+0.74`) now pulse continuously** instead of sitting static, drawing the eye to the number that's doing the work. Light and dark variants both updated.
- **The typewriter demo's `[12/100]` humanized score now bounces in on reveal**, synced to its existing fade-in, mirroring the logo's checkmark pop. Light and dark variants both updated.
- `docs-site/static/img/logo.svg` re-synced from `.github/assets/logo-light.svg` (was stale, predating the editorial red-pen refresh's bounce/ping additions).

## [0.6.1] - 2026-08-26

Visual identity refresh and README rewrite. No pattern or behavior changes.

### Changed

- **New "editorial red-pen" visual system**, replacing the fountain-pen "Manuscript" look: the logo (light/dark), the burstiness chart, the typewriter demo, and the GitHub social-preview card now show a red pen striking through an AI-sounding phrase and writing a plain correction, with a checkmark once it's fixed. The burstiness chart's bars now shift color between red (AI, flat) and green (human, varied), matching the same red/green convention used across every asset.
- **`docs-site` favicon replaced** with a dedicated small icon mark (a bold "H" on cream), since the previous favicon was the full wordmark shrunk to 16px and unreadable at that size.
- **README rewritten**, structure and prose both: `Install` now leads (with `npx skills add` and the vercel-labs/skills installer given real visual weight, a dedicated badge, and a one-line explainer), followed immediately by a working example (`See it work`) before any marketing copy, then `Why this exists`. Every collapsed section keeps its content, retitled and re-linked with explicit anchors.
- Git history: the 3 commits that shipped v0.6.0 (#9, #10, #11) had their messages rewritten to drop `Co-authored-by: Claude` trailers and the "Generated with Claude Code" line, which slipped in against this project's own no-AI-generated-copy positioning. Trees are byte-identical; only the messages changed. The `v0.6.0` tag and GitHub release were recreated to point at the corrected commit.

## [0.6.0] - 2026-08-25

The "discoverability" release: 2 new patterns, a sharper false-positive guard, a pre-commit hook, and SEO/GEO fixes across the README, llms.txt, and docs site. Evidence-scoped by five parallel research passes (competitor landscape, ClawHub/outbound status, product-surface gaps, content-craft frontier, GEO/SEO audit).

### Added

- **2 new patterns (P54-P55)**, taking the catalog to **55** (badge, CI threshold, and frontmatter moved in lockstep): P54 Argument Residue (rebutting an objection nobody raised) and P55 Leftover Hedge Debris (a qualifier a real revision pass would have cut). Named and worded independently; not derived from any other project's pattern text.
- **P34 trigger list widened to five providers**: Gemini (`[cite: 1]`, `[span_1](start_span)`), Grok (`grok_card`, `grok_render_citation_card_json`), DeepSeek (lenticular brackets, dagger symbols), and Perplexity (`attached_file`, `ppl-ai-file-upload`), alongside the existing ChatGPT tokens. Sourced from the live Wikipedia "Signs of AI writing" page.
- **P22 trigger list widened** with vague connector phrases: "in connection with", "connected with/to", "in association with", "associated with".
- **A semicolon/colon clustering note next to P13**: low-medium confidence, flag-in-clustering-only, explicitly not zero-tolerance like the em dash rule.
- **Sub-tiered Tier 1 vocabulary**: split into Tier 1A (evidence-grade, near-definitive on its own) and Tier 1B (wordiness-grade, flagged but weighted lower so a clarity fix alone cannot tip a score toward "AI").
- **False-positive guard additions**: a guardrail for neurodivergent writers (autistic/ADHD low-variance prose is not proof of AI) and an explicit non-native-English-speaker callout (Liang et al., arXiv:2304.02819).
- **A no-fabrication rule**: rewrites may not invent facts, names, dates, or numbers not present in the source.
- **An edit-mode refusal guard**: `--mode edit` now explicitly refuses non-prose targets (source code, config, structured data) instead of silently attempting a rewrite.
- **`references/patterns.md` "Honest limits of this catalog" section**: cites the Wikipedia guide's own talk-page reliability debate, Pindrop's ACL 2026 finding that trained human judges score only 45-53% at this task, the RLHF/instruction-tuning-artifact framing (arXiv:2605.19516), and flags P7/P13/P17 as the catalog's most model-version-fragile patterns. Also notes StoryScope (arXiv:2604.03136) as fiction-specific research currently out of scope.
- **`.pre-commit-hooks.yaml`** at the repo root, wrapping the existing CLI's `scan --fail-above` for the Python `pre-commit` framework, plus a doc section in `cli/README.md` with the consumer snippet and an optional Husky/lint-staged example.
- **P52 (Unicode Obfuscation) added to the browser demo's regex subset** (`landing/index.html`), closing a pattern-list drift between `SKILL.md` and the client-side detector.
- **`robots.txt`** for `docs-site/static/`.
- **`repository` field** and `files` allowlist in `cli/package.json` ahead of any future npm publish.
- **A lint step in CI** (`.github/workflows/ci.yml`) for the `cli/` JS.

### Changed

- **README**: added the missing `# Humanizer` H1 (previously zero H1s), rewrote the hero tagline to name the target phrase ("AI writing humanizer") near the top, and rephrased the existing GPTZero/Washington Post/RAID/HC3 citations as explicit "according to X" authority-signal language.
- **`docs-site/docs/intro.md`**: replaced the generic `title: What is Humanizer` frontmatter with a more specific, entity-rich title and description.
- **`docs-site/static/img/`**: replaced the stock Docusaurus `logo.svg`, `docusaurus-social-card.jpg`, `docusaurus.png`, and `favicon.ico` with the repo's own logo and social-preview assets, generated from `.github/assets/logo-light.svg` and `social-preview.png`.
- **GitHub repo metadata**: added topics `agent-skills` and `openclaw-skill` (the repo was already at 18 of GitHub's 20-topic cap, one more than the source research assumed, so `geo` did not fit and was dropped rather than displacing an existing topic); set the homepage field to `https://humanizer-skill.vercel.app`; refreshed the repo description to say 55 patterns.
- Plugin version 0.5.0 -> 0.6.0.

## [0.5.0] - 2026-07-15

The "polish" release: a new visual system, a leaner README, a best-practice skill, and a docs site. No pattern changes; the catalog stays at 53.

### Added

- **MDX documentation site** under `docs-site/` (Docusaurus, deploy-ready) with real `:::note` admonitions, hosting the full documentation as an additional surface.
- **Skill evaluations** at `skills/humanizer/evals/evals.json`: 5 should-trigger and 3 should-NOT-trigger cases plus a how-to-run note, following Anthropic's Agent Skills testing guidance.
- **Table of contents** at the top of `references/patterns.md` and `references/patterns.zh.md` (both now exceed 100 lines).

### Changed

- **Visual refresh**: the logo, burstiness chart, typewriter demo, and social card were rebuilt in a cohesive paper-and-pen "Manuscript" system (ivory paper, blue-black fountain-pen ink, brass), authored in premium SMIL that animates once and holds. Fixed the stale "43 patterns / 90+ sources" tagline baked into the logo and social card. The landing page was reskinned to match.
- **README** rewritten lean: a one-screen first view (hero, value prop, quickstart with expected output, features), with the full catalog, science, comparisons, model compatibility, and trust moved into `<details>` blocks. GitHub alerts used sparingly; command blocks carry no leading `$` for clean copy-paste. The badge/count/threshold lockstep and the zero-em-dash rule are preserved.
- **SKILL.md** trimmed from 626 to 431 lines, under Anthropic's 500-line budget, by moving per-pattern before/after examples and full trigger lists into `references/patterns.md` (nothing deleted, just tucked). Section headers are now year-neutral.
- **One canonical skill description** (third person, "Use when", literal user-phrase triggers) synced identically across `SKILL.md` frontmatter and `.claude-plugin/plugin.json`. Reinstall the skill so its registry listing refreshes.
- Plugin version 0.4.0 -> 0.5.0.

## [0.4.0] - 2026-07-15

The "collection upgrade": a bigger and more careful catalog, a real false-positive guard, a craft engine, an optional metrics CLI and CI gate, and Chinese localization.

### Added

- **10 new patterns (P44-P53)**, taking the catalog to **53** (badge, CI threshold, and frontmatter moved in lockstep):
  - P44 False Agency, P45 Narrator-from-a-Distance
  - P46 Diff-Anchored Writing, P47 Hyphenated-Pair Overuse, P48 Aphorism Formulas, P49 Fragmented Headers, P50 Passive/Subjectless
  - P51 Reasoning-Chain Artifacts, P52 Unicode Obfuscation
  - P53 Hedged-Enumeration Openers (from the HC3 corpus, arXiv 2301.07597)
- **False-positive guard**: a "What NOT to flag" section and a "Signs of human writing (preserve these)" section, so the skill stops gutting good human prose. Load-bearing rule: never rewrite watched phrases inside quotes, titles, code, or examples; flag clusters, not isolated tells.
- **Craft features** in the rewrite step: Voice Read, Anti-Default Discipline, a Position ("teeth") engine, a Concretizer pass, an Opening tournament (`--openings N`), a certainty-spectrum lexicon in Soul Injection, and a draft/self-audit/final metacognitive pass.
- **Tiered-confidence vocabulary** (Tier 1 always-flag / Tier 2 in-density / Tier 3 context-only) refining P7 to cut false positives.
- **New flags**: `--openings N`, `--ignore-code`, `--ignore-quotes` (mask code/quotes before detect and score).
- **Progressive disclosure**: verbose per-pattern deep dives and sources moved to `skills/humanizer/references/patterns.md`; always-on templates in `references/always-on-templates.md`. The `SKILL.md` core stays standalone and zero-dependency.
- **Optional metrics CLI** (`cli/`): zero-dependency Node tool computing burstiness, type-token ratio, sentence-length CoV, trigram repetition, AI-vocabulary density, and Flesch-Kincaid, with a transparent 0-100 score. Commands `score` / `scan` / `compare`, CI gate flags (`--fail-above`, `--baseline`, `--fail-on-regression`), 25 tests, and a reusable GitHub Action at `.github/actions/humanizer-gate`.
- **HC3 corpus citation** (arXiv 2301.07597) added to the README "science" table: bilingual, peer-reviewed corroboration of the length, vocabulary-diversity, and perplexity claims.
- **Chinese localization**: `README.zh-CN.md` (positioned on the "humanize your English writing" wedge) with a language switcher in both READMEs, and a provisional native-Chinese pattern appendix at `references/patterns.zh.md` (explicitly marked as needing a zh-fluent validator).
- **Cross-agent install via the skills CLI**: documented `npx skills add Aboudjem/humanizer-skill` ([vercel-labs/skills](https://github.com/vercel-labs/skills)), which auto-discovers the standard `skills/humanizer/SKILL.md` layout and installs to Claude Code, Cursor, Codex, opencode, and 70+ agents. No repo restructuring needed.

### Changed

- Pattern count: 43 -> 53 (badge, CI threshold, frontmatter, quick-reference, comparison table).
- **Honest positioning**: the "zero dependency / one file / nothing to audit" claims are now scoped to the Markdown skill core; the CLI is framed as a separate optional offline layer.
- Deduplicated the P31-P43 entries, which previously repeated their fix/source text 2-3 times, and fixed mangled lowercased URLs.
- Cross-checked the catalog against Wikipedia's "Signs of AI writing" guide and closed the remaining prose gaps by extending existing patterns (no count change): P14 now also covers skipped heading levels, thematic breaks before headings, emoji-as-bullets, and prose-worthy tables; P34 covers RAG `attribution`/`attributableIndex` markup; P39 covers section-end recap summaries. Coverage mapping documented in `references/patterns.md`.
- **Quick reference table block** at the top of SKILL.md: Modes, Voices, Pattern catalog, and Flags presented as scannable tables.
- **"When to use this skill" section** right under the H1.
- **Frontmatter description** updated to reflect 53 patterns.
- **Operating principles trimmed**: same content, less prose padding.

## [0.3.0] - 2026-05-13

### Added

- **6 community-discovered patterns (P38-P43)** sourced from HackerNews, Substack, Wikipedia editorial guideline, and writing practitioner blogs (May 2026 research wave):
  - P38 Paragraph-Reshuffling Immunity (semantic non-progression at paragraph level)
  - P39 Paragraph-Closing "Whether" Summary Sentences
  - P40 Symbolic Gloss / Meaning-Telling ("represents", "symbolizes")
  - P41 Infomercial Engagement Hooks ("The kicker?", "The brutal truth?")
  - P42 Erratic Inline Bolding (no-pattern bold spans; distinct from P14 overuse)
  - P43 The Treadmill Effect (low information density; restatement filler)
- **3 new flags** documented and specified in SKILL.md:
  - `--iterate N`: detect → rewrite → detect loop, up to N=3
  - `--score`: prepends a 0-100 AI-tell density score header
  - `--purpose essay|email|marketing|technical|general`: content-type rules layered on voice
- **Brand voice context auto-load**: drop a `humanizer-context.md` at project root; skill picks it up as a personal extension of the voice profile
- **3 new animated demo SVGs** (light + dark variants): burstiness comparison, typewriter before/after, pattern scanner. Burstiness viz embedded as the new hero proof asset in README.
- **"4-pass system" framing** in the How-it-works mermaid (Detect → Strip → Inject → Verify)
- **Score-yourself example** in README usage with quotable 0-100 number
- Stricter CI checks: em-dash audit, pattern-badge consistency check

### Changed

- Pattern count: 37 → 43 (propagated to badge, frontmatter, hero SVG taglines, comparison table, CI threshold)
- Viral hook at top of README: replaced soft tagline with quotable burstiness-score claim
- Skill description in frontmatter updated to reflect 43 patterns

### Fixed

- Stale "30 patterns" references in CONTRIBUTING.md, CHANGELOG.md, CI, and inner README
- Logo subtitle reframed to "Make AI Text Sound Human" (was "Make AI Text Undetectable") to match README's "writing quality, not detection evasion" positioning

## [0.2.0] - 2026-05-01

### Added

- **7 emerging 2026 patterns** (P31-P37) sourced from Wikipedia FR research and community signal:
  - P31 Elegant Variation (noun-phrase cycling, distinct from P11 word-level)
  - P32 Collaborative Communication Leaking ("In this article, we will explore")
  - P33 Placeholder Text / Mad Libs (`[Your Name]`, `[INSERT URL]`)
  - P34 Chatbot Reference Markup (`citeturn0search0`, `oai_citation`, `contentReference[oaicite:0]`)
  - P35 UTM Source Parameters (`utm_source=chatgpt.com`, `utm_source=openai`)
  - P36 Sudden Style/Register Shift (mixed human+AI authorship detection)
  - P37 Overattribution / Source-Listing as Content
- SVG hero logo with light/dark variants and animated pen+paper
- GitHub community files: CODE_OF_CONDUCT, SECURITY, FUNDING
- CI pipeline: structure validation, pattern count, internal-files leak check
- Self-correction technique in soul injection toolkit
- French-language AI tell research (anglicism markers, discourse markers)

### Changed

- README overhauled with sniff-quality structure, model-agnostic install table, mermaid pipeline diagram
- SEO/GEO optimization pass, README humanized to eat own dog food
- Em dash zero-tolerance enforced repo-wide (replaces hyphens/commas/colons everywhere)

## [0.1.0] - 2026-04-16

### Added

- **30 AI writing patterns** (P1-P30) across 5 categories: content, language and style, communication, filler and hedging
- **5 voice profiles**: casual, professional, technical, warm, blunt
- **3 operating modes**: detect (analysis only), rewrite (full transform), edit (surgical fixes)
- **4-step pipeline**: Detect patterns, Strip AI artifacts, Inject human voice, Verify with burstiness and perplexity checks
- **11 soul injection techniques** for adding authentic human qualities
- **90+ research sources** cited including GPTZero methodology, NeurIPS 2023, ACL 2024 RAID benchmark, Washington Post 328K message analysis
- **Before/after examples** for technical documentation, blog posts, and LinkedIn content
- **Comprehensive README** with science section, comparison table, and research citations
- **Contributing guide** with pattern submission format and quality standards
