"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { site } from "@/content/site";
import { Reveal, RevealMask } from "@/components/primitives/reveal";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * Closing call to action.
 *
 * Deliberately the loudest block on the page: the email address is set at
 * display size and IS the button. A portfolio's last screen has exactly one
 * job, and a contact form would add friction to it — nobody wants three
 * fields to say hello, and a `mailto:` cannot silently fail the way an
 * unmonitored form endpoint can.
 *
 * The copy-to-clipboard control exists because half the people who want the
 * address will not use a `mailto:` link.
 *
 * The address is fluid and breakable: it comes from the content file, and a
 * long one at a fixed display size would run straight off a narrow screen.
 */
export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the mailto: link still works.
    }
  }

  return (
    <Section
      id="contact"
      className="pb-32 md:pb-44"
      wash="bottom"
      paths={{ position: 1, intensity: "present", count: 24, speed: 34 }}
    >
      <Shell wide>
        <Reveal>
          <span className="eyebrow flex items-center gap-3">
            <span aria-hidden className="bg-accent inline-block h-px w-6" />
            {site.contact.eyebrow}
          </span>
        </Reveal>

        <RevealMask className="mt-8">
          <h2
            id="contact-heading"
            className="font-display text-display-lg text-bone"
          >
            {site.contact.heading}
          </h2>
        </RevealMask>

        <Reveal
          as="p"
          className="text-bone-muted prose-measure mt-8 text-base leading-relaxed md:text-lg"
        >
          {site.contact.body}
        </Reveal>

        {/* The email, as the primary control */}
        <Reveal>
          <div className="mt-14 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.contact.email}`}
              className="group border-bone/15 hover:border-accent/60 inline-flex max-w-full cursor-pointer items-center gap-4 border-b pb-2 transition-colors duration-300"
            >
              <span
                className="font-display text-bone group-hover:text-accent min-w-0 break-all transition-colors duration-300"
                style={{ fontSize: "clamp(1.5rem, 5.2vw, 3rem)" }}
              >
                {site.contact.email}
              </span>
              <ArrowUpRight
                aria-hidden
                className="text-bone-muted group-hover:text-accent h-6 w-6 shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:h-8 md:w-8"
              />
            </a>

            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? "Email address copied" : "Copy email address"}
              className="border-bone/15 text-bone-muted hover:border-accent/60 hover:text-bone inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
            >
              {copied ? (
                <Check className="text-accent h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
            </button>

            {/* Status for assistive tech — the icon swap alone is not enough. */}
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </Reveal>

        {/* Socials */}
        <Reveal>
          <ul
            role="list"
            className="border-bone/10 mt-20 grid gap-px border-t sm:grid-cols-3"
          >
            {site.contact.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group border-bone/10 relative flex cursor-pointer items-center justify-between overflow-hidden border-b px-1 py-6 transition-colors duration-300 sm:border-r sm:px-6"
                >
                  {/* Gold wash that rises on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(214,183,124,0.08), transparent 70%)",
                    }}
                  />
                  <span className="relative">
                    <span className="text-bone-faint block font-mono text-[10px] tracking-[0.2em] uppercase">
                      {social.label}
                    </span>
                    <span className="text-bone group-hover:text-accent mt-1.5 block text-lg transition-colors duration-300">
                      {social.handle}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="text-bone-faint group-hover:text-accent relative h-5 w-5 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Shell>
    </Section>
  );
}
