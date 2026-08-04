import { site } from "@/content/site";

/**
 * schema.org Person, as JSON-LD.
 *
 * For a personal site this is the highest-leverage SEO available: it is what
 * lets a search engine understand that the page is *about a person* — with a
 * name, a job description and a set of profiles — rather than just a document
 * that happens to mention one. It is the input to knowledge-panel style
 * results and to "same as" reconciliation across GitHub, LinkedIn and X.
 *
 * Built from the content file, so it can never contradict the visible page —
 * which matters, because structured data that disagrees with the rendered
 * content is treated as a spam signal rather than ignored.
 *
 * A server component: this is static markup, never interactive.
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": site.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built entirely from local content — there is no user
      // input anywhere in this object.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
