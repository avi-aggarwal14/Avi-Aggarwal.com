"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Floating navigation — v2.
 *
 *  · **It floats.** `top-4 left-4 right-4`, not welded to `top-0`. A bar
 *    flush to the edges reads as browser chrome; an inset pill reads as
 *    design.
 *  · **Deterministic scroll-spy.** v1 sorted the IntersectionObserver
 *    `entries`, which only contain sections whose intersection *changed* in
 *    that callback — so the indicator stuck on whichever reported last.
 *    Here every section is measured against a probe line 35% down the
 *    viewport: same answer every time, at any scroll speed.
 *  · **A shared `layoutId` pill** slides between links instead of blinking.
 *  · The bar gains a gold-tinted hairline and a whisper of gold in its glass
 *    once scrolled, so it feels lit by the same light as the filaments.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = site.nav.map((item) => item.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    let frame = 0;

    const pick = () => {
      frame = 0;
      const probe = window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          current = section.id;
          break;
        }
      }
      // Empty above the first section — the hero owns no nav entry.
      setActive(current);
    };

    const onScroll = () => {
      // Coalesce to one measurement per frame; scroll fires far more often.
      if (!frame) frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Lock the page behind the open mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE.outExpo, delay: 0.1 }}
        style={{ zIndex: "var(--z-nav)" }}
        className="fixed top-4 right-4 left-4 flex justify-center"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "relative flex w-full max-w-[var(--shell)] items-center justify-between gap-6 overflow-hidden rounded-full border px-5 py-2.5 transition-all duration-300 md:px-6",
            scrolled
              ? "border-bone/10 bg-ink/70 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          {/* Gold hairline along the top of the glass — only once scrolled. */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-0",
            )}
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(214,183,124,0.4), transparent)",
            }}
          />

          {/* Word mark. -mx-2 px-2 keeps it visually flush while giving the
              hit area the 44px minimum height a thumb needs. */}
          <a
            href="#top"
            aria-label={`${site.name} — back to top`}
            className="group relative -mx-2 flex min-h-[44px] cursor-pointer items-center gap-2.5 px-2"
          >
            <span
              aria-hidden
              className="bg-accent h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
            />
            <span className="font-display text-bone text-lg tracking-tight">
              {site.shortName}
            </span>
          </a>

          {/* Desktop links. role="list" is not redundant: Tailwind's preflight
              sets list-style:none, and Safari/VoiceOver drops list semantics
              from any list styled that way. */}
          <ul role="list" className="relative hidden items-center gap-1 md:flex">
            {site.nav.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors duration-200",
                      isActive ? "text-bone" : "text-bone-muted hover:text-bone",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="border-accent/25 bg-accent-soft absolute inset-0 rounded-full border"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="relative flex items-center gap-2">
            <a
              href="#contact"
              className="border-bone/20 text-bone hover:border-accent/60 hover:bg-accent-soft hidden cursor-pointer items-center rounded-full border px-4 py-2 text-sm transition-colors duration-200 sm:inline-flex"
            >
              Get in touch
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="text-bone hover:bg-bone/10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ zIndex: "var(--z-overlay)" }}
            className="bg-ink/95 fixed inset-0 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-bone text-lg">
                {site.shortName}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-bone hover:bg-bone/10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <ul role="list" className="flex flex-col px-6 pt-8">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.05,
                    duration: 0.5,
                    ease: EASE.outExpo,
                  }}
                  className="border-bone/10 border-b"
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-bone hover:text-accent block cursor-pointer py-5 text-4xl transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
