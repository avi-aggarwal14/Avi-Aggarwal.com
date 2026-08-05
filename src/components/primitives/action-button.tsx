"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "./magnetic";
import { cn } from "@/lib/utils";

/**
 * The site's call-to-action link — v2.
 *
 * Three layered interactions, each earning its place:
 *
 *  · magnetic pull toward the cursor (12px, via <Magnetic>)
 *  · a gold shine that sweeps across on hover — pure CSS transform on a
 *    gradient pseudo-layer, replacing v1's JS ripple: richer to look at,
 *    zero state, zero timers, zero layer churn
 *  · the arrow nudges while hovered
 *
 * Rendered as an anchor, not a button — it navigates, so keyboard and screen
 * reader users must get a link.
 */
export function ActionButton({
  children,
  href,
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  href: string;
  /** Solid bone-on-ink, or gold-ringed ghost. */
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const solid =
    "bg-bone text-ink border border-transparent hover:bg-bone/90";
  const ghost =
    "bg-transparent text-bone border border-bone/25 hover:border-accent/70 hover:bg-accent-soft/40";

  return (
    <Magnetic strength={10}>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group relative inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight",
          "transition-colors duration-200",
          variant === "solid" ? solid : ghost,
          className,
        )}
      >
        {/* The shine — a narrow gold-tinted band that crosses the button on
            hover. translateX only; skewed for the diagonal. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 transition-transform duration-700 ease-out",
            variant === "solid"
              ? "bg-gradient-to-r from-transparent via-[rgba(214,183,124,0.35)] to-transparent"
              : "bg-gradient-to-r from-transparent via-[rgba(214,183,124,0.18)] to-transparent",
            hovered ? "translate-x-[320%]" : "-translate-x-[160%]",
          )}
        />

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
