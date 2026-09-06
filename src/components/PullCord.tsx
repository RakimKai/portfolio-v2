"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useGround } from "@/lib/useGround";
import { useScrolled } from "@/lib/useScrolled";
import { useIntroDone } from "@/lib/intro";

const REST = 72;
const REELED = 4;
const MAX = 196;
const THRESHOLD = 44;
const STIFFNESS = 0.14;
const DAMPING = 0.86;

export function PullCord({
  mode = "attached",
}: {
  mode?: "attached" | "fixed";
}) {
  const { toggle } = useGround();
  const reduced = useReducedMotion();
  const scrolled = useScrolled();
  const ready = useIntroDone();

  const rope = useRef<SVGPathElement>(null);
  const twist = useRef<SVGPathElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const hint = useRef<SVGTextElement>(null);

  const state = useRef({ len: REELED, vel: 0, sway: 0, swayVel: 0, dragging: false, raf: 0 });
  const rest = useRef(REST);

  const draw = useCallback(() => {
    const s = state.current;
    const endX = 36 + s.sway;
    const slack = Math.max(0, 52 - (s.len - REST) * 0.42);
    const d = `M36 0 Q${(36 + s.sway * 0.42).toFixed(2)} ${(s.len * 0.52 + slack * 0.2).toFixed(2)} ${endX.toFixed(2)} ${s.len.toFixed(2)}`;
    rope.current?.setAttribute("d", d);
    twist.current?.setAttribute("d", d);
    ring.current?.setAttribute("cx", endX.toFixed(2));
    ring.current?.setAttribute("cy", (s.len + 9).toFixed(2));
    hint.current?.setAttribute("x", (endX - 20).toFixed(2));
    hint.current?.setAttribute("y", (s.len + 14).toFixed(2));
  }, []);

  const stop = useCallback(() => {
    if (state.current.raf) {
      cancelAnimationFrame(state.current.raf);
      state.current.raf = 0;
    }
  }, []);

  const start = useCallback(() => {
    if (reduced) {
      state.current.len = rest.current;
      state.current.sway = 0;
      draw();
      return;
    }
    if (state.current.raf) return;

    const step = () => {
      const s = state.current;
      s.raf = 0;
      s.vel = (s.vel + (rest.current - s.len) * STIFFNESS) * DAMPING;
      s.len += s.vel;
      s.swayVel = (s.swayVel - s.sway * 0.12) * 0.9;
      s.sway += s.swayVel;
      draw();
      if (Math.abs(s.vel) > 0.05 || Math.abs(s.len - rest.current) > 0.2 || Math.abs(s.sway) > 0.2) {
        s.raf = requestAnimationFrame(step);
      } else {
        s.len = rest.current;
        s.sway = 0;
        s.vel = 0;
        s.swayVel = 0;
        draw();
      }
    };

    state.current.raf = requestAnimationFrame(step);
  }, [draw, reduced]);

  useEffect(() => {
    draw();
    return stop;
  }, [draw, stop]);

  const dropped = useRef(false);

  useEffect(() => {
    rest.current = scrolled ? REELED : REST;
    if (state.current.dragging || !ready || !dropped.current) return;
    start();
  }, [scrolled, start, ready]);

  useEffect(() => {
    if (!ready || dropped.current) return;
    if (reduced) {
      dropped.current = true;
      state.current.len = rest.current;
      draw();
      return;
    }
    const timer = window.setTimeout(() => {
      dropped.current = true;
      start();
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [ready, reduced, draw, start]);

  const drag = useRef({ startY: 0, startX: 0, moved: false, blockClick: false });

  const onPointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    stop();
    const s = state.current;
    s.dragging = true;
    s.vel = 0;
    s.swayVel = 0;
    drag.current = { startY: event.clientY, startX: event.clientX, moved: false, blockClick: false };
    if (hint.current) hint.current.textContent = "pull me";

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dy = e.clientY - drag.current.startY;
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dy) > 4 || Math.abs(dx) > 4) drag.current.moved = true;
      s.len = Math.max(rest.current, Math.min(rest.current + dy, MAX));
      s.sway = Math.max(-22, Math.min(dx * 0.36, 22));
      if (hint.current) hint.current.textContent = s.len - REST > THRESHOLD ? "let go" : "pull me";
      draw();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!s.dragging) return;
      s.dragging = false;
      const pulled = s.len - rest.current;
      if (drag.current.moved) drag.current.blockClick = true;
      if (hint.current) hint.current.textContent = "pull me";
      if (pulled > THRESHOLD) {
        toggle();
        s.vel = -Math.min(pulled * 0.09, 7);
      } else {
        s.vel = 0;
      }
      start();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onClick = (event: React.MouseEvent) => {
    if (drag.current.blockClick) {
      drag.current.blockClick = false;
      return;
    }
    stop();
    if (event.detail === 0) {
      toggle();
      state.current.vel = 10;
    } else {
      state.current.vel = 5;
    }
    start();
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={false}
      aria-label="Page ground: pull the cord to switch"
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={[
        "group z-[31] block h-[104px] w-[64px] cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing",
        "transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled ? "pointer-events-none opacity-0" : "opacity-100",
        mode === "fixed" ? "fixed top-0" : "absolute top-full",
        "right-[calc(var(--gut)+26px)] md:right-[calc(var(--gut)-14px)] touch-none",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 72 330"
        className="pointer-events-none block h-[330px] w-[72px] overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="27" y="-3" width="18" height="6" rx="3"
          className="fill-[var(--rule)] transition-colors duration-500 group-hover:fill-[var(--accent)] group-focus-visible:fill-[var(--accent)]"
        />
        <path
          ref={rope} d="M36 0 Q36 22 36 44" fill="none" strokeWidth="3.4" strokeLinecap="round"
          className="stroke-[var(--rule)] transition-colors duration-500 group-hover:stroke-[var(--accent)] group-focus-visible:stroke-[var(--accent)]"
        />
        <path
          ref={twist} d="M36 0 Q36 22 36 44" fill="none" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray="2 6" className="stroke-[var(--paper)] opacity-70"
        />
        <circle
          ref={ring} cx="36" cy="81" r="9" fill="none" strokeWidth="2.2"
          className="stroke-[var(--rule)] transition-colors duration-500 group-hover:stroke-[var(--accent)] group-focus-visible:stroke-[var(--accent)]"
        />
        <text
          ref={hint} x="18" y="86" textAnchor="end"
          className="font-display fill-[var(--grey)] text-[13px] font-medium tracking-[0.06em] opacity-0 transition-opacity duration-300 group-hover:fill-[var(--accent)] group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100"
        >
          pull me
        </text>
      </svg>
    </button>
  );
}
