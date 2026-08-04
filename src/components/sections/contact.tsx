"use client";

import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { site } from "@/content/site";
import { Reveal } from "@/components/primitives/reveal";
import { Section, Shell } from "@/components/primitives/shell";
import { TextReveal } from "@/components/primitives/text-reveal";

/**
 * Closing call to action.
 *
 * Deliberately the loudest block on the page: the email address is set at
 * display size and *is* the button. A portfolio's last screen has exactly one
 * job, and a contact form would only add friction to it â€” nobody wants to fill
 * in three fields to say hello, and a `mailto:` cannot silently fail the way an
 * unmonitored form endpoint can.
 *
 * The copy-to-clipboard control exists because half the people who want the
 * address are not going to use a `mailto:` link.
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
    // The closing statement, so it gets the fullest treatment after the hero
    // â€” the most strokes and the slowest pass on the page.
    <Section
      id="contact"
      className="pb-32 md:pb-44"
      paths={{ position: 1, intensity: "present", count: 30, speed: 34 }}
    >
      <Shell wide>
        <Reveal y={16}>
          <span className="eyebrow flex items-center gap-3">
            <span aria-hidden className="bg-accent inline-block h-px w-6" />
            {site.contact.eyebrow}
          </span>
        </Reveal>

        <TextReveal
          as="h2"
          id="contact-heading"
          text={site.contact.heading}
          delay={0.06}
          className="font-display text-display-lg text-bone mt-8 block"
        />

        <TextReveal
          as="p"
          text={site.contact.body}
          delay={0.16}
          stagger={0.014}
          className="text-bone-muted prose-measure mt-8 block text-base leading-relaxed md:text-lg"
        />

        {/* The email, as the primary control */}
        <Reveal delay={0.2} y={22}>
          <div className="mt-14 flex flex-wrap items-center gap-4">
            {/* Fluid rather than a fixed md: step, and allowed to break:
                the address comes from the content file, and a long one at a
                fixed display size would run straight off a narrow screen. */}
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
              className="border-bone/15 text-bone-muted hover:border-bone/40 hover:text-bone inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
            >
              {copied ? (
                <Check className="text-accent h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
            </button>

            {/* Status for assistive tech â€” the icon swap alone is not enough. */}
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </Reveal>

        {/* Socials */}
        <Reveal delay={0.28}>
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
                  className="group border-bone/10 hover:bg-bone/[0.03] flex cursor-pointer items-center justify-between border-b px-1 py-6 transition-colors duration-300 sm:border-r sm:px-6"
                >
                  <span>
                    <span className="text-bone-faint block font-mono text-[10px] tracking-[0.2em] uppercase">
                      {social.label}
                    </span>
                    <span className="text-bone group-hover:text-accent mt-1.5 block text-lg transition-colors duration-300">
                      {social.handle}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="text-bone-faint group-hover:text-accent h-5 w-5 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
