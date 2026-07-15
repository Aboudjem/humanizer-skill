---
sidebar_position: 4
title: Voice profiles
---

# Voice profiles

Every voice changes how the skill rewrites: sentence structure, rhythm, and personality, not just vocabulary. Pass one with `--voice`, or let the skill infer it from the input register.

| Voice | Personality | Best for |
|:------|:-----------|:---------|
| `casual` | Contractions, first person, fragments, "And" starters | Blog posts, social media, community docs |
| `professional` | Selective contractions, dry wit, concrete examples | Business comms, reports, formal docs |
| `technical` | Precise terms, code-like clarity, deadpan humor | API docs, READMEs, architecture docs |
| `warm` | "We" and "our" language, empathy, shorter paragraphs | Tutorials, onboarding, support content |
| `blunt` | Shortest sentences, no hedging, active voice only | Reviews, internal comms, direct feedback |

## The same idea in three voices

**casual**

> I've been messing around with AI image generators for six months and I still can't decide if I love them. The outputs are impressive. But something's missing. It's like a perfect-looking meal with no flavor.

**technical**

> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts endpoints by user role. The rotation logic lives in `src/auth/refresh.ts`.

**blunt**

> Word-swap tools do not work. They change vocabulary and leave the rhythm robotic. Detectors measure structure, not synonyms. Fix the structure.

## Purpose presets

Layer content-type rules on top of a voice with `--purpose`:

| Purpose | Effect |
|:--------|:-------|
| `essay` | No contractions, formal headings, structured arguments |
| `email` | Greetings and a signoff allowed, no Markdown |
| `marketing` | Short paragraphs, concrete benefits, one call to action at the end |
| `technical` | Code blocks preserved, precise jargon kept, numbers over adjectives |
| `general` | No overrides (the default) |

:::note[Restraint is part of the job]
Injecting personality into text that should stay plain is its own kind of slop. On neutral, reference, or legal text the skill holds most of these techniques back. A ruthless editor who over-edits launders a real voice into the same flat prose it claims to fix.
:::
