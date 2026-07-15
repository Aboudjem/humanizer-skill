# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
