/* ============================================================================
 * SITE CONTENT — the only file to edit.
 *
 * Every string on the homepage lives here, all placeholder. The reference
 * spec ships Joel's copy; these fields are the same shapes with obvious
 * fill-me-in values so Avi can drop his own words in without touching a
 * component. Lengths matter more than words — keep titles to two short
 * lines and subs to one sentence.
 * ========================================================================== */

export const site = {
  /** Brand, top-left of the nav: "INITIALS / MOTTO". */
  brand: { initials: 'AA', motto: 'Work in public' },

  /** Three-line hero. Line 1 gets the accent period; line 3 is fully accent. */
  hero: {
    line1: 'Placeholder one',
    line2: 'Placeholder two.',
    line3: 'Repeat.',
    body: 'Placeholder intro. One or two sentences on what you build and why anyone should care. Keep it under 34 characters a line.',
    email: 'hello@example.com',
    github: { label: 'GitHub', href: 'https://github.com/avi-aggarwal14' },
  },

  /** The four tiles. Order = visual priority. */
  tiles: {
    pastWork: {
      label: 'Past work',
      href: '/past-work',
      title: 'Placeholder +\nprojects',
      sub: 'One line about the body of work.',
    },
    currentWork: {
      label: 'Current work',
      href: '/current-work',
      title: 'Placeholder\nProject',
      sub: 'One line on what you are building now.',
    },
    founderStory: {
      label: 'My story',
      href: '/story',
      title: 'How I\nstarted.',
      sub: 'From nothing to shipped.',
    },
    contact: {
      label: 'Contact me',
      href: 'mailto:hello@example.com',
      // Explicit break: the narrow tile wraps this anyway, and an explicit
      // two-line title keeps the line count IDENTICAL through the
      // hover-expand (§12: no line-break change during the transition).
      title: 'Email\nme',
      sub: 'Usually the fastest route.',
    },
  },

  /** Section pages below the fold, §10 skeleton. */
  pages: {
    'current-work': {
      label: 'Current work',
      title: 'Placeholder Project',
      lede: 'Placeholder lede for the current-work page. Two sentences at most.',
      blocks: [
        { label: 'What', body: 'Placeholder paragraph describing the thing.' },
        { label: 'Status', body: 'Placeholder status line — shipped, in progress, whatever is true.' },
        { label: 'Stack', body: 'Placeholder stack note.' },
      ],
      next: 'past-work' as const,
    },
    'past-work': {
      label: 'Past work',
      title: 'Placeholder + projects',
      lede: 'Placeholder lede for the past-work page.',
      blocks: [
        { label: '01', body: 'Placeholder project one — a line on what it was.' },
        { label: '02', body: 'Placeholder project two.' },
        { label: '03', body: 'Placeholder project three.' },
      ],
      next: 'story' as const,
    },
    story: {
      label: 'My story',
      title: 'How I started.',
      lede: 'Placeholder lede for the story page.',
      blocks: [
        { label: 'Then', body: 'Placeholder — where it began.' },
        { label: 'Now', body: 'Placeholder — where it is.' },
      ],
      next: 'current-work' as const,
    },
  },
}

export type PageSlug = keyof typeof site.pages
