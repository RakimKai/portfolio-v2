"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger step, in tenths of a second. */
  delay?: number;
  as?: ElementType;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * One slide-and-fade from the left, once — the same direction the cat walks in.
 * `viewport.once` means nothing replays when you scroll back over it.
 */
export function Reveal({ children, delay = 0, as = "div", className, ...rest }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x: -26 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: delay * 0.1 }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** The hairline above a section, drawn left to right as it arrives. */
export function SectionRule() {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="section-rule"
      initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
