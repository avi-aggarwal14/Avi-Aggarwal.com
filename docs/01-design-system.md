# Design system

The whole site runs on a small, deliberately boring set of tokens. Everything
visual on the page resolves back to something in this file, which is what keeps
a page this animated from looking like a pile of unrelated effects.

Tokens live in [`src/app/globals.css`](../src/app/globals.css).

## The one-line re-skin

```css
--accent: #d6b77c;
```

That is the only chromatic value in the palette. Every highlight, link
underline, focus ring, active nav dot, hover glow and section marker reads from
it. Change that line and the entire site changes character without a single
other edit.

## Colour

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#08080A` | Page base. Deliberately *not* `#000` — a hair of warmth stops the screen looking like a switched-off monitor. |
| `--ink-raised` | `#0F0F13` | Cards, inset panels, hover beds. |
| `--ink-overlay` | `#16161B` | Popovers and anything floating above a card. |
| `--bone` | `#F3EFE7` | Primary text. Warm off-white, not `#FFF`. |
| `--bone-muted` | `#9C978D` | Secondary text. |
| `--bone-faint` | `#5D5A54` | Meta, numerals, disabled. |
| `--accent` | `#D6B77C` | The single accent — champagne. |
| `--line` | `bone @ 10%` | Default hairline. |
| `--line-strong` | `bone @ 20%` | Emphasised hairline. |

### Why warm monochrome and not another purple dev portfolio

The `ui-ux-pro-max` product table puts Portfolio/Personal at *Motion-Driven +
Minimalism* with "brand primary + artistic interpretation", and the adjacent
premium/architectural lane at *Monochrome + Gold Accent + High Imagery*. Warm
monochrome with one metallic accent is the intersection: it reads as editorial
and expensive, it never competes with project imagery — which is the actual
content of a portfolio — and it side-steps the indigo/violet gradient that
roughly every developer portfolio has been wearing since 2021.

### Contrast

Measured against `--ink` (`#08080A`):

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--bone` on `--ink` | ~18:1 | AAA |
| `--bone-muted` on `--ink` | ~6.8:1 | AA, body-text safe |
| `--accent` on `--ink` | ~10.7:1 | AAA |
| `--bone-faint` on `--ink` | ~2.9:1 | Decorative only — never body text |

`--bone-faint` is deliberately below AA. It is restricted to large numerals and
non-essential meta, and it is never the sole carrier of information.

## Type

Three families, each with exactly one job.

| Role | Family | Used for |
| --- | --- | --- |
| Display | **Instrument Serif** | Headlines only. Carries all the personality. |
| Body | **DM Sans** | Everything readable. The skill's "Premium Sans" row names Satoshi/General Sans with DM Sans as the Google-hosted equivalent. |
| Meta | **JetBrains Mono** | Eyebrows, years, indices, counters. |

The serif/grotesk split is what makes the page feel like a magazine rather than
a dashboard. The mono is the quiet third voice that makes the other two look
intentional.

### Fluid scale

Display sizes are `clamp()`-based, so there is not a single typographic media
query in the project:

```css
.text-display-xl { font-size: clamp(3.25rem, 13vw, 12rem); }
.text-display-lg { font-size: clamp(2.75rem, 8vw,  6.5rem); }
.text-display-md { font-size: clamp(2rem,    5vw,  3.75rem); }
```

Body copy is capped at `--measure: 68ch`, inside the 65–75 character band the
skill's typography rules call for.

## Motion

One easing vocabulary, four tokens, used by every animated element:

| Token | Curve | Used for |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances. Fast out of the gate, long settle. |
| `--ease-out-quint` | `cubic-bezier(0.22, 1, 0.36, 1)` | Staggered text reveals. |
| `--ease-in-out-soft` | `cubic-bezier(0.65, 0, 0.35, 1)` | Loops and ambient drift. |
| `--dur-fast` / `--dur-base` / `--dur-slow` | 180 / 320 / 720ms | Micro-interactions sit in the 150–300ms band the skill's animation rules specify; only full-section entrances use `--dur-slow`. |

Motion is `transform`/`opacity`/`filter` only — never `width`, `height`, `top`
or `left` — so everything stays on the compositor.

## Texture

Three layers give the page depth without a single decorative image:

1. **Film grain** — a fixed SVG `feTurbulence` overlay at 3.5% opacity across
   the whole document. It kills gradient banding on large dark fields and is the
   cheapest "expensive" cue available.
2. **Dotted grid** — a two-offset radial-gradient lattice behind the hero.
3. **Ambient blooms** — slow, low-opacity blurred radials that breathe on an
   8-second cycle.

Layers 2 and 3 are adapted from the 21st.dev *Classy Hero* background. See
[`03-components.md`](./03-components.md).

## Radius and elevation

`--radius: 0.75rem`, on the tight side on purpose. Editorial layouts want
corners that read as *cut* rather than *soft*; heavy rounding is what makes a
premium layout drift toward consumer-app friendliness.

There are no drop shadows in the palette. On a near-black base, shadows are
invisible — depth is carried by surface lightness (`--ink` → `--ink-raised` →
`--ink-overlay`) and hairlines instead.

## Rules this system holds itself to

- No emoji as UI icons. Every icon is an SVG from `lucide-react`.
- Every clickable element gets `cursor-pointer` and a non-colour hover cue.
- Hover states never change layout — no `scale` on anything in document flow.
- `:focus-visible` is always styled, never removed.
- `prefers-reduced-motion` collapses every decorative animation; nothing that
  carries meaning is animation-dependent.
