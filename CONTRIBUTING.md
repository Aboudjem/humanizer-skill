# Contributing to Humanizer

Thanks for helping make AI text more human. Here's how to contribute.

## Adding a new pattern

1. Follow the existing format (P1-P30)
2. Include:
   - **Trigger words** - what to search for
   - **What's happening** - why AI does this
   - **Fix** - how to replace it
   - **Before/after table** - at least one example
3. Add to the appropriate category in SKILL.md
4. Update the pattern count in README.md badges

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
3. Keep SKILL.md under 550 lines (skill files have context budget limits)
4. Open a PR with a clear description

## Code of conduct

Be direct. Be helpful. Skip the pleasantries - we're humanizers, not sycophants.
