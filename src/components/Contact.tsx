"use client";

import { useEffect, useRef, useState } from "react";
import { meta } from "@/content/site";
import { Reveal } from "./Reveal";
import { useSmoothScroll } from "./SmoothScroll";

export function Contact() {
  const scrollTo = useSmoothScroll();

  return (
    <footer
      id="contact"
      className="relative border-t border-[var(--rule)] bg-[var(--paper-deep)] pb-[clamp(18px,2.5vw,26px)] pt-[clamp(44px,6vw,76px)]"
    >
      <div className="wrap rail-grid grid gap-[clamp(24px,4vw,40px)]">
        <h2 className="label rail">/contact</h2>

        <div className="col">
          <Reveal className="grid gap-[7px] py-3.5 sm:grid-cols-[9ch_1fr] sm:items-baseline sm:gap-5">
            <p className="label">email</p>
            <CopyEmail email={meta.email} />
          </Reveal>

          <Reveal delay={1} className="grid gap-[7px] border-t border-[var(--rule)] py-3.5 sm:grid-cols-[9ch_1fr] sm:items-baseline sm:gap-5">
            <p className="label">github</p>
            <a
              href={meta.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wipe-link inline-flex items-baseline gap-[9px] justify-self-start font-display text-[clamp(1.0625rem,3.4vw,1.375rem)] font-medium leading-[1.15] tracking-[-0.01em] hover:gap-[15px]"
            >
              {meta.github} <span aria-hidden="true">→</span>
            </a>
          </Reveal>

          {meta.phone ? (
            <Reveal delay={2} className="grid gap-[7px] border-t border-[var(--rule)] py-3.5 sm:grid-cols-[9ch_1fr] sm:items-baseline sm:gap-5">
              <p className="label">phone</p>
              <a
                href={`tel:${meta.phone.replace(/\s/g, "")}`}
                className="wipe-link justify-self-start font-display text-[clamp(1.0625rem,3.4vw,1.375rem)] font-medium tracking-[-0.01em]"
              >
                {meta.phone}
              </a>
            </Reveal>
          ) : null}

          <div className="mt-[clamp(8px,1.2vw,14px)] flex justify-end border-t border-[var(--rule)] pt-2.5">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group inline-flex cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 py-1.5 font-display text-[length:var(--meta)] font-medium tracking-[0.06em] text-[var(--grey)] transition-colors duration-300 hover:text-[var(--accent)]"
            >
              back to top
              <svg
                aria-hidden="true"
                viewBox="0 0 9 16"
                className="h-4 w-[9px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M4.5 16V1M4.5 1 1 4.5M4.5 1 8 4.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = false;
    }
    setState(ok ? "copied" : "manual");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full cursor-pointer items-baseline justify-between gap-[18px] border-0 bg-transparent p-0 text-left"
    >
      <span className="font-display text-[clamp(1.0625rem,3.6vw,1.5rem)] font-medium leading-[1.15] tracking-[-0.01em] break-all">
        {email}
      </span>
      <span
        className={[
          "shrink-0 font-display text-[length:var(--meta)] font-medium tracking-[0.05em] transition-colors duration-300",
          state === "idle" ? "text-[var(--grey)] group-hover:text-[var(--accent)]" : "text-[var(--accent)]",
        ].join(" ")}
      >
        {state === "idle" ? "click to copy" : state === "copied" ? "copied" : "press ⌘C"}
      </span>
    </button>
  );
}
