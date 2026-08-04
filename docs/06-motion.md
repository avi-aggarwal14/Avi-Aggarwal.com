# Motion

The site moves a lot. This is the reasoning behind each piece, and the rules
that stop it becoming a showreel.

## The governing idea

Motion is used for exactly three jobs:

1. **Orientation** — showing where you are (scroll progress, nav indicator,
   timeline spine).
2. **Hierarchy** — controlling the order things are read in (staggered reveals).
3. **Affordance** — showing what responds to you (magnetic pull, hover
   previews, cursor swell).

Anything that does none of those was cut. The clearest example: the 21st.dev
*Classy Hero* ships its call-to-action with three orbiting particles and a
rainbow gradient wash on hover. Both were dropped. They are decoration on top of
an element that was already communicating perfectly well.

## One vocabulary

Four easings and three durations, in `globals.css` and mirrored in
`lib/motion.ts`. Nothing defines its own.

| Token | Curve / value | Used for |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances. Fast off the mark, long settle. |
| `--ease-out-quint` | `cubic-bezier(0.22, 1, 0.36, 1)` | Staggered text. |
| `--ease-in-out-soft` | `cubic-bezier(0.65, 0, 0.35, 1)` | Loops and ambient drift. |
| `--dur-fast` | 180ms | Colour and border transitions. |
| `--dur-base` | 320ms | Hover states, opacity swaps. |
| `--dur-slow` | 720ms | Section entrances only. |

Micro-interactions sit in the 150–300ms band the `ui-ux-pro-max` animation rules
specify. Only full-block entrances go slower, and only because they cover more
distance.

Every easing here is an *ease-out*. Entrances that decelerate feel like objects
arriving; ease-in-out on an entrance reads as hesitant.

## What moves, and why

| Element | Motion | Job |
| --- | --- | --- |
| Hero name | Character reveal from a mask | The page's opening statement. The only character-level animation on the site. |
| Hero role | Letter-staggered word rotation | Says several things in one line without a list. |
| Hero block | Parallax drift on scroll | Depth. Content leaves faster than its background. |
| Sections | Fade + 24px rise, staggered | Controls reading order. |
| Section headings | Masked word rise | Marks the start of a movement. |
| Ticker | Continuous horizontal scroll | Breaks the vertical rhythm between hero and body. |
| Work rows | Cursor-tracked image preview on a lerp | The signature interaction. |
| Capability cards | Pointer-positioned radial spotlight | Makes a static grid feel responsive. |
| Timeline | Spine fills as you scroll | The line is drawn by the act of reading. |
| Nav indicator | `layoutId` pill sliding between links | Continuity — the indicator moves rather than blinking. |
| Buttons | Magnetic pull + click ripple | Affordance and feedback. |
| Cursor | Trailing ring with inertia | Second hover cue on everything interactive. |
| Scroll progress | Spring-smoothed bar | Position in a long page. |

## The restraint rules

**Nothing animates twice.** Every scroll reveal is `viewport={{ once: true }}`.
Re-animating on every pass is the fastest way to make an expensive-looking site
feel like a template.

**Hover never changes layout.** No `scale` on anything in document flow, no
size changes on cards. Hover beds fade in behind content; they do not push it.
An element that grows under the pointer moves its own click target away.

**Only compositor properties.** `transform`, `opacity`, `filter`. Never `width`,
`height`, `top`, `left`. The timeline spine animates `scaleY` on a
`transform-origin: top` element rather than growing `height`, which would force
layout every frame.

**The magnetic pull is 12px.** Magnetic buttons stop feeling expensive and start
feeling like a toy somewhere around 30px, and become hard to click past 40.

**Stagger is 55ms for words, 32ms for characters.** Slower than that and text
reveals feel like they are being typed at you.

## Reduced motion

Handled in two layers, because the CSS layer alone is not sufficient.

**Layer 1 — CSS.** All animations and transitions collapse to 0.01ms; smooth
scrolling off.

**Layer 2 — JS**, via `useReducedMotion`, where collapsing the duration gives
the wrong result:

- `TextReveal` / `CharReveal` render plain text — no splitting at all.
- `WordRotator` **stops rotating**. This is the one that matters: collapsing its
  duration would make it cycle words *faster*, which is precisely the opposite
  of what was asked for.
- `HeroBackground` skips the sweep highlight entirely and stops the blooms.
- `Hero` disables scroll parallax.
- `Magnetic` stops pulling.
- `Cursor` does not mount at all.

## The performance rule underneath all of it

**Pointer position never enters React state.**

Three components follow the cursor. All three keep the target in a ref, run one
`requestAnimationFrame` loop, and write directly to `node.style.transform` or a
CSS custom property. Calling `setState` on every pointer event re-renders whole
subtrees sixty times a second, and it is the single most common reason a site
like this feels heavy on a laptop.

The component this pattern was adapted from does exactly that — `setState`
inside its rAF loop, plus an effect that cancels and reschedules the frame on
every mouse move. Both were rewritten. See
[`03-components.md`](./03-components.md).
