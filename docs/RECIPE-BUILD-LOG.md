# RECIPE-02 build log

Built to `RECIPE-02-bento-portfolio.md` (kept in Downloads; §-references below
point there). All §3 pins installed exactly: next 16.3.0, react 19.2.8,
tailwindcss 4.3.3, gsap 3.15.0, @gsap/react 2.1.2, motion 12.43.0,
lenis 1.3.26. `npm run build` was run after every step and never proceeded red.

Content is entirely placeholder in `src/content/site.ts` — Avi fills it in
without touching components.

## Deviations from the recipe, all argued

1. **`create-next-app` ran in a temp dir** and the output was relocated —
   npm rejects capital letters in the folder name `Avi-Aggarwal.com`.
2. **Tile images are procedural placeholders** (SVG→sharp→AVIF, 7KB + 3KB),
   not FLUX/Higgsfield renders — no image API here, and §9's Unsplash
   alternative would put third-party photos where Avi's real shots belong.
   Art direction followed anyway: dark macro with upper-right rim light and a
   quiet bottom-left title zone; warm plaster that keeps `#101010` legible.
3. **`<Image unoptimized>` on the two tiles.** Not taste — a real defect:
   see trap 3 below.
4. **Lenis/§10 smooth scroll not wired.** Section pages are short; §10 says
   "if you build the scroll pages". The next-tile loop is built; Lenis can be
   added when real content makes the pages long.
5. **Contact tile title is an explicit two-liner** (`Email\nme`) so its line
   count cannot change mid-hover-expand (§12 motion row).

## Three traps hit, for whoever touches this next

### 1. Inline styles kill the `:has()` hover-expand
First cut put the base `grid-template-columns` in `style={}` per §7.2's
markup. Inline styles outrank every class rule, so the §7.3 hover states
never applied — the step-5 gate measured zero track movement. Base tracks
moved to stylesheet classes (`.bento-root`, `.bento-row-a`, `.bento-col-a`,
`.bento-row-b`); hover rules now win and the 620ms fr interpolation runs.

### 2. GSAP `from()` is the no-JS safety
Everything animates with `gsap.from(...)` — the HIDDEN state is created by
JavaScript, so the server HTML ships fully visible. Verified: JS disabled →
headline and all four tiles visible immediately. Never convert these to
`.to()` with CSS-hidden initial states.

### 3. The Next image optimizer hangs forever on AVIF re-encode
`/_next/image?url=…avif` with `Accept: image/avif` (every real browser)
**never responds** on this build — the request stays pending and the `load`
event never fires. `curl` without that header returns 200 in 30ms, which is
exactly how it slipped past the first smoke check. The tiles are hand-encoded
AVIF at final size, so the optimizer only added a resize: they are served
`unoptimized`, directly. The §12 rows still hold — served format is AVIF and
the LCP `preload` hint is emitted (`<link rel="preload" as="image"
href="/tiles/past-work.avif">`).

## §12 verification method

Headless Chrome (`scratchpad/pup/qa.js`): computed-style censuses (radius,
gaps, tones, accent uses), geometry probes (full-bleed, three-point anchor,
one-screen at 1280×800 and 1920×1080), keyboard walk, reduced-motion and
touch emulation, JS-disabled render, PerformanceObserver LCP/CLS, hover
track-width sampling at ~45ms intervals (monotonic ease confirmed).

Results table in the session report. Local LCP 452ms / CLS 0; Lighthouse
proper should be re-run against the Vercel deploy.
