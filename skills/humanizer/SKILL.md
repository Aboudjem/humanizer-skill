---
name: humanizer
description: Detects 53 AI writing patterns and rewrites text in 5 voice profiles. Use when (1) AI text reads like a chatbot, (2) preparing content for publication, (3) auditing prose for AI tells, (4) editing a file in place. Outputs a 0-100 AI-tell score on demand. Pure Markdown, zero dependencies, no network calls.
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
| Emerging (2026) | 13 | P31 to P43 |
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
- **Jargon and repetition can be correct.** Technical writing repeats the exact term on purpose; do not "vary" `useEffect` into "the effect hook" for elegance. Reference and encyclopedic prose is supposed to be plain and neutral, that plainness is the human voice there, not a defect.
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
- **--mode**: One of `detect`, `rewrite`, `edit`. Default: `rewrite`.
  - `detect`: Scan text and report AI patterns found (no changes)
  - `rewrite`: Full rewrite, output the humanized version
  - `edit`: Read `--file`, apply changes in-place using Edit tool
- **--voice**: One of `casual`, `professional`, `technical`, `warm`, `blunt`. Optional. Adjusts the personality injection. Default: infer from input text register.
- **--file**: Path to a file to humanize. If provided, read the file as input. Combined with `--mode edit`, applies changes in-place.
- **--aggressive**: Flag. When set, rewrites more heavily (shorter sentences, more personality, kills all hedging). Default: balanced.
- **--iterate N**: Optional. Runs detect → rewrite → detect up to N times (N <= 3). Stops early when the detection report finds zero patterns. Default: 1 (single pass).
- **--score**: Flag. When set, prepends a `[Score: NN/100]` header before output where NN is the estimated AI-tell density (0 = pristine human, 100 = maximum AI smell). Use the rubric in Step 4. Works in all modes.
- **--purpose**: Optional. One of `essay`, `email`, `marketing`, `technical`, `general`. Layered content-type rules on top of `--voice`:
  - `essay`: no contractions, formal headings, structured arguments
  - `email`: greetings allowed, signoff allowed, no markdown
  - `marketing`: short paragraphs, concrete benefits, one clear CTA at end
  - `technical`: code blocks preserved, precise jargon retained, numbers over adjectives
  - `general`: no purpose-specific overrides (default)
- **--openings N**: Optional. Generate N maximally-different opening hooks and surface the strongest one (see Step 3, Opening tournament). Default: off.
- **--ignore-code**: Flag. Mask fenced code blocks (triple-backtick and indented) before detection and scoring, so sample code does not inflate the score or get rewritten. Default: off.
- **--ignore-quotes**: Flag. Mask Markdown block quotes (lines starting with `>`) before detection and scoring, so pasted AI examples the author is critiquing do not count against them. Default: off.

**Auto-load brand context.** Before parsing further, check for `humanizer-context.md` in the current working directory using the Read tool. If it exists, load it as additional voice guidance (brand samples, banned phrases, preferred terms). Treat its contents as a personal extension of the `--voice` profile. If it doesn't exist, proceed without warning; this is opt-in.

Store parsed values. Proceed to Step 2.

---

## Step 2: Detect AI Patterns

Scan the input text for ALL of the following patterns. Track each match with its location and category.

### CONTENT PATTERNS

**P1: Significance Inflation.** Puff up importance by claiming arbitrary facts represent broader trends. Fix: State what the thing actually is or does. Cut the commentary about what it "represents." Triggers: stands/serves as, is a testament/reminder, vital/significant/crucial/pivotal/key role/moment, underscores/highlights importance, reflects broader, symbolizing ongoing/enduring/lasting, contributing to the, setting the stage, marking/shaping the, represents a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted.

> **AI:** established in 1989, marking a pivotal moment in the evolution of regional statistics  
> **Human:** established in 1989 to collect regional statistics

**P2: Notability Name-Dropping.** Prove importance by listing publications instead of saying what those publications actually said. Fix: Pick one source and say what it reported. Or cut the name-dropping entirely. Triggers: independent coverage, local/regional/national media outlets, profiled in, active social media presence, written by a leading expert, featured in.

> **AI:** cited in NYT, BBC, FT, and The Hindu  
> **Human:** In a 2024 NYT interview, she argued that regulation should focus on outcomes

**P3: Superficial -ing Phrases.** Tack present participle phrases onto sentences to fake depth. It's the written equivalent of nodding sagely while saying nothing. Fix: Delete the -ing clause. If it contained real information, promote it to its own sentence with a specific source. Triggers: highlighting/underscoring/emphasizing.", ensuring.", reflecting/symbolizing.", contributing to.", cultivating/fostering.", encompassing.", showcasing."

