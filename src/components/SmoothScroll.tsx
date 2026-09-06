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

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
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
