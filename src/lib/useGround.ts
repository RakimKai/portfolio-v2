"use client";

import { useCallback } from "react";

export type Ground = "ink" | "paper";

export function useGround() {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Ground = root.getAttribute("data-ground") === "paper" ? "ink" : "paper";
    if (next === "paper") root.setAttribute("data-ground", "paper");
    else root.removeAttribute("data-ground");
    try {
      localStorage.setItem("ground", next);
    } catch {
    }
  }, []);

  return { toggle };
}
