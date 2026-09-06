"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { markIntroDone } from "@/lib/intro";
import { BootIntro } from "./BootIntro";

const RUN = 2300;
const CAP = 2600;

export function Preloader() {
  const reduced = useReducedMotion();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (reduced) {
      markIntroDone();
      return;
    }

    const wake = window.setTimeout(markIntroDone, 560);
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
