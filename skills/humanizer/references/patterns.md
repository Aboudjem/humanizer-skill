# Pattern deep dives and provenance

Loaded on demand. The core `SKILL.md` is standalone and does not need this file. This is the "what's happening", the extra examples, and the full attribution for the patterns that benefit from more depth: the 2026 emerging set (P31-P43) and the craft/forensic set (P44-P53).

The core catalog (P1-P30) is derived mostly from [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) and is documented inline in `SKILL.md`.

---

## Provenance of P44-P53

These ten were adopted from the wider open humanizer ecosystem and one peer-reviewed corpus. Each is credited to where it was surfaced. They are novel relative to the P1-P43 catalog (cross-checked to avoid duplicates).

| ID | Pattern | Adopted from |
|:---|:--------|:-------------|
| P44 | False Agency | hardikpandya/stop-slop |
| P45 | Narrator-from-a-Distance | hardikpandya/stop-slop |
| P46 | Diff-Anchored Writing | blader/humanizer |
| P47 | Hyphenated-Pair Overuse | blader/humanizer |
| P48 | Aphorism Formulas | blader/humanizer |
| P49 | Fragmented Headers | blader/humanizer |
| P50 | Passive / Subjectless | blader/humanizer |
| P51 | Reasoning-Chain Artifacts | brandonwise/humanizer |
| P52 | Unicode Obfuscation | brandonwise/humanizer |
| P53 | Hedged-Enumeration Openers | HC3 corpus, [arXiv 2301.07597](https://arxiv.org/abs/2301.07597) |

We adopted the ideas and rewrote every entry, trigger list, and example from scratch. No text or code was copied from those repos.

---

## Emerging patterns (P31-P43): extended notes

**P31 Elegant Variation (Noun-Phrase Cycling).** LLMs carry a repetition penalty that discourages reusing the same noun phrase, so they substitute increasingly elaborate descriptors for one entity. This is distinct from P11 (Synonym Cycling), which is word-level. P31 is whole-noun-phrase cycling for the same subject. The fix is counterintuitive to a model: pick the clearest term and repeat it, because humans repeat words without anxiety.

**P32 Collaborative Communication Leaking.** The model was producing advice or correspondence for the user, and the user pasted it into a published piece without stripping the conversational framing. Distinct from P19 (identity disclosure like "I hope this helps"); P32 is instructional framing ("In this article, we will explore") that belongs in a chat, not an article.

**P33 Placeholder Text / Mad Libs.** Fill-in-the-blank templates the user forgot to complete. Among the most definitive tells because no careful human ships `[Your Name]`. Search for square-bracketed instructions and `XXXX`-style date stubs.

**P34 Chatbot Reference Markup Leaking.** Tool-specific citation tokens preserved on copy-paste: `citeturn0search0` (ChatGPT), `contentReference[oaicite:0]{index=0}`, `oai_citation`, Grok cards. Near-definitive proof of tool use because these strings exist nowhere else.

**P35 UTM Source Parameters.** ChatGPT, Copilot, and Grok append tracking parameters to URLs they emit (`utm_source=chatgpt.com`). Strip them.

**P36 Sudden Style/Register Shift.** Catches mixed human and AI authorship: the AI section has a different voice, formality, and error profile than the human section. Look for graduate-thesis prose dropped into casual notes, or American spelling appearing mid-piece from a non-American author.

**P37 Overattribution.** Proving importance by listing where a subject was covered, rather than what the coverage said. Distinct from P2 (dropping famous names). Fix: pick one source and summarize what it actually reported.

**P38 Paragraph-Reshuffling Immunity.** LLMs generate parallel self-contained blocks instead of an unfolding argument. The test: can you swap paragraphs 2 and 4 without breaking the piece? If yes, it reads as AI. Source: [HackerNews thread, May 2025](https://news.ycombinator.com/item?id=46646939).

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
