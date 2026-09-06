"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the boot screen has finished. The intro lives in the layout so it
 * plays on every page, and the hero waits on this rather than on a prop passed
 * down a tree it no longer shares.
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroDone() {
  /* false on the server and on the first client render, so the two agree */
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