> **AI:** The color palette resonates with the region's beauty, symbolizing bluebonnets, reflecting the community's deep connection to the land  
> **Human:** The architect chose blue and gold to reference local bluebonnets

**P4: Promotional Language.** Default to travel-brochure language. They can't describe a place without "nestling" it somewhere "vibrant." Fix: Replace adjectives with facts. What specifically makes it notable? Triggers: boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning, cutting-edge, seamless, robust, world-class, state-of-the-art.

> **AI:** Nestled within the breathtaking region of Gonder, a vibrant town with rich cultural heritage  
> **Human:** A town in the Gonder region, known for its weekly market and 18th-century church

**P5: Vague Attributions.** Invent phantom authorities to give opinions weight. Fix: name the specific expert/paper/report. If you can't, delete the claim. Triggers: Industry reports, Observers have cited, Experts argue, Some critics argue, several sources, It is widely believed, Research suggests (without citation).

> **AI:** Experts believe it plays a crucial role in the regional ecosystem  
> **Human:** A 2019 Chinese Academy of Sciences survey found 12 endemic fish species

**P6: Formulaic Challenges Sections.** Generate "challenges" sections from nothing. The template: despite [good thing], [vague problems]. Despite these, [optimistic platitude]. Fix: State specific problems with dates and data. Or cut the section if there's nothing concrete to say. Triggers: Despite its." Faces several challenges.", Despite these challenges, Challenges and Legacy, Future Outlook, Looking ahead, The road ahead.

> **AI:** Despite its prosperity, faces challenges typical of urban areas. Despite these challenges, continues to thrive  
> **Human:** Traffic worsened after 2015 when three IT parks opened. A stormwater project started in 2022

**P7: AI Vocabulary Words.** These words appear 3-10x more frequently in post-2023 text. They often cluster together. "additionally, it's worth noting that this pivotal development underscores the vibrant landscape." Triggers: Additionally, align with, bolster, crucial, delve, emphasizing, enduring, enhance, foster/fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective before noun), landscape (abstract), leverage, multifaceted, notably, pivotal, realm, showcase, tapestry (abstract), testament, underscore (verb), utilize, valuable, vibrant, moreover, furthermore, it's worth noting, it's important to note, in terms of, at the end of the day.

**P8: Copula Avoidance.** Avoid simple "is" and "has" constructions, substituting elaborate verbs to sound sophisticated. Fix: Use "is", "are", "has", "was". Simple copulas are not boring; they're clear. Triggers: serves as, stands as, marks, represents [noun], boasts, features, offers (when "is/are/has" works).

> **AI:** Gallery 825 serves as the exhibition space  
> **Human:** Gallery 825 is the exhibition space
### LANGUAGE & STYLE PATTERNS

**P9: Negative Parallelisms.** Once is fine. Twice is a pattern. Three times is a chatbot. Fix: State the point directly without the theatrical build-up. Triggers: "Not only X but Y", "It's not just about X, it's Y", "It's not merely X, it's Y", "X isn't just Y, it's Z".

> **AI:** It's not just a song, it's a statement  
> **Human:** The heavy beat adds to the aggressive tone

**P10: Rule of Three.** Group things in threes to sound authoritative. Humans don't always think in triads. Fix: Use the natural number. Sometimes one. Sometimes four. Two is underrated. Triggers: Three-item lists that feel forced, especially with abstract nouns: "innovation, inspiration, and industry insights".

> **AI:** innovation, inspiration, and industry insights  
> **Human:** talks and panels, plus time for networking

**P11: Synonym Cycling (Elegant Variation).** Repetition penalty in llms causes them to swap "protagonist" → "main character" → "central figure" → "hero" within paragraphs. Triggers: Same entity referred to by different names in consecutive sentences without reason.

**P12: False Ranges.**  Triggers: "From X to Y" where X and Y aren't on a meaningful spectrum.

**P13: Em Dash Ban.** Overuse em dashes mimicking punchy sales/editorial writing. It's the single most common ai formatting tell. Triggers: Any em dash (U+2014) anywhere in the text. Zero tolerance.

**P14: Boldface/Formatting Overuse.** Mechanically emphasize terms. Humans use bold sparingly, once per section, not on every noun. Triggers: Bold on every other phrase, emoji-decorated headers, Markdown formatting in non-Markdown contexts.

**P15: Structured List Syndrome.**  Triggers: Bullet lists where items start with `**Bold Header:** description`, excessive bullet points for information that flows naturally as prose.

