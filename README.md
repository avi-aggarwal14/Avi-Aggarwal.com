# avi-aggarwal.com

One-screen bento portfolio. The homepage is a switchboard, not a scroll:
four full-bleed tiles route to everything, separated by 1px hairlines,
zero gaps, zero rounded corners.

Built to `RECIPE-02-bento-portfolio.md` — build notes and the traps hit are
in [`docs/RECIPE-BUILD-LOG.md`](docs/RECIPE-BUILD-LOG.md).

## Run

```bash
npm install
npm run dev
```

## Fill in your content

Everything written on the site lives in **`src/content/site.ts`** — hero
lines, tile titles, the three section pages, email. All of it is placeholder;
none of it requires opening a component.

Tile imagery lives in `public/tiles/` (`past-work.avif`, `founder.avif`) —
currently procedural placeholders. Replace with real photography per the art
direction in the recipe's §9: keep the bottom-left third quiet for the title.

## Stack

Next 16.3.0 · React 19.2.8 · Tailwind 4.3.3 · GSAP 3.15.0 (SplitText) ·
Motion 12.43.0 · Switzer + Geist Mono
