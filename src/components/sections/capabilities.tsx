"use client";

import {
  BarChart3,
  Camera,
  Code2,
  Layers,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import type { Capability } from "@/content/site";
import { pad } from "@/lib/utils";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/section-heading";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * Icon map. Content names an icon by string key so `site.ts` never has to
 * import a React component â€” keeping the content file editable by someone who
 * has no interest in the component tree.
 *
 * All six come from one set (lucide), one size, one stroke weight. Mixing icon
 * sets is one of the loudest tells of an unconsidered interface.
 */
const ICONS: Record<Capability["icon"], LucideIcon> = {
  spark: Sparkles,
  code: Code2,
  layers: Layers,
  camera: Camera,
  pen: PenTool,
  chart: BarChart3,
};

/**
 * Capabilities grid with a cursor-tracked spotlight.
 *
 * Each card carries its own radial highlight positioned from the pointer, so
 * light appears to fall across the grid as the cursor moves. The position is
 * written to a CSS custom property on the node rather than to React state:
 * a pointer-move handler that calls `setState` re-renders the whole grid on
 * every frame, which is exactly the kind of thing that makes a page with six
 * static cards feel sluggish.
 */
export function Capabilities() {
  return (
    <Section
      id="capabilities"
      paths={{ position: 1, intensity: "subtle", count: 26 }}
    >
      <Shell>
        <SectionHeading
          eyebrow={site.capabilities.eyebrow}
          heading={site.capabilities.heading}
          headingId="capabilities-heading"
          aside={`${pad(site.capabilities.items.length)} disciplines`}
        />

        {/* Hairlines come from the container showing through 1px gaps, not
            from a border on every card. Bordered cards separated by a gap
            stack up to 3px of line between neighbours, which reads as heavy
            next to the 1px rules used everywhere else on the page. */}
        <div className="border-bone/10 bg-bone/10 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-3">
          {/* Composite key â€” capability titles are not guaranteed unique. */}
          {site.capabilities.items.map((item, index) => (
            <Reveal key={`${item.title}-${index}`} delay={index * 0.05} y={22}>
              <CapabilityCard item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  );
}

function CapabilityCard({
  item,
  index,
}: {
  item: Capability;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const Icon = ICONS[item.icon];

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    // Straight to the DOM â€” no state, no re-render.
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="group bg-ink relative h-full overflow-hidden p-8 transition-colors duration-300 md:p-10"
    >
      {/* Pointer spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background:
            "radial-gradient(340px circle at var(--mx) var(--my), rgba(214,183,124,0.09), transparent 70%)",
        }}
      />

      {/* Top hairline that lights up on hover */}
      <span
        aria-hidden
        className="via-accent/60 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="border-bone/10 bg-ink-raised text-accent inline-flex h-11 w-11 items-center justify-center rounded-lg border">
            <Icon className="h-5 w-5" aria-hidden strokeWidth={1.5} />
          </span>
          <span className="text-bone-faint font-mono text-[11px] tabular-nums">
            {pad(index + 1)}
          </span>
        </div>

        <h3 className="font-display text-bone mt-7 text-2xl">{item.title}</h3>
        <p className="text-bone-muted mt-3 text-sm leading-relaxed">
          {item.body}
        </p>
      </div>
    </div>
  );
}
