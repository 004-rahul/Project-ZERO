"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Landing motion primitives (Design Bible §15, §19.4). Everything here is
 * transform/opacity only — GPU-friendly, 60fps — and every primitive has a
 * reduced-motion path that renders the final state immediately.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────── layout shell ─────────────────────────── */

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16 ${className ?? ""}`}>
      {children}
    </div>
  );
}

/** Numbered section eyebrow — mono index, rule, label. */
export function Eyebrow({ index, children }: { index: string; children: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="pz-num text-2xs font-bold tracking-[.2em] text-accent">{index}</span>
        <span className="h-px w-10 bg-accent/30" />
        <span className="text-2xs font-extrabold uppercase tracking-[.26em] text-muted">
          {children}
        </span>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────── reveals ─────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — direct children animate in sequence. */
export function Stagger({
  children,
  gap = 0.07,
  className,
  y = 20,
}: {
  children: ReactNode;
  gap?: number;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/** Headline mask reveal — each line rises from behind a clip edge. */
export function MaskLines({
  lines,
  className,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.11 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </h1>
  );
}

/* ─────────────────────────── parallax + pointer depth ─────────────────────────── */

/** Scroll parallax: shifts a layer as its section passes the viewport. */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}

/** Pointer-driven depth for layered hero art. Returns springs in px. */
export function usePointerDepth(strength = 12) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 90, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * strength);
      my.set((e.clientY / window.innerHeight - 0.5) * strength);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduced, strength]);

  return { x, y };
}

/* ─────────────────────────── surfaces ─────────────────────────── */

/**
 * Spotlight card: a violet radial follows the cursor and the border warms.
 * Borders stay visible at rest so cards never blend into the canvas.
 */
export function SpotlightCard({
  children,
  className,
  lift = true,
}: {
  children: ReactNode;
  className?: string;
  lift?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const bg = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, rgba(124,58,237,.09), transparent 72%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        mx.set(-999);
        my.set(-999);
      }}
      whileHover={lift ? { y: -4 } : undefined}
      transition={{ duration: 0.35, ease: EASE }}
      className={`group relative overflow-hidden rounded-lg border border-line bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent/35 hover:shadow-lift ${className ?? ""}`}
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** Magnetic wrapper — the element leans toward the cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 20 });
  const y = useSpring(my, { stiffness: 260, damping: 20 });

  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={reduced ? undefined : { x, y }}
      onMouseMove={(e) => {
        if (reduced) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────── data display ─────────────────────────── */

/** Counts to `end` when scrolled into view. */
export function Ticker({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? end : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1500);
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, reduced]);

  return (
    <span ref={ref} className="pz-num">
      {n}
      {suffix}
    </span>
  );
}

/** Infinite marquee rail. */
export function Marquee({
  children,
  duration = 32,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`pz-fade-x overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex w-max"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </motion.div>
    </div>
  );
}

/** Draggable horizontal rail with snap-back bounds. */
export function DragRail({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [bound, setBound] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      setBound(Math.max(0, el.scrollWidth - el.offsetWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className={bound > 0 && !reduced ? "pz-grab flex w-max" : "flex w-max"}
        drag={bound > 0 && !reduced ? "x" : false}
        dragConstraints={{ left: -bound, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ power: 0.25, timeConstant: 220 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Section scroll progress, 0→1, for scrub-driven visuals. */
export function useSectionProgress(): [React.RefObject<HTMLDivElement>, MotionValue<number>] {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return [ref, scrollYProgress];
}
