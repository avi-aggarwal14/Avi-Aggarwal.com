# Responsive behaviour

Verified in a real browser at the four widths the `ui-ux-pro-max` layout rules
name: **375 / 768 / 1024 / 1440**.

| Width | `scrollWidth` | Horizontal scroll |
| --- | --- | --- |
| 375 | 375 | None |
| 768 | 758 | None |
| 1440 | 1430 | None |

(`scrollWidth` under viewport width at 768/1440 is the scrollbar gutter.)

## The approach

**Almost no breakpoints.** Type is `clamp()`-based and layout is grid/flex with
`minmax`, so most of the page adapts continuously rather than snapping at fixed
widths. The hero headline measures 52px at 375 and 187px at 1440 without a
single media query in between.

Breakpoints are used only where the *structure* has to change, not where the
size does:

| Breakpoint | What changes |
| --- | --- |
| `sm` (640) | Contact socials go from stacked to three-up. Nav reveals the "Get in touch" pill. |
| `md` (768) | Nav switches from hamburger sheet to inline links. Timeline gains its left rail and right-aligned period column. Scroll cue appears. |
| `lg` (1024) | About splits into the 5/7 copy-and-portrait grid. Capabilities goes three-up. The cursor-following work preview is enabled. |

## Mobile-specific decisions

**The cursor-following preview does not exist below `lg`.** There is no cursor
to follow. Rather than silently dropping the interaction, the Work section
swaps in a "Tap a project to open it" line, so the affordance is still stated.

**The custom cursor never mounts on touch.** Gated behind
`(pointer: fine)` — rendering a fake cursor on a device with no pointer is pure
overhead.

**Navigation becomes a full-screen sheet**, with links at `text-4xl` and 44px+
row heights. A shrunken copy of the desktop nav is the usual mistake here; a
sheet gives every target a comfortable thumb area.

**The role rotator is fluid, not stepped.** It sets `whitespace-nowrap` — a word
that re-wraps mid-rotation looks broken — so a fixed font size would let a long
role run off the right edge on a narrow screen. `clamp(1.65rem, 7vw, 3rem)`
means any reasonable entry fits at any width.

**Timeline collapses to a single column** below `md`, with the spine moving to
the far left and periods sitting above each entry rather than beside it.

## Why nothing scrolls sideways

Four elements are genuinely wider than the viewport at 375px:

- two hero ambient blooms (512px, 576px)
- the hero sweep highlight (1317px)
- the marquee track (2972px — it is meant to be, it is a loop)

All four sit inside `overflow-hidden` parents, so none of them extends the
document. `body { overflow-x: hidden }` is set as a backstop, but it is not
what is doing the work — the containment is.

## Type at small sizes

- Body copy stays 16px on mobile. It is never scaled down.
- The About lede is 24px at 375px — display-size, deliberately.
- Mono meta labels are 10–11px, which is below the readable-body threshold, but
  they are labels rather than prose and are always adjacent to full-size text.

## Not tested

- No real-device testing. All measurements come from a resized desktop browser,
  which does not reproduce mobile Safari's dynamic viewport, touch latency, or
  its font rendering.
- `100svh` is used for the hero rather than `100vh`, which should handle the
  collapsing mobile URL bar — but that specifically is worth confirming on a
  real iPhone.
- Landscape phone orientation is not specifically designed for; the hero will
  be tight at 812×375.
