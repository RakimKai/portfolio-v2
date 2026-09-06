"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { meta, nav, projects } from "@/content/site";
import { PullCord } from "./PullCord";
import { useSmoothScroll } from "./SmoothScroll";

export function Nav() {
  const scrollTo = useSmoothScroll();
  const pathname = usePathname();
  const atHome = pathname === "/";

  return (
    <nav aria-label="Primary" className="site-nav sticky top-0 z-30 border-b py-4 min-[1500px]:py-5 min-[1900px]:py-6 min-[2400px]:py-7">
      <PullCord />
      <div className="wrap flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <Link
          href="/"
          aria-label={`${meta.name}, home`}
          onClick={(event) => {
            if (!atHome) return;
            event.preventDefault();
            scrollTo(0);
          }}
          className="group inline-flex shrink-0 items-center gap-2 pt-px no-underline sm:pt-0"
        >
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-[var(--accent)] min-[1900px]:h-2 min-[1900px]:w-2 transition-colors duration-300 group-hover:bg-[var(--accent-deep)]"
          />
          <span className="font-display text-[length:var(--meta)] font-medium tracking-[0.06em] text-[var(--ink)]">
            ae
          </span>
        </Link>

        <ul className="m-0 hidden list-none flex-wrap items-center justify-end gap-x-3 gap-y-2 p-0 sm:gap-x-4 sm:gap-y-2.5 md:flex min-[1900px]:gap-x-7">
          {nav.map((item) =>
            item.href === "#projects" ? (
              <ProjectsMenu key={item.href} atHome={atHome} scrollTo={scrollTo} />
            ) : (
              <li key={item.href}>
                <Link
                  href={atHome ? item.href : `/${item.href}`}
                  onClick={(event) => {
                    if (!atHome) return;
                    event.preventDefault();
                    scrollTo(item.href);
                  }}
                  className="wipe-link font-display text-[length:var(--meta)] tracking-[0.04em] text-[var(--grey)] hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <MobileMenu atHome={atHome} scrollTo={scrollTo} />
      </div>
    </nav>
  );
}

function MobileMenu({
  atHome,
  scrollTo,
}: {
  atHome: boolean;
  scrollTo: (target: string | number) => void;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (href: string) => {
    setOpen(false);
    if (!atHome) return;
    window.setTimeout(() => scrollTo(href), reduced ? 0 : 220);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--rule)] bg-transparent p-0 transition-colors duration-300 hover:border-[var(--accent)]"
      >
        <span aria-hidden="true" className="grid gap-[5px]">
          <span className="block h-px w-4 bg-[var(--ink)]" />
          <span className="block h-px w-4 bg-[var(--ink)]" />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            className="fixed inset-0 z-50"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full border-0 bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] p-0 backdrop-blur-[2px]"
            />

            <motion.div
              ref={panel}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute right-0 top-0 h-full w-[min(86vw,360px)] border-l border-[var(--rule)] bg-[var(--paper-deep)] px-[var(--gut)] pb-[clamp(28px,6vh,48px)] pt-5 outline-none"
              initial={reduced ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--rule)] bg-transparent p-0 font-display text-[1rem] leading-none text-[var(--ink)]"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <ul className="m-0 mt-[clamp(24px,5vh,44px)] grid list-none gap-0 p-0">
                  {nav.map((item) => (
                    <li key={item.href} className="border-b border-[var(--rule)]">
                      <Link
                        href={atHome ? item.href : `/${item.href}`}
                        onClick={(event) => {
                          if (atHome) event.preventDefault();
                          goTo(item.href);
                        }}
                        className="block py-3.5 font-display text-[1.5rem] font-medium tracking-[-0.02em] text-[var(--ink)] no-underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

              </div>

            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProjectsMenu({
  atHome,
  scrollTo,
}: {
  atHome: boolean;
  scrollTo: (target: string | number) => void;
}) {
  const [open, setOpen] = useState(false);
  const item = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!item.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <li
      ref={item}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={atHome ? "#projects" : "/#projects"}
        aria-expanded={open}
        onClick={(event) => {
          if (!atHome) return;
          event.preventDefault();
          setOpen(false);
          scrollTo("#projects");
        }}
        className={`wipe-link font-display text-[length:var(--meta)] tracking-[0.04em] hover:text-[var(--ink)] ${
          open ? "text-[var(--ink)]" : "text-[var(--grey)]"
        }`}
      >
        projects
      </Link>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 top-full z-40 m-0 grid list-none gap-0 border border-[var(--rule)] bg-[var(--paper-deep)] p-0 pt-1"
          >
            {projects.map((project, index) => (
              <motion.li
                key={project.slug}
                initial={reduced ? false : { opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-3 whitespace-nowrap px-4 py-2.5 no-underline"
                >
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-[var(--rule)] transition-colors group-hover:bg-[var(--accent)]"
                  />
                  <span className="font-display text-[calc(var(--meta)*1.15)] font-medium tracking-[-0.005em] text-[var(--grey)] transition-colors group-hover:text-[var(--ink)]">
                    {project.title}
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
