# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Quick reference table block** at the top of SKILL.md: Modes, Voices, Pattern catalog, and Flags presented as scannable tables. Matches the layout of ClawHub's top-installed skills (self-improving-agent, skill-vetter) so the registry page reads cleanly.
- **"When to use this skill" section** right under the H1: bullet list of trigger conditions for users skimming the registry preview.

### Changed

- **Frontmatter description tightened** from 280 chars to 230 chars with numbered use cases. Matches ClawHub registry summary format used by top-installed skills.
- **Operating principles trimmed**: same content, less prose padding, no redundancy between the three opening sentences.

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
- **Lineage and credit section** acknowledging [@blader/humanizer](https://github.com/blader/humanizer) and [@softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit) as predecessors
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