**P16: Title Case in Headings.**  Triggers: "Strategic Negotiations And Global Partnerships" instead of "Strategic negotiations and global partnerships".

**P17: Curly Quotes and Typographic Tells.** Chatgpt specifically uses curly quotes. Claude uses straight quotes. These are fingerprints. Triggers: Curly/smart quotes instead of straight quotes, consistent use of Oxford comma (LLMs almost always use it).

**P18: Formal Register Overuse.** Default to the most formal register in any language. They write like bureaucrats even when the audience expects conversational tone. Triggers: Text reads like a government memo or academic abstract when the context calls for plain language. Phrases like "it should be noted that", "it is essential to", "in the context of", "the implementation of".
### COMMUNICATION PATTERNS

**P19: Chatbot Artifacts.**  Triggers: "I hope this helps", "Of course!", "Certainly!", "You're absolutely right!", "Would you like me to."", "Let me know if."", "Here is a."".

**P20: Knowledge-Cutoff Disclaimers.**  Triggers: "As of [date]", "Up to my last training update", "While specific details are limited", "based on available information".

**P21: Sycophantic Tone.**  Triggers: "Great question!", "That's an excellent point!", "You raise a very important issue", "Absolutely!".
### FILLER & HEDGING PATTERNS

**P22: Filler Phrases.** 
**P23: Excessive Hedging.**  Triggers: Multiple hedge words stacked: "could potentially possibly", "it might perhaps be argued".

**P24: Generic Positive Conclusions.**  Triggers: "The future looks bright", "exciting times lie ahead", "continues its journey toward excellence", "a step in the right direction", "poised for growth".
### BONUS PATTERNS

**P25: Hallucination Markers.**  Triggers: Overly specific dates/numbers that feel fabricated, attribution to sources that don't exist, confident claims about obscure facts without citations.

**P26: Perfect/Error Alternation.**  Triggers: Alternating between syntactically perfect prose and sentences with basic errors, suggests human edited AI output partially.

**P27: Question-Format Section Titles.** Trained on faq content default to question headings. Human editors rarely do this in long-form content. Triggers: "What makes X unique?", "Why is Y important?", "How does Z work?".

**P28: Markdown Bleeding.**  Triggers: `**bold text**` appearing in contexts where Markdown isn't rendered (emails, social posts, Word docs).

**P29: The "Comprehensive Overview" Opening.**  Triggers: "This comprehensive guide/overview/analysis covers."", "In this article, we will explore."", "Let's dive into."".

**P30: Uniform Sentence Length.** Produce statistically average sentence lengths. Humans vary wildly: 3 words to 40+. Triggers: Every sentence in a paragraph is between 15-25 words. No short punches. No long flowing thoughts.
### EMERGING PATTERNS (2026)

Deep dives (extended "what's happening" notes, extra examples, and full sources) for every pattern live in `references/patterns.md`, loaded on demand. A provisional native-Chinese appendix is in `references/patterns.zh.md`. This file is standalone and needs neither.

**P31: Elegant Variation (Noun-Phrase Cycling).** Repetition penalties push models to swap in ever more elaborate descriptors for the same entity. Distinct from P11 (word-level synonyms); this is whole noun phrases. Fix: pick the clearest term and repeat it. Humans repeat words naturally. Triggers: same referent named 3+ different ways in a paragraph ("the artist", "the non-conformist painter", "the visionary creator").

> **AI:** Yankilevsky, alongside other non-conformist artists, faced obstacles. The visionary creator's distinctive artistic journey continued.
> **Human:** Yankilevsky and other non-conformist artists faced obstacles. His work continued.

**P32: Collaborative Communication Leaking.** Conversational framing meant for the user gets pasted into published content. Distinct from P19 (identity disclosure); this is instructional framing. Fix: delete the meta-commentary; start with the actual content. Triggers: "In this article, we will explore", "Let me walk you through", "Here's what you need to know", reader-directed instructions.

> **AI:** In this article, we will explore the unique characteristics that make this framework worth using.
> **Human:** This framework solves three problems that React Router doesn't.

**P33: Placeholder Text / Mad Libs Templates.** Fill-in-the-blank templates the user forgot to complete. Near-definitive AI tells. Fix: fill in the real information or delete the placeholder. Triggers: `[Your Name]`, `[Describe the section]`, `[INSERT SOURCE URL]`, `2025-XX-XX`, square-bracketed instructions.

