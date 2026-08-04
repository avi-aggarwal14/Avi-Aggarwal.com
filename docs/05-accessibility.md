# Accessibility

A heavily animated dark site is an easy place to fail accessibility quietly.
This records what was done, what was measured, and what is knowingly not
covered.

## Measured in the browser

Run against the live dev server at 375 / 768 / 1440.

| Check | Result |
| --- | --- |
| Horizontal scroll at 375px | None. `scrollWidth` 375 = viewport 375. |
| Horizontal scroll at 768px | None. |
| Horizontal scroll at 1440px | None. |
| Focusable elements | 21, all reachable by keyboard. |
| Touch targets under 44px | **1 found and fixed** — the nav wordmark was 33×17. It now has `min-h-[44px]` with negative margin so the fix is invisible. |
| Console errors | None. |
| Duplicate React keys | **4 found and fixed.** Placeholder strings repeat, so string-valued keys collided in the stats, capabilities and tag lists. All now composite. |

The four elements wider than the viewport at 375px are the hero background
blooms, the sweep highlight and the marquee track — all inside
`overflow-hidden` parents, which is why the document itself does not scroll
sideways.

## Contrast

Every pair measured against `--ink` (`#08080A`):

| Pair | Ratio | Standard |
| --- | --- | --- |
| `--bone` `#F3EFE7` | ~18:1 | AAA |
| `--accent` `#D6B77C` | ~10.7:1 | AAA |
| `--bone-muted` `#9C978D` | ~6.8:1 | AA (body text) |
| `--bone-faint` `#5D5A54` | ~2.9:1 | **Below AA — decorative only** |

`--bone-faint` is used for index numerals, years, and the footer meta line. In
every case the same information is available elsewhere in a compliant colour,
so nothing depends on reading it. It is never used for body copy.

## Keyboard

- **Skip link** is the first tab stop, jumping past the navigation to `#main`.
  Hidden until focused.
- **`:focus-visible` is styled globally** — a 2px accent outline at 3px offset.
  It is never removed anywhere in the project.
- **The work list responds to focus, not just hover.** `onFocus`/`onBlur` mirror
  `onMouseEnter`/`onMouseLeave`, so tabbing through projects drives the same
  preview a mouse user gets. The source component this was adapted from is
  mouse-only.
- **Mobile menu** traps nothing but sets `body { overflow: hidden }` while open
  and returns focus flow to the page on close.
- Tab order follows visual order throughout — there is no positive `tabindex`
  anywhere.

## Screen readers

- **One `h1`** (the name in the hero). Every section heading is an `h2`;
  card titles are `h3`. No levels are skipped.
- **Split text is re-assembled.** `TextReveal` and `CharReveal` split strings
  into per-word or per-character spans. Each wrapper carries `aria-label` with
  the full string and every fragment is `aria-hidden`, so a screen reader reads
  a sentence rather than a stack of letters.
- **Decoration is hidden.** The hero background, grain, scroll progress bar,
  cursor, marquee and the cursor-following image preview are all `aria-hidden`.
- **Icon-only buttons are labelled** — menu open/close, copy email, back to top.
- **The copy-email button announces its result** through a `role="status"`
  `aria-live="polite"` region. The icon swapping from a clipboard to a tick is
  a colour-and-shape change that a screen reader would otherwise miss.
- **Stats use `<dl>`/`<dt>`/`<dd>`** with visually-hidden `<dt>` labels, so the
  number is always announced with what it means.
- **The timeline is an `<ol>`.** The scroll-drawn spine is decorative; the
  chronology survives with CSS off entirely.
- Project preview images use `alt=""` — they are decorative duplicates of the
  link text beside them, and announcing them would be noise.
- **Every section region is named.** Each `<section>` carries
  `aria-labelledby` pointing at its own heading, so a landmark list reads
  "Selected work, region" rather than five identical unnamed regions. All five
  were verified to resolve to a real element.
- **The ticker is readable.** The marquee duplicates its item list to make the
  loop seamless, so it is `aria-hidden` — a screen reader would otherwise read
  everything twice. The same items are rendered once more, visually hidden, as
  a real `<ul>`, so the content is still available.
- **List semantics are restored explicitly.** Tailwind's preflight sets
  `list-style: none`, and Safari/VoiceOver drops list roles from any list
  styled that way. `role="list"` is set on all six.

## Motion

`prefers-reduced-motion: reduce` is honoured at two levels.

**Globally**, in CSS — every animation and transition collapses to 0.01ms and
smooth scrolling is disabled.

**Per component**, in JS, where merely shortening the animation is not enough:

| Component | Behaviour under reduced motion |
| --- | --- |
| `TextReveal` / `CharReveal` | Renders plain text. No split, no spans. |
| `WordRotator` | Stops rotating. Shows the first entry, statically. |
| `HeroBackground` | Blooms stop pulsing; the sweep highlight is not rendered at all. |
| `Hero` | Scroll parallax disabled. |
| `Magnetic` | No cursor pull. |
| `Cursor` | Does not mount. |

The `WordRotator` case matters most: shortening its duration to 0.01ms would
make it cycle words *faster*, which is the opposite of the request.

## Not covered

Stated plainly rather than left to be discovered:

- **No automated audit has been run.** No axe, no Lighthouse. The checks above
  were made by hand and by script in a real browser. An axe pass before
  deploying would be worth the ten minutes.
- **No light mode.** The site is dark-only and declares `color-scheme: dark`.
  This is a deliberate design decision, not an oversight, but it does mean
  someone who needs a light interface has no option here.
- **Contrast ratios above are calculated, not instrument-measured.** They have
  comfortable margins, but a formal checker is the last word.
- **No `lang` variation.** English only.
- **The generated OG image has alt text**, but social platforms vary in whether
  they use it.
