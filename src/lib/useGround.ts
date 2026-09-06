"use client";

import { useCallback } from "react";

export type Ground = "ink" | "paper";

/**
 * The ground lives on <html data-ground> and nowhere else: the inline script in
 * layout.tsx puts it there before first paint, and this only flips it. Keeping
 * no React state means there is nothing to disagree with the server about.
 */
export function useGround() {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Ground = root.getAttribute("data-ground") === "paper" ? "ink" : "paper";
    if (next === "paper") root.setAttribute("data-ground", "paper");
    else root.removeAttribute("data-ground");
    try {
      localStorage.setItem("ground", next);
    } catch {
      /* private mode, or storage is blocked — the choice just will not persist */
    }
  }, []);

  return { toggle };
}
