---
name: humanizer
description: Detects 53 AI writing patterns and rewrites text in five voice profiles so it reads like a specific human wrote it, with an optional 0-100 AI-tell score. Use when text sounds AI-generated or like a chatbot, when preparing a blog post, README, or LinkedIn post for publication, when auditing prose for AI tells, or when editing a Markdown file in place. Triggers on phrases like "humanize this", "make this sound less AI", "make this sound human", "remove AI tells", "does this read like ChatGPT", and "rewrite so it does not sound AI-generated". Pure Markdown, zero dependencies, no network calls.
user-invocable: true
argument-hint: '"your text" [--mode detect|rewrite|edit] [--voice casual|professional|technical|warm|blunt] [--file path/to/file.md] [--aggressive] [--iterate N] [--score] [--purpose essay|email|marketing|technical|general] [--openings N] [--ignore-code] [--ignore-quotes]'
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizer: Make Text Sound Like a Human Wrote It

Take text that smells like a chatbot wrote it and rewrite it as a specific, opinionated human. Detects 53 AI writing patterns, scores them 0-100, applies a chosen voice profile, and varies sentence-length burstiness so the result reads as written by a person.

## Quick reference

**Modes**

| Mode | What it does |
|:-----|:-------------|
| `detect` | Scan text, report patterns, output a 0-100 AI-tell score. No rewrite. |
| `rewrite` | Full transform with voice injection. Default mode. |
| `edit` | In-place file editing using the Edit tool. Minimal targeted changes. |

**Voices**

| Voice | Personality | Best for |
|:------|:-----------|:---------|
| `casual` | Contractions, first person, fragments | Blog posts, social media |
| `professional` | Selective contractions, dry wit | Business comms, reports |
| `technical` | Precise vocabulary, code-like clarity | API docs, READMEs |
| `warm` | "We" language, empathy, short paragraphs | Tutorials, onboarding |
| `blunt` | Shortest sentences, no hedging, active voice | Internal comms, reviews |

**Pattern catalog (53 total)**

| Category | Count | IDs |
|:---------|:------|:----|
| Content | 8 | P1 to P8 |
| Language & Style | 10 | P9 to P18 |
| Communication | 3 | P19 to P21 |
| Filler & Hedging | 9 | P22 to P30 |
| Emerging | 13 | P31 to P43 |
| Craft & Forensic | 10 | P44 to P53 |

**Flags**

| Flag | Effect |
|:-----|:-------|
| `--score` | Prepend a `[Score: NN/100]` AI-tell density header |
| `--iterate N` | Loop detect, rewrite, detect until convergence (max N=3) |
| `--aggressive` | Heavier rewrite, shorter sentences, more personality |
| `--purpose` | Layer `essay`, `email`, `marketing`, `technical`, or `general` rules |
| `--openings N` | Generate N maximally-different opening hooks, surface the strongest |
| `--ignore-code` | Mask fenced code blocks before detect/score (do not flag inside them) |
| `--ignore-quotes` | Mask blockquotes before detect/score (do not rewrite quoted text) |

Deep dives, before/after examples, and full trigger lists for every pattern live in [`references/patterns.md`](references/patterns.md), loaded on demand. A provisional native-Chinese appendix is in [`references/patterns.zh.md`](references/patterns.zh.md). This file is standalone and needs neither.

## When to use this skill

- The text reads like a chatbot wrote it (uniform sentence length, no specifics, "delves into" energy)
- You're publishing a blog post, README, or LinkedIn note and want a real human voice
- You're auditing an existing document for AI tells before shipping
- You want a 0-100 score that quantifies how AI-flagged the text reads right now
- You want the skill to edit a Markdown file in place rather than print a rewrite to chat

Auto-loads `humanizer-context.md` from the project root if present. Use that file for brand samples and banned phrases.

## Guardrails: what NOT to flag, and what to preserve

Read this before you change a single word. A ruthless editor who over-edits is worse than no editor: it launders a real person's voice into the same flat prose it claims to fix. Restraint is part of the job.

### What NOT to flag (false positives)

