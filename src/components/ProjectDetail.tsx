"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Project } from "@/content/site";
import { ProjectDeck } from "./ProjectDeck";
import { Reveal } from "./Reveal";

/**
 * A case study: the title and the one-line what-it-is, then the project itself
 * as a deck of panels, then the way on to the next one.
 */
export function ProjectDetail({
  project,
  next,
  previous,
}: {
  project: Project;
  next: Project;
  previous: Project;
}) {
  const reduced = useReducedMotion();

  return (
    <main>
      <header className="border-b border-[var(--rule)] pb-[clamp(36px,6vw,72px)] pt-[clamp(14px,2.5vh,24px)]">
        <div className="wrap">
          {/* the panels want to be near the top, so the title sits close
              behind the back link */}
          <Reveal as="p" className="label mb-[clamp(32px,6vh,64px)]">
            <Link href="/#projects" className="wipe-link">
              ← back to projects
            </Link>
          </Reveal>

          <h1 className="text-[clamp(2.5rem,10vw,7rem)] leading-[0.9] tracking-[-0.04em]">
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block"
                initial={reduced ? false : { x: "-104%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {project.title}
              </motion.span>
            </span>
          </h1>

          <Reveal
            delay={2}
            className="mt-[clamp(24px,4vw,44px)] grid gap-[clamp(16px,2.5vw,28px)] border-t border-[var(--rule)] pt-4 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
          >
            <p className="max-w-[38ch] text-[length:var(--lead)] font-light leading-[1.32]">
              {project.lead}
            </p>
            <dl className="m-0 grid grid-cols-[7ch_1fr] gap-x-5 gap-y-1">
              <dt className="label">year</dt>
              <dd className="m-0 font-display text-[length:var(--meta)] tabular-nums">{project.year}</dd>
            </dl>
          </Reveal>
        </div>
      </header>

      <ProjectDeck project={project} />

      <section className="section">
        {/* not .wrap: on a wide screen that splits into the rail-and-column
            grid the rest of the page uses, and the pager wants the full width */}
        <div className="mx-auto grid max-w-[var(--max)] gap-[clamp(26px,4vw,44px)] px-[var(--gut)]">
          {/* the way back through the list, kept quiet so it does not compete
              with the doorway underneath it */}
          <div className="border-b border-[var(--rule)] pb-[clamp(20px,3vw,30px)]">
            <Link
              href={`/projects/${previous.slug}`}
              className="group inline-block no-underline"
            >
              <span className="label transition-colors duration-500 group-hover:text-[var(--accent)]">
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5"
                >
                  ←
                </span>
                previous project
              </span>
            </Link>
          </div>

          <Link href={`/projects/${next.slug}`} className="group block no-underline">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-2.5">
                <h2 className="label">next project</h2>
                <p className="text-[clamp(2.25rem,8vw,5rem)] font-bold leading-[0.95] tracking-[-0.035em] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-[var(--accent)]">
                  {next.title}
                </p>
                <p className="max-w-[52ch] font-light">{next.summary}</p>
              </div>

              <span
                aria-hidden="true"
                className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-[var(--grey)] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-[var(--accent)]"
              >
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}
