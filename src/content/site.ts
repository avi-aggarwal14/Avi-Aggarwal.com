/* =============================================================================
 * SITE CONTENT — THE ONLY FILE YOU NEED TO EDIT
 * -----------------------------------------------------------------------------
 * Everything written on the page comes from here. No copy is hard-coded into a
 * component, so you can fill in your real portfolio without opening a single
 * .tsx file.
 *
 * Every value below is a PLACEHOLDER. They exist to prove the layout at
 * realistic lengths — swap them for the real thing and the design holds.
 *
 * Rough guide to lengths that keep the layout balanced:
 *   hero.roles          2–5 words each, 4–6 entries
 *   projects[].summary  8–16 words
 *   capabilities[].body 12–24 words
 *   about.lede          25–45 words
 * ========================================================================== */

export type Project = {
  /** Shown large in the work list. */
  title: string;
  /** One line under the title. Say what it is, not how clever it was. */
  summary: string;
  /** Right-aligned in the row. Any short string — "2026", "Ongoing". */
  year: string;
  /** Two or three tags, max. More than that reads as filler. */
  tags: string[];
  /** Where the row links. Use "#" while a case study does not exist yet. */
  href: string;
  /**
   * Image shown in the cursor-following preview. Drop a file in /public and
   * use "/work/thing.jpg", or keep a remote URL (hosts are allowlisted in
   * next.config.ts).
   */
  image: string;
};

export type Capability = {
  title: string;
  body: string;
  /** Key into the icon map in components/sections/capabilities.tsx. */
  icon: "spark" | "code" | "layers" | "camera" | "pen" | "chart";
};

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  body: string;
};

