# Handoff — Avi Aggarwal personal site, v3

You are picking up a **fresh build** of Avi Aggarwal's personal site and
portfolio. Everything below is the complete brief. There is no prior design to
be compatible with — the working tree was deliberately emptied and this is a
clean start.

**State at handoff:** `main` @ `477e075`, 178 commits, working tree clean,
local == `origin/main`. `src/` contains exactly one file: `app/globals.css`.

---

## 1 · What this is

A single-page personal site + portfolio at **avi-aggarwal.com**.

Repo: `https://github.com/avi-aggarwal14/avi-aggarwal.com`
Local: `D:\Avi-Aggarwal.com` (branch `main`)
Deployed: `https://aviaggarwal.vercel.app` (auto-deploys on push to `main`)

**The design is the deliverable. The content is not.** Avi fills in his own
copy later. Every string must be an obvious placeholder living in one file
(`src/content/site.ts`) so he never has to open a `.tsx`. Do not invent
projects, employers, statistics or credentials for him.

---

## 2 · Current state

The working tree has been emptied of all site code. What remains:

```
package.json / package-lock.json     Next 16.3.0, React 19.1.1, Tailwind v4,
                                     framer-motion 12, lucide-react
tsconfig.json  next.config.ts        @/* -> ./src/*  ; security headers set
postcss.config.mjs  eslint.config.mjs
.gitattributes .editorconfig .nvmrc  (Node 22)
src/app/globals.css                  ← THE ONLY SOURCE FILE THAT EXISTS
```

`src/app/globals.css` is written and committed. It is the v3 design system:
palette, type scale, entrance keyframes, the intro-curtain animation, reduced
motion, print, scrollbar. **Read it first — it defines everything below and is
the contract the components must satisfy.**

Everything else needs building: `layout.tsx`, `page.tsx`, content file,
components, SEO routes, favicon, public assets.

⚠️ Ignore `.claude/worktrees/add-taste-skill-b31acf/` — a different session's
git worktree on another branch. It is git-ignored and unrelated to this work.

---

## 3 · The design direction

Avi supplied a reference: **https://joel-personal-website.vercel.app/**
He wants that language, in **forest green, gold and black, in varying shades**,
with **animations as crisp as the reference**.

Screenshots of the reference are in `handoff/reference/` (desktop top + five
scroll depths) and the intro animation is frame-sampled in
`handoff/reference/intro/`. Study them.
**Design research only — do not copy its markup, CSS or assets.**

### What makes the reference work (measured, not guessed)

| | Reference |
| --- | --- |
| Background / text | `rgb(5,5,5)` / `rgb(244,244,244)` |
| Dominant surface | `rgb(241,238,232)` cream — full-bleed inverted sections |
| Accent | one hot coral, used sparingly |
| Fonts | Geist 500–700, JetBrains Mono, Playfair Display |
| Heading sizes | 74px → 360px |
| Heading tracking | −6.5px to −32px ≈ **−0.075em** |
| Body size | ~30px in editorial bands |
| Media | 4 images total. No canvas, no video. |

Five moves carry it:

1. **Bento portal hero.** Left: a three-line headline, each line a different
   colour (bone / muted / accent). Right: a grid of large clickable tiles —
   mono eyebrow, corner arrow, big title, one line of description. Tiles
   alternate surface: photo, accent-filled, cream, dark.
2. **Full-bleed inversion.** Whole sections flip to cream with near-black
   text. This jolt does more for perceived quality than any effect.
3. **Enormous, very tight type.** 700 weight at −0.075em. The tightness is the
   trick; the same size at default tracking reads cheap.
4. **Large body copy** (~30px) in a narrow column beside a huge heading.
5. **Restraint.** Four images. No particle fields, no canvas.

### Our palette (already in globals.css)

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#050706` | Base. Black with a green cast. |
| `--forest` / `--forest-mid` / `--forest-lift` / `--forest-deep` | `#08170F` / `#0E2A1C` / `#143D28` / `#041009` | Surfaces, tiles, hovers |
| `--gold` | `#C9A227` | The accent |
| `--gold-warm` | `#D6B77C` | Champagne — hairlines, fine detail |
| `--cream` | `#F1EEE8` | The inversion surface |
| `--bone` / `--bone-muted` / `--bone-faint` | `#F4F2ED` / `#9AA39C` / `#5D665F` | Type on dark |