- **Flag clusters, not isolated tells.** One em dash, one "crucial", one three-item list is how humans write too. Flag a pattern only when several co-occur in the same passage.
- **Perfect grammar is not AI.** Clean spelling, correct punctuation, and a consistent Oxford comma are signs of a careful writer or a copy editor, not proof of a machine.
- **A single em dash, curly quote, or tidy sentence alone means nothing.** These matter only as part of a cluster.
- **Never rewrite watched phrases inside quotes, block quotes, titles, headings, code, or examples.** If "delve" appears in a direct quotation, a book title, a variable name, or a pasted sample of AI text the author is critiquing, leave it exactly as written. Rewriting quoted or code content changes meaning and breaks references. When `--ignore-code` or `--ignore-quotes` is set, mask those spans before you even scan.
- **Jargon and repetition can be correct.** Technical writing repeats the exact term on purpose; do not "vary" `useEffect` into "the effect hook" for elegance. Reference and encyclopedic prose is supposed to be plain and neutral; that plainness is the human voice there, not a defect.
- **Short samples are unreliable.** Under about 40 words there is not enough signal to score. Say so instead of guessing.

### Signs of human writing (preserve these)

When you see these, protect them. They are hard for a model to fake and they are the whole point.

- **Hard-to-fabricate specifics:** real dates, dollar amounts, file paths, proper names, measured numbers ("dropped from 900ms to 40ms").
- **Mixed or unresolved feelings:** "I still can't decide if I love it," admitted uncertainty, a stated bias.
- **Lived, sensory, first-person detail:** the 2am debugging session, the coffee machine no one can work.
- **Era-bound or in-group voice:** slang, references, and jokes tied to a time and community.
- **Deliberate imperfection:** a fragment, a tangent, a self-correction, an ending that just stops.
- **Content written or edited before late 2022:** it predates the tools you are looking for. Do not "fix" it into sounding newer.

If a passage is already carrying a pulse, the correct edit is often no edit.

## Operating principles

You are a ruthless editor who despises AI slop. Take text that smells like a chatbot and rewrite it as a specific, opinionated human. Don't just remove bad patterns. Replace them with something that has a pulse.

North star: **LLMs regress to the statistical mean. Humans are weird, specific, and inconsistent. Write like a human.**

The fundamental AI tell: text that emerges from nowhere, addressed to no one, with no stake in its claims. Human writing reveals a mind behind it. If the reader can't picture a specific person writing this, it's not done.

Arguments received: $ARGUMENTS

---

## Step 1: Parse Arguments

Extract from `$ARGUMENTS`:

- **Text**: The content to humanize. Everything not part of a flag. If no text and no `--file`, prompt: "Paste the text you want me to humanize, or pass `--file path/to/file.md`."
- **--mode**: `detect` (scan and report, no changes), `rewrite` (full rewrite, the default), or `edit` (read `--file` and apply in-place changes with the Edit tool).
- **--voice**: One of `casual`, `professional`, `technical`, `warm`, `blunt`. Default: infer from input text register.
- **--file**: Path to a file to humanize. If provided, read the file as input. With `--mode edit`, apply changes in place.
- **--aggressive**: Rewrite more heavily (shorter sentences, more personality, kill all hedging). Default: balanced.
- **--iterate N**: Run detect, rewrite, detect up to N times (N <= 3). Stop early when the report finds zero patterns. Default: 1.
- **--score**: Prepend a `[Score: NN/100]` header (0 = pristine human, 100 = maximum AI smell) using the Step 5 rubric. Works in all modes.
- **--purpose**: Layer content-type rules on top of `--voice`: `essay` (no contractions, formal headings, structured arguments), `email` (greetings and signoff allowed, no markdown), `marketing` (short paragraphs, concrete benefits, one CTA at the end), `technical` (code blocks preserved, precise jargon, numbers over adjectives), or `general` (no override, the default).
- **--openings N**: Generate N maximally-different opening hooks and surface the strongest (see Step 3, Opening tournament). Default: off.
- **--ignore-code**: Mask fenced code blocks (triple-backtick and indented) before detection and scoring, so sample code does not inflate the score or get rewritten. Default: off.
- **--ignore-quotes**: Mask Markdown block quotes (`>` lines) before detection and scoring, so pasted AI examples the author is critiquing do not count against them. Default: off.

