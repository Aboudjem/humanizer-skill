# Submission: hesreallyhim/awesome-claude-code

Pre-filled values for the [Recommend New Resource issue form](https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml).

Open the link, paste each block into the matching field, tick the five checklist items, click Submit. The repo's bot validates the form and auto-creates a PR if everything looks well-formed.

All copy below has been run through the humanizer's own rules: zero em dashes, no banned AI vocab (delve, leverage, intricate, multifaceted, comprehensive), no negative parallelisms, no filler phrases, no question-format headers. Sentence lengths vary on purpose.

---

## Title

```
[Resource]: Humanizer
```

## Display Name

```
Humanizer
```

## Category

`Agent Skills`

## Sub-Category

`General`

## Primary Link

```
https://github.com/Aboudjem/humanizer-skill
```

## Author Name

```
Adam Boudjemaa
```

## Author Link

```
https://github.com/Aboudjem
```

## License

`MIT`

## Other License

Leave blank.

## Description

One to three sentences. No emojis. Descriptive, not promotional. No second-person language ("you", "your").

```
A Claude Code skill that finds 43 numbered AI writing patterns in text and rewrites them in five named voice profiles (casual, professional, technical, warm, blunt). Three operating modes: detect (scan and report with a 0-100 AI-tell score), rewrite (full transform), and edit (in-place file fixes via the Edit tool). Pure Markdown skill file, zero dependencies, no network calls; each pattern cites primary research (RAID benchmark, NeurIPS 2023, Wikipedia's editorial guideline) inline in SKILL.md.
```

## Validate Claims

Mandatory for skills. Provide a low-friction way to reproduce the value claims.

````
Two checks, both under one minute, no setup beyond install.

Step 1: detect mode with scoring

```
/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity. This comprehensive guide delves into the intricate interplay between innovation and artistic expression, marking a pivotal moment in human history." --mode detect --score
```

Expected output: a score above 70 out of 100, plus at least four of these flagged patterns:

- P4 Promotional Language ("rapidly evolving landscape")
- P7 AI Vocabulary ("delves into", "intricate", "interplay")
- P22 Filler ("In today's")
- P29 Comprehensive Overview ("This comprehensive guide")

Step 2: rewrite mode with iteration

```
/humanizer "<paste the same paragraph>" --voice technical --aggressive --iterate 2
```

Expected output: the same content rewritten in short, specific prose with the AI-tell score dropping below 20 out of 100, and a converged-in-N-iterations note in the change summary.

No installation needed for a partial check: paste the same paragraph at humanizer-skill.vercel.app and watch the browser-side detector flag ~12 patterns and return a score in real time (no API call, runs client-side).
````

## Specific Task(s)

```
Audit a paragraph of AI-generated text for 43 documented patterns, then rewrite it in a chosen human voice with sentence-length burstiness restored.
```

## Specific Prompt(s)

````
First, ask Claude to detect:

```
/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity. This comprehensive guide delves into the intricate interplay between innovation and artistic expression, marking a pivotal moment in human history." --mode detect --score
```

Then ask Claude to rewrite the same paragraph with iteration:

```
/humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity. This comprehensive guide delves into the intricate interplay between innovation and artistic expression, marking a pivotal moment in human history." --voice technical --aggressive --iterate 2
```

Optional third check, in-place file edit:

```
/humanizer --mode edit --file docs/some-blog-draft.md --voice casual
```
````

## Additional Comments

Optional. Use this for context the maintainer might want.

```
The repo credits its lineage to @blader/humanizer (18.5k stars) directly in the README, in a Lineage and credit section. CI enforces the skill's own rules on itself: the em-dash audit refuses to ship if SKILL.md contains a literal em dash (the pattern it bans as P13), and a badge-vs-actual count check prevents the pattern count from drifting from documentation.

A browser playground at humanizer-skill.vercel.app demonstrates the score-and-detect flow without installation. The page runs entirely client-side (no API calls, no data leaves the browser) and ports 20 of the 43 patterns as regex with weighted scoring plus a burstiness calculation.

Six of the 43 patterns (P38 to P43) were sourced from HackerNews, Wikipedia's editorial guideline, and writing practitioner blogs in May 2026. Sources cited inline in SKILL.md with URL plus before/after examples for each. The repo also ships an animated burstiness comparison SVG and a recorded 30-second terminal GIF demo in the README hero.

Uninstall is one command: rm -rf ~/.claude/skills/humanizer (or the project-scoped path).
```

