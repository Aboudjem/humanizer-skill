---
sidebar_position: 5
title: The 55 AI writing patterns Humanizer detects
description: The full catalog of 55 numbered AI writing patterns, from significance inflation to unicode obfuscation, with what to look for and where each one comes from.
---

# The 55 patterns

Humanizer detects 55 numbered patterns across six categories. Below is the catalog with what to look for. Full descriptions, trigger lists, and a before/after example for each live in the [skill source](https://github.com/Aboudjem/humanizer-skill/blob/main/skills/humanizer/SKILL.md) and the [reference deep dives](https://github.com/Aboudjem/humanizer-skill/blob/main/skills/humanizer/references/patterns.md).

:::warning[Flag clusters, not isolated tells]
One em dash, one "crucial", one three-item list is how humans write too. A pattern only counts when several co-occur in the same passage. The skill ships a false-positive guard, and it never rewrites text inside quotes, code, titles, or examples. This is about writing quality, not detection evasion.
:::

## Content (P1-P8)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P1 | Significance Inflation | "marking a pivotal moment", "is a testament to" |
| P2 | Notability Name-Dropping | "featured in", "active social media presence" |
| P3 | Superficial -ing Phrases | "highlighting", "ensuring", "fostering" |
| P4 | Promotional Language | "cutting-edge", "seamless", "world-class", "nestled" |
| P5 | Vague Attributions | "Experts argue", "Research suggests" with no citation |
| P6 | Formulaic Challenges | "Despite challenges, continues to thrive" |
| P7 | AI Vocabulary | "delve", "leverage", "multifaceted", "tapestry" |
| P8 | Copula Avoidance | "serves as" instead of "is" |

## Language and Style (P9-P18)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P9 | Negative Parallelisms | "It's not just X, it's Y" |
| P10 | Rule of Three | Forced triads: "innovation, inspiration, and insights" |
| P11 | Synonym Cycling | "protagonist" then "main character" then "central figure" |
| P12 | False Ranges | "From X to Y" on non-spectrums |
| P13 | Em Dash Ban | Zero em dashes; replace with commas or hyphens |
| P14 | Boldface Overuse | Bold on every noun, emoji headers |
| P15 | Structured List Syndrome | `**Header:** description` bullets for prose content |
| P16 | Title Case Headings | "Strategic Negotiations And Global Partnerships" |
| P17 | Typographic Tells | Curly quotes, a rigidly consistent Oxford comma |
| P18 | Formal Register Overuse | "it should be noted that", "it is essential to" |

## Communication (P19-P21)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P19 | Chatbot Artifacts | "I hope this helps!", "Certainly!" |
| P20 | Knowledge-Cutoff Disclaimers | "As of [date]", "based on available information" |
| P21 | Sycophantic Tone | "Great question!", "That's an excellent point!" |

## Filler and Hedging (P22-P30)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P22 | Filler Phrases | "In order to", "It's worth noting" |
| P23 | Excessive Hedging | "could potentially possibly" |
| P24 | Generic Conclusions | "The future looks bright", "poised for growth" |
| P25 | Hallucination Markers | Fabricated-feeling dates, phantom citations |
| P26 | Perfect/Error Alternation | Inconsistent quality that suggests a partial AI edit |
| P27 | Question-Format Titles | "What makes X unique?", "Why is Y important?" |
| P28 | Markdown Bleeding | `**bold**` in emails, Word docs, social posts |
| P29 | Comprehensive Overview Opening | "This guide delves into", "Let's dive in" |
| P30 | Uniform Sentence Length | Every sentence 15-25 words, no variation |

## Emerging (P31-P43)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P31 | Elegant Variation | "the artist", "the visionary creator" for one person |
| P32 | Communication Leaking | "In this article, we will explore" |
| P33 | Placeholder Text | `[Your Name]`, `[INSERT SOURCE URL]`, unfilled brackets |
| P34 | Chatbot Markup Leaking | `citeturn0search0`, `oai_citation`, broken footnote refs |
| P35 | UTM Source Parameters | `utm_source=chatgpt.com` in URLs |
| P36 | Sudden Register Shift | Formal prose switching to casual mid-piece |
| P37 | Overattribution | "Featured in Wired and other outlets" without substance |
| P38 | Reshuffling Immunity | Paragraphs that could swap order without breaking |
| P39 | "Whether" Closers | "Whether you prefer X or Y, the answer is" as a wrap-up |
| P40 | Symbolic Gloss | "represents", "symbolizes" applied to mundane things |
| P41 | Infomercial Hooks | "The catch?", "The kicker?", "Here's the thing." |
| P42 | Erratic Inline Bolding | Random mid-sentence bold with no shared logic |
| P43 | Treadmill Effect | "In other words", "Put simply" looping one point |

## Craft and Forensic (P44-P55)

| # | Pattern | What to look for |
|:--|:--------|:-----------------|
| P44 | False Agency | "the data tells us", "the market rewards" |
| P45 | Narrator-from-a-Distance | "People tend to", "Nobody designed this" |
| P46 | Diff-Anchored Writing | "was refactored to", "now uses", "replaces the old" |
| P47 | Hyphenated-Pair Overuse | "the report is high-quality" |
| P48 | Aphorism Formulas | "X is the new Y", "the currency of" |
| P49 | Fragmented Headers | A heading followed by one line restating it |
| P50 | Passive / Subjectless | "No configuration is needed", "changes were made" |
| P51 | Reasoning-Chain Artifacts | "Let me think", "Step 1:", "Breaking this down" |
| P52 | Unicode Obfuscation | Zero-width chars, soft hyphens, homoglyphs |
| P53 | Hedged-Enumeration Openers | "There are several ways to", "In general" |
| P54 | Argument Residue | "While some might argue...", a rebuttal to a claim nobody made |
| P55 | Leftover Hedge Debris | "To some extent, this is arguably..." next to a confident claim |

## Tiered vocabulary

Pattern P7 uses tiers to cut false positives. Tier 1 splits into 1A, evidence-grade words (`delve`, `tapestry`, `multifaceted`, `realm`, `interplay`) that almost never survive in unedited human prose and are always flagged, and 1B, wordiness-grade words (`underscore`, `leverage`, "it's worth noting") that are legitimate but often lazy, flagged but weighted lower so a clarity fix alone cannot tip a score toward "AI." Tier 2 words (`crucial`, `pivotal`, `vibrant`, `seamless`, `foster`) are flagged only in density, two or more per paragraph. Tier 3 words (`key`, `important`, `significant`) are ordinary and are flagged only when they cluster with higher tiers.
