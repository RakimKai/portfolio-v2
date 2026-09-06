"use client";

import { useEffect, useState } from "react";

/**
 * Framer's own hook reads matchMedia during the first client render, which the
 * server cannot know about — so a visitor with reduced motion switched on got a
 * hydration mismatch on every animated element. This one always agrees with the
 * server on the first render and only reports the real answer after mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
