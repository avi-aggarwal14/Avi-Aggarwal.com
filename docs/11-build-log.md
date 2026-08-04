# Build log

How this got built, in order, including the things that went wrong.

---

## 1 · Research

Loaded the `ui-ux-pro-max` skill. Its `search.py` needs Python, which is not
installed on this machine — only the Windows Store stub, which exits rather than
running. Read the CSV data directly instead, which gave the same intelligence
without the dependency.

The relevant rows:

- **Portfolio/Personal** → *Motion-Driven + Minimalism*, storytelling-driven
  landing structure, "brand primary + artistic interpretation".
- **Architecture/Interior** (the adjacent premium lane) → *Exaggerated
  Minimalism + High Imagery*, "Monochrome + Gold Accent".
- **Premium Sans** (typography) → Satoshi / General Sans, with DM Sans as the
  Google-hosted equivalent.

Direction set from the intersection: editorial dark minimalism, warm monochrome,
one metallic accent, motion-driven.

Searched 21st.dev across heroes, work lists, text reveals, docks and card
grids — all free and unmetered.

## 2 · The budget constraint

`get_usage` returned:

```json
{ "tier": "free", "freeRetrievalsPerDay": 2, "freeRetrievalsRemaining": 2 }
```

Two component code retrievals for the whole build. Spent them on the two
components whose *implementation* carried the value rather than their
appearance:

1. **Project Showcase** — the lerp-tracked cursor preview.
2. **Classy Hero** — the layered background, the text rotator, the ripple button.

Everything else was designed by hand in the same language.

## 3 · Scaffolding — first failure

`create-next-app` refused the directory:

```
Could not create a project called "Avi-Aggarwal.com" because of npm naming
restrictions: name can no longer contain capital letters
```

The folder is named after the domain, so this was never going to work. Rather
than scaffolding elsewhere and moving files, wrote `package.json`, `tsconfig`,
`next.config`, `postcss.config` and the app directory by hand. Faster than the
workaround, and everything was going to be customised anyway.

## 4 · Security patch mid-build

`npm install` warned:

```
npm warn deprecated next@15.5.4: This version has a security vulnerability.
See https://nextjs.org/blog/CVE-2025-66478
```

Upgraded 15.5.4 → 16.3.0. Cost two follow-on changes: Next 16 rewrites
`tsconfig.json` on first build (`jsx: react-jsx`, extra type paths), and
`next lint` no longer exists.

## 5 · Design tokens, then components

`globals.css` first — the whole palette, the type scale, the easing vocabulary,
the z-index ladder. Then `lib/motion.ts`, then the content file, then primitives,
then layout furniture, then sections.

Building the token layer before any component is what stopped the page becoming
a pile of unrelated effects. Nothing downstream defines a colour or a curve of
its own.

## 6 · First build — passed

TypeScript compiled, three static pages generated, no errors.

## 7 · Browser verification — three real bugs

The Browser pane was not compositing frames, so screenshots were unavailable.
Verified through the DOM and the console instead, which turned out to be more
useful — it caught things a screenshot would not have.

### Bug 1 — fonts silently not applying

Every font was falling back to system sans. The cause:

```css
@theme inline {
  --font-sans: var(--font-dm-sans), ui-sans-serif, sans-serif;
}
```

`@theme inline` **inlines** a value into the generated utilities rather than
emitting it as a custom property. So `--font-sans` did not exist at runtime, and
`body { font-family: var(--font-sans) }` resolved to nothing.

Confirmed by probing: `--font-dm-sans` was present and correct on `<body>`;
`--font-sans` was an empty string.

Fixed by referencing the `next/font` variables directly in the base rules, and
moving the font classes from `<body>` to `<html>` so they are in scope for every
element.

### Bug 2 — duplicate React keys

Forty-odd console errors. Lists were keyed on their string content, and the
placeholder content deliberately repeats — six capabilities all titled
"Placeholder capability", tags all reading "Placeholder".

Fixed with composite keys in four places. Worth noting the placeholders *caused*
this, but real content could too — two projects can legitimately share a tag.

### Bug 3 — touch target below minimum

A script audit of every `<a>` and `<button>` found one element under 44px: the
nav wordmark, at 33×17. Fixed with `min-h-[44px]` and negative margin so the fix
is invisible.

## 8 · Bugs fixed *in* the retrieved components

Three, all in the 21st.dev source rather than in the integration:

| Component | Bug |
| --- | --- |
| Project Showcase | Preview positioned from a `getBoundingClientRect()` captured during render and never updated — it detaches from the cursor on any scroll or resize. Rewritten to viewport coordinates. |
| Project Showcase | rAF loop listed `mousePosition` in its dependency array, cancelling and rescheduling the frame on every pointer event, and calling `setState` inside the loop. Rewritten to one loop, zero re-renders. |
| Classy Hero (`TextRotator`) | Reserves width from a hidden copy of `words[0]`, so any longer word is clipped. Rewritten to size from the longest entry. |

## 9 · Second pass — polish

- OG card generated at build from the content file, so it cannot drift.
- `sitemap.ts`, `robots.ts`, on-brand 404.
- Custom cursor, gated on `(pointer: fine)` and reduced motion.
- eslint flat config. `FlatCompat` threw `Converting circular structure to JSON`
  against `eslint-config-next@16` — it is for wrapping *legacy* configs, and v16
  ships native flat configs from subpath exports. Rewritten to import those
  directly; lint now passes clean.
- `prefers-contrast: more` support, and a print stylesheet.
- `role="list"` restored on every styled list — Tailwind's preflight removes
  `list-style`, and Safari/VoiceOver drops list semantics along with it.

### A fourth reduced-motion bug, found while documenting

The blanket `animation-duration: 0.01ms` rule that most reduced-motion
implementations use is wrong for *looping* animations. It does not stop them —
it fast-forwards them to their end state. The marquee snapped to `translateX(-50%)`
instead of standing still.

Fixed by switching the three looping animations off outright rather than
collapsing them.

## 10 · Verification

| Check | Result |
| --- | --- |
| `npm run build` | Passes, 5 static routes |
| `npm run lint` | Clean |
| Console errors | None |
| Horizontal scroll @ 375 / 768 / 1440 | None |
| Touch targets < 44px | None |
| Heading structure | 1 × h1, 5 × h2, 14 × h3 — no skipped levels |

## What is still not done

- No automated accessibility audit (axe) and no Lighthouse run.
- No real-device testing.
- The content is placeholder — by design, per the brief.
