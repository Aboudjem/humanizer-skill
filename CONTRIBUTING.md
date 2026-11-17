# Contributing to Humanizer

Thanks for helping make AI text more human. Here's how to contribute.

## Adding a new pattern

1. Follow the existing format. P1 to P55 all use one template, and [SKILL.md](skills/humanizer/SKILL.md) shows it.
2. Include:
   - **Trigger words**: what to search for (regex-friendly when possible)
   - **What's happening**: why AI does this, with a source if you have one
   - **Fix**: how to replace it (prescriptive, not "consider...")
   - **Before/after table**: at least one real example, not invented
3. Place it in the right category (Content P1-P8, Language & Style P9-P18, Communication P19-P21, Filler & Hedging P22-P30, Emerging P31-P43, Craft & Forensic P44+)
4. Update three places in lockstep:
   - Pattern count in [README.md](README.md) badge (`patterns-NN`)
   - Pattern count threshold in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`EXPECTED=NN`)
   - CHANGELOG entry under a new version
5. Put the short entry (name, trigger, one-line fix, before/after) in `SKILL.md`; put any longer "what's happening" notes or sources in [`references/patterns.md`](skills/humanizer/references/patterns.md) so the core stays lean.

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
3. Keep `SKILL.md` lean: it is the always-loaded core, so push verbose deep dives, extra examples, and sources into `references/` rather than growing the core. New patterns add a compact entry here and their depth there.
4. If you touch the CLI (`cli/`), run `npm test` from the repo root and keep it green. New metrics or vocabulary entries should ship with tests (aim for a few positive and negative cases each, in the spirit of "every pattern earns its tests").
5. Run `npm run selfcheck`. It scores the repo with its own CLI and rejects an em dash (U+2014) in any doc.
6. Open a PR with a clear description

## Code of conduct

Be direct. Be helpful. Skip the pleasantries. We're humanizers, not sycophants.
