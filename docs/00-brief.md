# Brief

## What was asked for

A personal website and portfolio for Avi Aggarwal, built with 21st.dev
components via their MCP server, applying the `ui-ux-pro-max` design skill
throughout. It had to feel premium and stylish.

Two clarifications arrived while the work was in progress and both changed the
shape of the deliverable:

1. **"Just design the website. I don't want you to actually add anything for my
   portfolio page. I will do that myself when I'm back."**

   So this is a *design*, not a filled-in portfolio. Every piece of copy on the
   page is a deliberate placeholder, and all of it lives in one file —
   [`src/content/site.ts`](../src/content/site.ts) — so the real content can be
   dropped in without touching a component.

   This also means nothing on the site claims anything about Avi. There are no
   invented projects, no fabricated employers, no made-up statistics. A
   portfolio that ships with plausible-looking fake achievements is a liability,
   not a head start.

2. **"Commit every single little change… make lots of .md files to document
   everything."**

   Hence this directory, and a commit history that tracks the build one change
   at a time rather than in a handful of large drops.

## What the site is

A single-page, scroll-driven personal site in seven movements:

| Section | Job |
| --- | --- |
| Hero | Who this is. Full viewport, atmospheric, one `h1`. |
| Ticker | A beat of horizontal motion to break the vertical stack. |
| About | The context for everything below it. |
| Work | The actual point of the site. |
| Capabilities | What that work is made of. |
| Timeline | How it accumulated. |
| Contact | The ask. |

Work sits above Capabilities deliberately. Evidence first, claims second: a
portfolio that opens with a list of skills is asking to be believed, while one
that opens with work has already made the argument.

## Stack

| Choice | Why |
| --- | --- |
| Next.js 16 (App Router) | 21st.dev components are authored for React/Next + shadcn conventions, so they drop in without translation. |
| React 19 | Peer of the above. |
| Tailwind v4 | CSS-first config — the token layer *is* the stylesheet, with no `tailwind.config.js` indirection. |
| Framer Motion 12 | Every catalogue component in this family already depends on it. |
| lucide-react | One icon set, one stroke weight. The skill's `no-emoji-icons` rule. |
| TypeScript, strict | The content file is typed, so a malformed entry fails at build rather than at runtime. |

Next was upgraded from 15.5.4 to 16.3.0 during the build: npm flagged the
former for CVE-2025-66478.

## Constraint worth recording

The 21st.dev account is on the **free tier — two component code retrievals per
day**. Search, theme and logo endpoints are unmetered; only `get_component` is
charged.

So the two retrievals were spent on the two components that were genuinely hard
to rebuild from a preview image, and everything else was designed in the same
language by hand. See [`03-components.md`](./03-components.md) for what was
pulled, what was changed, and what was built from scratch.

## Definition of done

- Production build passes with no type errors.
- No console errors.
- No horizontal scroll at 375 / 768 / 1024 / 1440.
- Every interactive element ≥44px and keyboard reachable with a visible focus ring.
- `prefers-reduced-motion` honoured.
- Every string on the page reachable from one content file.
