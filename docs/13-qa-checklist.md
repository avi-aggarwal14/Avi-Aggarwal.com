# QA checklist

The `ui-ux-pro-max` pre-delivery checklist, worked through against this build.
Every item is either **Pass** with the evidence, or **Not covered** with the
reason. Nothing is ticked because it was intended.

## Visual quality

| Item | Status |
| --- | --- |
| No emojis used as icons | **Pass.** Every icon is `lucide-react`. There is not one emoji in the source. |
| All icons from one set, consistent sizing | **Pass.** All lucide, all `24` viewBox, `strokeWidth={1.5}` on the capability icons and default elsewhere, sized `h-4/5/6`. |
| Brand logos correct | **N/A.** The site displays no third-party logos. Socials are text labels, which sidesteps the problem entirely. |
| Hover states don't cause layout shift | **Pass.** No `scale` or size change on any element in document flow. Hover beds are absolutely-positioned siblings that fade; the arrow nudges use `translate` only. |
| Theme colours used directly, not `var()` wrappers | **Pass.** Components use `bg-ink`, `text-bone-muted`, `border-bone/10`. The only raw `var()` uses are for `--z-*` in inline styles, where a Tailwind utility does not exist. |

## Interaction

| Item | Status |
| --- | --- |
| Every clickable element has `cursor-pointer` | **Pass.** Audited across nav, work rows, buttons, socials, footer and 404. |
| Hover states give clear feedback | **Pass.** Every interactive element changes colour, border or opacity — never colour alone, and never nothing. |
| Transitions 150–300ms | **Pass.** Micro-interactions run at `duration-200`/`duration-300`. Only full-section entrances exceed it, at 720ms. |
| Focus states visible for keyboard | **Pass.** `:focus-visible` is styled globally — 2px accent outline at 3px offset — and removed nowhere. |

## Light / dark mode

| Item | Status |
| --- | --- |
| Light-mode text contrast | **Not covered — deliberate.** The site is dark-only and declares `color-scheme: dark`. There is no light mode to check. Recorded as a known gap in [05 · Accessibility](./05-accessibility.md) and argued in [10 · Decisions](./10-decisions.md). |
| Glass elements visible in light mode | **N/A** — as above. |
| Borders visible in both modes | **Pass for dark.** `--line` is bone at 10%, which is visible against every surface in the palette. |
| Both modes tested | **N/A** — as above. |

## Layout

| Item | Status |
| --- | --- |
| Floating elements spaced from edges | **Pass.** The nav is `top-4 left-4 right-4`, not welded to `top-0`. |
| No content hidden behind fixed nav | **Pass.** The hero carries `pt-32`; `html` has `scroll-padding-top: 6rem` and every section `scroll-mt-24`, so anchor jumps clear the bar. |
| Consistent max-width | **Pass.** Two widths, both from one component — `Shell` (`max-w-6xl`) and `Shell wide` (`max-w-[82rem]`). No section sets its own. |
| Responsive at 375 / 768 / 1024 / 1440 | **Pass.** Measured; no horizontal scroll at any width. See [09 · Responsive](./09-responsive.md). |
| No horizontal scroll on mobile | **Pass.** `scrollWidth` 375 at a 375 viewport. |

## Accessibility

| Item | Status |
| --- | --- |
| All images have alt text | **Pass.** The only `<img>` tags are the work previews (`alt=""` — decorative, duplicating adjacent link text) and the optional portrait (`alt="Portrait of {name}"`). |
| Form inputs have labels | **N/A.** There are no forms. Contact is a `mailto:` link — argued in [10 · Decisions](./10-decisions.md). |
| Colour is not the only indicator | **Pass.** Active nav state carries a pill *and* `aria-current`. Hover states change border or opacity alongside colour. The copy-email confirmation swaps the icon *and* announces through `aria-live`. |
| `prefers-reduced-motion` respected | **Pass**, at two levels — a CSS blanket rule plus per-component `useReducedMotion` where collapsing a duration would give the wrong result. A bug was found here during review: the blanket rule *fast-forwards* looping animations rather than stopping them. Fixed. See [06 · Motion](./06-motion.md). |

## Beyond the checklist

Found and fixed during verification, none of which the checklist asks about:

- **Fonts silently not applying.** `@theme inline` does not emit custom
  properties, so `var(--font-sans)` resolved to nothing.
- **Four duplicate-key errors** from repeated placeholder strings.
- **One touch target under 44px** — the nav wordmark, at 33×17.
- **List semantics lost in Safari/VoiceOver** — Tailwind's preflight strips
  `list-style`, which takes list roles with it. `role="list"` restored on all
  five.
- **Three bugs inside the retrieved 21st.dev components** — a preview that
  detaches from the cursor on scroll, an rAF loop rescheduling on every pointer
  event, and a text rotator that clips any word longer than its first.
- **Three content-driven overflow risks** — the hero name could not wrap, the
  role rotator was fixed-size with `whitespace-nowrap`, and the contact email
  was fixed-size and unbreakable. All three were made robust rather than tuned
  to the current placeholder, because the real content does not exist yet.
- **Five unnamed landmark regions** — sections had no accessible name. Now
  `aria-labelledby` their own headings.
- **Ticker content unreachable** — the marquee has to be `aria-hidden` (it
  duplicates its list), which made real content invisible to screen readers. A
  visually-hidden list was added alongside.
- **A 3px hairline** in the capabilities grid where every other rule is 1px,
  caused by bordered cards separated by a gap.

## Still outstanding

- No automated axe pass.
- No Lighthouse run against a production deploy.
- No real-device testing; `100svh` behaviour on mobile Safari is unconfirmed.
- Contrast ratios are calculated, not instrument-measured.
