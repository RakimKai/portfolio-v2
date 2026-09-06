"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { experience } from "@/content/site";
import { CountUp } from "./CountUp";
import { Reveal, SectionRule } from "./Reveal";

export function Experience() {
  const panels = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let frame = 0;

    const read = () => {
      frame = 0;
      const list = panels.current.filter(Boolean) as HTMLElement[];
      if (window.innerWidth < 768) {
        list.forEach((panel) => {
          panel.style.transform = "";
          panel.style.opacity = "";
        });
        return;
      }
      for (let i = 0; i < list.length - 1; i += 1) {
        const here = list[i].getBoundingClientRect();
        const next = list[i + 1].getBoundingClientRect();
        const progress =
          1 - Math.max(0, Math.min((next.top - here.top) / Math.max(here.height, 1), 1));
        list[i].style.transform = `scale(${(1 - progress * 0.04).toFixed(4)})`;
        list[i].style.opacity = `${(1 - progress * 0.45).toFixed(3)}`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section id="experience" className="section">
      <SectionRule />
      <div className="wrap">
        <Reveal as="h2" className="label rail">
          /experience
        </Reveal>

        <div className="col grid">
          {experience.map((role, index) => (
            <article
              key={role.company}
              ref={(node) => {
                panels.current[index] = node;
              }}
              className={[
                "grid gap-[18px] bg-[var(--paper)] will-change-transform md:sticky md:top-16",
                "pb-[clamp(40px,8vw,72px)]",
                index > 0
                  ? "mt-[clamp(32px,6vw,56px)] border-t border-[var(--rule)] pt-[clamp(24px,4vw,40px)]"
                  : "",
              ].join(" ")}
            >
              <div className="grid gap-1.5 md:grid-cols-[1fr_auto] md:items-end md:gap-x-6">
                <Reveal as="h3" className="text-[length:var(--d3)] leading-[0.98] tracking-[-0.02em]">
                  {role.company}
                </Reveal>
                <Reveal
                  delay={1}
                  as="p"
                  className="font-display text-[length:var(--meta)] tracking-[0.03em] text-[var(--grey)] tabular-nums"
                >
                  {role.period}
                </Reveal>
              </div>

              <Reveal delay={1} className="flex flex-wrap gap-x-5 gap-y-1.5">
                <p className="label">{role.title}</p>
                {role.note ? <p className="label">{role.note}</p> : null}
              </Reveal>

              <div className="prose">
                <Reveal as="p">{role.body}</Reveal>

                {role.figure ? (
                  <Reveal delay={1} className="mt-1 grid max-w-[44ch] gap-0.5 border-l-2 border-[var(--accent)] pl-4">
                    <p className="font-display text-[clamp(1.75rem,6vw,2.75rem)] font-bold leading-none tracking-[-0.02em]">
                      <CountUp value={role.figure.value} />
                    </p>
                    <p className="label">{role.figure.caption}</p>
                  </Reveal>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
