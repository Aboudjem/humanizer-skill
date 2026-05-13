# Contributing to Humanizer

Thanks for helping make AI text more human. Here's how to contribute.

## Adding a new pattern

1. Follow the existing format (P1-P43 use this exact template — see [SKILL.md](skills/humanizer/SKILL.md) for examples)
2. Include:
   - **Trigger words**: what to search for (regex-friendly when possible)
   - **What's happening**: why AI does this — cite a source if you have one
   - **Fix**: how to replace it (prescriptive, not "consider...")
   - **Before/after table**: at least one real example, not invented
3. Place it in the right category (Content P1-P8, Language & Style P9-P18, Communication P19-P21, Filler & Hedging P22-P30, Emerging P31+)
4. Update three places in lockstep:
   - Pattern count in [README.md](README.md) badge (`patterns-NN`)
   - Pattern count threshold in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`COUNT -lt NN`)
   - CHANGELOG entry under a new version

## Improving an existing pattern

- Add more trigger words from real AI text you've encountered
- Add before/after examples
- Refine the fix instructions

## Reporting false positives

If the skill flags something that's genuinely human writing, open an issue with:
- The flagged text
- Which pattern triggered
- Why it's a false positive

## Pull request process

1. Fork and create a branch (`feat/pattern-31-whatever` or `fix/false-positive-p7`)
2. Make your changes in SKILL.md
3. Keep SKILL.md under 600 lines (skill files have context budget limits; ours sits at ~567 and Claude Code allocates roughly 2k tokens for skill frontmatter+body before paging the rest as references)
4. Open a PR with a clear description

## Code of conduct

Be direct. Be helpful. Skip the pleasantries. We're humanizers, not sycophants.

---

## Spreading the word

If you found this skill useful, the highest-leverage way to help is submitting it to skill aggregators. Each row below is one PR away from listing.

| Aggregator | URL | Submission method |
|:-----------|:----|:------------------|
| awesome-claude-code | [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Open issue using "[Resource]" template, then PR adding row to `THE_RESOURCES_TABLE.csv` |
| awesome-claude-skills | [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Fork, add to "Communication & Writing", PR |
| awesome-claude-skills (Travis) | [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | README PR |
| awesome-claude-code (jquery) | [jqueryscript/awesome-claude-code](https://github.com/jqueryscript/awesome-claude-code) | README PR |
| awesome-claude-code (jman) | [jmanhype/awesome-claude-code](https://github.com/jmanhype/awesome-claude-code) | README PR |
| ClawHub | [docs.openclaw.ai/clawhub](https://docs.openclaw.ai/clawhub) | `clawhub skill publish` |
| LobeHub Skills | [lobehub.com/skills](https://lobehub.com/skills) | Web form |
| awesomeclaude.ai | [awesomeclaude.ai](https://awesomeclaude.ai/awesome-claude-code) | Submission form |
| claudepluginhub | [claudepluginhub.com](https://www.claudepluginhub.com) | Auto-indexed via repo topics |

PRs in this direction are very welcome. If you submit and the listing goes live, drop a link in an issue so we can credit you here.
