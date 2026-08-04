# Architecture

## Shape of the project

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata, skip link
│   ├── page.tsx              section order — the whole page assembly
│   ├── globals.css           the design tokens. everything resolves here
│   ├── not-found.tsx         404
│   ├── opengraph-image.tsx   social card, generated at build
│   ├── sitemap.ts
│   └── robots.ts
│
├── content/
│   └── site.ts               ← every string on the site
│
├── lib/
│   ├── utils.ts              cn, lerp, clamp, pad
│   └── motion.ts             shared easings, durations, variants
│
└── components/
    ├── primitives/           reusable, content-agnostic
    │   ├── reveal.tsx
    │   ├── text-reveal.tsx
    │   ├── word-rotator.tsx
    │   ├── magnetic.tsx
    │   ├── marquee.tsx
    │   ├── action-button.tsx
    │   ├── section-heading.tsx
    │   └── shell.tsx
    │
    ├── layout/               page furniture, present on every screen
    │   ├── nav.tsx
    │   ├── footer.tsx
    │   ├── scroll-progress.tsx
    │   └── cursor.tsx
    │
    └── sections/             one file per band of the page
        ├── hero.tsx
        ├── hero-background.tsx
        ├── ticker.tsx
        ├── about.tsx
        ├── work.tsx
        ├── capabilities.tsx
        ├── timeline.tsx
        └── contact.tsx
```

## The three rules holding it together

### 1. Content never lives in a component

Every string is in `content/site.ts`. No section hard-codes copy. This is what
makes the site fillable by someone who does not want to read JSX, and it is the
single most important structural decision in the project given the brief was
*design it, I'll add my content later*.

The content object is typed with `satisfies Project[]` and friends, so a
malformed entry is a build error rather than a blank space on the page.

### 2. Every visual value resolves to a token

No component contains a hex code, an easing curve, or a duration of its own.
They come from `globals.css` and `lib/motion.ts`. That is why a page with this
much movement still reads as one object rather than a pile of separate effects
— and why `--accent` alone can re-skin the whole thing.

The one deliberate exception is `opengraph-image.tsx`. Satori supports no CSS
variables, so the palette is repeated literally there. It is commented as such.

### 3. Sections are independent

Each section owns its own layout and state, imports what it needs from
`primitives/`, and knows nothing about its siblings. Deleting a section from
`page.tsx` removes it cleanly.

## Server vs client

`page.tsx` and `layout.tsx` are server components. Everything under
`components/` is `"use client"` — they all use hooks, pointer events or
`framer-motion`.

There is no data fetching, no database and no API route. Every route
prerenders to static HTML:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /opengraph-image
├ ○ /robots.txt
└ ○ /sitemap.xml
```

Which means it can be hosted anywhere — Vercel, Netlify, Cloudflare Pages, or a
static export behind any CDN.

## Performance decisions

**No cursor position ever enters React state.** Three components track the
pointer — the work list, the capability spotlight, the custom cursor — and all
three write transforms or custom properties straight to the DOM inside a single
`requestAnimationFrame` loop. Routing 60 updates a second through `setState`
re-renders whole subtrees for no reason, and it is the most common way a page
like this ends up feeling heavy.

**Only compositor properties are animated** — `transform`, `opacity`, `filter`.
Never `width`, `height`, `top` or `left`. The timeline spine, for example,
animates `scaleY` on a `transform-origin: top` element rather than growing its
height, which would force layout on every frame.

**Scroll reveals fire once.** `viewport={{ once: true }}` everywhere.
Re-animating on every scroll-past costs work and makes a site feel cheap.

**Scroll listeners are passive** and observers are disconnected on unmount.

**No image component in the hero.** The entire hero background is CSS gradients
and one inline SVG noise tile — there is no image request in the critical path.

## Known trade-offs

- **`framer-motion` is a substantial dependency** (~50kb gzipped). Much of what
  it does here could be CSS. It is justified because the catalogue components
  this site is built from already depend on it, and because `layoutId` on the
  nav indicator and `useScroll` on the timeline are genuinely awkward by hand.
- **Everything is one route.** Case studies would want `/work/[slug]`. The
  sitemap is already structured to make that addition obvious.
- **The grain overlay is a fixed full-viewport pseudo-element** at `z-60`. It is
  `pointer-events: none`, but it does composite on every frame.
