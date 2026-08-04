# Avi-Aggarwal.com

Personal site and portfolio. Built with Next.js 16, Tailwind v4 and Framer
Motion, using components from [21st.dev](https://21st.dev).

**The design is finished. The content is not** — every string on the page is a
placeholder, and all of them live in one file.

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build    # production build
npm run lint     # eslint
```

---

## Put your content in

Open **[`src/content/site.ts`](./src/content/site.ts)** and work top to bottom.
It is ordered the same way the page is, and every field is commented with the
length that keeps the layout balanced.

You should not need to open a single `.tsx` file.

The five things worth changing first:

1. `tagline` — the line under your name
2. `hero.roles` — the words that rotate
3. `hero.intro` — two or three lines about what you do
4. `projects` — four entries, the actual point of the site
5. `contact.email` — currently `hello@example.com`, which is nobody

Full guide: **[`docs/07-content-guide.md`](./docs/07-content-guide.md)**.

## Re-skin it

One line in [`src/app/globals.css`](./src/app/globals.css):

```css
--accent: #d6b77c;
```

That is the only chromatic value in the palette. Every highlight, focus ring,
active nav dot, hover glow and section marker reads from it.

---

## What's here

A single scrolling page in seven movements:

**Hero** → **Ticker** → **About** → **Work** → **Capabilities** → **Timeline** → **Contact**

Plus a matching 404, a generated social-preview card, `sitemap.xml` and
`robots.txt`.

The signature interaction is in **Work**: hovering a project floats a preview
image that chases your cursor on a lerp, so it always trails slightly behind
the pointer.

### Design direction

Editorial dark minimalism. Warm monochrome — ink `#08080A` and bone `#F3EFE7` —
with exactly one accent, a champagne `#D6B77C`. Instrument Serif for headlines,
DM Sans for body, JetBrains Mono for meta.

No photography, no illustration, one colour. Which means the typography *is*
the identity.

---

## Documentation

| Doc | What's in it |
| --- | --- |
| [00 · Brief](./docs/00-brief.md) | What was asked for, and what changed mid-build |
| [01 · Design system](./docs/01-design-system.md) | Tokens, contrast ratios, the rules it holds itself to |
| [02 · Typography](./docs/02-typography.md) | The three families and the fluid scale |
| [03 · Components](./docs/03-components.md) | 21st.dev provenance — what was pulled, what was changed |
| [04 · Architecture](./docs/04-architecture.md) | Project structure and performance decisions |
| [05 · Accessibility](./docs/05-accessibility.md) | Audit results, and what is knowingly not covered |
| [06 · Motion](./docs/06-motion.md) | The motion vocabulary and the restraint rules |
| [07 · Content guide](./docs/07-content-guide.md) | **Start here to fill the site in** |
| [08 · Performance](./docs/08-performance.md) | Bundle, rendering, and the rAF pattern |
| [09 · Responsive](./docs/09-responsive.md) | Verified widths and mobile decisions |
| [10 · Decisions](./docs/10-decisions.md) | Every non-obvious call, and its alternative |
| [11 · Build log](./docs/11-build-log.md) | How this got built, in order |
| [12 · Deployment](./docs/12-deployment.md) | Shipping it |

---

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind v4 (CSS-first tokens) |
| Motion | Framer Motion 12 |
| Icons | lucide-react |
| Components | [21st.dev](https://21st.dev) |
| Language | TypeScript, strict |

Every route prerenders to static HTML — there is no database, no API route and
no runtime data fetching, so this can host anywhere.

---

## Credits

Two components were retrieved from the 21st.dev catalogue and adapted:

- **Project Showcase** — [@jatin-yadav05](https://21st.dev/@jatin-yadav05/components/project-showcase)
- **Classy Hero** — [@jatin-yadav05](https://21st.dev/@jatin-yadav05/components/classy-hero)

Both were modified — including fixes to a scroll-positioning bug, a
re-scheduling animation loop, and a text-sizing bug. Details in
[`docs/03-components.md`](./docs/03-components.md).