Fonts to wire in `layout.tsx` via `next/font/google`, exposed as CSS variables
`--font-inter`, `--font-jetbrains-mono`, `--font-playfair`:
**Inter** (display + body), **JetBrains Mono** (meta), **Playfair Display
italic** (one accented word at a time — the flourish voice).

---

## 4 · The intro curtain — build this first, Avi asked for it specifically

He wants the reference's startup animation, **with "AVI"** and our colours.

What the reference does (see `handoff/reference/intro/`):

1. Skewed vertical colour panels wipe up to fill the screen (~−11° skew).
2. A horizontal band framed by two full-width rules holds the name.
3. The name reveals **letter by letter**, clipped inside that band.
4. Mono meta pinned top-left (`NAME / ROLE` and `LOCATION / YEAR`) and a
   counter bottom-right (`00 — 01`).
5. The whole curtain wipes away **diagonally** to reveal the site.

Ours: panels in **gold → cream → forest** (varying shades), giant near-black
**AVI** on the cream, black rules, mono meta in ink.

**The CSS is already written** — `.intro`, `.intro-panel`, `.intro-band` and
keyframes `panel-in`, `rule-draw`, `curtain-out`, `curtain-kill` in
globals.css. It is deliberately **100% CSS**: it self-dismisses via
`animation-fill-mode: forwards`, so if JavaScript never arrives the curtain
still leaves, and the page content sits underneath it in the HTML the whole
time. Build the markup to match; do not reach for JS to drive it.

Optional enhancement only: `sessionStorage` to skip the curtain on repeat
navigations. Progressive — never required for correctness.

---

## 5 · Hard rules (non-negotiable)

These are the contract. Violating any of them has previously produced
user-visible bugs on this exact site.

1. **Nothing above the fold may be hidden by JavaScript.** framer-motion
   serializes `initial` into the SSR HTML as inline `opacity:0`. Above the
   fold that means a background with no words on it until hydration. Use the
   CSS `.in` / `.in-char` keyframes instead.
2. **Below-fold reveals are CSS scroll-driven and visible by default.** Use
   `.reveal` / `.reveal-mask`. The animation only exists inside
   `@supports (animation-timeline: view())`, so no-support / no-JS /
   mid-hydration all simply show content. There must be no state in which a
   section is stuck blank.
3. **No animated `filter`** (no `blur()`, no `drop-shadow`). Each animating
   filter promotes its element to a fresh GPU layer; churn causes
   single-frame flashes on loaded machines. Use gradients for softness.
4. **No `mask-image` over continuously animating content** — the masked
   region re-rasterizes every frame. Use a static gradient overlay instead.
5. **Transform and opacity only.** Never animate `width`, `height`, `top`,
   `left`. Pin continuously animating surfaces with `transform: translateZ(0)`.
6. **Never `scroll-behavior: smooth`** on a page this tall.
7. **`href="#"` placeholders must `preventDefault()`** — otherwise clicking a
   project navigates to the top of the document and replays every entrance.
8. **Pointer position never enters React state.** Track in refs, one rAF loop,
   write straight to `node.style`.
9. **`role="list"` on every styled list** — Tailwind preflight strips
   `list-style` and Safari/VoiceOver drops list semantics with it.
10. **Never edit files with PowerShell `Get-Content -Raw` + `Set-Content`.**
    PS 5.1 reads UTF-8 as ANSI and writes it back double-encoded, mangling
    every em-dash. Use the Write/Edit tools or Node.

---

## 6 · Verification tooling (already built, in `handoff/scripts/`)

The in-app Browser pane does **not** composite frames on this machine —
screenshots via MCP time out. Use headless Chrome instead.

```bash
mkdir -p /tmp/pup && cd /tmp/pup && npm i puppeteer-core
```

Chrome lives at `C:\Program Files\Google\Chrome\Application\chrome.exe` (the
path each script already points at). Run the scripts from wherever
`puppeteer-core` is installed — e.g. copy one in, or
`node D:/Avi-Aggarwal.com/handoff/scripts/ssrcheck.js <url>` for the two that
need no browser (`ssrcheck.js`, `fixmoji.js`).

