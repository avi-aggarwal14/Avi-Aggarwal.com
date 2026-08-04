# Components — provenance and changes

Where every component came from, and exactly what was changed. Written mostly
so that nothing here is mistaken for something it isn't.

## The 21st.dev budget

The account is on the **free tier: two `get_component` retrievals per day**.
`search`, `get_theme` and `search_logo` are unmetered — only fetching a
component's source code is charged.

That is a real constraint on a build this size, so the two retrievals went to
the two components whose *implementation* carried the value, not just their
look. Everything else was designed by hand in the same visual language, using
the catalogue as reference.

## Retrieved from 21st.dev

### 1. Project Showcase — `@jatin-yadav05` (demo id 9607)

> A minimal, list-based portfolio section with a cursor-following image
> preview. On hover, a smooth floating image appears and tracks your mouse
> using lerp-based animation.

Lives in [`src/components/sections/work.tsx`](../src/components/sections/work.tsx).

This is the signature interaction on the site. The lerp is the whole trick: an
image pinned exactly to the cursor feels stuck to the glass, while one that
eases toward it feels like it has weight.

**Changes made:**

| Change | Why |
| --- | --- |
| Preview positioned in **viewport coordinates** via `position: fixed` | The original reads `containerRef.current?.getBoundingClientRect()` *during render* to place the preview. That value is captured on first paint and never recomputed, so the preview drifts away from the cursor as soon as the page is scrolled or the window resized. Fixed positioning needs no measurement and is correct at any scroll offset. |
| rAF loop started **once** | The original lists `mousePosition` in its effect dependency array, so the animation frame is cancelled and rescheduled on *every pointer event*. The target is held in a ref here and the loop runs for the life of the component. |
| Cursor position kept **out of React state** | The original calls `setSmoothPosition` inside the rAF loop, re-rendering the entire list ~60×/second. The transform is written straight to the node instead. |
| Preview jumps to the pointer on first hover | Otherwise it flies in from wherever the last hover left it. |
| `onFocus`/`onBlur` mirror hover | The original is mouse-only, so keyboard users get nothing. |
| Scaled to editorial proportions; added index numerals and tag rows | House style. |

### 2. Classy Hero — `@jatin-yadav05` (demo id 1946)

> A premium hero section with a black-and-white animated background, elegant
> typography, and interactive elements.

Three separate things were taken from this one:

**a. The background** →
[`src/components/sections/hero-background.tsx`](../src/components/sections/hero-background.tsx)

Six stacked layers, none of them an image file: dotted lattice, ambient blooms,
vignette, sweep highlight, edge lighting, horizon glow.

- Blooms re-tinted from white to carry a trace of the champagne accent, so the
  hero sits in the same palette as the rest of the site.
- The original's second fine-grain SVG tile was dropped — `body.grain` in
  globals.css already lays one grain pass over the whole document, and running
  two doubles the noise.
- A radial mask fades the lattice out behind the copy.
- Every animated layer is skipped entirely under `prefers-reduced-motion`.

**b. `TextRotator`** →
[`src/components/primitives/word-rotator.tsx`](../src/components/primitives/word-rotator.tsx)

- The original tints each letter with a rotating HSL rainbow. Dropped — this
  palette has exactly one chromatic value, and a rainbow would be the loudest
  thing on the page by an order of magnitude. Letters inherit `currentColor`
  and the motion does the work.
- **Sizing bug fixed.** The original reserves width with a hidden copy of
  `words[0]`, so the box is only as wide as the *first* word and longer entries
  are clipped. The sizer here renders the *longest* word, so the line never
  reflows mid-rotation.
- Rotation halts under `prefers-reduced-motion`.

**c. `ButtonRipple`** →
[`src/components/primitives/action-button.tsx`](../src/components/primitives/action-button.tsx)

- Kept: pointer-positioned click ripple, hover arrow nudge.
- Dropped: the indigo→purple→pink gradient wash and three orbiting particles.
  Same reason as the rainbow.
- Added: magnetic cursor pull, and rendered as an `<a>` rather than a `<button>`
  because it navigates.
- Ripple nodes are removed on a timer instead of accumulating.

## Searched but not retrieved

These informed the design without spending a retrieval — the catalogue previews
and descriptions were enough to build from:

| Component | Author | What it informed |
| --- | --- | --- |
| Masked Slide Reveal | `@framecn` | The masked word-rise in `text-reveal.tsx`. |
| Text Reveal (Mask) | `@soralabs` | Word / character / line split strategy. |
| Vertical Cut Reveal | `@cnippet.dev` | Clip-path wipe direction and stagger feel. |
| LumaBar, DockMorph, Magnetic Dock | `@ruixen.ui` | Floating-pill nav geometry and the sliding active indicator. |
| Hover Reveal Cards | `@lavikatiyar` | Capability-grid hover behaviour. |
| Portfolio Gallery | `@isaiahbjork` | Considered for Work, rejected — a 3D overlap layout fights a text-led editorial page. |

## Built from scratch

Everything below is original, written against the same tokens:

`reveal.tsx` · `text-reveal.tsx` · `magnetic.tsx` · `marquee.tsx` ·
`section-heading.tsx` · `shell.tsx` · `nav.tsx` · `footer.tsx` ·
`scroll-progress.tsx` · `ticker.tsx` · `about.tsx` · `capabilities.tsx` ·
`timeline.tsx` · `contact.tsx` · `icon.svg`

## A note on `font-serif`

`@theme inline` **inlines** token values into generated utilities rather than
emitting them as custom properties. That means `var(--font-sans)` resolves to
nothing in plain CSS rules, which is why the base styles reference the
`next/font` variables (`--font-dm-sans`, `--font-instrument-serif`,
`--font-jetbrains-mono`) directly.

Practical consequence: **use `.font-display` for the serif, not Tailwind's
`font-serif` utility.** `.font-display` is the supported class and carries the
correct letter-spacing and line-height with it.
