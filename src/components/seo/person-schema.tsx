import { site } from "@/content/site";

/**
 * schema.org Person, as JSON-LD.
 *
 * For a personal site this is the highest-leverage SEO available: it is what
 * lets a search engine understand the page is *about a person* — with a name,
 * a role and a set of profiles — rather than a document that happens to
 * mention one.
 *
 * Built from the content file, so it can never contradict the visible page.
 * That matters: structured data disagreeing with rendered content is treated
 * as a spam signal rather than ignored. (Which also means the placeholders
 * must be replaced before this goes to a real domain — see docs/12.)
 */
export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    description: site.meta.description,
    email: `mailto:${site.contact.email}`,
    jobTitle: site.tagline,
    sameAs: site.contact.socials.map((social) => social.href),
    knowsAbout: site.capabilities.items.map((item) => item.title),
    mainEntityOfPage: { "@type": "WebPage", "@id": site.url },
  };

  return (
    <script
      type="application/ld+json"
      // `async` is required, not cosmetic. React 19 refuses to render a sync
      // or deferred <script> outside the document head — "Cannot render a sync
      // or defer <script> outside the main document without knowing its
      // order." Marking it async lets React hoist it safely, and script
      // ordering is meaningless for a JSON-LD payload that executes nothing.
      async
      // The payload is built entirely from local content — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
