"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "./magnetic";
import { cn } from "@/lib/utils";

type Ripple = { x: number; y: number; size: number; id: number };

type ActionButtonProps = {
  children: ReactNode;
  href: string;
  /** Solid bone-on-ink, or hairline outline. */
  variant?: "solid" | "ghost";
  className?: string;
};

/**
 * The site's call-to-action link.
 *
 * Three layered interactions, borrowed from the `ButtonRipple` in the 21st.dev
 * "Classy Hero" and toned down for a one-accent palette:
 *
 *  - **Magnetic pull** toward the cursor (12px, via <Magnetic>).
 *  - **Click ripple** originating at the exact pointer position.
 *  - **Arrow nudge** on hover, looping gently.
 *
 * The original also runs an indigo→purple→pink gradient wash and three orbiting
 * particles on hover. Both are dropped here: this palette has exactly one
 * chromatic value, and a rainbow gradient would be the loudest thing on the
 * page by an order of magnitude.
 *
 * Rendered as an anchor, not a button — it navigates, so it must be a link for
 * keyboard and screen-reader users.
 */
export function ActionButton({
  children,
  href,
  variant = "solid",
  className,
}: ActionButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const nextId = useRef(0);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const ripple: Ripple = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size,
      id: nextId.current++,
    };
    setRipples((prev) => [...prev, ripple]);
    // Drop it once the animation has finished rather than leaking nodes.
    window.setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)),
      700,
    );
  }

  const solid =
    "bg-bone text-ink hover:bg-bone/90 border border-transparent";
  const ghost =
    "bg-transparent text-bone border border-bone/25 hover:border-bone/60 hover:bg-bone/5";

  return (
    <Magnetic strength={10}>
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight",
          "transition-colors duration-200",
          // 44px minimum touch target.
          "min-h-[44px]",
          variant === "solid" ? solid : ghost,
          className,
        )}
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              initial={{ opacity: 0.35, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                width: ripple.size,
                height: ripple.size,
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                background:
                  variant === "solid"
                    ? "radial-gradient(circle, rgba(8,8,10,0.28) 0%, rgba(8,8,10,0) 70%)"
                    : "radial-gradient(circle, rgba(243,239,231,0.22) 0%, rgba(243,239,231,0) 70%)",
              }}
            />
          ))}
        </AnimatePresence>

        <span className="relative z-10">{children}</span>

        <motion.span
          className="relative z-10 flex items-center"
          animate={{ x: hovered ? [0, 4, 0] : 0 }}
          transition={{
            duration: 1.1,
            repeat: hovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </motion.span>
      </a>
    </Magnetic>
  );
}
