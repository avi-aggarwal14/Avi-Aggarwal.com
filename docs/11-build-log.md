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

## 10 · Third pass — robustness against unknown content

The site ships with placeholder content, which means every fixed-size element
is a bet on content that does not exist yet. Three places were quietly assuming
the placeholders:

| Element | Problem | Fix |
| --- | --- | --- |
| Hero name | `CharReveal` laid characters out as a flat `inline-flex`, which cannot wrap. A long name would run off the side of a narrow screen. | Group characters into words. The line now wraps between words and never inside one; the stagger still runs continuously across the string. |
| Role rotator | Fixed `text-3xl md:text-5xl` with `whitespace-nowrap`. A long role would overflow. | Fluid `clamp(1.65rem, 7vw, 3rem)`. |
| Contact email | Fixed display size, unbreakable. | Fluid `clamp()` plus `break-all`. |

Also in this pass: a schema.org `Person` block built from the content file,
security headers, a web manifest, `.gitattributes` (which silenced the CRLF
warning on every commit), and a visual fix to the capabilities grid — bordered
cards separated by a gap were stacking 3px of line between neighbours where
every other rule on the page is 1px.

## 11 · Fourth pass — screen reader semantics

- Every `<section>` given `aria-labelledby` pointing at its own heading, so
  landmark navigation reads real names instead of five unnamed regions.
- The ticker's items exposed as a visually-hidden `<ul>`. The marquee itself has
  to be `aria-hidden` — it duplicates its list to make the loop seamless — but
  the items are real content and were previously unreachable.
- `role="list"` restored on all six styled lists.

## 12 · Verification

| Check | Result |
| --- | --- |
| `npm run build` | Passes, 5 static routes |
| `npm run lint` | Clean |
| Console errors | None |
| Horizontal scroll @ 375 / 768 / 1440 | None |
| Touch targets < 44px | None |
| Heading structure | 1 × h1, 5 × h2, 14 × h3 — no skipped levels |
| Section labels resolve | 5 / 5 |
| Skip link is first tabbable, target exists | Yes |
| JSON-LD parses | Yes |

## 13 · Fifth pass — the gold filaments

A flowing line background added behind the hero, then extended to every band of
the page. Full write-up in [16 · Gold filaments](./16-floating-paths.md).

The interesting part was learning that sub-pixel strokes render at full colour
across partial pixel coverage, so perceived brightness is
`opacity × width` — which is why the first tuning pass, low on both, rendered
half its strokes as literally nothing.

## 14 · Sixth pass — bugs found in the wild

Avi deployed to Vercel and reported two problems, with a screen recording.

### Every word run together

Confirmed straight off the video: "Thisisplaceholdercopysittingwhereyour…".

`TextReveal` renders each word inside its own `inline-block` so the mask can
clip it, and put the trailing space **inside** that inline-block. CSS strips
white space at the end of a line box — and an inline-block is its own line box —
so every separator was deleted. It affected every heading and paragraph on the
site.

Fixed by emitting the space as a sibling text node *between* the word spans. It
has to stay a normal breaking space, not `&nbsp;`: it is the only wrap
opportunity in the string, so a non-breaking one would stop paragraphs wrapping
at all.

`CharReveal` was already correct — it uses a literal U+00A0, which is right
there because its wrap opportunity comes from `flex-wrap` between word groups.

Worth recording: an earlier DOM check in this build had already surfaced this,
reporting an accessible name of `"Ashortheadingaboutyou"`. It was dismissed as
an `innerText` artifact. It was the bug, visible long before it was believed.

### "The site glitches"

Three separate causes, all mine:

1. **Placeholder rows navigated to the top.** Every project carries
   `href="#"`, which is a real navigation to the top of the document. Clicking
   one slammed the page back to the hero and replayed every entrance animation.
   Rows with no destination are now inert.

2. **Sections scrolled past as empty panels.** `Reveal` triggered at
   `amount: 0.25` with no margin, so a block only started fading in once a
   quarter of it was already on screen. On a 6500px page — especially during a
   long smooth-scroll from a nav link — section after section arrived blank.
   Reveals now start 240px *before* an element enters.

3. **The nav indicator stuck on the wrong section.** The scroll-spy sorted the
   IntersectionObserver `entries`, which only contain sections whose
   intersection *changed* in that callback, not all of them. The winner
   depended on which section happened to report last. Replaced with a
   deterministic probe line 35% down the viewport.

Also removed a `scrollIntoView` that fired on *any* focus, so a plain mouse
click on a work row kicked off a smooth scroll that fought whatever the user was
already doing. It is now gated on `:focus-visible`.

### A self-inflicted encoding bug

Several of the fixes above were applied with PowerShell `Get-Content -Raw` /
`Set-Content`. On PS 5.1 that reads UTF-8 as ANSI and writes it back
double-encoded: every `—`, `·` and `→` in two docs turned to mojibake, and eight
source files picked up a BOM.

Caught by diffing before committing the docs, so those were restored from git
and rewritten with a UTF-8-safe tool. The BOMs had already been committed and
were stripped in a follow-up. **Text edits in this repo go through Node or the
editor, never a PowerShell read-write round-trip.**

## 15 · Seventh pass — prominence

Avi asked for the filaments to be stronger and present everywhere, not just the
hero.