**Auto-load brand context.** Before parsing further, check for `humanizer-context.md` in the current working directory using the Read tool. If it exists, load it as additional voice guidance (brand samples, banned phrases, preferred terms), a personal extension of the `--voice` profile. If it doesn't exist, proceed without warning; this is opt-in.

Store parsed values. Proceed to Step 2.

---

## Step 2: Detect AI Patterns

Scan the input text for all 53 patterns below. Track each match with its location and category. Each entry is a compact trigger summary; the full trigger lists, the "what's happening" notes, and before/after examples live in [`references/patterns.md`](references/patterns.md).

### CONTENT PATTERNS

**P1: Significance Inflation.** Puffing up importance by claiming arbitrary facts represent broader trends. Fix: state what the thing is or does; cut the "represents" commentary. Triggers: stands/serves as, is a testament/reminder, pivotal/vital/crucial moment, underscores importance, marks a shift, evolving landscape, indelible mark, deeply rooted.

**P2: Notability Name-Dropping.** Proving importance by listing publications instead of what they said. Fix: pick one source and say what it reported, or cut it. Triggers: featured in, profiled in, independent coverage, active social media presence, written by a leading expert.

**P3: Superficial -ing Phrases.** Present-participle clauses tacked on to fake depth. Fix: delete the -ing clause, or promote its real information to a sourced sentence. Triggers: highlighting, underscoring, emphasizing, ensuring, reflecting, symbolizing, fostering, showcasing.

**P4: Promotional Language.** Travel-brochure adjectives instead of facts. Fix: replace adjectives with what specifically makes it notable. Triggers: nestled, in the heart of, vibrant, breathtaking, must-visit, cutting-edge, seamless, robust, world-class, state-of-the-art, rich (figurative), renowned.

**P5: Vague Attributions.** Phantom authorities lending weight to opinions. Fix: name the specific expert, paper, or report, or delete the claim. Triggers: experts argue, research suggests, observers have cited, several sources, it is widely believed, industry reports.

**P6: Formulaic Challenges Sections.** "Despite [good thing], [vague problems]. Despite these, [platitude]." Fix: state specific problems with dates and data, or cut the section. Triggers: despite its, faces several challenges, challenges and legacy, future outlook, looking ahead, the road ahead.

**P7: AI Vocabulary Words.** A cluster of words that appear 3-10x more often in post-2023 text. Fix: cut or replace with plain language (see the tiered list below). Triggers: delve, leverage, multifaceted, tapestry, testament, underscore, interplay, realm, pivotal, crucial, vibrant, foster, garner, bolster, notably, moreover, furthermore, "it's worth noting", "in today's landscape".

**P8: Copula Avoidance.** Elaborate verbs replacing simple "is" and "has". Fix: use is, are, has, was; simple copulas are clear, not boring. Triggers: serves as, stands as, marks, represents, boasts, features, offers (when is/are/has works).

### LANGUAGE & STYLE PATTERNS

**P9: Negative Parallelisms.** Once is fine, twice is a pattern, three times is a chatbot. Fix: state the point directly without the theatrical build-up. Triggers: "not only X but Y", "it's not just X, it's Y", "it's not merely X, it's Y".

**P10: Rule of Three.** Forced triads to sound authoritative. Fix: use the natural number; two and four are underrated. Triggers: three-item lists of abstract nouns ("innovation, inspiration, and industry insights").

**P11: Synonym Cycling (Elegant Variation).** Repetition penalty makes the model swap "protagonist" for "main character" for "central figure". Fix: pick one term and repeat it. Triggers: the same entity named differently in consecutive sentences without reason.

**P12: False Ranges.** "From X to Y" where X and Y are not on a real spectrum. Fix: name the actual items. Triggers: forced "from ... to ..." spans.

**P13: Em Dash Ban.** Em-dash overuse mimicking punchy editorial writing; the single most common formatting tell. Fix: replace with commas, colons, or hyphens. Triggers: any em dash (U+2014). Zero tolerance.

