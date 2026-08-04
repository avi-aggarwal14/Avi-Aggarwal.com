# Deployment

Every route prerenders to static HTML. There is no database, no API route and no
runtime data fetching, so this will host anywhere.

## Before you deploy

Three things, in order of how much they matter.

### 1. Set the real domain

In [`src/content/site.ts`](../src/content/site.ts):

```ts
url: "https://avi-aggarwal.com",
```

This feeds `metadataBase`, which is what social platforms resolve the preview
image against. Leave it wrong and link previews will point at the wrong origin.
It also feeds `sitemap.xml` and `robots.txt`.

### 2. Replace the placeholder content

The site will deploy perfectly happily reading "Placeholder capability" six
times. See [`07-content-guide.md`](./07-content-guide.md).

At minimum, change `contact.email` — it is currently `hello@example.com`.

### 3. Check the build

```bash
npm run build
npm run lint
```

Both should pass silently.

## Vercel

The path of least resistance, since Next is a Vercel project.

1. Push to GitHub (already done).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Accept every default — framework, build command and output directory are all
   detected correctly.
4. Add the custom domain in **Project → Settings → Domains**, then point the
   registrar at Vercel's nameservers or add the `A`/`CNAME` records it shows you.

No environment variables are needed. There are none.

## Anywhere else

Netlify and Cloudflare Pages both detect Next automatically:

- Build command: `npm run build`
- Output: `.next`

For a **fully static** host (GitHub Pages, S3, any plain CDN), add
`output: "export"` to `next.config.ts` and build. That produces an `out/`
directory of flat files.

One caveat if you go that route: `output: "export"` disables Next's image
optimisation, so you would also need `images: { unoptimized: true }`. The site
currently ships no `next/image` usage in the critical path, so the practical
cost is low.

## GitHub Pages specifically

Workable but fiddly, and worth knowing the sharp edges before starting:

- Requires `output: "export"`.
- If served from `user.github.io/repo` rather than a custom domain, you need
  `basePath` and `assetPrefix` set to `/repo`, and every internal link has to
  respect them.
- A custom domain removes both problems. Given the repo is named after the
  domain, that is presumably the plan — in which case Vercel is less work for
  the same result.

## After deploying

- Run Lighthouse against the production URL. Nothing here has been measured in
  the field, only reasoned about — see [`08-performance.md`](./08-performance.md).
- Run an axe pass. The accessibility work was done by hand and by script; no
  automated audit has been run.
- Check the social card by pasting the URL into Slack, iMessage or
  [opengraph.xyz](https://www.opengraph.xyz). It is generated at
  `/opengraph-image`.
- Confirm the hero on a real iPhone. `100svh` should handle the collapsing URL
  bar, but that specifically has only been tested in a resized desktop browser.
