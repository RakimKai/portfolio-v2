"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ScrollTo = (target: string | number) => void;

const ScrollContext = createContext<ScrollTo>(() => {});

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Lenis drives the whole page. Anchor jumps run through it too, so a nav
 * click travels on the same curve as a wheel gesture instead of snapping.
 * With reduced motion the whole thing is skipped and jumps are instant.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    /* lerp rather than duration: each wheel tick still lands where the OS
       intended, it just catches up over a few frames. Duration-based easing is
       what makes smooth-scroll libraries feel floaty and detached. */
    const instance = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false, /* phones keep their own native scrolling */
    });
    lenis.current = instance;

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduced]);

  /**
   * Lenis carries its own idea of where the page is, so the router's own jump
   * to the top on a navigation left it convinced we were still halfway down
   * a page that no longer exists — a new case study opened mid-way through.
   * Anything with a hash is left alone: that jump belongs to the anchor.
   */
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  const scrollTo = useCallback<ScrollTo>(
    (target) => {
      const offset =
        typeof target === "string"
          ? -((document.querySelector("nav")?.offsetHeight ?? 0) + 4)
          : 0;

      if (lenis.current) {
        lenis.current.scrollTo(target, { offset, duration: 0.9 });
        return;
      }

      if (typeof target === "number") {
        window.scrollTo(0, target);
        return;
      }
      const element = document.querySelector(target);
      if (element) {
        window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + offset);
      }
    },
    [],
  );

  return <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>;
}
