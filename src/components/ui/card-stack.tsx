"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven card stack — adapted from the 21st.dev "Animated Cards Stack"
 * (@youcefbnm).
 *
 * A tall scroll container holds a sticky stage; each card is pinned in that
 * stage and driven off the container's own scroll progress. Cards enter
 * rotated and stacked, straighten as their slice of the scroll arrives, then
 * lift away — so the reader deals them like a hand of cards by scrolling.
 *
 * ## Changes from the source, and why
 *
 * 1. **A conditional hook is gone.** The original computes its drop-shadow as
 *    `variant === "light" ? useMotionTemplate\`…\` : "none"`, which calls a
 *    hook inside a ternary — a rules-of-hooks violation that changes hook
 *    order between renders. React only tolerates it because `variant` happens
 *    not to change. Removed entirely along with the shadow.
 *
 * 2. **No animated `drop-shadow`, no `backdrop-blur`.** Both are filters, and
 *    an animating filter promotes its element to a fresh GPU layer every
 *    frame. Four of those churning together is precisely the layer thrash
 *    that made this site flash on loaded machines. Depth is carried by
 *    surface lightness, hairlines and a static gold rim instead — which suits
 *    a near-black palette better anyway, since shadows are invisible on it.
 *
 * 3. **Transform-only motion.** `translateZ`, `translateY` and `rotate`
 *    composed through `useMotionTemplate`, exactly as the original does —
 *    that part was already right.
 *
 * 4. **Index is derived, not passed.** The source asks the caller for
 *    `index + 2` with the offset undocumented; here the component owns its
 *    own arithmetic.
 *
 * 5. **Reduced motion renders a plain list.** The stack is a scroll toy; the
 *    content underneath it is real, so it degrades to a readable column
 *    rather than disappearing.
 */

type StackContextValue = { scrollYProgress: MotionValue<number> };

const StackContext = React.createContext<StackContextValue | undefined>(undefined);

function useStackContext() {
  const ctx = React.useContext(StackContext);
  if (!ctx) {
    throw new Error("Stack cards must be rendered inside <CardStackScroll>.");
  }
  return ctx;
}

/**
 * The tall scroll container. Give it a height in viewports — roughly
 * `(cards + 1) * 70vh` reads well; too short and the cards snap past.
 */
export function CardStackScroll({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  return (
    <StackContext.Provider value={{ scrollYProgress }}>
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ perspective: "1200px", ...style }}
        {...props}
      >
        {children}
      </div>
    </StackContext.Provider>
  );
}

/** The sticky stage the cards are pinned inside. */
export function CardStackStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sticky top-0 flex h-svh items-center", className)}>
      <div
        className={cn("relative mx-auto w-full")}
        style={{ perspective: "1200px" }}
      >
        {children}
      </div>
    </div>
  );
}

export function StackCard({
  index,
  total,
  children,
  className,
  offsetY = 12,
  offsetZ = 14,
}: {
  /** 0-based position in the stack. */
  index: number;
  total: number;
  children: React.ReactNode;
  className?: string;
  /** Vertical stagger of the resting stack, px per card. */
  offsetY?: number;
  /** Depth stagger, px per card. */
  offsetZ?: number;
}) {
  const { scrollYProgress } = useStackContext();

  // Each card owns a slice of the container's scroll. The +1 leaves room for
  // the last card to settle before the container ends.
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);

  // The rotation window opens well before the card's own slice, so cards are
  // already straightening as they arrive rather than snapping upright.
  const rotateRange: [number, number] = [start - 1.5, end / 1.5];
  const enterRotation = -index + 90;

  const y = useTransform(scrollYProgress, [start, end], ["0%", "-180%"]);
  const rotate = useTransform(scrollYProgress, rotateRange, [enterRotation, 0]);

  const transform = useMotionTemplate`translateZ(${
    index * offsetZ
  }px) translateY(${y}) rotate(${rotate}deg)`;

  return (
    <motion.div
      style={{
        top: index * offsetY,
        transform,
        backfaceVisibility: "hidden",
        zIndex: (total - index) * 10,
      }}
      className={cn(
        "absolute inset-x-0 mx-auto will-change-transform",
        // Surface + hairline + static gold rim. No filters anywhere.
        "border-bone/12 bg-ink-raised/95 rounded-2xl border",
        className,
      )}
    >
      {/* Static gold rim light along the top edge — reads as a bevel catching
          the same light as the filaments, and costs one painted gradient. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(214,183,124,0.55), transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}
