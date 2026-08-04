# Performance

A page with this much motion is easy to make heavy. These are the decisions
that keep it from being so.

## Measured

Production build output:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /opengraph-image
├ ○ /robots.txt
└ ○ /sitemap.xml

○  (Static)  prerendered as static content
```

Everything prerenders. No SSR at request time, no API route, no database, no
runtime fetching. The whole site is HTML and assets on a CDN.

Compile time is ~3.5s with Turbopack.

## The one rule that matters most

**Pointer position never enters React state.**

Three components track the cursor:

- the Work list (the image that follows the pointer)
- the Capabilities grid (the spotlight on each card)
- the custom cursor (the trailing ring)

All three keep the target in a `useRef`, run a single `requestAnimationFrame`
loop, and write directly to `node.style.transform` or a CSS custom property.
None of them call `setState` on pointer move.

This matters because the alternative is genuinely bad. The 21st.dev component
the Work list is adapted from does the opposite:

```js
// original
const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });

useEffect(() => {
  const animate = () => {
    setSmoothPosition(prev => ({ ... }));      // re-renders the entire list
    animationRef.current = requestAnimationFrame(animate);
  };
  animationRef.current = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationRef.current);
}, [mousePosition]);                            // …and reschedules on every move
```

Two compounding problems: the whole project list re-renders roughly sixty times
a second, *and* the effect tears down and re-creates its animation frame on
every single pointer event. Rewritten here to one loop, zero re-renders.

## Rendering

**Only compositor properties are animated** — `transform`, `opacity`, `filter`.
Never `width`, `height`, `top` or `left`.

The clearest case is the timeline spine. It fills as you scroll, and the obvious
implementation is animating `height`. That forces layout on every frame. It
animates `scaleY` on a `transform-origin: top` element instead, which stays
entirely on the compositor.

**Scroll reveals fire once.** `viewport={{ once: true }}` everywhere. Beyond the
wasted work, re-animating on every scroll-past is what makes a site feel like a
template.

**Scroll listeners are passive.** `{ passive: true }` on every one, so scrolling
is never blocked waiting to find out whether the handler will call
`preventDefault`.

**Observers are disconnected on unmount**, and ripple nodes are removed on a
timer rather than accumulating in state.

## Assets

**No image in the critical path.** The entire hero — six layers of it — is CSS
gradients plus one inline SVG noise tile encoded as a data URI. There is not a
single image request before first paint.

**Fonts are self-hosted and metric-matched.** `next/font/google` downloads all
three families at build time and generates a fallback with matching metrics, so
there is no request to `fonts.googleapis.com` and no layout shift when the
webfonts land.

**The social card is generated at build**, not shipped as a PNG, so it cannot
drift out of sync with the content.

**Project images are the one remote dependency.** The placeholders point at
Unsplash. Once real work images live in `/public`, the `remotePatterns` block in
`next.config.ts` can be deleted entirely.

## Known costs

Stated plainly:

- **Framer Motion is ~50kb gzipped.** A large fraction of what it does here
  could be CSS. It is justified by `layoutId` on the nav indicator and
  `useScroll` on the timeline and hero parallax — both genuinely awkward by
  hand — and by the fact that the catalogue components this is built from
  already depend on it. If bundle size ever becomes the priority, the cheapest
  win is replacing the simple `<Reveal>` entrances with a CSS
  `@starting-style` or an IntersectionObserver plus a class toggle, which would
  cover most usages.

- **The grain overlay composites every frame.** A fixed, full-viewport
  pseudo-element at `z-60`. It is `pointer-events: none` and GPU-composited, but
  it is not free. It earns its place — it is what kills gradient banding across
  the large dark fields.

- **Three simultaneous rAF loops** when the pointer is over the Work section.
  Each does a handful of arithmetic operations and one style write, so this is
  well within budget, but it is three rather than one shared ticker.

- **Every section is a client component.** They all use hooks or pointer
  events, so there is no meaningful server-component tree here beyond the page
  shell. On a content-only site you could push much more to the server; on this
  one, the interactivity *is* the design.

## Not measured

No Lighthouse run, no Web Vitals field data, no bundle analysis. The build
output and the architectural decisions above are what is actually known. A
Lighthouse pass against a production deploy would be the sensible next step.
