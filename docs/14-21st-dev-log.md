# 21st.dev research log

What was searched, what came back, and how each result was used. Kept because
the *rejected* options explain the design as much as the chosen ones.

## The budget

```json
{ "tier": "free", "freeRetrievalsPerDay": 2, "freeRetrievalsRemaining": 2 }
```

`search`, `search_picker`, `get_theme`, `search_logo` and `get_usage` are free
and unmetered. **Only `get_component` — fetching a component's actual source —
is charged.** Two per day.

That shapes the whole approach: search widely, retrieve narrowly, and spend the
two retrievals on components whose *implementation* is hard to reproduce rather
than whose appearance is.

## Searches run

### "premium personal portfolio hero section with animated gradient and bold typography"

Twelve results. The shortlist:

| Result | Verdict |
| --- | --- |
| **Classy Hero** — `@jatin-yadav05` | **Retrieved.** "Black-and-white animated background, elegant typography." The only result whose palette did not need fighting. |
| Portfolio Hero — `@waleedkibhen` | Rejected. Built around a profile-image overlay; there is no portrait for the hero here. |
| Animated Hero — `@ravikatiyar162` | Rejected. Red gradient title — wrong palette, and the cursor-following dot grid duplicates work the background already does. |
| Experience Hero — `@hardikkashiyani123456788` | Rejected. GSAP dependency for one section. |
| PrismaHero — `@rahil1202` | Rejected. Requires a background video. |
| Hero with Mockup — `@serafimcloud` | Rejected. Product-mockup framing — a SaaS shape, not a person's. |

### "project showcase card grid with hover reveal for portfolio work"

| Result | Verdict |
| --- | --- |
| **Project Showcase** — `@jatin-yadav05` | **Retrieved.** List-based with a lerp-tracked cursor preview. The lag is the whole trick, and it is fiddly enough to be worth the retrieval. |
| Portfolio Gallery — `@isaiahbjork` | Rejected. 3D overlapping layout fights a text-led editorial page. |
| Hover Reveal Cards — `@lavikatiyar` | Not retrieved; the blur-siblings-on-hover idea informed the capability grid. |
| Gradient Card Showcase — `@minhxthanh` | Rejected. Skewed gradient back-panels — too much colour for a one-accent palette. |
| Text Reveal Card — `@nexus-ui` | Rejected for Work; the mouse-follow glow idea reappears in the capability spotlight. |

### "scroll reveal animated text mask heading kinetic typography"

Ten results, none retrieved. The pattern was clear enough from descriptions and
previews to rebuild against our own easing tokens:

- **Masked Slide Reveal** — `@framecn` — "words slide up out of an invisible
  horizontal mask". This is the exact behaviour of `TextReveal`.
- **Text Reveal (Mask)** — `@soralabs` — line / word / character split strategy.
- **Vertical Cut Reveal** — `@cnippet.dev` — clip-path wipe direction and
  stagger feel.

### "floating glass navbar dock with smooth active indicator"

Eight results, mostly `@ruixen.ui` docks — LumaBar, DockMorph, Magnetic Dock,
Gooey Dock, Tilted Dock. None retrieved.

They are icon docks, and this site needs a text nav. What carried over was the
geometry: a floating pill inset from the viewport edge rather than a bar welded
to the top, and a single indicator that *slides* between items instead of
blinking on and off. That became the `layoutId` pill in `nav.tsx`.

### Theme searches — the dead end worth recording

```
search({ query: "elegant dark premium theme with warm accent", type: "theme" })
→ []

search({ query: "dark theme", type: "theme" })
→ 1 result: "Classic blue and dark theme" by @eliaszaki
```

The theme catalogue is thin, and the one dark theme available is blue —
directly against the warm-monochrome direction. So the palette was authored from
scratch against the `ui-ux-pro-max` colour guidance instead. `get_theme` is
free, so this cost nothing but the search.

### Logos

`search_logo` was never called. The design deliberately uses text labels for
social links rather than brand marks — which avoids the "correct brand logo"
checklist item altogether, and looks better in an editorial layout than a row of
recognisable icons would.

## Where the two retrievals went

| Retrieval | Component | What it bought |
| --- | --- | --- |
| 1 of 2 | Project Showcase (demo id 9607) | The lerp-tracking preview — the signature interaction. |
| 2 of 2 | Classy Hero (demo id 1946) | Three things at once: a six-layer background, a text rotator, and a ripple button. The best value available from one call. |

Both arrived with bugs, all three fixed. Detailed in
[03 · Components](./03-components.md).

## What this says about using the catalogue

The useful pattern that emerged: **search is for design intelligence, retrieval
is for hard implementation.**

Descriptions and preview images were enough to make design decisions on more
than forty components — including several rejections that genuinely shaped the
result. Only two needed their source, and both were chosen for mechanics
(inertial cursor tracking, layered atmospherics) rather than for looks.

A build that retrieved ten components would have had less coherence, not more —
each one arrives with its own palette, easing and spacing assumptions, and
reconciling them costs more than writing the component.
