"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { lerp, pad } from "@/lib/utils";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/section-heading";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * Selected work — the signature interaction on the site.
 *
 * Built on the 21st.dev "Project Showcase" (@jatin-yadav05): a list of rows
 * where hovering one floats a preview image that chases the cursor on a lerp,
 * so the image always trails slightly behind the pointer. That lag is the whole
 * trick — an image pinned exactly to the cursor feels stuck to the glass; one
 * that eases toward it feels like it has weight.
 *
 * Changes from the source component:
 *
 *  - **Fixed a positioning bug.** The original reads
 *    `containerRef.current?.getBoundingClientRect()` during render to place the
 *    floating preview. That value is captured on the first paint and never
 *    updated, so the preview detaches from the cursor as soon as the page is
 *    scrolled or the window resized. Here the pointer is tracked in *viewport*
 *    coordinates via `position: fixed`, which is correct at any scroll offset
 *    and needs no measurement at all.
 *  - **rAF loop no longer restarts on every mouse move.** The original lists
 *    `mousePosition` in the effect's dependency array, so the animation frame
 *    is cancelled and re-scheduled on every single pointer event. The target is
 *    held in a ref here and the loop is started exactly once.
 *  - **The preview no longer lives in React state.** Writing cursor position to
 *    state re-renders the entire list ~60 times a second. The transform is
 *    applied straight to the node.
 *  - Scaled up to editorial proportions, given index numbering, tag rows and a
 *    keyboard-accessible focus path.
 *
 * The preview is decorative: it is `aria-hidden`, and every row is a plain
 * anchor carrying the same information as text.
 */
export function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  // One rAF loop for the life of the component. Reads refs, writes a transform,
  // never touches React state — so the list never re-renders while you move.
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
  // in from wherever it was left.
  function handleEnter(index: number, event: React.MouseEvent) {
    if (hovered === null) {
      const start = { x: event.clientX + 28, y: event.clientY - 110 };
      target.current = start;
      current.current = start;
    }
    setHovered(index);
  }

  return (
    // Whisper, and fewer strokes: this section already carries the cursor
    // preview, four hover beds and the densest type on the page.
    <Section
      id="work"
      paths={{ position: -1, intensity: "whisper", count: 20, speed: 34 }}
    >
      <Shell wide>
        <SectionHeading
          eyebrow={site.work.eyebrow}
          heading={site.work.heading}
          headingId="work-heading"
          aside={site.work.note}
        />

        {/* Floating preview. Fixed-positioned, so it is correct at any scroll
            offset; opacity/scale are transitioned, position is driven by rAF. */}
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
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hovered === index ? 1 : 0,
                  scale: hovered === index ? 1 : 1.08,
                  filter: hovered === index ? "none" : "blur(12px)",
                }}
              />
            ))}
            <div className="from-ink/50 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        </div>

        {/* The list */}
        <div
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
          className="border-bone/10 border-t"
        >
          {site.projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.06} y={20}>
              <a
                href={project.href}
                onMouseEnter={(event) => handleEnter(index, event)}
                onFocus={(event) => {
                  setHovered(index);
                  // Keyboard users get no scroll from focus alone when a row
                  // is only partly on screen. Bring it fully into view.
                  event.currentTarget.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                  });
                }}
                onBlur={() => setHovered(null)}
                className="group border-bone/10 relative block cursor-pointer border-b"
              >
                {/* Hover bed. Sits behind the content, fades rather than moves,
                    so nothing in the row shifts on hover. */}
                <span
                  aria-hidden
                  className="from-bone/[0.04] absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />

                <div className="relative flex items-baseline gap-5 py-7 md:gap-10 md:py-10">
                  {/* Index */}
                  <span className="text-bone-faint group-hover:text-accent w-8 shrink-0 font-mono text-xs transition-colors duration-300">
                    {pad(index + 1)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-bone truncate text-3xl transition-colors duration-300 md:text-5xl">
                        {project.title}
                      </h3>
                      <ArrowUpRight
                        aria-hidden
                        className="text-bone-muted h-5 w-5 shrink-0 -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:h-6 md:w-6"
                      />
                    </div>

                    <p className="text-bone-muted mt-2.5 max-w-xl text-sm leading-relaxed md:text-base">
                      {project.summary}
                    </p>

                    <ul role="list" className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <li
                          key={`${tag}-${tagIndex}`}
                          className="border-bone/12 text-bone-muted rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Year */}
                  <span className="text-bone-faint group-hover:text-bone-muted shrink-0 font-mono text-xs tabular-nums transition-colors duration-300">
                    {project.year}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Mobile note — the hover preview cannot exist on touch, so the
            section says so rather than silently doing nothing. */}
        <Reveal delay={0.1}>
          <p className="text-bone-faint mt-8 font-mono text-[11px] tracking-[0.16em] uppercase lg:hidden">
            Tap a project to open it
          </p>
        </Reveal>
      </Shell>
    </Section>
  );
}