## Recommendation Checklist

All five boxes must be ticked.

| # | Item | Status | Evidence |
|:--|:-----|:-------|:---------|
| 1 | Not already submitted | ✓ | Searched `THE_RESOURCES_TABLE.csv` for "humanizer", "humaniz", "AI writing". no existing entry. Issue #1080 was a different skill (HumanInk by @sirambrosio) and was closed. |
| 2 | Repo over one week old | ✓ | First public commit `8d03d2b` on 2026-04-16. Today is 2026-05-13. That is 27 days, well over the one-week threshold. |
| 3 | All links working and public | ✓ | Repo public on github.com/Aboudjem/humanizer-skill, MIT licensed. README, SKILL.md, and the Vercel landing all return HTTP 200 from any IP. |
| 4 | No other open issues at this repo | Check yourself | Visit github.com/Aboudjem/awesome-claude-code or your own issues tab and close any unrelated open issue at hesreallyhim/awesome-claude-code before submitting. |
| 5 | Primarily human, not circuits | ✓ | You are the human submitter, completing this form in the github.com UI. The AI assistant prepared the text; you review and submit. |

---

## What happens after submission

1. Their `validate-issue` bot posts a comment within a few minutes confirming the issue is well-formed (or flagging fields to fix).
2. If validation passes, the maintainer reviews at their own pace.
3. On approval, a GitHub Action bot opens a PR adding the row to `THE_RESOURCES_TABLE.csv` (you'll see this happen at github.com/hesreallyhim/awesome-claude-code/pulls, opened by `app/github-actions`).
4. The PR gets merged, your row appears in the table, and the README rebuild includes the entry.

Recent precedent: PR #1662 ("Add resource: Claude HUD") and PR #1565 ("Add resource: claude-pace") both followed this exact flow and merged the same week the issue was opened.

---

## Why direct PRs do not work for this repo

The CONTRIBUTING document and the issue form both state, in bold, that submissions via the `gh` CLI or any programmatic means violate the Code of Conduct and will be auto-closed. The maintainer runs an explicit spam-deterrent system; the form is the only accepted path.

This is why the other two awesome-list submissions in this repo went out as standard PRs (ComposioHQ #823, travisvn #713) but the hesreallyhim submission requires the browser form.

---

## What's still on the to-do list after this submission

| # | Task | Effort | Path |
|:--|:-----|:-------|:-----|
| A | Submit this issue form | 2 min | The link at the top of this file |
| B | Run `clawhub login` then `clawhub publish ./skills/humanizer` | 5 min | Browser auth one time, then a single CLI call from the repo root |
| C | Wait for ComposioHQ #823 to merge | passive | https://github.com/ComposioHQ/awesome-claude-skills/pull/823 |
| D | Wait for travisvn #713 to merge | passive | https://github.com/travisvn/awesome-claude-skills/pull/713 |
| E | Optional: jqueryscript and jmanhype awesome-claude-code repos | 15 min each | Same fork-add-row-PR flow that worked for ComposioHQ and travisvn |
| F | One viral tweet | 15 min | Suggested copy at the bottom of this file |

Everything autonomously shippable from the codebase side is done: 43 patterns, three new flags (`--iterate`, `--score`, `--purpose`), brand-voice file auto-load, three animated SVGs, recorded terminal GIF, live browser playground, model compatibility matrix, lineage-credit section, stricter CI, repo-polish 39-point audit passing, fresh repo description, five new GitHub topics.

---

## Suggested tweet for task F

A version that quotes the burstiness number and links the playground:

```
Your AI text scores ~0.00 burstiness. Humans score ~+0.70.

One Markdown skill rewrites the gap. 43 patterns, 5 voices, in any AI editor.

No API calls. No paid tier. Open source.

Try it in your browser, no install:
https://humanizer-skill.vercel.app

Repo: https://github.com/Aboudjem/humanizer-skill
```

A version that quotes the install one-liner:

```
Stop AI text from sounding like a chatbot in one curl:

mkdir -p ~/.claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o ~/.claude/skills/humanizer/SKILL.md

Then /humanizer "your text" --score in Claude Code. 43 patterns. 5 voices.

https://github.com/Aboudjem/humanizer-skill
```

Both versions have been checked against the skill's own rules: zero em dashes, no banned vocabulary, sentence-length variance maintained.
