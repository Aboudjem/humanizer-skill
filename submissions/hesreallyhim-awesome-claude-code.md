# Submission: hesreallyhim/awesome-claude-code

Pre-filled values for the [Recommend a Resource issue form](https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml).

Re-verified live against the actual template on 2026-08-25 (`gh api repos/hesreallyhim/awesome-claude-code/contents/.github/ISSUE_TEMPLATE/recommend-resource.yml`). Two corrections from the original May 2026 draft of this file: the template's `category` dropdown has no "Agent Skills" option (use "Writing & Prose Quality") and there is no "Sub-Category" field at all, it does not exist in the live form. The recommendation pipeline is also **not paused** (the July research's "paused for redesign" note was stale); 8+ "Add resource" PRs merged in the 6 weeks before this pass, most recently 2026-08-13.

Open the link, paste each block into the matching field, tick the five required checklist items (leave the sixth, the "trap" box, unchecked), click Submit. A bot validates the form and comments within minutes; a maintainer reviews and approves at their own pace.

All copy below has been run through the humanizer's own rules: zero em dashes, no banned AI vocab (delve, leverage, intricate, multifaceted, comprehensive), no negative parallelisms, no filler phrases, no question-format headers, no second-person address (the live template explicitly forbids "you"/"your" in the description field). Sentence lengths vary on purpose.

---

## Form fields (7 total, matches the live template exactly)

### Display Name

```
Humanizer
```

### Category

Select from the dropdown:

```
Writing & Prose Quality
```

There is no Sub-Category field on the live form. Do not look for one.

### Link

```
https://github.com/Aboudjem/humanizer-skill
```

### Author Name

```
Adam Boudjemaa
```

### Author Link

```
https://github.com/Aboudjem
```

### Description

10 to 500 characters, descriptive not promotional, no second-person language. This is 392 characters:

```
A Claude Code skill that detects 55 numbered AI writing patterns and rewrites text in five named voice profiles (casual, professional, technical, warm, blunt). Three modes: detect (scan and report with a 0-100 AI-tell score), rewrite (full transform), and edit (in-place file fixes). Pure Markdown, zero dependencies, no network calls; every pattern cites a primary source inline in SKILL.md.
```

### Checklist

Six checkboxes on the live form. Tick the first five (all required); leave the sixth unchecked exactly as instructed by its own label.

```
[x] I have visited this repo before with my own eyes, and I have confirmed that this resource is sufficiently distinct from any existing resource
[x] All links are working and publicly accessible
[x] This resource is specific to Claude Code
[x] I have read the CONTRIBUTING.md
[x] I promise I actually did these things and not doing so is shameful and lazy
[ ] Do not check the following box - leave it unchecked. By checking this box, I admit that I am not reading any of these statements.
```

---

## Eligibility (the form's own gate, checked live 2026-08-25)

The repo must meet one of: (a) at least 14 days of active development since the first commit, or (b) at least 100 stars. `Aboudjem/humanizer-skill` clears both: first commit well over 14 days ago, and 189 stars as of this pass (confirmed via `gh api repos/Aboudjem/humanizer-skill`).

---

## What happens after submission

1. An automated check validates the form and posts a comment within minutes, confirming it is well-formed or flagging fields to fix.
2. A maintainer reviews at their own pace; the queue is active, not paused (8+ merges in the 6 weeks before this pass).
3. On approval, a GitHub Action bot opens a PR adding the row to the resources table. Track it at `github.com/hesreallyhim/awesome-claude-code/pulls`, opened by `app/github-actions`.
4. The PR merges and the entry appears in the published list.

---

## Why direct PRs do not work for this repo

The CONTRIBUTING document and the issue form both say, in bold, that submissions via the `gh` CLI or any other programmatic means violate the repo's Code of Conduct and get auto-closed. The form is the only accepted path. This is why the other awesome-list submissions for this project went out as ordinary PRs (travisvn #997, ComposioHQ #1336, both still open and unreviewed after 6 weeks, which is normal review latency, not rejection) while this one has to go through the browser form.