> **AI:** Dear [Recipient], I am writing regarding [Topic].
> **Human:** (Either fill it in or don't send it.)

**P34: Chatbot Reference Markup Leaking.** Internal citation tokens preserved when copy-pasting from ChatGPT, Grok, or Perplexity. Near-definitive proof of tool use. Fix: delete all markup; replace with a real reference if the citation mattered. Triggers: `citeturn0search0`, `contentReference[oaicite:0]{index=0}`, `oai_citation`, `[attached_file:1]`, orphan footnote characters.

> **AI:** The school has been recognized as an International Fellowship Centre. citeturn0search1
> **Human:** The school has been recognized as an International Fellowship Centre.

**P35: UTM Source Parameters from AI Tools.** ChatGPT, Copilot, and Grok append tracking parameters to URLs they generate. Fix: strip UTM parameters from all URLs. Triggers: `utm_source=chatgpt.com`, `utm_source=openai`, `utm_source=copilot.com`, `referrer=grok.com`.

> **AI:** `https://example.com/article?utm_source=chatgpt.com`
> **Human:** `https://example.com/article`

**P36: Sudden Style/Register Shift.** AI-written portions carry a different voice and error profile than the human-written ones. Catches mixed authorship. Fix: hold one register throughout; rewrite the AI sections to match the author. Triggers: perfect formal English next to casual text with errors, American spelling appearing mid-piece from a non-American author, thesis prose inside casual notes.

> **AI:** yeah so the bug is in line 42 lol. The aforementioned implementation exhibits suboptimal performance characteristics.
> **Human:** yeah so the bug is in line 42. The loop allocates on every iteration instead of reusing the buffer.

**P37: Overattribution / Source-Listing as Content.** Proving importance by listing where a subject was covered instead of what the coverage said. Distinct from P2 (famous-name dropping); this treats source lists as proof. Fix: pick one source and say what it reported, or cut the list. Triggers: "Featured in [A], [B], and other media outlets", "Has been cited in", "Maintains an active social media presence".

> **AI:** Her insights have been featured in Wired, Refinery29, and other prominent media outlets.
> **Human:** Wired profiled her 2024 research on algorithmic bias in hiring software.

### COMMUNITY-DISCOVERED PATTERNS (2026)

Surfaced from HackerNews, Substack, and Wikipedia's editorial guideline after the initial catalog. Full sources in `references/patterns.md`.

**P38: Paragraph-Reshuffling Immunity.** Parallel blocks instead of an unfolding argument. Test: can you swap paragraph 2 and 4 without breaking the piece? If yes, it's AI. Fix: make paragraph N+1 depend on something concrete in paragraph N; merge or cut interchangeable paragraphs. Triggers: self-contained mini-theses that never build on each other. Source: [HackerNews, May 2025](https://news.ycombinator.com/item?id=46646939).

> **AI:** Remote work improves balance. Many workers prefer it. Studies show productivity rises. Commuting costs drop. Office costs decline too.
> **Human:** Remote work's flexibility is the obvious sell. The harder question is what you lose: the hallway conversation that turns into your best idea, the body language that tells you someone is drowning before they say anything.

**P39: Paragraph-Closing "Whether" Summary Sentences.** Paragraph endings written as local SEO-style recaps. Fix: cut the closing "whether" sentence; end on the strongest specific point. Triggers: paragraphs ending "Whether you...", "Whether they...", "Whether it's...". Source: [Gone Travelling Productions, Aug 2025](https://gonetravellingproductions.com/2025/08/20/ai-giveaways-in-writing/).

> **AI:** Tokyo offers everything from Michelin-starred restaurants to humble ramen stalls. Whether you prefer fine dining or street food, Tokyo has something for every palate.
> **Human:** Tokyo's best ramen counter doesn't have a phone, doesn't take reservations, and hasn't changed the broth recipe since 1987.

**P40: Symbolic Gloss / Meaning-Telling.** Narrating the meaning of a fact instead of trusting the fact. Distinct from P1 (pivotal/testament framing); this is the interpretive gloss telling readers what to feel. Fix: cut the symbol sentence; state the fact and let the reader interpret. Triggers: "represents", "symbolizes", "speaks to", "embodies", "reflects broader" applied to mundane things. Source: [Writewithai Substack, 2025](https://writewithai.substack.com/p/10-dead-giveaways-your-content-screams).

> **AI:** The closed factory represents the decline of American manufacturing and speaks to broader anxieties about post-industrial identity.
> **Human:** The factory closed in 2009. Three hundred jobs. The town's high school dropped football the following year.

**P41: Infomercial Engagement Hooks.** Fake dramatic pauses imported from social-media-optimized writing. Distinct from P19 and P21. Fix: delete the hook line; let the next paragraph make its point. If you want the rhythm break, use a short declarative fragment. Triggers: "The catch?", "The kicker?", "Here's the thing.", "The brutal truth?", "Sound familiar?", "Want to know the best part?". Source: [Writewithai](https://writewithai.substack.com/p/10-dead-giveaways-your-content-screams).

> **AI:** Most people abandon goals in week three. The brutal truth? They lack a clear failure threshold.
> **Human:** Most people abandon goals in week three. The ones who don't usually make the failure threshold explicit before they start.

**P42: Erratic Inline Bolding.** Patternless bolding: the model bolds words it decided felt important, with no consistent rule. Distinct from P14 (systematic overuse). Fix: strip inline bold except glossary terms and UI labels; let sentence structure carry emphasis. Triggers: bold spans of 1-4 words mid-paragraph with no shared category. Source: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

> **AI:** Remote work has **fundamentally changed** the way companies operate, with **many employees** now preferring **flexible arrangements**.
> **Human:** Remote work has fundamentally changed how companies operate. Most employees now want flexible arrangements.

**P43: The Treadmill Effect (Low Information Density).** A 500-word AI section may hold 100 words of new information and 400 of restatement. Humans advance; AI circles. Distinct from P22 and P30. Fix: apply the "what's actually new here?" test per sentence; delete pure rephrasings. Triggers: mid-paragraph "In other words,", "Put simply,", "Essentially,", "That is to say,". Source: [aidetectors.io](https://www.aidetectors.io/blog/spotting-ai-writing-patterns).

> **AI:** The system is fast. In other words, it performs well. Put simply, speed is one of its strengths.
> **Human:** The system answers in 40ms at p99, about 20x faster than the tool it replaced.

### CRAFT AND FORENSIC PATTERNS (P44-P53)

Novel patterns adopted from the wider humanizer ecosystem (blader, stop-slop, brandonwise) and the HC3 corpus (arXiv 2301.07597). Extended notes and attribution in `references/patterns.md`.

**P44: False Agency.** Inanimate things performing human actions or making decisions. Fix: name the human actor, or address the reader as "you". Triggers: "the data tells us", "the market rewards", "the decision emerges", "a complaint becomes a fix", abstractions as the subject of a willed verb.

> **AI:** The market rewards companies that listen.
> **Human:** Customers spend more with companies that answer support tickets within an hour.

**P45: Narrator-from-a-Distance.** Floating above the scene in detached third person. Fix: put the reader in the room; "you" beats "people". Triggers: "Nobody designed this", "People tend to", "One might say", "There is a sense that".

> **AI:** People tend to underestimate how much testing matters.
> **Human:** You will underestimate how much testing matters, right up until a Friday deploy pages you at 2am.

**P46: Diff-Anchored Writing.** Docs or comments that narrate a change instead of describing the thing as it is. Fix: describe the current state; delete the edit history. Triggers: "was added to", "now uses", "has been updated to", "replaces the old", "previously" in reference docs.

> **AI:** This function was refactored to replace the old callback approach with async/await.
> **Human:** This function fetches the user and returns a promise.

**P47: Hyphenated-Pair Overuse.** Uniform hyphenation even after the noun, where humans open the compound. Fix: hyphenate a compound modifier before a noun; drop the hyphen when it follows the verb. Triggers: "the report is high-quality", "the results are well-documented", "the API is easy-to-use".

> **AI:** The results are high-quality and the pipeline is state-of-the-art.
> **Human:** The results are high quality and the pipeline is genuinely new.

**P48: Aphorism Formulas.** Fake-profound templates standing in for a concrete claim. Fix: cut the aphorism; state the actual point. Triggers: "X is the new Y", "the currency/language/architecture of", "not a X but a Y", "X is where Y meets Z".

> **AI:** Data is the new oil, and attention is the currency of the modern web.
> **Human:** Ad networks pay about $8 per thousand views, so publishers chase pageviews.

**P49: Fragmented Headers.** A heading followed by a single line that just restates the heading. Fix: cut the restating line or replace it with a real fact. Triggers: H2/H3 immediately followed by one sentence echoing the heading words, or "This section covers X."

> **AI:** ## Performance / Performance is important for a good user experience.
> **Human:** ## Performance / The dashboard renders 10,000 rows in 40ms because it virtualizes the list.

**P50: Passive / Subjectless Constructions.** Agentless passive that hides who acts. Fix: name the actor and use active voice. Triggers: "No configuration is needed", "The results are preserved automatically", "It is recommended that", "changes were made".

> **AI:** The cache is invalidated automatically when the config is changed.
> **Human:** The file watcher clears the cache whenever you edit the config.

**P51: Reasoning-Chain Artifacts.** Chain-of-thought scaffolding from reasoning models leaking into the final text. Fix: delete the scaffolding; keep only the conclusion in the author's voice. Triggers: "Let me think", "Step 1:", "Breaking this down", "First, I'll", "To answer this, we need to", numbered thinking that was meant to stay internal.

> **AI:** Let me break this down. First, we need to understand the users. Step 1: identify who hits this endpoint.
> **Human:** Ops engineers hit this endpoint about 400 times a day. That is who we are designing for.

**P52: Unicode Obfuscation.** Invisible or look-alike characters inserted to dodge detectors. Fix: strip zero-width and control characters, normalize to plain text (NFC). Good writing does not need to hide. Triggers: zero-width space (U+200B), zero-width joiner (U+200D), soft hyphen (U+00AD), dense non-breaking spaces (U+00A0), Cyrillic or Greek homoglyphs standing in for Latin letters.

> **AI:** Text seeded with zero-width spaces between letters so a detector reads gibberish.
> **Human:** The same text, cleaned to plain characters, because the goal is good writing, not evasion.

**P53: Hedged-Enumeration Openers.** Opening a paragraph or answer by announcing a vague list instead of committing to an answer. Fix: give the specific answer first; drop the throat-clearing. Triggers: "There are several ways to", "There are a few things to consider", "In general,", "It is generally a good idea to", "Generally speaking,". Source: HC3 indicating-words, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597).

> **AI:** There are several ways to speed up a slow query. In general, it is a good idea to consider indexing.
> **Human:** Add an index on user_id. That one change took the query from 900ms to 12ms.

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
- Choosing the second or third word that comes to mind, not the first (the most statistically likely, the one AI would pick)
- Using domain-specific jargon or slang appropriate to the audience
- Making unexpected analogies from personal experience
- Occasionally using informal transitions ("Anyway,", "So here's the thing:", "Look,", "Thing is,")

### Rewrite craft (run these during a rewrite)

These turn a clean rewrite into a human one. Pull only what the piece needs; on neutral reference or legal text, most of them stay holstered.

**Voice Read (do this before rewriting).** Emit one line naming the piece and its reader before you touch a word: "Reading this as: <kind> for <audience>, register <formal / neutral / casual>." It anchors every choice that follows. Skip it only in `edit` mode on a file that already has a settled voice.

**Anti-Default Discipline.** Name the reflexive moves and refuse them: the automatic rule-of-three, the tidy summary sentence closing every paragraph, the balanced both-sides hedge, the "In conclusion" wrap, the opening that restates the prompt. None fire on their own. Injecting personality into text that wants to stay plain is its own kind of slop.

**Position engine (give it teeth).** The deepest AI tell is text with no stake in its claims. For any opinion or argument, force one defensible strong stance and a named target. An opinion no one could argue against is not an opinion. Replace "there are pros and cons" with a claim someone could disagree with, and say what you are arguing against. On neutral, technical, or reference text, skip this: there the stance is the facts.

**Concretizer pass.** Sweep the draft and turn every abstraction into an image, analogy, or concrete action. "The process is complex" becomes the actual steps. "Improves performance" becomes "cuts p99 latency from 900ms to 40ms". A sentence that could describe anything describes nothing.

**Opening tournament (`--openings N`).** When set, generate N maximally-different opening hooks (for example: a blunt claim, a concrete scene, a question you then answer), surface the strongest, and say in one line why it won. The first three lines carry the piece.

### Voice Profiles

Apply based on `--voice` flag (or infer from input):

#### casual
- Contractions always (it's, don't, won't, can't, wouldn't, that's, here's)
- First person when appropriate ("I think", "from what I've seen")
- Informal transitions ("So", "Anyway", "Look", "Here's the thing")
- Occasional parenthetical asides (like this one)
- Self-deprecating humor where it fits
- Sentence fragments for emphasis. Like this.
- Allowed: starting sentences with "And" or "But"

#### professional
- Contractions: selective (use "it's" and "don't" but not "wouldn't've")
- Third person default, first person for opinions/experience
- Clean transitions without being stiff
- Dry wit over jokes
- Concrete examples over abstract claims
- Short paragraphs (3-5 sentences max)

#### technical
- Precise vocabulary: use the exact term, don't simplify for the sake of it
- Code-like clarity: each sentence makes one point
- "Note:" and "Important:" sparingly, not as decoration
- Allowed: dry, deadpan observations about technical absurdity
- No metaphors unless they genuinely clarify (most don't)
- Concrete numbers > vague quantities

#### warm
- Contractions always
- "We" and "our" to build shared experience
- Acknowledge difficulty ("this part is tricky", "I struggled with this too")
- Encouragement without sycophancy
- Personal anecdotes when relevant
- Shorter paragraphs, more whitespace

#### blunt
- Shortest possible sentences
- No hedging whatsoever
- "X is bad. Here's why." energy
- Strong opinions stated as facts, qualified only when genuinely uncertain
- Cut all pleasantries
- Active voice exclusively

### Soul Injection Techniques

These make the difference between "clean" and "human":

**1. Have actual opinions.** Don't just report. React. "This API design is frustrating" is more human than "The API has certain limitations."

**2. Calibrate certainty on a spectrum, don't just hedge.** Match word choice to real belief strength instead of adding blanket qualifiers. High conviction: "clearly", "no question", "this is wrong". Medium: "I think", "probably", "in my experience". Genuine doubt: "I'm not sure, but", "it might be that". A real mind moves across this range; AI parks in flat medium confidence. Never stack hedges ("could potentially possibly").

**3. Use specific sensory/experiential details.** Not "the process is complex" but "debugging this at 2am with a cold cup of coffee and a stack trace that makes no sense."

**4. Reference shared human experiences.** "You know that feeling when."" creates connection.

**5. Allow tangents and asides.** A brief digression signals a thinking mind, not an algorithm.

**6. Vary paragraph length dramatically.** Four sentences, then one line. Like this.

**7. Use the "imperfect start" technique.** Start mid-thought: "So I was looking at the logs and."" or "Here's what nobody tells you about.""

**8. Break parallel structure occasionally.** Three items with the same grammar, then make the fourth different. Humans aren't that consistent.

**9. Use callbacks.** Reference something mentioned earlier. "Remember that API design I called frustrating? It gets worse."

**10. Self-correct.** "The system handles auth." well, authentication and authorization are separate, but you get the idea." A small correction signals a mind thinking in real time.

**11. End without wrapping up.** Not every piece needs a neat conclusion. Sometimes just stop.

---

## Step 4: Execute Based on Mode

**Masking first (all modes).** If `--ignore-code` is set, replace fenced code blocks (triple-backtick and indented blocks) with a placeholder before scanning, so their contents never trigger a pattern or get rewritten. If `--ignore-quotes` is set, do the same for Markdown block quotes (`>` lines), so pasted AI examples the author is critiquing do not count against the score. Restore the masked spans verbatim in the output.

### Mode: `detect`

1. Scan input text for all 53 patterns
2. For each match, record:
   - Pattern ID and name (e.g., "P7: AI Vocabulary")
   - The offending text (quoted)
   - Why it triggers (brief explanation)
   - Suggested fix
3. Output a report:

```
## AI Pattern Report

**Patterns found:** 12
**Severity:** HIGH (8+ patterns = heavy AI smell)

| # | Pattern | Text | Fix |
|---|---------|------|-----|
| P3 | Superficial -ing | "."ensuring reliability and fostering growth" | Delete or expand with source |
| P7 | AI Vocabulary | "Additionally", "crucial", "landscape" | Replace: "Also", "important", [delete] |
| P13 | Em Dash Overuse | 4 em dashes in 2 paragraphs | Replace 3 with commas |
|." |." |." |." |

**Burstiness score:** LOW (sentence lengths: 18, 19, 17, 20, 18; very uniform)
**Estimated AI probability:** HIGH

### Recommendations
[Prioritized list of changes that would have the most impact]
```

### Mode: `rewrite`

1. Run detection (Step 2) internally; don't output the report
2. Apply fixes for every detected pattern
3. Apply voice injection (Step 3) based on `--voice` flag
4. Verify the rewrite by checking:
   - No remaining AI vocabulary blacklist words (unless genuinely needed)
   - Zero em dashes (U+2014). Replace with commas, colons, or hyphens
   - Sentence length variance > 30% (burstiness check)
   - No more than 2 consecutive sentences with similar structure
   - No orphaned formatting (bold, emoji, Markdown in wrong context)
6. Output the rewritten text with a brief change summary:

```
[Rewritten text here]

---
Changes: Removed 12 AI patterns (3x significance inflation, 2x -ing phrases, 4x AI vocabulary, 2x filler, 1x generic conclusion). Injected casual voice. Varied sentence length from 4 to 38 words. Added 2 specific examples to replace vague claims.
```

### Mode: `edit`

1. Verify `--file` was provided
2. Read the file using the Read tool
3. Run detection on file contents
4. If 0 patterns found: "This file reads clean. No AI patterns detected."
5. If patterns found:
   - Apply fixes using the Edit tool (targeted edits, not full rewrites)
   - Make minimal changes; preserve author's existing voice where it's already human
   - After editing, re-read the file and verify patterns are resolved
6. Output summary of edits made

---

## Step 5: Final Quality Check

Before presenting output, verify:

1. **Read it aloud mentally.** Does it sound like a person talking? Or a press release?
2. **Check the opening.** Does it start with a boring overview sentence? Rewrite to hook.
3. **Check the ending.** Does it wrap up with a generic positive? Cut or replace with specific.
4. **Count the "delves."** If any AI blacklist words survived, kill them now.
5. **Zero em dashes.** Search for U+2014. If any exist, replace with commas, colons, or hyphens.
6. **Sentence length audit.** If you see 3+ sentences of similar length in a row, vary them.
7. **The "who wrote this?" test.** If someone read this, could they picture a specific person behind it? If it could have been written by anyone (or anything), it needs more voice.

### Draft, self-audit, final (cheap quality pass, distinct from `--iterate`)

After the first rewrite, ask one question of your own draft: "What still makes this read as AI?" Answer honestly in two or three bullets, then do one corrective pass targeting exactly those. This metacognitive step is cheaper than a full `--iterate` detect loop and catches the tells a checklist misses. It does not replace `--iterate`; it complements it.

### Scoring rubric (used when `--score` is set)

Compute a 0-100 AI-tell density score on the text. Lower is more human.

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

---

## Examples

### Example 1: Technical Documentation

**Before (AI-heavy):**
> This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience. Additionally, it features a pivotal role-based access control system that serves as a testament to our commitment to security. Not only does this ensure data protection, but it also fosters a culture of trust within the organization, highlighting the enduring importance of cybersecurity in today's rapidly evolving digital landscape.

**After (human, --voice technical):**
> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role: admin, editor, and viewer each see different data. The token rotation logic is in `src/auth/refresh.ts` if you need to change the expiry windows.

**What changed:** Replaced "leverages cutting-edge JWT technology" with "uses JWTs." Added specific details (expiry times, file paths). Killed 9 AI vocabulary words.

### Example 2: Blog Post

**Before (AI-heavy):**
> In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history, one that underscores the intricate interplay between innovation and artistic expression. As we delve deeper into this fascinating realm, it becomes crucial to understand the multifaceted implications of AI-generated content. Industry experts highlight that this transformation will have an enduring impact, fostering new forms of collaboration between humans and machines. The future looks incredibly bright for those who embrace this change.

**After (human, --voice casual):**
> I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are technically impressive. I got a portrait last week that looked better than anything I could paint in a year. But there's something missing. It's like eating a perfect-looking meal that has no flavor. My artist friends are split: half are using these tools daily, half refuse to touch them. I don't think either side is wrong. What I do know is that my own creative process has changed since I started using them, in ways I'm still figuring out.

**What changed:** Replaced abstract commentary with personal experience. Added genuine uncertainty. Concrete analogy (perfect meal, no flavor). Sentence lengths: 8 to 31 words.

### Example 3: Social Media / LinkedIn

**Before (AI-heavy):**
> Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. I'm deeply grateful to my amazing network for their unwavering support. The team at TechCorp is truly world-class, and I'm committed to leveraging my expertise to drive innovation and foster growth. Looking forward to this exciting chapter! #NewBeginnings #Innovation #Leadership #Grateful

**After (human, --voice professional):**
> Started a new job at TechCorp this week. I'm leading their developer tools team, 12 engineers building internal tooling that currently serves about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out. Nervous and excited in roughly equal measure. If anyone has advice on the first 90 days in an eng leadership role, I'm all ears.

**What changed:** No emojis, no hashtags. Replaced "pivotal new role" with what the role actually is. Added specific details (team size, user count). Coffee machine line adds humanity. Closing asks for help. Vulnerable, engaging.

---

## Always-On Mode

To make an agent write clean by default, not only when you invoke `/humanizer`, bake the core rules into its standing instructions. Ready copy-paste blocks for `CLAUDE.md`, `SOUL.md`, a system prompt, and ChatGPT custom instructions live in `references/always-on-templates.md`. This keeps the skill on-demand while giving power users an always-on option.

---

*Write like a human. Be weird, specific, inconsistent.*
