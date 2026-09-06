"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { projects, type Project } from "@/content/site";
import { SectionRule } from "./Reveal";

const GROUPS = 3;

export function Projects() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLElement[]>([]);
  const progress = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const state = useRef({ x: 0, setWidth: 0, velocity: 0, dragging: false, lastX: 0, raf: 0 });

  const focus = useCallback(() => {
    const width = window.innerWidth;
    const middle = width / 2;
    for (const panel of panels.current) {
      const box = panel.getBoundingClientRect();
      if (box.right < -200 || box.left > width + 200) continue;
      const distance = Math.abs(box.left + box.width / 2 - middle) / middle;
      const t = Math.max(0, Math.min((distance - 0.26) / 0.4, 1));
      panel.style.opacity = (1 - t * 0.7).toFixed(3);
      panel.style.filter = t > 0.05 ? `blur(${(t * 1.3).toFixed(2)}px)` : "none";
    }
  }, []);

  const apply = useCallback(() => {
    const s = state.current;
    if (s.setWidth) {
      while (s.x <= -s.setWidth) s.x += s.setWidth;
      while (s.x > 0) s.x -= s.setWidth;
    }
    if (track.current) track.current.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
    if (progress.current && s.setWidth) {
      const travelled = (((-s.x / s.setWidth) % 1) + 1) % 1;
      progress.current.style.left = `${((37 + travelled * 74) % 74).toFixed(2)}%`;
    }
    focus();
  }, [focus]);

  const measure = useCallback(() => {
    const first = track.current?.firstElementChild as HTMLElement | undefined;
    state.current.setWidth = first?.getBoundingClientRect().width ?? 0;
    panels.current = Array.from(track.current?.querySelectorAll("article") ?? []);
    apply();
  }, [apply]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const startGlide = useCallback(() => {
    if (reduced || state.current.raf) return;

    const step = () => {
      const s = state.current;
      s.raf = 0;
      if (s.dragging || Math.abs(s.velocity) <= 0.05) return;
      s.x += s.velocity;
      s.velocity *= 0.92;
      apply();
      s.raf = requestAnimationFrame(step);
    };

    state.current.raf = requestAnimationFrame(step);
  }, [apply, reduced]);

  const suppressClick = useRef(false);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    const s = state.current;
    s.dragging = true;
    s.lastX = event.clientX;
    s.velocity = 0;
    suppressClick.current = false;
    const startX = event.clientX;

    const onMove = (move: PointerEvent) => {
      if (!s.dragging) return;
      const dx = move.clientX - s.lastX;
      s.lastX = move.clientX;
      s.x += dx;
      s.velocity = dx;
      if (Math.abs(move.clientX - startX) > 4) suppressClick.current = true;
      apply();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!s.dragging) return;
      s.dragging = false;
      startGlide();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onCardClick = (event: React.MouseEvent) => {
    if (!suppressClick.current) return;
    event.preventDefault();
    suppressClick.current = false;
  };

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;

    let axis: "none" | "x" | "y" = "none";
    let idle = 0;

    const onWheel = (event: WheelEvent) => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        axis = "none";
      }, 140);

      if (axis === "none") {
        axis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? "x" : "y";
      }
      if (axis === "y") return;

      event.preventDefault();
      event.stopPropagation();
      state.current.x -= event.deltaX;
      apply();
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
    };
  }, [apply]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = Math.min((viewport.current?.clientWidth ?? 600) * 0.6, 420);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      state.current.x -= step;
      apply();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      state.current.x += step;
      apply();
    }
  };

  return (
    <section id="projects" className="section">
      <SectionRule />
      <div className="wrap">
        <h2 className="label rail">/projects</h2>
      </div>

      <div
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="Projects, horizontally scrollable"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="mt-[clamp(28px,4vw,44px)] cursor-grab touch-pan-y overflow-hidden pb-[clamp(56px,8vw,96px)] active:cursor-grabbing"
      >
        <div ref={track} className="flex w-max items-start will-change-transform">
          {Array.from({ length: GROUPS }).map((_, group) => (
            <div key={group} className="flex flex-none items-start">
              {projects.map((project) => (
                <Panel
                  key={`${group}-${project.n}`}
                  project={project}
                  ghost={group > 0}
                  onClick={onCardClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-[clamp(16px,3vw,32px)] max-w-[var(--max)] px-[var(--gut)]">
        <div className="relative h-px overflow-hidden bg-[var(--rule)]">
          <i ref={progress} className="absolute bottom-0 left-0 top-0 w-[26%] bg-[var(--accent)]" />
        </div>
      </div>
    </section>
  );
}

function Panel({
  project,
  ghost,
  onClick,
}: {
  project: Project;
  ghost: boolean;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <article
      aria-hidden={ghost || undefined}
      style={{ "--off": `${project.offset}px` } as React.CSSProperties}
      className={[
        "flex-none transition-[opacity,filter] duration-300 ease-out",
        "translate-y-[calc(var(--off)*0.35)] md:translate-y-[var(--off)]",
        project.wide
          ? "w-[min(88vw,480px)] 2xl:w-[560px] min-[1900px]:w-[660px]"
          : "w-[min(80vw,392px)] 2xl:w-[460px] min-[1900px]:w-[540px]",
        "max-[600px]:w-[82vw]",
      ].join(" ")}
    >
      <Link
        href={`/projects/${project.slug}`}
        tabIndex={ghost ? -1 : undefined}
        onClick={onClick}
        draggable={false}
        className="group relative grid gap-[11px] border-l border-[var(--rule)] px-[clamp(22px,3.5vw,44px)] pt-[clamp(18px,2.6vw,28px)] no-underline"
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />

        <p
          aria-hidden="true"
          className="mb-1 font-display text-[clamp(3.25rem,9vw,5rem)] font-bold leading-[0.8] tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_var(--rule)] group-hover:[-webkit-text-stroke:1px_var(--accent)] group-focus-visible:[-webkit-text-stroke:1px_var(--accent)]"
        >
          {project.n}
        </p>

        <h3 className="text-[length:var(--d4)] leading-[1.02] tracking-[-0.015em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
          {project.title}
        </h3>

        <p className="font-display text-[length:var(--meta)] tracking-[0.05em] text-[var(--grey)]">
          {project.year} · {project.role}
        </p>

        <p className="text-[calc(var(--body)*0.97)] font-light leading-[1.5]">{project.summary}</p>

        <p className="border-t border-[var(--rule)] pt-2 font-display text-[length:var(--meta)] tracking-[0.03em] text-[var(--grey)]">
          {project.stack}
        </p>

        <span className="mt-1 inline-flex items-center gap-2 font-display text-[length:var(--meta)] font-medium tracking-[0.04em] text-[var(--accent)]">
          read the case
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
