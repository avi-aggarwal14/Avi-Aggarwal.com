# The gold filaments

The flowing line treatment that runs behind six sections of the site.

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
| Stroke width | `0.5 + i × 0.03` → 0.5–1.55px | 0.25–0.75px depending on intensity |
| Stroke opacity | `0.1 + i × 0.03` → up to 1.15 | 0.06–0.34 depending on intensity |
| Duration | `20 + Math.random() × 10` | `speed + seeded(i) × 12`, deterministic |
| Scope | One instance, hero only | Six instances, tuned per section |
| Off-screen | Always animating | Parked when out of view |
| Reduced motion | Not handled | Renders still, fully-drawn |
| Edges | Hard clip | Radial mask, fades out on all sides |

### Colour

`text-accent`, not a hard-coded gold. The strokes inherit the same `--accent`
token as every other highlight on the site, so the one-line re-skin promised in
[01 · Design system](./01-design-system.md) still holds — change `--accent` and
the filaments change with it.

### Thinness, and the thing that is easy to get wrong

Sub-pixel strokes do not render at reduced intensity. A 0.5px line renders at
**full colour across roughly half a pixel of antialiased coverage**. So the
brightness you actually perceive is approximately:

```
effective = strokeOpacity × strokeWidth
```

That matters because the obvious way to make something subtle — turn both
numbers right down — multiplies two small values together, and the faintest
strokes stop painting anything at all. The first tuning pass here did exactly
that: 0.12px at 0.03 opacity is an effective 0.0036, which is nothing. Half the
DOM nodes were rendering empty.

The current ranges keep every stroke above the visibility floor while staying
well under the source:

| Intensity | Width | Opacity | Effective brightness | Used by |
| --- | --- | --- | --- | --- |
| `whisper` | 0.25 → 0.40 | 0.06 → 0.18 | 0.015 → 0.072 | Work |
| `subtle` | 0.28 → 0.55 | 0.08 → 0.26 | 0.022 → 0.143 | About, Capabilities, Timeline |
| `present` | 0.30 → 0.75 | 0.09 → 0.34 | 0.027 → 0.254 | Hero, Contact, 404 |

For comparison, the source component reaches an effective brightness of roughly
**1.5** — around six times brighter than the hero here, at twice the width.

### Per-section tuning

Intensity is matched to how much else the section is already doing, and the
flow direction alternates so the eye is led across the page rather than dragged
the same way six times.

| Section | Position | Intensity | Strokes | Reasoning |
| --- | --- | --- | --- | --- |
| Hero | −1 | present | 36 | The opening statement. Fullest treatment. |
| About | +1 | subtle | 26 | Mirrors the hero flow. |
| Work | −1 | whisper | 20 | Already carries the cursor preview, four hover beds and the densest type on the page. Deliberately almost invisible. |
| Capabilities | +1 | subtle | 24 | Behind a six-card grid. |
| Timeline | −1 | subtle | 24 | Runs against the scroll-drawn spine. |
| Contact | +1 | present | 32 | The closing statement. |
| 404 | −1 | present | 28 | A dead end should still look like the same site. |

The hero instance is layer 2 of seven in `hero-background.tsx` — above the
dotted lattice, below the vignette and blooms, so it is softened by everything
stacked on top rather than sitting flat on the front.

## Performance

162 animated strokes across the page is not free, and `pathOffset` animates
`stroke-dashoffset`, which repaints rather than compositing.

Three mitigations:

**Off-screen instances are parked.** `useInView` with a 240px margin switches
each instance between its looping target and a static, fully-drawn one. Without
this, all six run permanently — five of them for nobody.

**Stroke counts are tuned down** where prominence is low. Work uses 20, not 36.

**The rendering is otherwise static** — no state, no per-frame JS. The animation
runs entirely inside framer-motion's own loop.

## Accessibility

- Every instance is `aria-hidden` and `pointer-events-none`.
- Under `prefers-reduced-motion` the strokes render still and fully drawn — the
  texture survives, only the movement stops. Removing them entirely would
  change the design for those users; freezing them does not.
- Contrast is unaffected. At an effective brightness of 0.25 at the very
  strongest, against `--ink`, the strokes do not measurably alter the contrast
  of any text sitting over them.

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

To remove the treatment from a section, delete its `paths` prop. To change the
overall balance, edit the `INTENSITY` table in the component — it is the single
place all three presets are defined.
