# Decisions

Every non-obvious call made during the build, what the alternative was, and why
it lost. Recorded so they can be argued with later rather than reverse-engineered.

---

### Warm monochrome + one metallic accent, not a gradient palette

**Alternative:** the indigo→violet→pink gradient that most developer portfolios
wear.

The `ui-ux-pro-max` product table puts Portfolio/Personal at *Motion-Driven +
Minimalism*, and the adjacent premium lane at *Monochrome + Gold Accent*. Warm
monochrome with a single accent is the intersection.

Three reasons it wins here: it reads as editorial rather than SaaS; it never
competes with project imagery, which is the actual content of a portfolio; and
one accent is a constraint that forces every highlight to earn its place. A
palette with three chromatic values would have let the hero, the buttons and the
cards each pick a different one, and the page would have stopped cohering.

---

### A display serif for headlines, not a heavy geometric sans

**Alternative:** Inter/Satoshi at 700, the default choice.

With no photography and no illustration, type *is* the identity. A high-contrast
serif at 400 does more work at large sizes than a grotesk at 700, and it is the
single decision that makes the page read as a magazine spread rather than a
developer template.

---

### Work above Capabilities

**Alternative:** skills first, which is how most portfolios are ordered.

Evidence before claims. A portfolio that opens with a list of skills is asking
to be believed; one that opens with work has already made the argument. By the
time the reader reaches Capabilities they have seen four projects, so the list
reads as a summary rather than a promise.

---

### Everything in one content file

**Alternative:** MDX per project, or a CMS.

The brief was explicit — *design it, I'll add my content later*. MDX means
learning frontmatter conventions; a CMS means an account, a schema and a
network dependency. One typed TypeScript object means opening one file, and
`satisfies Project[]` turns a malformed entry into a build error rather than a
blank space on the page.

The cost: no case-study pages yet. When those are wanted, `/work/[slug]` is the
obvious addition and the sitemap is already structured for it.

---

### Placeholder content, not plausible invented content

**Alternative:** filling the site with realistic-sounding projects so it looks
finished.

Rejected outright. A portfolio that ships with fabricated achievements is a
liability, not a head start — the failure mode is it going live with invented
credentials still in it. Every placeholder is unmistakably a placeholder, and
each one is written at the length the design expects, so replacing them needs
no re-tuning.

---

### `position: fixed` for the cursor-following preview

**Alternative:** the source component's approach — measuring the container with
`getBoundingClientRect()` and offsetting from it.

That measurement is taken during render and never recomputed, so the preview
detaches from the cursor the moment the page is scrolled or the window resized.
Viewport coordinates need no measurement and are correct at any scroll offset.
This was a bug fix, not a preference.

---

### No light mode

**Alternative:** `next-themes` and a toggle.

A single, committed dark aesthetic is stronger than two adequate ones, and the
entire design — the ambient blooms, the grain, the edge lighting, the champagne
accent — is built on a near-black base. A light variant would need a different
accent and a different texture strategy, effectively a second design.

This is a real trade-off, not a free one: someone who needs a light interface
has no option here. It is recorded as a known gap in
[`05-accessibility.md`](./05-accessibility.md).

---

### Two 21st.dev retrievals, spent on implementation rather than looks

The account is free-tier: **two `get_component` calls per day.**

They went to the two components whose *code* carried the value — the
lerp-tracked preview and the layered hero atmosphere — rather than to
components whose appearance could be rebuilt from a preview image. Everything
else was designed by hand in the same language, informed by unmetered catalogue
search.

---

### Rendering the longest word in the rotator's sizer

**Alternative:** the source component's hidden copy of `words[0]`.

That sizes the box to the *first* word, so any longer entry is clipped. Since
the words come from a content file and are not known in advance, the sizer has
to reserve the widest. Also a bug fix.

---

### A `mailto:` link instead of a contact form

**Alternative:** a form posting to a serverless function.

A form adds friction to the one action the page exists to produce, and it can
fail silently — an unmonitored endpoint swallows messages with no sign anything
went wrong. A `mailto:` cannot. The copy-to-clipboard button covers the half of
readers who do not use `mailto:`.

---

### Dropping the ornament from the retrieved components

The *Classy Hero* call-to-action ships with three orbiting particles and a
rainbow gradient wash; its text rotator tints every letter on a rotating HSL
cycle.

All of it was removed. A one-accent palette cannot absorb a rainbow, and the
elements were already communicating perfectly well without it. What was kept —
the ripple, the arrow nudge, the letter stagger — does one of the three jobs
motion is allowed to do here.

---

### Custom cursor that does not hide the real one

**Alternative:** `cursor: none` globally, which is the usual implementation.

If the JS fails to hydrate, that leaves the visitor with no pointer at all. The
custom cursor rides alongside the native one, and never mounts on touch devices
or under `prefers-reduced-motion`.

---

### Next 15 → 16 mid-build

npm flagged 15.5.4 for CVE-2025-66478 during install. Upgrading cost a
`tsconfig` reconciliation and an eslint config rewrite (`next lint` is gone in
16, and `FlatCompat` throws against the v16 config).

Shipping a personal site on a version with a published CVE was not worth
avoiding twenty minutes of migration.
