# Next steps

What to do after the content is in, roughly in the order worth doing it.

## First — before it goes live

1. **Fill in `src/content/site.ts`.** See
   [07 · Content guide](./07-content-guide.md).
2. **Set `site.url` to the real domain.** It feeds `metadataBase`, the sitemap
   and the social card.
3. **Fix `contact.socials`** — the hrefs currently point at `github.com`,
   `linkedin.com` and `x.com`, not at your profiles. They are published as
   `sameAs` in the structured data, so wrong values there actively mislead.
4. **Run `npm run build` and `npm run lint`.** Both should pass silently.
5. **Deploy.** See [12 · Deployment](./12-deployment.md).

## Immediately after launch

- **Run Lighthouse** against production. Nothing here has been measured in the
  field — only reasoned about.
- **Run axe.** The accessibility work was done by hand and by script; no
  automated audit has been run.
- **Check the social card** by pasting the URL into Slack or
  [opengraph.xyz](https://www.opengraph.xyz).
- **Open it on a real phone.** `100svh` should handle Safari's collapsing URL
  bar, but that has only been tested in a resized desktop browser.

## The obvious next feature: case studies

The Work section currently links each project to `#`. The natural next move is
`/work/[slug]` — a page per project.

Most of the groundwork is already in place:

- `Project` is already a type in the content file; add a `slug` and a `body`.
- `sitemap.ts` is structured so project routes drop straight in.
- Every primitive (`Reveal`, `TextReveal`, `SectionHeading`, `Shell`) is
  content-agnostic and will work unchanged on a detail page.

The thing to resist is reaching for a CMS on day one. Four case studies as MDX
files, or as fields in the existing content object, will carry you a long way
further than the setup cost of anything hosted.

## Worth doing eventually

**A Content Security Policy.** Deliberately skipped — Next's inline hydration
scripts and `next/font`'s injected styles need a nonce setup, and a CSP that is
subtly wrong breaks the page silently. The other security headers are already
in `next.config.ts`.

**Real project images.** The placeholders point at Unsplash. Once files live in
`/public/work/`, delete the `remotePatterns` block from `next.config.ts`
entirely — one less remote dependency in the render path.

**Reduce the Framer Motion surface.** It is ~50kb gzipped and a large share of
its usage here is simple entrance animations. The cheapest win is replacing
`<Reveal>` with an IntersectionObserver and a class toggle, which would cover
most call sites. Only `layoutId` on the nav pill and `useScroll` on the timeline
and hero genuinely need it.

**A writing section.** If you start writing, it belongs between Timeline and
Contact. The `SectionHeading` + list pattern from Work transfers directly.

## Worth NOT doing

**A light mode.** It was considered and rejected — see
[10 · Decisions](./10-decisions.md). The entire visual system is built on a
near-black base; a light variant needs a different accent and a different
texture strategy, which makes it a second design rather than a theme toggle.
`next-themes` is installed if you disagree, but budget it as real work.

**A contact form.** A `mailto:` cannot fail silently. An unmonitored form
endpoint can, and does.

**More sections.** Seven is already generous for a personal site. The instinct
when a portfolio feels thin is to add another band; it is almost always better
to make the Work section stronger.

**More accent colours.** One chromatic value is the constraint holding the
design together. A second one will look fine in isolation and make the page
cohere noticeably less.