export const site = {
  /* --- Identity ---------------------------------------------------------- */
  name: "Avi Aggarwal",
  /** Used in <title>, the nav mark and the footer. */
  shortName: "Avi",
  /** Sits under the name in the hero. One line, no full stop. */
  tagline: "Placeholder tagline — a single line about what you do",
  domain: "avi-aggarwal.com",
  url: "https://avi-aggarwal.com",

  /* --- SEO / social ------------------------------------------------------ */
  meta: {
    title: "Avi Aggarwal",
    description:
      "Placeholder description. Replace with one or two sentences describing who you are and what you build — this is what shows up in search results and link previews.",
    /**
     * The social preview card is GENERATED, not a file — see
     * src/app/opengraph-image.tsx. It reads `name`, `tagline` and `domain`
     * from this object, so it can never drift out of sync with the site.
     */
  },

  /* --- Hero -------------------------------------------------------------- */
  hero: {
    /** Small line above the name. */
    eyebrow: "Portfolio",
    /**
     * Cycled one at a time in the hero. Keep them the same part of speech —
     * the rotation reads badly when the grammar changes underneath it.
     */
    roles: [
      "Placeholder One",
      "Placeholder Two",
      "Placeholder Three",
      "Placeholder Four",
    ],
    /** Paragraph under the headline. */
    intro:
      "This is placeholder copy sitting where your introduction will go. Two or three lines is the sweet spot — enough to say what you do and who it is for, short enough that nobody scrolls past it.",
    primaryCta: { label: "See the work", href: "#work" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    /** Scrolling strip under the hero. Short phrases work best. */
    ticker: [
      "Placeholder discipline",
      "Placeholder discipline",
      "Placeholder discipline",
      "Placeholder discipline",
      "Placeholder discipline",
      "Placeholder discipline",
    ],
  },

  /* --- About ------------------------------------------------------------- */
  about: {
    eyebrow: "About",
    heading: "A short heading about you",
    lede: "Placeholder lede paragraph. This is the sentence that gets read, so it should carry the single most useful thing about you — what you make, who you make it for, and why anyone should care.",
    body: [
      "Placeholder body paragraph. Two or three of these is plenty. Use them for the detail the lede cannot carry: how you work, what you have been doing lately, the shape of the problems you like.",
      "A second placeholder paragraph. Resist the urge to list everything you have ever touched — the work section does that job better, and a tight about section reads far more confidently than a long one.",
    ],
    /** Numbers beside the text. Delete the array to hide the block entirely. */
    stats: [
      { value: "00", label: "Placeholder stat" },
      { value: "00", label: "Placeholder stat" },
      { value: "00", label: "Placeholder stat" },
    ],
    /** Portrait. Put a real one at /public/portrait.jpg. */
    portrait: "",
  },

  /* --- Work -------------------------------------------------------------- */
  work: {
    eyebrow: "Selected work",
    heading: "Things I have built",
    note: "Hover a row to preview it.",
  },

  /**
   * Four rows is the sweet spot for the hover-preview list — enough to look
   * considered, few enough that every row stays above the fold on a laptop.
   */
  projects: [
    {
      title: "Project One",
      summary: "A one-line description of what this project is and who it was for.",
      year: "2026",
      tags: ["Placeholder", "Placeholder"],
      href: "#",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Project Two",
      summary: "Another single line. Say what it does, not how hard it was to make.",
      year: "2025",
      tags: ["Placeholder", "Placeholder"],
      href: "#",
      image:
        "https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Project Three",
      summary: "One line about the third thing. Concrete beats clever every time.",
      year: "2025",
      tags: ["Placeholder", "Placeholder"],
      href: "#",
      image:
        "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Project Four",
      summary: "The fourth line. If a project needs two lines, it needs its own page.",
      year: "2024",
      tags: ["Placeholder", "Placeholder"],
      href: "#",
      image:
        "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=1200&auto=format&fit=crop",
    },
  ] satisfies Project[],

  /* --- Capabilities ------------------------------------------------------ */
  capabilities: {
    eyebrow: "Capabilities",
    heading: "What I do",
    items: [
      {
        title: "Placeholder capability",
        body: "A sentence describing this capability. Keep every entry roughly the same length so the grid stays even.",
        icon: "spark",
      },
      {
        title: "Placeholder capability",
        body: "Another sentence of similar weight. Specific verbs land harder than abstract nouns here.",
        icon: "code",
      },
      {
        title: "Placeholder capability",
        body: "A third. Three to six entries fills the grid without leaving an awkward orphan on the last row.",
        icon: "layers",
      },
      {
        title: "Placeholder capability",
        body: "A fourth entry, matching the others in length so nothing looks accidental.",
        icon: "camera",
      },
      {
        title: "Placeholder capability",
        body: "A fifth, still roughly the same size. Consistency is what makes a grid look designed.",
        icon: "pen",
      },
      {
        title: "Placeholder capability",
        body: "A sixth and final entry, closing the grid cleanly on a full row of three.",
        icon: "chart",
      },
    ] satisfies Capability[],
  },

  /* --- Timeline ---------------------------------------------------------- */
  timeline: {
    eyebrow: "Timeline",
    heading: "How I got here",
    entries: [
      {
        period: "2026 —",
        title: "Placeholder role or milestone",
        org: "Placeholder organisation",
        body: "A line or two about what this was and what came out of it. Outcomes read better than responsibilities.",
      },
      {
        period: "2025",
        title: "Placeholder role or milestone",
        org: "Placeholder organisation",
        body: "Another entry. Newest first — nobody reads a timeline that starts at the beginning.",
      },
      {
        period: "2024",
        title: "Placeholder role or milestone",
        org: "Placeholder organisation",
        body: "A third entry to prove the rhythm of the list at a realistic length.",
      },
      {
        period: "2023",
        title: "Placeholder role or milestone",
        org: "Placeholder organisation",
        body: "The last entry. Four or five is plenty; a timeline is a highlight reel, not a CV.",
      },
    ] satisfies TimelineEntry[],
  },

  /* --- Contact ----------------------------------------------------------- */
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk",
    body: "Placeholder line inviting people to get in touch. Say what you are open to — work, collaboration, questions — so the reader knows whether they qualify.",
    email: "hello@example.com",
    /**
     * Delete any row you do not want. `handle` is what shows on screen;
     * `href` is where it goes.
     */
    socials: [
      { label: "GitHub", handle: "@placeholder", href: "https://github.com" },
      { label: "LinkedIn", handle: "placeholder", href: "https://linkedin.com" },
      { label: "X", handle: "@placeholder", href: "https://x.com" },
    ],
  },

  /* --- Navigation -------------------------------------------------------- */
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Timeline", href: "#timeline" },
    { label: "Contact", href: "#contact" },
  ],

  footerNote: "Placeholder footer line.",
};

export type Site = typeof site;
