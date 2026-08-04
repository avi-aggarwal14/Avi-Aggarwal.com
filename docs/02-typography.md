# Typography

Type is doing most of the work on this site. There is no photography in the
design, no illustration, and one accent colour — which means the headline
treatment *is* the visual identity.

## The three families

| Role | Family | Weight | Job |
| --- | --- | --- | --- |
| Display | **Instrument Serif** | 400 | Every headline. Carries all the personality. |
| Body | **DM Sans** | 400 / 500 | Everything meant to be read. |
| Meta | **JetBrains Mono** | 400 | Eyebrows, years, indices, counters, tags. |

All three are Google Fonts, loaded through `next/font/google`, self-hosted at
build time. No render-blocking request to a third-party CDN, no layout shift —
`next/font` generates a metric-matched fallback so text does not reflow when the
webfont lands.

### Why this pairing

The `ui-ux-pro-max` typography table's "Premium Sans" row names Satoshi /
General Sans with **DM Sans** as the Google-hosted equivalent — clean, slightly
geometric, no strong opinions of its own. Exactly what you want carrying body
copy underneath a loud headline face.

**Instrument Serif** is the decision that sets the tone. A high-contrast display
serif at very large sizes is what separates an editorial layout from a
dashboard, and it is the reason the page reads as a magazine spread rather than
a developer template. Most personal sites in this space reach for a geometric
sans at 700 weight; a serif at 400 is quieter and considerably more expensive-
looking.

**JetBrains Mono** is the third voice. Used small and wide-tracked, it is what
makes the other two look deliberate — an eyebrow in mono above a serif headline
reads as a system, whereas the same eyebrow set in the body sans reads as an
accident.

The pairing works because the three are maximally distinct. Serif / grotesk /
mono can never be mistaken for one another, so hierarchy is legible before a
single size is applied.

## Scale

Display sizes are fluid. There is not one typographic media query in the
project.

```css
.text-display-xl { font-size: clamp(3.25rem, 13vw, 12rem); }  /* hero name   */
.text-display-lg { font-size: clamp(2.75rem, 8vw,  6.5rem); } /* contact     */
.text-display-md { font-size: clamp(2rem,    5vw,  3.75rem); }/* section h2  */
```

`clamp()` with a viewport-relative middle term means the headline is always
proportional to the screen it is on: 52px at 375px wide, 187px at 1440px, both
measured in the browser.

Body copy stays at a fixed 16px/1.6. Fluid *body* text is a mistake — the
comfortable reading size does not change with the window, only the measure does.

## Measure and rhythm

- `--measure: 68ch` caps every paragraph, inside the 65–75 character band the
  skill's `line-length` rule specifies.
- Body line-height is 1.6, in the 1.5–1.75 band.
- Display line-height is 0.95. Large type needs *negative* leading relative to
  body copy or the lines drift apart and the headline stops reading as one
  object.
- Display tracking is `-0.02em`. Large type looks loose at default tracking.
- Mono is tracked `+0.16em` to `+0.22em` and uppercased. Monospace at small
  sizes needs air or it turns into a smear.

## Details that matter at this size

- **`tabular-nums`** on years, indices and the copyright. Proportional figures
  visibly jitter when numbers change or sit in a column.
- **Descender clearance.** The masked reveal clips words inside
  `overflow-hidden`, which slices the tails off `g`, `y`, `p` and `j`. Every
  mask carries `pb-[0.12em]` to clear them.
- **The rotator reserves the longest word.** The component this was adapted from
  sizes its box from `words[0]`, so longer entries get clipped. Fixed — see
  [`03-components.md`](./03-components.md).
- **Warm off-white, not pure white.** `#F3EFE7` rather than `#FFFFFF`. Pure
  white on near-black glares and produces halation around the strokes at
  display sizes.

## One trap

`@theme inline` **inlines** token values into generated utilities rather than
emitting them as custom properties, so `var(--font-serif)` resolves to nothing
in plain CSS.

**Use `.font-display` for the serif — not Tailwind's `font-serif` utility.**
`.font-display` is the supported class and carries the correct tracking and
leading with it.