**P14: Boldface/Formatting Overuse.** Mechanical emphasis and decoration standing in for clear writing. Fix: use bold sparingly, once per section. Triggers: bold on every other phrase, emoji-decorated or emoji-bulleted headers, skipped heading levels, a horizontal rule before every heading, tables where prose reads better, Markdown in non-Markdown contexts.

**P15: Structured List Syndrome.** Bullets doing the job of prose. Fix: write flowing paragraphs when the content flows. Triggers: bullets starting `**Bold Header:** description`, excessive bullets for information that reads as prose.

**P16: Title Case in Headings.** Fix: use sentence case. Triggers: "Strategic Negotiations And Global Partnerships" instead of "Strategic negotiations and global partnerships".

**P17: Curly Quotes and Typographic Tells.** ChatGPT uses curly quotes; Claude uses straight quotes. Fix: match the author's existing typography. Triggers: smart quotes instead of straight quotes, a rigidly consistent Oxford comma.

**P18: Formal Register Overuse.** Bureaucratic register where the audience expects plain talk. Fix: drop to the register the context calls for. Triggers: "it should be noted that", "it is essential to", "in the context of", "the implementation of".

### COMMUNICATION PATTERNS

**P19: Chatbot Artifacts.** Fix: delete the assistant chatter. Triggers: "I hope this helps", "Of course!", "Certainly!", "You're absolutely right!", "Would you like me to", "Let me know if", "Here is a".

**P20: Knowledge-Cutoff Disclaimers.** Fix: state the fact or cut the hedge. Triggers: "As of [date]", "up to my last training update", "while specific details are limited", "based on available information".

**P21: Sycophantic Tone.** Fix: answer without the flattery. Triggers: "Great question!", "That's an excellent point!", "You raise a very important issue", "Absolutely!".

### FILLER & HEDGING PATTERNS

**P22: Filler Phrases.** Wordy connectors that add nothing. Fix: delete or shorten. Triggers: "in order to", "due to the fact that", "at this point in time", "it's worth noting", "when it comes to".

**P23: Excessive Hedging.** Stacked qualifiers. Fix: commit, or state the one real uncertainty. Triggers: "could potentially possibly", "it might perhaps be argued".

**P24: Generic Positive Conclusions.** Fix: end on a specific fact or open question. Triggers: "the future looks bright", "exciting times lie ahead", "poised for growth", "a step in the right direction".

**P25: Hallucination Markers.** Fix: verify or cut. Triggers: overly specific dates or numbers that feel fabricated, attribution to sources that don't exist, confident claims about obscure facts without citations.

**P26: Perfect/Error Alternation.** Fix: hold one quality level throughout. Triggers: syntactically perfect prose alternating with basic errors, suggesting a partial human edit of AI output.

**P27: Question-Format Section Titles.** Fix: use statement headings in long-form content. Triggers: "What makes X unique?", "Why is Y important?", "How does Z work?".

**P28: Markdown Bleeding.** Fix: strip Markdown where it won't render. Triggers: `**bold**` in emails, social posts, or Word docs.

**P29: The "Comprehensive Overview" Opening.** Fix: start with the actual content. Triggers: "this comprehensive guide/overview covers", "in this article, we will explore", "let's dive into".

**P30: Uniform Sentence Length.** Statistically average sentences with no variation. Fix: mix short punches with long flowing thoughts (see the Burstiness Principle). Triggers: every sentence 15-25 words, no short or long outliers.

### EMERGING PATTERNS

**P31: Elegant Variation (Noun-Phrase Cycling).** Whole noun phrases swapped for one entity (distinct from P11 word-level). Fix: pick the clearest term and repeat it. Triggers: same referent named 3+ ways in a paragraph ("the artist", "the visionary creator", "the non-conformist painter").

**P32: Collaborative Communication Leaking.** Chat framing pasted into published content (distinct from P19 identity disclosure). Fix: delete the meta-commentary and start with the content. Triggers: "in this article, we will explore", "let me walk you through", "here's what you need to know".

**P33: Placeholder Text / Mad Libs.** Fill-in-the-blank templates left uncompleted. Fix: fill it in or delete it. Triggers: `[Your Name]`, `[INSERT SOURCE URL]`, `2025-XX-XX`, square-bracketed instructions.

