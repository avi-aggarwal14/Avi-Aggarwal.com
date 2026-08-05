"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { lerp, pad } from "@/lib/utils";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/heading";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * A project row has no real destination yet if its href is empty or a bare
 * fragment. `"#"` is not harmless — the browser treats it as a navigation to
 * the top of the document, which slams the page back to the hero and replays
 * every entrance. Rows without a destination are inert.
 */
function isPlaceholderHref(href: string) {
  return !href || href === "#";
}

/**
 * Selected work — the signature interaction on the site.
 *
 * Built on the 21st.dev "Project Showcase" (@jatin-yadav05): a list of rows
 * where hovering one floats a preview image that chases the cursor on a lerp,
 * so the image always trails slightly behind the pointer. That lag is the
 * whole trick — an image pinned exactly to the cursor feels stuck to the
 * glass; one that eases toward it feels like it has weight.
 *
 * ## Changes from the source component
 *
 *  · **Positioning bug fixed.** The original reads
 *    `containerRef.current?.getBoundingClientRect()` *during render* to place
 *    the preview. That value is captured on first paint and never updated, so
 *    the preview detaches from the cursor as soon as the page is scrolled or
 *    resized. Here the pointer is tracked in viewport coordinates via
 *    `position: fixed`, correct at any scroll offset and needing no
 *    measurement at all.
 *  · **The rAF loop starts once.** The original lists `mousePosition` in its
 *    effect dependency array, cancelling and rescheduling the frame on every
 *    single pointer event.
 *  · **Cursor position never enters React state.** The original calls
 *    `setSmoothPosition` inside the loop, re-rendering the whole list ~60×
 *    a second. The transform is written straight to the node.
 *  · **Focus mirrors hover**, so keyboard users drive the same preview.
 *  · Scaled to editorial proportions, with index numerals and tag rows, and
 *    the hovered title shifts into the serif italic.
 */
export function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  // One rAF loop for the life of the component. Reads refs, writes a
  // transform, never touches React state — so the list never re-renders.
  useEffect(() => {
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.12);
      current.current.y = lerp(current.current.y, target.current.y, 0.12);

      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  function handleMove(event: React.MouseEvent) {
    // Viewport coordinates, offset so the card sits up and right of the cursor.
    target.current = { x: event.clientX + 28, y: event.clientY - 110 };
  }

  // Jump the preview to the pointer on first entry rather than letting it fly
  // in from wherever the last hover left it.
  function handleEnter(index: number, event: React.MouseEvent) {
    if (hovered === null) {
      const start = { x: event.clientX + 28, y: event.clientY - 110 };
      target.current = start;
      current.current = start;
    }
    setHovered(index);
  }

  return (
    <Section
      id="work"
      wash="bl"
      paths={{ position: -1, intensity: "whisper", count: 16, speed: 34 }}
    >
      <Shell wide>
        <SectionHeading
          eyebrow={site.work.eyebrow}
          heading={site.work.heading}
          headingId="work-heading"
          index={2}
          aside={site.work.note}
        />

        {/* Floating preview. Fixed-positioned, so it is correct at any scroll
            offset; opacity and scale transition, position is driven by rAF. */}
        <div
          ref={previewRef}
          aria-hidden
          style={{ zIndex: "var(--z-overlay)" }}
          className="pointer-events-none fixed top-0 left-0 hidden lg:block"
        >
          <div
            className="border-bone/15 bg-ink-raised relative h-[15rem] w-[22rem] overflow-hidden rounded-xl border transition-[opacity,scale] duration-300 ease-out"
            style={{
              opacity: hovered === null ? 0 : 1,
              scale: hovered === null ? 0.92 : 1,
            }}
          >
            {site.projects.map((project, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={project.title}
                src={project.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
                style={{ opacity: hovered === index ? 1 : 0 }}
              />
            ))}
            <div className="from-ink/50 absolute inset-0 bg-gradient-to-t to-transparent" />
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(214,183,124,0.6), transparent)",
              }}
            />
          </div>
        </div>

        {/* The list */}
        <div
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
          className="border-bone/10 border-t"
        >
          {site.projects.map((project, index) => (
            <Reveal key={project.title}>
              <a
                href={project.href}
                aria-disabled={isPlaceholderHref(project.href) || undefined}
                onClick={(event) => {
                  if (isPlaceholderHref(project.href)) event.preventDefault();
                }}
                onMouseEnter={(event) => handleEnter(index, event)}
                onFocus={(event) => {
                  setHovered(index);
                  // Only pull into view for KEYBOARD focus — doing it on every
                  // focus meant a plain mouse click also kicked off a scroll.
                  if (event.currentTarget.matches(":focus-visible")) {
                    event.currentTarget.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }
                }}
                onBlur={() => setHovered(null)}
                className="group border-bone/10 relative block cursor-pointer border-b"
              >
                {/* Hover bed: gold-tinted, fades rather than moves, so nothing
                    in the row shifts on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(214,183,124,0.07), transparent 65%)",
                  }}
                />
                {/* Gold edge that draws in from the left on hover. */}
                <span
                  aria-hidden
                  className="bg-accent absolute bottom-0 left-0 h-px w-0 transition-all duration-500 ease-out group-hover:w-full group-focus-visible:w-full"
                />

                <div className="relative flex items-baseline gap-5 py-7 md:gap-10 md:py-10">
                  <span className="text-bone-faint group-hover:text-accent w-8 shrink-0 font-mono text-xs transition-colors duration-300">
                    {pad(index + 1)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      {/* The title swaps to the serif italic on hover — the
                          one place besides the hero that voice is spent. */}
                      <h3 className="text-bone truncate text-3xl transition-all duration-300 md:text-5xl">
                        <span className="font-display group-hover:hidden">
                          {project.title}
                        </span>
                        <span className="font-display-italic text-accent hidden group-hover:inline">
                          {project.title}
                        </span>
                      </h3>
                      <ArrowUpRight
                        aria-hidden
                        className="text-accent h-5 w-5 shrink-0 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:h-6 md:w-6"
                      />
                    </div>

                    <p className="text-bone-muted mt-2.5 max-w-xl text-sm leading-relaxed md:text-base">
                      {project.summary}
                    </p>

                    <ul role="list" className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <li
                          key={`${tag}-${tagIndex}`}
                          className="border-bone/12 text-bone-muted group-hover:border-accent/30 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="text-bone-faint group-hover:text-bone-muted shrink-0 font-mono text-xs tabular-nums transition-colors duration-300">
                    {project.year}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* The hover preview cannot exist on touch, so the section says so
            rather than silently doing nothing. */}
        <Reveal>
          <p className="text-bone-faint mt-8 font-mono text-[11px] tracking-[0.16em] uppercase lg:hidden">
            Tap a project to open it
          </p>
        </Reveal>
      </Shell>
    </Section>
  );
}
