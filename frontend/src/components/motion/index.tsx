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
import { DUR, EASE_OUT, SPRING, VIEWPORT, scaleDistance } from "@/lib/motion";

/**
 * Motion layer. Purely behavioural — nothing here renders styling, so the same
 * primitive can wrap a heading, a card or a canvas without carrying design
 * decisions with it. Every primitive:
 *   · animates transform / opacity / clip-path only
 *   · collapses to the final state under prefers-reduced-motion
 *   · scales travel distance on small screens rather than reusing desktop values
 */

/* ── environment ─────────────────────────────────────────────────────── */

function useMedia(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return on;
}
export const useIsMobile = () => useMedia("(max-width: 767px)");
export const useFinePointer = () => useMedia("(pointer: fine)");

/* ── entrances ───────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: scaleDistance(y, mobile) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.componentSlow, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Sequences direct children. Accepts any element type via `as`. */
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
  const mobile = useIsMobile();
  if (reduced) return <div className={className}>{children}</div>;
  const dy = scaleDistance(y, mobile);
  const kids = Array.isArray(children) ? children : [children];
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {kids.map((child, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, y: dy }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: DUR.component, ease: EASE_OUT }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Line-by-line mask reveal for display type. */
export function MaskLines({
  lines,
  className,
  delay = 0,
  onLoad = false,
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  /** true = animate on mount (hero), false = animate when scrolled to. */
  onLoad?: boolean;
  as?: "h1" | "h2" | "p" | "div";
}) {
  const reduced = useReducedMotion();
  const trigger = onLoad
    ? { animate: { y: "0%" } }
    : { whileInView: { y: "0%" }, viewport: VIEWPORT };
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              {...trigger}
              transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: delay + i * 0.085 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  );
}

/** Word-level reveal. Splits on words — per-character reads as a typewriter. */
export function SplitWords({
  text,
  className,
  delay = 0,
  gap = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "0.5em", filter: "blur(5px)" },
              show: { opacity: 1, y: "0em", filter: "blur(0px)" },
            }}
            transition={{ duration: DUR.componentSlow, ease: EASE_OUT }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Clip wipe — reveals a surface by its edge instead of fading it in. */
export function ClipReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left";
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  const closed = from === "bottom" ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)";
  return (
    <motion.div
      className={className}
      initial={{ clipPath: closed, opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A rule that draws itself along its own axis. */
export function DrawRule({
  className,
  vertical = false,
  delay = 0,
}: {
  className?: string;
  vertical?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <span aria-hidden className={className} />;
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ transformOrigin: vertical ? "top" : "left" }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay }}
    />
  );
}

/* ── scroll-linked ───────────────────────────────────────────────────── */

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
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = scaleDistance(distance, mobile);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [d, -d]), SPRING.scroll);
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}

/** Settles from slightly oversized to true size on entry. */
export function ScrollScale({
  children,
  className,
  from = 1.06,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [from, 1]), SPRING.scroll);
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ scale }}>{children}</motion.div>}
    </div>
  );
}

/** Progress 0→1 across a pinned section, for scrub-driven visuals. */
export function useSectionScrub(): [
  React.RefObject<HTMLDivElement>,
  MotionValue<number>,
] {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return [ref, scrollYProgress];
}

/* ── pointer ─────────────────────────────────────────────────────────── */

/** Global pointer depth, in px. Coalesced to one write per frame. */
export function usePointerDepth(strength = 12) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING.pointer);
  const y = useSpring(my, SPRING.pointer);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        mx.set((e.clientX / window.innerWidth - 0.5) * strength);
        my.set((e.clientY / window.innerHeight - 0.5) * strength);
        frame = 0;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mx, my, reduced, strength]);

  return { x, y };
}

/** Local cursor position over an element, as a CSS gradient template. */
export function useSpotlight(radius = 340, alpha = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const frame = useRef(0);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(61,219,217,${alpha}), transparent 70%)`;

  const onMouseMove = (e: React.MouseEvent) => {
    if (frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      const r = ref.current?.getBoundingClientRect();
      if (r) {
        mx.set(clientX - r.left);
        my.set(clientY - r.top);
      }
      frame.current = 0;
    });
  };
  const onMouseLeave = () => {
    mx.set(-9999);
    my.set(-9999);
  };
  return { ref, background, onMouseMove, onMouseLeave };
}

/** Leans toward the cursor. Fine pointers only. */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING.magnet);
  const y = useSpring(my, SPRING.magnet);
  const off = reduced || !fine;

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={off ? undefined : { x, y }}
      onMouseMove={(e) => {
        if (off) return;
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

/* ── data ────────────────────────────────────────────────────────────── */

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
      const p = Math.min(1, (now - t0) / 1400);
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

export function Marquee({
  children,
  duration = 34,
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