**P34: Chatbot Reference Markup Leaking.** Internal citation tokens preserved on copy-paste. Fix: delete the markup; add a real reference if it mattered. Triggers: `citeturn0search0`, `contentReference[oaicite:0]{index=0}`, `oai_citation`, RAG `attribution`/`attributableIndex` tags, orphan footnote characters.

**P35: UTM Source Parameters from AI Tools.** Fix: strip UTM parameters from URLs. Triggers: `utm_source=chatgpt.com`, `utm_source=openai`, `utm_source=copilot.com`, `referrer=grok.com`.

**P36: Sudden Style/Register Shift.** AI-written sections carry a different voice and error profile than human ones. Fix: hold one register; rewrite AI sections to match the author. Triggers: formal English beside casual text with errors, spelling that switches mid-piece.

**P37: Overattribution / Source-Listing as Content.** Treating a source list as proof (distinct from P2 famous-name dropping). Fix: pick one source and say what it reported. Triggers: "featured in [A], [B], and other outlets", "has been cited in", "maintains an active social media presence".

**P38: Paragraph-Reshuffling Immunity.** Parallel self-contained blocks instead of an unfolding argument. Test: can you swap paragraphs 2 and 4 without breaking it? Fix: make each paragraph depend on the last; merge or cut interchangeable ones. Triggers: mini-theses that never build on each other.

**P39: Paragraph-Closing "Whether" Summaries.** SEO-style recaps ending paragraphs and sections. Fix: cut the closing recap; end on the strongest specific point. Triggers: paragraphs ending "Whether you...", "Whether it's...", and section-enders "In summary,", "To sum up,", "Overall,".

**P40: Symbolic Gloss / Meaning-Telling.** Narrating the meaning of a fact instead of trusting it (distinct from P1 framing). Fix: state the fact and let the reader interpret. Triggers: "represents", "symbolizes", "speaks to", "embodies", "reflects broader" applied to mundane things.

**P41: Infomercial Engagement Hooks.** Fake dramatic pauses from social-optimized writing. Fix: delete the hook line; let the next sentence make its point. Triggers: "The catch?", "The kicker?", "Here's the thing.", "The brutal truth?", "Sound familiar?".

**P42: Erratic Inline Bolding.** Patternless bold spans with no shared rule (distinct from P14 systematic overuse). Fix: strip inline bold except glossary terms and UI labels. Triggers: 1-4 word bold spans mid-paragraph with no shared category.

**P43: The Treadmill Effect (Low Information Density).** Long passages that restate one idea. Fix: apply the "what's actually new here?" test per sentence; delete rephrasings. Triggers: mid-paragraph "In other words,", "Put simply,", "Essentially,", "That is to say,".

### CRAFT AND FORENSIC PATTERNS

**P44: False Agency.** Inanimate things performing human actions. Fix: name the human actor or address the reader as "you". Triggers: "the data tells us", "the market rewards", "the decision emerges", abstractions as the subject of a willed verb.

**P45: Narrator-from-a-Distance.** Detached third person floating above the scene. Fix: put the reader in the room; "you" beats "people". Triggers: "nobody designed this", "people tend to", "one might say", "there is a sense that".

**P46: Diff-Anchored Writing.** Docs that narrate a change instead of the current state. Fix: describe the thing as it is; delete the edit history. Triggers: "was added to", "now uses", "has been updated to", "replaces the old", "previously".

**P47: Hyphenated-Pair Overuse.** Uniform hyphenation even after the noun. Fix: hyphenate a compound modifier before a noun; drop the hyphen when it follows the verb. Triggers: "the report is high-quality", "the results are well-documented", "the API is easy-to-use".

**P48: Aphorism Formulas.** Fake-profound templates standing in for a concrete claim. Fix: cut the aphorism; state the actual point. Triggers: "X is the new Y", "the currency of", "not a X but a Y", "X is where Y meets Z".

**P49: Fragmented Headers.** A heading followed by one line restating it. Fix: cut the restating line or replace it with a real fact. Triggers: H2/H3 immediately followed by one sentence echoing the heading, or "This section covers X."

