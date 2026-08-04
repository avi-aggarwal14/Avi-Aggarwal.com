# Filling this in

Everything written on the site lives in one file:
[`src/content/site.ts`](../src/content/site.ts).

You should not need to open a `.tsx` file to put your portfolio in. If you find
yourself wanting to, that is a bug in how this was built — tell me and I'll move
the string into the content file.

## Start here

```bash
npm install
npm run dev
```

Then open `src/content/site.ts` and work top to bottom. The file is ordered the
same way the page is.

## The five-minute version

If you only change five things, change these:

1. `tagline` — the single line under your name.
2. `hero.roles` — the words that rotate. Keep them the same part of speech;
   the rotation reads badly when the grammar changes underneath it.
3. `hero.intro` — two or three lines. What you do, who for.
4. `projects` — four entries. This is the actual point of the site.
5. `contact.email` — currently `hello@example.com`, which is nobody.

## Lengths that keep the layout balanced

The placeholders are all written at the length the design expects. If you match
them roughly, nothing needs re-tuning.

| Field | Target | Why |
| --- | --- | --- |
| `hero.roles[]` | 2–5 words, 4–6 entries | The rotator reserves the width of the longest entry. One very long role leaves a visible gap beside the short ones. |
| `hero.intro` | 30–50 words | Longer and it pushes the buttons below the fold on a laptop. |
| `about.lede` | 25–45 words | Set at display size — it grows fast. |
| `about.body[]` | 2–3 paragraphs | More than three and the portrait column runs out of height beside it. |
| `projects[].summary` | 8–16 words | One line at desktop width. If a project needs two, it needs its own page. |
| `projects[].tags` | 2–3 | More reads as filler. |
| `capabilities.items[]` | 3 or 6 entries | The grid is three-up. Four or five leaves an orphan on the last row. |
| `capabilities.items[].body` | 12–24 words, all similar | Uneven card heights are what make a grid look accidental. |
| `timeline.entries[]` | 4–5, newest first | A timeline is a highlight reel, not a CV. |

## Images

### Project previews

Each project needs an `image`. It shows in the panel that follows your cursor
in the Work section.

- Drop files in `public/work/` and reference them as `/work/name.jpg`.
- Landscape, roughly 3:2. They render into a 352×240 box.
- The placeholders point at Unsplash. Those hosts are allowlisted in
  `next.config.ts` — once you are on local files you can delete the
  `remotePatterns` block entirely.

### Portrait

`about.portrait` is empty, so the About section renders a framed placeholder
telling you where to put one. Save a portrait to `public/portrait.jpg`, set
`portrait: "/portrait.jpg"`, and it will slot straight in. The frame holds a
4:5 aspect ratio, so nothing shifts when the real image arrives.

### Social preview

`public/og.png` does not exist yet. Make one at **1200×630** for link previews
in iMessage, Slack, WhatsApp and X. Until it exists those previews will show
text only — which is fine, just plainer.

## Deleting things

Sections are wired up in [`src/app/page.tsx`](../src/app/page.tsx). Delete the
component from that file and the section is gone; nothing else breaks.

Smaller pieces degrade on their own:

- `about.stats: []` — the stats row disappears.
- `contact.socials` — remove any row you don't want.
- `hero.ticker` — drives the scrolling strip.

If you remove a section, delete its entry from `nav` too, or the link will
scroll to nothing.

## Re-skinning it

One line in [`src/app/globals.css`](../src/app/globals.css):

```css
--accent: #d6b77c;
```

That is the only chromatic value in the entire palette. Every highlight, focus
ring, active nav dot, hover glow and section marker reads from it. Change it and
the whole site changes character.

A caution: it needs to hold up against a near-black background at small sizes.
Anything very dark or very saturated will fail the contrast the rest of the
design assumes. Test it on the eyebrow labels — they are the smallest thing
wearing it.

## Things that will bite you

- **`site.nav` hrefs must match section ids.** `#work` → `<Section id="work">`.
  The scroll-spy watches those ids; a typo means the nav indicator never
  activates for that section.
- **Keep the `satisfies Project[]` annotations.** They are what turn a malformed
  entry into a build error instead of a blank space on the page.
- **`url` and `metaBase`** — `site.url` feeds `metadataBase`. Set it to the real
  domain before deploying or social previews resolve relative image paths
  against the wrong origin.
