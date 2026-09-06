"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { DeckChapter, Media, Project } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectDeck({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<Media | null>(null);
  const [wide, setWide] = useState(false);
  const [direction, setDirection] = useState(1);
  const region = useRef<HTMLElement>(null);

  const chapters: DeckChapter[] = useMemo(
    () => [
      ...(project.deck ?? []),
      {
        label: "stack",
        title: "Built with",
        body: [project.summary],
        plate: project.stack.split(" · "),
      },
    ],
    [project.deck, project.stack, project.summary],
  );

  const go = useCallback(
    (step: number) => {
      setIndex((current) => {
        setDirection(step);
        return (current + step + chapters.length) % chapters.length;
      });
    },
    [chapters.length],
  );

  const jump = useCallback((to: number) => {
    setIndex((current) => {
      if (to !== current) setDirection(to > current ? 1 : -1);
      return to;
    });
  }, []);

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    let visible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio > 0.5;
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(element);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!visible) return;
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [go]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [zoom]);

  const swipe = useRef({ x: 0, y: 0, live: false });
  const swiped = useRef(false);

  const onPointerDown = (event: React.PointerEvent) => {
    swipe.current = { x: event.clientX, y: event.clientY, live: true };
    swiped.current = false;
  };
  const onPointerUp = (event: React.PointerEvent) => {
    if (!swipe.current.live) return;
    swipe.current.live = false;
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };

  const chapter = chapters[index];
  const shots = (chapter.shots ?? [])
    .map((shot) => project.media[shot])
    .filter(Boolean);

  const slide = (from: number) =>
    reduced
      ? { opacity: 0 }
      : { opacity: 0, x: from * direction };

  return (
    <section
      ref={region}
      aria-roledescription="carousel"
      aria-label={`${project.title}, panel by panel`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="section relative touch-pan-y"
    >
      <div className="mx-auto grid w-full max-w-[var(--max)] items-center gap-[clamp(24px,4vw,80px)] px-[var(--gut)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto]">
        <div className="grid min-h-[34vh] content-center gap-4 lg:col-start-1 lg:row-start-1 lg:h-[min(46vh,560px)] lg:min-h-0">
          <div className="grid gap-4">
            <p className="label">{chapter.label}</p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={chapter.title}
                className="grid gap-3.5"
                initial={slide(48)}
                animate={{ opacity: 1, x: 0 }}
                exit={slide(-32)}
                transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
              >
                <h2 className="text-[length:var(--d3)] leading-[1.06] tracking-[-0.02em]">
                  {chapter.title}
                </h2>
                {chapter.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="max-w-[46ch] font-light">
                    {paragraph}
                  </p>
                ))}

                {index === chapters.length - 1 ? (
                  project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wipe-link mt-1 inline-flex items-baseline gap-2 justify-self-start font-display text-[length:var(--meta)] tracking-[0.04em] text-[var(--accent)]"
                    >
                      {project.link.replace("https://", "")} <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <p className="label">
                      {project.linkNote ?? "client work, no public repository"}
                    </p>
                  )
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        <div className="flex h-[min(36vh,320px)] items-center justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(62vh,760px)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chapter.title}
              className="flex h-full w-full items-center justify-center gap-[clamp(14px,2vw,28px)]"
              initial={slide(72)}
              animate={{ opacity: 1, x: 0 }}
              exit={slide(-48)}
              transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
            >
              {shots.length ? (
                shots.map((shot) => (
                  <Shot
                    key={shot.alt}
                    media={shot}
                    onOpen={() => {
                      if (swiped.current) return;
                      setZoom(shot);
                    }}
                  />
                ))
              ) : (
                <Plate lines={chapter.plate ?? []} numbered={chapter.label !== "stack"} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <Progress
            index={index}
            total={chapters.length}
            labels={chapters.map((entry) => entry.title)}
            onJump={jump}
          />
        </div>
      </div>

      {wide ? (
        <>
          <Arrow direction={-1} onClick={() => go(-1)} />
          <Arrow direction={1} onClick={() => go(1)} />
        </>
      ) : null}

      <AnimatePresence>
        {zoom ? <Lightbox media={zoom} onClose={() => setZoom(null)} reduced={reduced} /> : null}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  media,
  onClose,
  reduced,
}: {
  media: Media;
  onClose: () => void;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-[color-mix(in_srgb,var(--paper)_94%,transparent)] backdrop-blur-[3px]"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={media.alt}
    >
      <div className="flex items-center justify-between gap-4 px-[var(--gut)] pt-5">
        <p className="label max-w-[46ch] leading-[1.45]">{media.caption ?? media.alt}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--rule)] bg-transparent p-0 font-display text-[1.05rem] leading-none text-[var(--ink)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="flex flex-1 items-center overflow-auto overscroll-contain p-[var(--gut)]">
        <motion.div
          className="m-auto"
          initial={reduced ? false : { scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <img
            src={media.src}
            alt={media.alt}
            className={[
              "block rounded-[6px] border border-[var(--rule)] bg-[var(--paper-deep)]",
              media.portrait
                ? "h-auto max-h-[82vh] w-auto max-w-full rounded-[22px]"
                : "h-auto w-[max(100%,960px)] max-w-none",
            ].join(" ")}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Progress({
  index,
  total,
  labels,
  onJump,
}: {
  index: number;
  total: number;
  labels: string[];
  onJump: (to: number) => void;
}) {
  return (
    <div className="flex items-center gap-x-4">
      <div className="flex flex-1 items-center gap-1.5">
        {labels.map((label, position) => (
          <button
            key={label}
            type="button"
            aria-label={`Panel ${position + 1}: ${label}`}
            aria-current={position === index ? "true" : undefined}
            onClick={() => onJump(position)}
            className="group h-4 flex-1 border-0 bg-transparent p-0"
          >
            <span
              className={[
                "block h-px w-full transition-colors duration-500",
                position === index
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--rule)] group-hover:bg-[var(--grey)]",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      <p className="label tabular-nums">
        <span className="text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
        {" / "}
        {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}

function Arrow({ direction, onClick }: { direction: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? "Next panel" : "Previous panel"}
      className={[
        "group absolute top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full",
        "border border-[var(--rule)] bg-[var(--paper)] p-0 text-[var(--ink)]",
        "transition-colors duration-500 hover:border-[var(--accent)] hover:text-[var(--accent)]",
        "min-[1900px]:h-14 min-[1900px]:w-14",
        direction === 1
          ? "right-[clamp(8px,1.6vw,44px)]"
          : "left-[clamp(8px,1.6vw,44px)]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "font-display text-[1.05rem] leading-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          direction === 1 ? "group-hover:translate-x-1" : "group-hover:-translate-x-1",
        ].join(" ")}
      >
        {direction === 1 ? "→" : "←"}
      </span>
    </button>
  );
}

function Shot({ media, onOpen }: { media: Media; onOpen: () => void }) {
  return (
    <figure
      className={[
        "m-0 grid max-h-full gap-3",
        media.portrait ? "w-auto justify-items-center" : "w-full justify-items-start",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Enlarge: ${media.alt}`}
        className={[
          "group relative block cursor-zoom-in overflow-hidden border border-[var(--rule)] bg-[var(--paper-deep)] p-0 text-left",
          media.portrait ? "rounded-[20px] p-1.5" : "w-full p-2.5",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 z-10 grid h-7 w-7 place-items-center rounded-full border border-[var(--rule)] bg-[var(--paper)] font-display text-[0.75rem] leading-none text-[var(--ink)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
        >
          ⤢
        </span>
        <img
          src={media.src}
          alt={media.alt}
          className={[
          "block h-auto max-h-[min(26vh,240px)] object-contain lg:max-h-[min(50vh,660px)]",
            media.portrait ? "w-auto rounded-[15px]" : "w-full",
          ].join(" ")}
        />
      </button>
      {media.caption ? (
        <figcaption
          className={[
            "label max-w-[30ch] leading-[1.45]",
            media.portrait ? "text-center" : "",
          ].join(" ")}
        >
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Plate({ lines, numbered }: { lines: string[]; numbered: boolean }) {
  return (
    <div className="grid max-h-full w-full max-w-[36ch] gap-0 overflow-y-auto border border-[var(--rule)] bg-[var(--paper-deep)] px-[clamp(24px,3vw,44px)] py-[clamp(8px,1.5vw,16px)]">
      {lines.map((line, index) => (
        <p
          key={line}
          className={[
            "flex items-baseline gap-4 py-[clamp(14px,2vw,22px)] font-display text-[clamp(1.05rem,2vw,1.6rem)] font-medium leading-[1.25] tracking-[-0.02em]",
            index ? "border-t border-[var(--rule)]" : "",
          ].join(" ")}
        >
          <span aria-hidden="true" className="text-[length:var(--meta)] text-[var(--accent)]">
            {numbered ? String(index + 1).padStart(2, "0") : "·"}
          </span>
          {line}
        </p>
      ))}
    </div>
  );
}