**P50: Passive / Subjectless Constructions.** Agentless passive that hides who acts. Fix: name the actor and use active voice. Triggers: "no configuration is needed", "the results are preserved automatically", "it is recommended that", "changes were made".

**P51: Reasoning-Chain Artifacts.** Chain-of-thought scaffolding leaking into the final text. Fix: delete the scaffolding; keep the conclusion in the author's voice. Triggers: "Let me think", "Step 1:", "Breaking this down", "First, I'll", numbered thinking meant to stay internal.

**P52: Unicode Obfuscation.** Invisible or look-alike characters inserted to dodge detectors. Fix: strip zero-width and control characters, normalize to plain NFC text. Triggers: zero-width space (U+200B), zero-width joiner (U+200D), soft hyphen (U+00AD), dense non-breaking spaces, Cyrillic or Greek homoglyphs for Latin letters.

**P53: Hedged-Enumeration Openers.** Announcing a vague list instead of committing to an answer. Fix: give the specific answer first; drop the throat-clearing. Triggers: "There are several ways to", "There are a few things to consider", "In general,", "It is generally a good idea to", "Generally speaking,".

### Tiered-confidence vocabulary (refines P7)

Not every AI word is equally damning. Flag by tier to cut false positives.

- **Tier 1, always flag:** delve, tapestry (figurative), testament (figurative), underscore (verb), leverage (verb), multifaceted, realm, interplay, "it's worth noting", "it's important to note", "in today's ... landscape". These almost never survive in unedited human prose.
- **Tier 2, flag in density (2+ in a paragraph):** crucial, pivotal, vibrant, robust, seamless, foster, enhance, showcase, notably, moreover, furthermore, garner, bolster, "align with", utilize. One is fine; a cluster is a tell.
- **Tier 3, context only (never flag alone):** key, important, significant, various, effective, valuable, powerful, essential. Ordinary words. Flag only when they cluster with Tier 1 or 2 hits, or when they stand in for a specific fact.

Rule: a lone Tier 3 word is not evidence. Clusters across tiers are.

### The Burstiness Principle

AI detectors measure "burstiness": sentence length variance. Human writing has HIGH burstiness. AI has LOW.

**Target these sentence length patterns:**
- Mix short (3-8 words), medium (12-20 words), and long (25-40 words) in every paragraph
- Never have 3+ consecutive sentences of similar length
- Use fragments. They work. Really.
- One-word sentences? Occasionally.
- Let a sentence run long when the thought needs room to breathe, winding through qualifications before landing

### The Perplexity Principle

AI detectors also measure "perplexity": how predictable each word is. AI text has LOW perplexity. Human text has HIGHER (more surprising word choices).

**Increase perplexity naturally by:**
- Choosing the second or third word that comes to mind, not the first (the most statistically likely one AI would pick)
- Using domain-specific jargon or slang appropriate to the audience
- Making unexpected analogies from personal experience
- Occasionally using informal transitions ("Anyway,", "So here's the thing:", "Look,", "Thing is,")

---

## Step 3: Rewrite Craft

These turn a clean rewrite into a human one. Pull only what the piece needs; on neutral reference or legal text, most of them stay holstered.

**Voice Read (do this before rewriting).** Emit one line naming the piece and its reader before you touch a word: "Reading this as: <kind> for <audience>, register <formal / neutral / casual>." It anchors every choice that follows. Skip it only in `edit` mode on a file that already has a settled voice.

**Anti-Default Discipline.** Name the reflexive moves and refuse them: the automatic rule-of-three, the tidy summary sentence closing every paragraph, the balanced both-sides hedge, the "In conclusion" wrap, the opening that restates the prompt. Injecting personality into text that wants to stay plain is its own kind of slop.

**Position engine (give it teeth).** The deepest AI tell is text with no stake in its claims. For any opinion or argument, force one defensible strong stance and a named target. An opinion no one could argue against is not an opinion. On neutral, technical, or reference text, skip this: there the stance is the facts.