Prominence was bought with **opacity** (roughly tripled) and by widening the
radial mask from `25% / 78%` to `45% / 96%` — not with stroke width, which
moved barely at all. Wider strokes read as ribbons; the brief was thin. Two new
instances were added, on the ticker band and the footer, taking the treatment to
every band of the page.

## 16 · The actual "glitching" — a flash of invisible content

Two more reports of glitching after the fixes above, with a second recording.
The first frame of that video showed the hero completely empty: nav, gold
waves, and no words at all. Everything appeared a beat later.

The cause was structural, not a tuning problem. **framer-motion writes its
`initial` state into the server-rendered HTML as an inline `opacity:0`.** A
request to the deployed site returned **76 elements carrying `opacity:0`**, the
bulk of them the hero. So the first paint of the site was a background with no
content on it, and it stayed that way until:

1. the JS bundle downloaded, then
2. React hydrated, then
3. a deliberately staggered 2.1-second entrance timeline ran.

On a cold load that is well over a second of blank page. It is the classic
flash-of-invisible-content, and no amount of adjusting delays fixes it, because
nothing can animate before the JavaScript that owns the animation arrives.

### The fix

Above-the-fold content no longer depends on JavaScript to be visible. The hero
entrance moved to CSS keyframes (`hero-entrance.tsx` + `@keyframes hero-rise` /
`hero-char`), which run at first paint. The rotator got
`<AnimatePresence initial={false}>` so its first word is present in the HTML
rather than animating in from hidden. The timeline was compressed from 2.1s to
0.66s.

framer-motion still drives the hero parallax — that only matters once you are
scrolling, by which point hydration has long since happened. Below-the-fold
reveals still use it too, and should: nobody is looking at them pre-hydration.

### Verified, finally with eyes

Diagnosing this took far too long because I had no way to see the site — the
Browser pane never composited a frame all session. Installing `puppeteer-core`
against the system Chrome fixed that and should have happened at the start.
Measured against the live deployment:

| Check | Result |
| --- | --- |
| `opacity:0` nodes in the hero (SSR) | 76 → **0** |
| Hero readable with **JavaScript disabled** | Yes — all 12 glyphs, intro, CTAs |
| Hero readable on slow 3G + 6× CPU throttle, 900ms in | Yes |
| Rotator blank frames over 12s | 0, min opacity 0.84 |
| Console errors | None |

## 17 · The flicker that survived — a compositor bug, not a style bug

The glitch persisted after pass 16. Frame-by-frame analysis of the second
recording (ffmpeg scene detection, then every native frame around each spike)
finally characterised it exactly:

- at t≈3.45s the **entire hero content** vanishes for one frame — waves and nav
  stay — and returns with the rotator mid-swap;
- at t≈6.2s the **waves** vanish for a frame and return.

Meanwhile a probe sampling the live site at rAF rate for 20 seconds — computed
opacity of the hero wrapper, every rotator letter, the SVG and every stroke —
found **zero dips in 390 samples**. The DOM never blanks. Both symptoms are
single-frame **GPU layer drops**: Chromium re-deciding layerization mid-frame
on a machine under graphics load (the recording itself runs at 13fps), and
briefly rendering without whichever layer it is rebuilding.

The page was giving it constant reasons to re-layerize:

| Source | Why it churns layers |
| --- | --- |
| Rotator letters animating `filter: blur()` | Every animating filter promotes its element to its own GPU layer — a swap created and destroyed a dozen layers at once, twice a cycle. The t≈3.45 flash lands exactly on a swap. |
| Blooms: 32–36rem divs under `blur(120–140px)` with animated opacity | Two enormous filter surfaces re-rasterized as their opacity breathes. |
| `mask-image` on the filament container | Children repaint every frame (`stroke-dashoffset`), so the compositor re-rasterizes the whole masked region continuously. |
| Grain pseudo-element at `inset: -50%` | A fixed layer four times the viewport, for a repeating tile that never needed it. |

### The fix — remove the reasons

- Rotator letters animate **opacity and transform only**. No filters.
- Blooms are **pure radial gradients** — a gradient fading to transparent is
  already soft; the blur on top was almost entirely wasted GPU work.
- The filament mask became a **static ink-fade overlay** painted above the
  strokes (visually identical on this ink background), and the SVG container is
  pinned to its own layer with `translateZ(0)` so its layerization never
  changes again.
- Grain layer reduced to viewport size. Hero filament count 34 → 26.

### Honesty about verification

This class of bug depends on the viewer's GPU and driver. It does not reproduce
in headless Chrome — before *or* after the fix — so the verification here is
removal of every identified churn source plus confirmation that nothing else
regressed (SSR still clean, rotator still gapless over 12s, zero console
errors, screenshots visually unchanged). If any flash survives on the affected
machine, the next dial is reducing filament counts further — and the honest
last resort is `chrome://gpu` diagnostics, because at that point the page is
fighting the driver, not the CSS.

## What is still not done

- No automated accessibility audit (axe) and no Lighthouse run.
- No real-device testing.
- No visual confirmation from my side at any point — the Browser pane never
  composited frames, so every check in this log is DOM- and console-based.
  The two bugs in pass 14 are exactly the class of problem that a screenshot
  would have caught in seconds.
- The content is placeholder — by design, per the brief.
