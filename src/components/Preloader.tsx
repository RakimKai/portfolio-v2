"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { markIntroDone } from "@/lib/intro";
import { BootIntro } from "./BootIntro";

const RUN = 2300; /* the sweep, plus a beat */
const CAP = 2600; /* hard ceiling — it never holds the page longer than this */

/**
 * A console start-up screen: the name, then the mark, then it lifts away.
 * The cap is a plain timeout, so on a slow connection the site still appears
 * on schedule whatever is loading behind it. Reduced motion skips it entirely.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (reduced) {
      markIntroDone();
      return;
    }

    /* the name starts moving almost at once, so the cat appears to shove it
       into place rather than to uncover something already sitting there */
    const wake = window.setTimeout(markIntroDone, 560);
    /* the sweep has a length of its own, and a ceiling above it */
    const done = window.setTimeout(() => {
      markIntroDone();
      setRemoved(true);
    }, RUN);
    const cap = window.setTimeout(() => {
      markIntroDone();
      setRemoved(true);
    }, CAP);

    return () => {
      window.clearTimeout(wake);
      window.clearTimeout(done);
      window.clearTimeout(cap);
    };
  }, [reduced]);

  if (reduced || removed) return null;

  return (
    <div aria-hidden="true" className="boot-sweep fixed inset-0 z-[60]">
      <BootIntro />
    </div>
  );
}
