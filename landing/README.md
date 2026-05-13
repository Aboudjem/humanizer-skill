# Humanizer landing page

A single static HTML page with a client-side AI-text detector. Ported a subset of the SKILL.md regex blacklist (P1, P3, P4, P5, P7, P8, P9, P13, P18, P19, P20, P21, P22, P24, P29, P32, P34, P35, P39, P41, 20 patterns of 43) plus burstiness scoring.

## Local preview

```bash
cd landing
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static server. There is no build step.

## Deploy

```bash
vercel --prod
```

The first deploy will prompt for project linking. Subsequent deploys reuse the linked project.

## Why a landing page

Closes the "try it before you install" gap that humanize.io and undetectable.ai use to capture top-of-funnel traffic for the commercial humanizer category. Our version is the only open-source one that runs entirely client-side (no API keys, no data leaves the browser, no cost).

The 20 patterns it covers are the mechanically detectable ones. The full skill catches all 43 plus does the rewriting, which requires an LLM (Claude/GPT/Gemini), which is why the actual rewriting happens in your editor.

## What it tracks

- Pattern hits with counts and examples
- Burstiness (sentence length variance, normalized 0-1)
- Composite 0-100 AI-tell score
- Verdict label (Pristine → Pure AI smell)

## What it does not do

- Rewrite the text (that's the skill's job in your editor)
- Send anything to a server (intentional, the whole script is local)
- Persist anything (no localStorage, no cookies)

## Files

- `index.html`, the entire page, inline CSS and JS, ~9KB minified
- `vercel.json`, security headers and immutable caching
- `README.md`, this file
