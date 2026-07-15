# Pattern deep dives and provenance

Loaded on demand. The core `SKILL.md` is standalone and does not need this file. This is the depth behind the compact catalog: the "what's happening" notes, the full trigger lists, the before/after examples for every pattern, and the sources behind the 2026 emerging set (P31-P43).

The core catalog (P1-P30) is derived mostly from [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## Contents

- [The craft and forensic set (P44-P53)](#the-craft-and-forensic-set-p44-p53)
- [Emerging patterns (P31-P43): extended notes](#emerging-patterns-p31-p43-extended-notes)
- [The HC3 corpus](#the-hc3-corpus-grounding-for-p53-and-the-science-claims)
- [Coverage against Wikipedia](#coverage-against-wikipedia-signs-of-ai-writing)
- [Full trigger lists (P1, P4, P7)](#full-trigger-lists)
- [Before and after examples (P1-P53)](#before-and-after-examples)
- [Worked examples (technical, blog, LinkedIn)](#worked-examples)

---

## The craft and forensic set (P44-P53)

These ten extend the catalog with craft-level and forensic tells, novel relative to the P1-P43 set (cross-checked to avoid duplicates). P44-P52 target higher-order writing habits and copy-paste artifacts; P53 is grounded in the HC3 corpus.

| ID | Pattern |
|:---|:--------|
| P44 | False Agency |
| P45 | Narrator-from-a-Distance |
| P46 | Diff-Anchored Writing |
| P47 | Hyphenated-Pair Overuse |
| P48 | Aphorism Formulas |
| P49 | Fragmented Headers |
| P50 | Passive / Subjectless |
| P51 | Reasoning-Chain Artifacts |
| P52 | Unicode Obfuscation |
| P53 | Hedged-Enumeration Openers (HC3 corpus, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597)) |

---

## Emerging patterns (P31-P43): extended notes

**P31 Elegant Variation (Noun-Phrase Cycling).** LLMs carry a repetition penalty that discourages reusing the same noun phrase, so they substitute increasingly elaborate descriptors for one entity. This is distinct from P11 (Synonym Cycling), which is word-level. P31 is whole-noun-phrase cycling for the same subject. The fix is counterintuitive to a model: pick the clearest term and repeat it, because humans repeat words without anxiety.

**P32 Collaborative Communication Leaking.** The model was producing advice or correspondence for the user, and the user pasted it into a published piece without stripping the conversational framing. Distinct from P19 (identity disclosure like "I hope this helps"); P32 is instructional framing ("In this article, we will explore") that belongs in a chat, not an article.

**P33 Placeholder Text / Mad Libs.** Fill-in-the-blank templates the user forgot to complete. Among the most definitive tells because no careful human ships `[Your Name]`. Search for square-bracketed instructions and `XXXX`-style date stubs.

**P34 Chatbot Reference Markup Leaking.** Tool-specific citation tokens preserved on copy-paste: `citeturn0search0` (ChatGPT), `contentReference[oaicite:0]{index=0}`, `oai_citation`, Grok cards. Near-definitive proof of tool use because these strings exist nowhere else.

**P35 UTM Source Parameters.** ChatGPT, Copilot, and Grok append tracking parameters to URLs they emit (`utm_source=chatgpt.com`). Strip them.

**P36 Sudden Style/Register Shift.** Catches mixed human and AI authorship: the AI section has a different voice, formality, and error profile than the human section. Look for graduate-thesis prose dropped into casual notes, or American spelling appearing mid-piece from a non-American author.

**P37 Overattribution.** Proving importance by listing where a subject was covered, rather than what the coverage said. Distinct from P2 (dropping famous names). Fix: pick one source and summarize what it actually reported.

**P38 Paragraph-Reshuffling Immunity.** LLMs generate parallel self-contained blocks instead of an unfolding argument. The test: can you swap paragraphs 2 and 4 without breaking the piece? If yes, it reads as AI. Source: [HackerNews thread](https://news.ycombinator.com/item?id=46646939).

**P39 Paragraph-Closing "Whether" Summaries.** SEO-blog habit of ending each paragraph with a local recap ("Whether you prefer X or Y..."). Humans rarely close flowing prose this way. Source: [Gone Travelling Productions, Aug 2025](https://gonetravellingproductions.com/2025/08/20/ai-giveaways-in-writing/).

**P40 Symbolic Gloss / Meaning-Telling.** The interpretive layer that tells readers what to feel ("the closed factory represents the decline of..."). Distinct from P1 (pivotal/testament inflation). Fix: state the fact, let the reader interpret. Source: [Writewithai Substack, 2025](https://writewithai.substack.com/p/10-dead-giveaways-your-content-screams).

**P41 Infomercial Engagement Hooks.** Fake dramatic pauses from social-media-optimized writing ("The kicker?", "The brutal truth?"). Distinct from P19 and P21. Source: [Writewithai](https://writewithai.substack.com/p/10-dead-giveaways-your-content-screams), corroborated on [HackerNews](https://news.ycombinator.com/item?id=46646939).

**P42 Erratic Inline Bolding.** Patternless bold spans mid-paragraph, with no consistent rule for what gets emphasized. Distinct from P14 (systematic overuse). Source: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

**P43 The Treadmill Effect.** Low information density: a long section that restates one idea. Humans advance; AI circles. Distinct from P22 (sentence-level filler) and P30 (uniform length). Source: [aidetectors.io](https://www.aidetectors.io/blog/spotting-ai-writing-patterns).

---

## The HC3 corpus (grounding for P53 and the science claims)

HC3 (Human ChatGPT Comparison Corpus), from Guo et al. 2023, "How Close is ChatGPT to Human Experts?", [arXiv 2301.07597](https://arxiv.org/abs/2301.07597), pairs human and ChatGPT answers to the same questions. It is bilingual (separate [HC3-English](https://huggingface.co/datasets/Hello-SimpleAI/HC3) and [HC3-Chinese](https://huggingface.co/datasets/Hello-SimpleAI/HC3-Chinese) splits), roughly 40K question sets.

Findings this skill leans on:

- **Length.** English human answers average 142.5 words vs ChatGPT 198.1 (about 39% longer). Chinese 102.3 vs 115.3. Backs the "AI is wordier" thesis and P43.
- **Vocabulary diversity.** Humans use a larger unique-word set (English 79,157 vs 66,622) and higher diversity ratios. A second corpus corroborating the type-token-ratio point.
- **Perplexity.** ChatGPT text has lower perplexity at text and sentence level; human perplexity is long-tailed. Direct support for the Perplexity Principle.
- **"Indicating words".** The corpus ships lists of top-discriminating tokens. The ChatGPT markers "There are several ways", "In general", "It is generally a good idea" became P53.

Licensing note: the HuggingFace dataset is CC-BY-SA-4.0 (cite with attribution). The GitHub detector code has no license, so none of it was reused, and this skill does not claim to have benchmarked against their detectors. We cite HC3 as corroborating evidence only.

---

## Coverage against [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

Every prose and formatting sign the Wikipedia guide documents maps to a pattern here:

- Significance inflation -> P1; notability over-attribution -> P2, P37; superficial -ing -> P3; promotional tone -> P4; weasel/vague attribution -> P5; exaggerated source quantity -> P5, P37; formulaic "challenges" -> P6.
- AI vocabulary -> P7 (tiered); copula avoidance -> P8; negative parallelisms (all three variants) -> P9; rule of three -> P10; elegant variation -> P11, P31.
- Title case headings -> P16; boldface overuse, emoji-as-formatting, skipped heading levels, thematic breaks before headings, tables-where-prose-fits -> P14; inline-header lists -> P15; em dashes -> P13; curly quotes -> P17; Markdown in the wrong context -> P28.
- Collaborative/conversational language -> P19, P32; knowledge-cutoff disclaimers -> P20; placeholder text -> P33; chatbot markup (turn0search0, contentReference/oaicite, RAG attribution tags) -> P34; utm_source parameters -> P35; fabricated or phantom citations -> P25; pronounced style shifts -> P36; section-end summaries -> P39.
- Human-writing positive indicators (predating Nov 2022, natural variation) and the "detectors are unreliable, do not judge on one tell" caution map to the Guardrails section in `SKILL.md`.

Intentionally out of scope (Wikipedia-namespace editing, not general prose): non-existent categories/templates, AfC submission statements, exhaustive edit summaries, pre-placed maintenance tags, canned user pages, permissions gaming, and citation-integrity mechanics (invalid DOI/ISBN, missing page numbers, unused named references). A prose humanizer should not touch these.

---

## Full trigger lists

`SKILL.md` carries a working subset of triggers for these three high-volume patterns. Here is the full list.

**P1 Significance Inflation.** stands/serves as, is a testament/reminder, vital/significant/crucial/pivotal/key role/moment, underscores/highlights importance, reflects broader, symbolizing ongoing/enduring/lasting, contributing to the, setting the stage, marking/shaping the, represents a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted.

**P4 Promotional Language.** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning, cutting-edge, seamless, robust, world-class, state-of-the-art.

**P7 AI Vocabulary Words.** Additionally, align with, bolster, crucial, delve, emphasizing, enduring, enhance, foster/fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective before noun), landscape (abstract), leverage, multifaceted, notably, pivotal, realm, showcase, tapestry (abstract), testament, underscore (verb), utilize, valuable, vibrant, moreover, furthermore, "it's worth noting", "it's important to note", "in terms of", "at the end of the day". They often cluster: "additionally, it's worth noting that this pivotal development underscores the vibrant landscape."

---

## Before and after examples

One before/after pair per pattern that benefits from one. Read the AI line, then the human rewrite.

**P1 Significance Inflation**
> **AI:** established in 1989, marking a pivotal moment in the evolution of regional statistics
> **Human:** established in 1989 to collect regional statistics

**P2 Notability Name-Dropping**
> **AI:** cited in NYT, BBC, FT, and The Hindu
> **Human:** In a 2024 NYT interview, she argued that regulation should focus on outcomes

**P3 Superficial -ing Phrases**
> **AI:** The color palette resonates with the region's beauty, symbolizing bluebonnets, reflecting the community's deep connection to the land
> **Human:** The architect chose blue and gold to reference local bluebonnets

**P4 Promotional Language**
> **AI:** Nestled within the breathtaking region of Gonder, a vibrant town with rich cultural heritage
> **Human:** A town in the Gonder region, known for its weekly market and 18th-century church

**P5 Vague Attributions**
> **AI:** Experts believe it plays a crucial role in the regional ecosystem
> **Human:** A 2019 Chinese Academy of Sciences survey found 12 endemic fish species

**P6 Formulaic Challenges**
> **AI:** Despite its prosperity, faces challenges typical of urban areas. Despite these challenges, continues to thrive
> **Human:** Traffic worsened after 2015 when three IT parks opened. A stormwater project started in 2022

**P8 Copula Avoidance**
> **AI:** Gallery 825 serves as the exhibition space
> **Human:** Gallery 825 is the exhibition space

**P9 Negative Parallelisms**
> **AI:** It's not just a song, it's a statement
> **Human:** The heavy beat adds to the aggressive tone

**P10 Rule of Three**
> **AI:** innovation, inspiration, and industry insights
> **Human:** talks and panels, plus time for networking

**P31 Elegant Variation**
> **AI:** Yankilevsky, alongside other non-conformist artists, faced obstacles. The visionary creator's distinctive artistic journey continued.
> **Human:** Yankilevsky and other non-conformist artists faced obstacles. His work continued.

**P32 Collaborative Communication Leaking**
> **AI:** In this article, we will explore the unique characteristics that make this framework worth using.
> **Human:** This framework solves three problems that React Router doesn't.

**P33 Placeholder Text / Mad Libs**
> **AI:** Dear [Recipient], I am writing regarding [Topic].
> **Human:** (Either fill it in or don't send it.)

**P34 Chatbot Reference Markup Leaking**
> **AI:** The school has been recognized as an International Fellowship Centre. citeturn0search1
> **Human:** The school has been recognized as an International Fellowship Centre.

**P35 UTM Source Parameters**
> **AI:** `https://example.com/article?utm_source=chatgpt.com`
> **Human:** `https://example.com/article`

**P36 Sudden Style/Register Shift**
> **AI:** yeah so the bug is in line 42 lol. The aforementioned implementation exhibits suboptimal performance characteristics.
> **Human:** yeah so the bug is in line 42. The loop allocates on every iteration instead of reusing the buffer.

**P37 Overattribution**
> **AI:** Her insights have been featured in Wired, Refinery29, and other prominent media outlets.
> **Human:** Wired profiled her 2024 research on algorithmic bias in hiring software.

**P38 Paragraph-Reshuffling Immunity**
> **AI:** Remote work improves balance. Many workers prefer it. Studies show productivity rises. Commuting costs drop. Office costs decline too.
> **Human:** Remote work's flexibility is the obvious sell. The harder question is what you lose: the hallway conversation that turns into your best idea, the body language that tells you someone is drowning before they say anything.

**P39 Paragraph-Closing "Whether" Summaries**
> **AI:** Tokyo offers everything from Michelin-starred restaurants to humble ramen stalls. Whether you prefer fine dining or street food, Tokyo has something for every palate.
> **Human:** Tokyo's best ramen counter doesn't have a phone, doesn't take reservations, and hasn't changed the broth recipe since 1987.

**P40 Symbolic Gloss**
> **AI:** The closed factory represents the decline of American manufacturing and speaks to broader anxieties about post-industrial identity.
> **Human:** The factory closed in 2009. Three hundred jobs. The town's high school dropped football the following year.

**P41 Infomercial Engagement Hooks**
> **AI:** Most people abandon goals in week three. The brutal truth? They lack a clear failure threshold.
> **Human:** Most people abandon goals in week three. The ones who don't usually make the failure threshold explicit before they start.

**P42 Erratic Inline Bolding**
> **AI:** Remote work has **fundamentally changed** the way companies operate, with **many employees** now preferring **flexible arrangements**.
> **Human:** Remote work has fundamentally changed how companies operate. Most employees now want flexible arrangements.

**P43 The Treadmill Effect**
> **AI:** The system is fast. In other words, it performs well. Put simply, speed is one of its strengths.
> **Human:** The system answers in 40ms at p99, about 20x faster than the tool it replaced.

**P44 False Agency**
> **AI:** The market rewards companies that listen.
> **Human:** Customers spend more with companies that answer support tickets within an hour.

**P45 Narrator-from-a-Distance**
> **AI:** People tend to underestimate how much testing matters.
> **Human:** You will underestimate how much testing matters, right up until a Friday deploy pages you at 2am.

**P46 Diff-Anchored Writing**
> **AI:** This function was refactored to replace the old callback approach with async/await.
> **Human:** This function fetches the user and returns a promise.

**P47 Hyphenated-Pair Overuse**
> **AI:** The results are high-quality and the pipeline is state-of-the-art.
> **Human:** The results are high quality and the pipeline is genuinely new.

**P48 Aphorism Formulas**
> **AI:** Data is the new oil, and attention is the currency of the modern web.
> **Human:** Ad networks pay about $8 per thousand views, so publishers chase pageviews.

**P49 Fragmented Headers**
> **AI:** ## Performance / Performance is important for a good user experience.
> **Human:** ## Performance / The dashboard renders 10,000 rows in 40ms because it virtualizes the list.

**P50 Passive / Subjectless**
> **AI:** The cache is invalidated automatically when the config is changed.
> **Human:** The file watcher clears the cache whenever you edit the config.

**P51 Reasoning-Chain Artifacts**
> **AI:** Let me break this down. First, we need to understand the users. Step 1: identify who hits this endpoint.
> **Human:** Ops engineers hit this endpoint about 400 times a day. That is who we are designing for.

**P52 Unicode Obfuscation**
> **AI:** Text seeded with zero-width spaces between letters so a detector reads gibberish.
> **Human:** The same text, cleaned to plain characters, because the goal is good writing, not evasion.

**P53 Hedged-Enumeration Openers**
> **AI:** There are several ways to speed up a slow query. In general, it is a good idea to consider indexing.
> **Human:** Add an index on user_id. That one change took the query from 900ms to 12ms.

---

## Worked examples

Longer before/after passages showing several patterns fixed at once.

### Technical documentation (`--voice technical`)

**Before (AI-heavy):**
> This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience. Additionally, it features a pivotal role-based access control system that serves as a testament to our commitment to security. Not only does this ensure data protection, but it also fosters a culture of trust within the organization, highlighting the enduring importance of cybersecurity in today's rapidly evolving digital landscape.

**After:**
> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role: admin, editor, and viewer each see different data. The token rotation logic is in `src/auth/refresh.ts` if you need to change the expiry windows.

**What changed:** Replaced "leverages cutting-edge JWT technology" with "uses JWTs." Added specific details (expiry times, file paths). Killed 9 AI vocabulary words.

### Blog post (`--voice casual`)

**Before (AI-heavy):**
> In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history, one that underscores the intricate interplay between innovation and artistic expression. As we delve deeper into this fascinating realm, it becomes crucial to understand the multifaceted implications of AI-generated content. Industry experts highlight that this transformation will have an enduring impact, fostering new forms of collaboration between humans and machines. The future looks incredibly bright for those who embrace this change.

**After:**
> I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are technically impressive. I got a portrait last week that looked better than anything I could paint in a year. But there's something missing. It's like eating a perfect-looking meal that has no flavor. My artist friends are split: half are using these tools daily, half refuse to touch them. I don't think either side is wrong. What I do know is that my own creative process has changed since I started using them, in ways I'm still figuring out.

**What changed:** Replaced abstract commentary with personal experience. Added genuine uncertainty. Concrete analogy (perfect meal, no flavor). Sentence lengths: 8 to 31 words.

### Social media / LinkedIn (`--voice professional`)

**Before (AI-heavy):**
> Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. I'm deeply grateful to my amazing network for their unwavering support. The team at TechCorp is truly world-class, and I'm committed to leveraging my expertise to drive innovation and foster growth. Looking forward to this exciting chapter! #NewBeginnings #Innovation #Leadership #Grateful

**After:**
> Started a new job at TechCorp this week. I'm leading their developer tools team, 12 engineers building internal tooling that currently serves about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out. Nervous and excited in roughly equal measure. If anyone has advice on the first 90 days in an eng leadership role, I'm all ears.

**What changed:** No emojis, no hashtags. Replaced "pivotal new role" with what the role actually is. Added specific details (team size, user count). The coffee machine line adds humanity. Closing asks for help.