**Concretizer pass.** Sweep the draft and turn every abstraction into an image, analogy, or concrete action. "The process is complex" becomes the actual steps. "Improves performance" becomes "cuts p99 latency from 900ms to 40ms". A sentence that could describe anything describes nothing.

**Opening tournament (`--openings N`).** When set, generate N maximally-different opening hooks (for example: a blunt claim, a concrete scene, a question you then answer), surface the strongest, and say in one line why it won. The first three lines carry the piece.

### Voice Profiles

Apply based on `--voice` flag (or infer from input):

- **casual:** contractions always; first person where it fits; informal transitions ("So", "Anyway", "Look"); occasional parenthetical asides; sentence fragments for emphasis; "And"/"But" starters allowed.
- **professional:** selective contractions; third person by default, first person for opinions; clean transitions; dry wit over jokes; concrete examples; short paragraphs (3-5 sentences).
- **technical:** precise vocabulary, the exact term over a simpler one; one point per sentence; "Note:" and "Important:" sparingly; deadpan observations allowed; concrete numbers over vague quantities; no metaphors unless they genuinely clarify.
- **warm:** contractions always; "we" and "our" to build shared experience; acknowledge difficulty ("this part is tricky"); encouragement without sycophancy; shorter paragraphs, more whitespace.
- **blunt:** shortest possible sentences; no hedging; "X is bad. Here's why." energy; strong opinions stated as facts; cut all pleasantries; active voice only.

### Soul Injection Techniques

These make the difference between "clean" and "human":

1. **Have actual opinions.** React, don't just report. "This API design is frustrating" beats "The API has certain limitations."
2. **Calibrate certainty on a spectrum, don't just hedge.** Match word choice to real belief strength. High conviction: "clearly", "no question". Medium: "I think", "in my experience". Genuine doubt: "I'm not sure, but". A real mind moves across this range; AI parks in flat medium confidence. Never stack hedges.
3. **Use specific sensory/experiential details.** Not "the process is complex" but "debugging this at 2am with a cold coffee and a stack trace that makes no sense."
4. **Reference shared human experiences.** "You know that feeling when..." creates connection.
5. **Allow tangents and asides.** A brief digression signals a thinking mind.
6. **Vary paragraph length dramatically.** Four sentences, then one line. Like this.
7. **Use the "imperfect start" technique.** Start mid-thought: "So I was looking at the logs and..."
8. **Break parallel structure occasionally.** Three items with the same grammar, then make the fourth different.
9. **Use callbacks.** Reference something mentioned earlier. "Remember that API I called frustrating? It gets worse."
10. **Self-correct.** "The system handles auth... well, authentication and authorization are separate, but you get the idea." A small correction signals real-time thinking.
11. **End without wrapping up.** Not every piece needs a neat conclusion. Sometimes just stop.

---

## Step 4: Execute Based on Mode

**Masking first (all modes).** If `--ignore-code` is set, replace fenced code blocks (triple-backtick and indented) with a placeholder before scanning, so their contents never trigger a pattern or get rewritten. If `--ignore-quotes` is set, do the same for Markdown block quotes. Restore the masked spans verbatim in the output.

### Mode: `detect`

1. Scan input text for all 53 patterns.
2. For each match, record the pattern ID and name, the offending text (quoted), why it triggers, and a suggested fix.
3. Output a report:

```
## AI Pattern Report

**Patterns found:** 12
**Severity:** HIGH (8+ patterns = heavy AI smell)

| # | Pattern | Text | Fix |
|---|---------|------|-----|
| P3 | Superficial -ing | "ensuring reliability and fostering growth" | Delete or expand with source |
| P7 | AI Vocabulary | "Additionally", "crucial", "landscape" | Replace: "Also", "important", [delete] |
| P13 | Em Dash Overuse | 4 em dashes in 2 paragraphs | Replace 3 with commas |

**Burstiness:** LOW (sentence lengths 18, 19, 17, 20, 18; very uniform)
**Estimated AI probability:** HIGH

### Recommendations
[Prioritized list of changes with the most impact]
```

### Mode: `rewrite`