| Script | What it does |
| --- | --- |
| `shots2.js` | Screenshots every section + audits for elements still invisible after a full scroll. `TARGET`, `TAG`, `W`, `H` env vars. |
| `ssrcheck.js` | Counts `opacity:0` nodes in the server HTML. **Hero must be 0.** Pass a URL as argv. |
| `nojs.js` | Renders with JS disabled and on throttled 3G — proves the page is readable without hydration. |
| `probe.js` | Samples hero layers at rAF rate for 20s hunting for single-frame dips. |
| `verify.js` | Samples a rotating-text element for blank frames. |
| `study.js` | The reference-site reader (screenshots + structural/colour/font census). |
| `fixmoji.js` | Detects and repairs CP1252 mojibake if an encoding accident happens. |
| `makeico.js` | Renders `public/icon.svg` to a real `favicon.ico`. |

Run `ssrcheck.js` and `nojs.js` before declaring anything done.

---

## 7 · Working preferences (Avi's, stated explicitly)

- **Commit every individual change separately** with a descriptive message,
  and **push immediately**. He watches the GitHub commit list as the progress
  indicator; unpushed work reads as no work. There are already 177 commits —
  keep the granularity.
- **Write `.md` docs as you go** for anything non-obvious. `docs/` is empty;
  recreate what is useful.
- **Caveman response style is active** — terse, no filler, technical substance
  intact. Skill: `anthropic-skills:caveman`. Off only if he says "stop
  caveman" / "normal mode".
- He is **away and wants autonomous progress**. Make design calls yourself.
- He asked for **21st.dev MCP components** to be used, for technical
  sophistication (he specifically liked the idea of a drag carousel).

### 21st.dev budget ⚠️

Free tier: **2 `get_component` retrievals per day**. Verified at handoff:
`freeRetrievalsRemaining: 0` — **both spent, none left today.**

`search`, `search_picker`, `get_theme`, `search_logo` and `get_usage` are free
and unmetered. So: search widely to pick components, then either wait for the
daily reset before retrieving code, or build from the preview images by hand.
Call `get_usage` first — do not plan a session around a retrieval you may not
have.

Retrieved code has also, every time so far, needed fixing before use
(rules-of-hooks violations, animated filters, `Math.random()` during render,
stale `getBoundingClientRect()` reads). Treat catalogue source as a starting
point to audit against §5, not as something to paste.

---

## 8 · Suggested build order

1. `layout.tsx` — fonts (Inter / JetBrains Mono / Playfair), metadata, skip link, grain.
2. `src/content/site.ts` — typed, all-placeholder content.
3. Intro curtain component (markup for the CSS already in globals.css).
4. Bento portal hero.
5. Nav (fixed, mono uppercase, three groups, gold hairline).
6. Sections: work (numbered, full-bleed media, `.drift` parallax), a cream
   inversion band, a two-column editorial story, contact.
7. Footer, 404, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, favicon.
8. Verify → document → push.

---

## 9 · Suggested skills

| Skill | When |
| --- | --- |
| `anthropic-skills:caveman` | **Immediately, and keep active** — Avi's standing preference. |
| `ui-ux-pro-max` | Before and during design work. He asked for it explicitly and repeatedly. Its pre-delivery checklist (44px targets, cursor-pointer, no emoji icons, contrast, reduced motion, 375/768/1024/1440) is the QA gate. |
| `artifact-design` | Only if a shareable artifact page is requested. |

MCP: the 21st.dev server is `mcp__f54e7b6e-de71-4dd9-b58f-ca4ca632475a__*`
(`search`, `get_component`, `get_theme`, `search_logo`, `get_usage`).

---

## 10 · Definition of done

- `npm run build` and `npm run lint` pass silently.
- `ssrcheck.js` reports **0** `opacity:0` nodes in the hero.
- `nojs.js` shows the hero fully readable with JavaScript disabled.
- No console errors.
- No horizontal scroll at 375 / 768 / 1024 / 1440.
- Every interactive element ≥44px, keyboard reachable, visible focus ring.
- `prefers-reduced-motion` honoured; the intro curtain does not appear.
- Every string on the page reachable from `src/content/site.ts`.
- Committed granularly and pushed.
