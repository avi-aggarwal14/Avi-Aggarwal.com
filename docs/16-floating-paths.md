# The gold filaments

The flowing line treatment that runs behind every band of the site.

Component: [`src/components/ui/floating-paths.tsx`](../src/components/ui/floating-paths.tsx)

## Where it came from

A community "Floating Paths" background — 36 long, nested bezier sweeps whose
`pathOffset` animates on a slow linear loop, so the strokes appear to flow
endlessly through each other.

The path geometry is kept verbatim. It is the entire character of the effect
and there was no reason to touch it. Everything about how it *reads* was
rewritten.

## What changed, and why

| | Source | Here |
| --- | --- | --- |
| Colour | `text-slate-950 dark:text-white` | `text-accent` — the champagne token |
| Stroke width | `0.5 + i × 0.03` → 0.5–1.55px | 0.30–0.88px depending on intensity |
| Stroke opacity | `0.1 + i × 0.03` → up to 1.15 | 0.14–0.64 depending on intensity |
| Duration | `20 + Math.random() × 10` | `speed + seeded(i) × 12`, deterministic |
| Scope | One instance, hero only | Eight instances — every band of the page |
| Off-screen | Always animating | Parked when out of view |
| Reduced motion | Not handled | Renders still, fully-drawn |
| Edges | Hard clip | Radial mask, fades out on all sides |

### Colour

`text-accent`, not a hard-coded gold. The strokes inherit the same `--accent`
token as every other highlight on the site, so the one-line re-skin promised in
[01 · Design system](./01-design-system.md) still holds — change `--accent` and
the filaments change with it.

### Thin, but prominent — and why those are different levers

Sub-pixel strokes do not render at reduced intensity. A 0.5px line renders at
**full colour across roughly half a pixel of antialiased coverage**. So the
brightness you actually perceive is approximately:

```
effective = strokeOpacity × strokeWidth
```

Two consequences, and both bit during this build.

**First:** turning both numbers down multiplies two small values together and
the faintest strokes stop painting anything at all. The opening tuning pass did
exactly that — 0.12px at 0.03 opacity is an effective 0.0036, which is nothing.
Half the DOM nodes were rendering empty.

**Second, and the reason for the current values:** the treatment then read as
too faint, and the brief is "thin *and* prominent". Those only pull against
each other if you reach for width. So prominence was bought almost entirely
with **opacity**, which roughly tripled, while widths moved barely at all.
Wider strokes would read as ribbons; brighter thin ones stay filaments.

| Intensity | Width | Opacity | Effective max | Used by |
| --- | --- | --- | --- | --- |
| `whisper` | 0.30 → 0.55 | 0.14 → 0.36 | 0.20 | Work |
| `subtle` | 0.32 → 0.65 | 0.20 → 0.51 | 0.33 | About, Capabilities, Timeline, Footer |
| `present` | 0.35 → 0.88 | 0.26 → 0.64 | 0.57 | Hero, Ticker, Contact, 404 |

For comparison the source component reaches an effective brightness of roughly
**1.5** at up to 1.55px. The hero here is still under half that brightness at
just over half the width.

### The mask is a prominence control too

Easy to overlook. The container is masked with a radial gradient, and the first
version held full opacity only to 25% before fading out completely by 78% —
which meant most of every sweep was faded away before it was ever seen.

Widening it to `black 45%, transparent 96%` keeps far more of each stroke at
full strength while still avoiding a hard edge at the band boundary. That single
change did as much for prominence as the opacity increase.

### Per-band tuning

Intensity is matched to how much else the band is already doing, and the flow
direction alternates so the eye is led across the page rather than dragged the
same way eight times.

| Band | Position | Intensity | Strokes | Reasoning |
| --- | --- | --- | --- | --- |
| Hero | −1 | present | 34 | The opening statement. Fullest treatment. |
| Ticker | +1 | present | 12 | Only ~90px tall — a high count compresses into a solid gold haze rather than reading as lines. |
| About | +1 | subtle | 26 | Mirrors the hero flow. |
| Work | −1 | whisper | 20 | Already carries the cursor preview, four hover beds and the densest type on the page. |
| Capabilities | +1 | subtle | 26 | Behind a six-card grid. |
| Timeline | −1 | subtle | 26 | Runs against the scroll-drawn spine. |
| Contact | +1 | present | 30 | The closing statement. |
| Footer | −1 | subtle | 14 | Carries the treatment to the last pixel. |
| 404 | −1 | present | 28 | A dead end should still look like the same site. |

The hero instance is layer 2 of seven in `hero-background.tsx` — above the
dotted lattice, below the vignette and blooms, so it is softened by everything
stacked on top rather than sitting flat on the front.

## Performance

188 animated strokes across the page is not free, and `pathOffset` animates
`stroke-dashoffset`, which repaints rather than compositing.

Three mitigations:

**Off-screen instances are parked.** `useInView` with a 240px margin switches
each instance between its looping target and a static, fully-drawn one. This is
what makes the count affordable: at any moment only the one or two bands
actually on screen are animating, not all eight.

**Counts are matched to band height.** The ticker gets 12, the footer 14 — a
short band does not need 30 strokes to look full.

**The rendering is otherwise static** — no state, no per-frame JS. The animation
runs entirely inside framer-motion's own loop.

If the page ever feels heavy on a low-end machine, `count` is the first dial to
turn down, and it costs very little visually.

## Accessibility

- Every instance is `aria-hidden` and `pointer-events-none`.
- Under `prefers-reduced-motion` the strokes render still and fully drawn — the
  texture survives, only the movement stops. Removing them entirely would
  change the design for those users; freezing them does not.
- Contrast is unaffected. Text always sits in a `relative z-10` wrapper above
  the backdrop, and even the brightest instance tops out at an effective 0.57
  against `--ink`.

## Two implementation notes

**`framer-motion`, not `motion`.** The upstream component imports from
`motion/react`. `motion` is framer-motion rebranded — same codebase, same
maintainers, identical API for everything used here. This project already ships
framer-motion 12, so installing `motion` would have added a second ~50kb copy of
the same library for nothing.

**Deterministic variation.** The source calls `Math.random()` inside the
transition config to vary each path's duration. That is non-deterministic across
server and client renders. A hash of the index gives the same visual variety
with no hydration risk.

## Tuning it

Everything is a prop:

```tsx
<Section
  id="work"
  paths={{ position: -1, intensity: "whisper", count: 20, speed: 34 }}
>
```

- `position` — flow direction and skew. Negative and positive mirror.
- `intensity` — `"whisper"` | `"subtle"` | `"present"`.
- `count` — number of strokes.
- `speed` — seconds for one pass. Higher is slower.

For bands that are not a `<Section>` — the ticker and the footer — drop
`<SectionPaths />` in as the first child of a `relative overflow-hidden`
container and wrap the content in `relative z-10`.

To remove the treatment from a band, delete its `paths` prop. To change the
overall balance everywhere at once, edit the `INTENSITY` table in the component
— it is the single place all three presets are defined.