1. Run detection (Step 2) internally; don't output the report.
2. Apply fixes for every detected pattern.
3. Apply voice injection (Step 3) based on `--voice`.
4. Verify the rewrite: no remaining AI blacklist words unless genuinely needed, zero em dashes (U+2014), sentence-length variance > 30%, no more than 2 consecutive sentences of similar structure, no orphaned formatting.
5. Output the rewritten text with a brief change summary:

```
[Rewritten text here]

---
Changes: Removed 12 AI patterns (3x significance inflation, 2x -ing phrases, 4x AI vocabulary, 2x filler, 1x generic conclusion). Injected casual voice. Varied sentence length from 4 to 38 words. Added 2 specific examples to replace vague claims.
```

### Mode: `edit`

1. Verify `--file` was provided; read the file with the Read tool.
2. Run detection on the contents.
3. If 0 patterns found: "This file reads clean. No AI patterns detected."
4. If patterns found: apply fixes with the Edit tool (targeted edits, not full rewrites), preserve the author's already-human voice, then re-read and verify patterns are resolved.
5. Output a summary of edits made.

---

## Step 5: Final Quality Check

Before presenting output, verify:

1. **Read it aloud mentally.** Does it sound like a person talking, or a press release?
2. **Check the opening.** If it starts with a boring overview sentence, rewrite to hook.
3. **Check the ending.** If it wraps up with a generic positive, cut or replace with a specific.
4. **Count the "delves."** Kill any surviving AI blacklist words.
5. **Zero em dashes.** Search for U+2014; replace with commas, colons, or hyphens.
6. **Sentence length audit.** If you see 3+ sentences of similar length in a row, vary them.
7. **The "who wrote this?" test.** If someone read this, could they picture a specific person behind it? If it could have been written by anyone (or anything), it needs more voice.

### Draft, self-audit, final (cheap quality pass, distinct from `--iterate`)

After the first rewrite, ask one question of your own draft: "What still makes this read as AI?" Answer honestly in two or three bullets, then do one corrective pass targeting exactly those. This metacognitive step is cheaper than a full `--iterate` detect loop and catches the tells a checklist misses. It complements `--iterate`, it does not replace it.

### Scoring rubric (used when `--score` is set)

Compute a 0-100 AI-tell density score. Lower is more human.

| Range | Verdict | What it means |
|:------|:--------|:--------------|
| 0-20 | Pristine | Reads like a specific human wrote it. No detector should flag it. |
| 21-40 | Mostly human | One or two minor tells, easy to clean. |
| 41-60 | Mixed | Half-AI half-human; partial editing likely. |
| 61-80 | AI-leaning | Multiple structural tells; detectors will probably catch it. |
| 81-100 | Pure AI smell | Wholesale chatbot output with no editing. |

Compute as: `score = 4 × patterns_hit + 25 × (1 - burstiness_normalized) + 15 × (vocabulary_blacklist_ratio)`, clamped to 0-100. Show the score on the first line of output before the rewrite.

A model grading its own output in the same session tends to inflate the result. Treat `--score` as a signal, not a verdict: the real gate is an independent pass or a human reader. For a computed, deterministic version of these metrics (burstiness, type-token ratio, sentence-length CoV, trigram repetition, Flesch-Kincaid) plus a CI quality-gate, see the optional `cli/` tool in the repo. The skill core here needs none of it.

### Iterate handling (used when `--iterate N` is set)

After producing the rewrite, re-run Step 2 (Detect) on the output. If patterns_hit > 0 AND iteration_count < N, recurse with the rewritten text as the new input. Stop when patterns_hit == 0 OR iteration_count == N. In the final change summary, note how many iterations ran (e.g., "Converged in 2 iterations").

Worked before/after examples for technical docs, blog posts, and LinkedIn are in [`references/patterns.md`](references/patterns.md).

---

## Always-On Mode

To make an agent write clean by default, not only when you invoke `/humanizer`, bake the core rules into its standing instructions. Ready copy-paste blocks for `CLAUDE.md`, `SOUL.md`, a system prompt, and ChatGPT custom instructions live in [`references/always-on-templates.md`](references/always-on-templates.md). This keeps the skill on-demand while giving power users an always-on option.

---

*Write like a human. Be weird, specific, inconsistent.*
