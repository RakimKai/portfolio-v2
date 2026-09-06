"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { meta } from "@/content/site";
import { useIntroDone } from "@/lib/intro";

const [firstName, ...restOfName] = meta.name.split(" ");
const lines = [firstName.toLowerCase(), restOfName.join(" ").toLowerCase()];

export function Hero() {
  const reduced = useReducedMotion();
  const ready = useIntroDone();

  return (
    <header
      id="top"
      className="hero flex min-h-[calc(100svh-120px)] flex-col pb-[clamp(40px,7vh,80px)] pt-[clamp(32px,6vh,80px)]"
    >
      <div className="wrap w-full">
        <motion.h1
          className="text-[length:var(--name)] leading-[0.88] tracking-[-0.04em]"
          initial={reduced ? false : { x: -56 }}
          animate={ready || reduced ? { x: 0 } : { x: -56 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {lines.map((text, index) => (
            <span
              key={text}
              className={[
                "block overflow-hidden pb-[0.05em]",
                index ? "pl-[1.5%]" : "",
              ].join(" ")}
            >
              <motion.span
                className="block will-change-transform"
                initial={reduced ? false : { x: "-104%" }}
                animate={ready || reduced ? { x: "0%" } : { x: "-104%" }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          className="mt-[clamp(28px,6vh,72px)] grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-[clamp(16px,3vw,40px)] border-t border-[var(--rule)] pt-[clamp(16px,2.5vw,24px)] md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-x-[clamp(32px,6vw,96px)]"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={ready || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 1.5 }}
        >
          <p className="col-span-2 max-w-[34ch] text-[length:var(--lead)] font-light leading-[1.25] md:col-span-1">
            {meta.intro}
          </p>

          <dl className="m-0 grid grid-cols-[6ch_1fr] items-baseline gap-x-4 md:grid-cols-[7ch_1fr] md:gap-x-5">
            <dt className="label">based</dt>
            <dd className="m-0 font-display text-[length:var(--meta)] lowercase leading-[1.2]">
              {meta.location}
            </dd>
          </dl>

          <p className="label tabular-nums justify-self-end">{meta.year}</p>
        </motion.div>
      </div>
    </header>
  );
}
