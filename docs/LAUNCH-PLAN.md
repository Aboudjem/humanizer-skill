# Launch Plan — Humanizer Skill (June 2026)

Supernova Standard Pillar 1: borrowed-reach-first, same-window multi-channel stacking.

---

## Pre-launch checklist (complete before Day 0)

- [x] README: hero + demo GIF + install snippet above the fold
- [x] plugin.json + marketplace.json — installable via `claude plugin marketplace add`
- [x] AGENTS.md — auto-discovered by 23 AI harnesses
- [x] llms.txt — LLM-citeability and RAG discoverability
- [x] examples/ — before/after reference case
- [x] Issue templates — bug + feature request
- [x] GitHub topics: `claude-code`, `claude-code-plugin`, `humanizer`, `ai-writing`, `writing-tools`
- [x] GitHub description: keyword-first, ≤160 chars
- [ ] Social preview image: 1280×640 (use `.github/assets/demo-burstiness-light.svg` as base)
- [ ] Submit to hesreallyhim/awesome-claude-code via web-UI issue form (before launch day — review takes time)
- [ ] Submit to Anthropic official marketplace at `clau.de/plugin-directory-submission`
- [ ] Draft origin-story X thread (2-4 tweets, GIF first)
- [ ] Draft r/ClaudeAI post (problem-first, no marketing language)
- [ ] Prep a dev.to post (the origin story: why I built this, what the 43 patterns are)
- [ ] Share demo privately in 2-3 writing/AI Discord servers ~24h before launch ("feel free to share")

---

## Launch day (target: Tuesday–Thursday, 13:00–16:00 UTC)

### T=0: 13:00 UTC — r/ClaudeAI

Post here first. It's the highest-fit audience: Claude Code users who write with AI. Title:

> "I built a Claude Code skill that detects 43 AI writing patterns and scores your text 0-100. Here's the before/after on a blog post that scored 87."

Body: problem-first (not a pitch), the burstiness chart, the score example, install command, link to repo.

### T+30min: 13:30 UTC — X/Twitter thread

Post the demo GIF first (no text above the GIF — it auto-plays). Thread:

- Tweet 1: GIF + "AI text scores ~0.00 burstiness. Humans score ~+0.70. I built a Claude Code skill that rewrites the gap."
- Tweet 2: The 5 most common AI tells with before/after examples
- Tweet 3: Install command + "it's one Markdown file, no API calls, zero dependencies"
- Tweet 4: Link to repo + r/ClaudeAI thread

Tag `@AnthropicAI`, `@ClaudeAI`. No begging for RTs.

### T+1h: 14:00 UTC — awesome-list PRs + dev.to

- Merge any pre-queued awesome-list PRs (awesome-claude-code if approved)
- Publish dev.to origin story: "How I catalogued 43 AI writing patterns (and built a skill to fix them)"
- Cross-post to r/writing, r/artificial if the r/ClaudeAI post gets traction

### T+2h: 15:00 UTC — Monitor + engage

- Reply to every comment in the r/ClaudeAI thread within the first 2 hours
- Retweet any organic shares
- Don't cold-submit to Hacker News as author — let it happen organically or via someone else

---

## Borrowed-reach strategy

The skill is for writers and AI-assisted content creators, not just developers. Reach targets:

1. r/ClaudeAI — primary; fits well (Claude Code + writing)
2. Writing/AI Discord servers — share demo 24h before launch, no hard ask
3. X writing folks — DM 2-3 writers who post about AI writing tools, share the GIF, no ask
4. dev.to — underrated origin channel (how superpowers first broke through)
5. Newsletters — TLDR AI, Changelog Nightly (submit 48h before launch)

Don't cold-Show-HN. If it lands there, it'll be because someone else submitted it after seeing the Reddit post or the X thread.

---

## Realistic star expectations

Based on the 15-repo supernova corpus:

| Scenario | Stars/24h | Condition |
|:---------|:----------|:----------|
| Modest | 20-50 | r/ClaudeAI hits front page, no viral spread |
| Good | 100-200 | X thread gets picked up by a writing-focused account |
| Breakout | 500+ | HN third-party submission + multi-channel stacking same day |

The skill hits a specific problem (AI writing patterns), has a measurable result (0-100 score), is free + open source, and works in 5 seconds. That's a graspable hook.

---

## Second wave (2-4 weeks post-launch)

- Ship v0.2: add P44-P50 community-submitted patterns; blog post "What 100 readers taught me about AI writing"
- Court a writing YouTuber or newsletter
- Submit to Product Hunt (aged accounts only — PH clears new-account upvotes every ~2h)
- Track star:fork ratio — stay below 20:1 (organic signal)
- If HN hasn't happened: use the HN second-chance pool (email `hn@ycombinator.com`) after the second wave
