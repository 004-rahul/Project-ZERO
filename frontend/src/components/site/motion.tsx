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
 * Motion layer — behaviour only, renders no styling.
 *
 * Two rules keep this from becoming "animate everything":
 *  1. A primitive exists only if it earns a REASON to move (arrival, order,
 *     depth, feedback). There is no generic FadeIn here on purpose.
 *  2. Distances scale on small screens; nothing is a shrunk desktop animation.
 */

function useMedia(q: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [q]);
  return on;
}
export const useIsMobile = () => useMedia("(max-width: 767px)");
export const useFinePointer = () => useMedia("(pointer: fine)");

/* ── arrival ─────────────────────────────────────────────────────────── */

/** Line-masked display type. The only entrance used on headings. */
export function Lines({
  children,
  className,
  delay = 0,
  onLoad = false,
  as: Tag = "h2",
}: {
  children: string[];
  className?: string;
  delay?: number;
  onLoad?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const go = onLoad
    ? { animate: { y: "0%" } }
    : { whileInView: { y: "0%" }, viewport: VIEWPORT };
  return (
    <Tag className={className}>
      {children.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em]">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "115%" }}
              {...go}
              transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: delay + i * 0.08 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  );
}

/** Supporting content arriving after its heading. Never used on headings. */
export function Enter({
  children,
  delay = 0,
  y = 16,
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

/** Sequenced children — for lists where ORDER is the information. */
export function Sequence({
  children,
  gap = 0.06,
  className,
  y = 18,
}: {
  children: ReactNode[];
  gap?: number;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (reduced) return <div className={className}>{children}</div>;
  const dy = scaleDistance(y, mobile);
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children.map((c, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, y: dy }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: DUR.component, ease: EASE_OUT }}
        >
          {c}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Edge wipe — for surfaces. A fade makes a panel look like it failed to load. */
export function Wipe({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A rule that draws along its own axis. */
export function Draw({
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

/* ── depth ───────────────────────────────────────────────────────────── */

export function Drift({
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

/** Global normalised pointer, -0.5..0.5. One write per frame. */
export function usePointer() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING.pointer);
  const y = useSpring(my, SPRING.pointer);
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let f = 0;
    const on = (e: MouseEvent) => {
      if (f) return;
      f = requestAnimationFrame(() => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
        f = 0;
      });
    };
    window.addEventListener("mousemove", on, { passive: true });
    return () => {
      window.removeEventListener("mousemove", on);
      if (f) cancelAnimationFrame(f);
    };
  }, [mx, my, reduced]);
  return { x, y };
}

/** Cursor spotlight over a surface, as a ready CSS background. */
export function useSpotlight(radius = 360, alpha = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const f = useRef(0);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(61,219,217,${alpha}), transparent 68%)`;
  return {
    ref,
    background,
    onMouseMove: (e: React.MouseEvent) => {
      if (f.current) return;
      const { clientX, clientY } = e;
      f.current = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (r) {
          mx.set(clientX - r.left);
          my.set(clientY - r.top);
        }
        f.current = 0;
      });
    },
    onMouseLeave: () => {
      mx.set(-9999);
      my.set(-9999);
    },
  };
}

export function Magnetic({
  children,
  strength = 0.2,
}: {
  children: ReactNode;
  strength?: number;
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
      className="inline-block"
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

/* ── scrub ───────────────────────────────────────────────────────────── */

export function useScrub(): [React.RefObject<HTMLDivElement>, MotionValue<number>] {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return [ref, scrollYProgress];
}

/* ── data ────────────────────────────────────────────────────────────── */

export function Count({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? end : 0);
  useEffect(() => {
    if (!seen || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1300);
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, end, reduced]);
  return (
    <span ref={ref} className="pz-num">
      {n}
      {suffix}
    </span>
  );
}

export function Ticker({
  children,
  duration = 40,
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
