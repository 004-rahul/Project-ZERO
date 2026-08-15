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
import { DUR, EASE_OUT, EASE_SOFT, SPRING, VIEWPORT, scaleDistance } from "@/lib/motion";

/**
 * Landing motion primitives (Design Bible §15, §19.4).
 *
 * Rules this file enforces so the system stays coherent:
 *  1. transform / opacity / clip-path / filter ONLY — never layout properties.
 *  2. Every primitive has a reduced-motion path that renders the final state.
 *  3. Travel distances are scaled on small screens, never copied from desktop.
 *  4. Timing comes from the tokens in lib/motion, never from a local guess.
 */

/* ─────────────────────────── environment ─────────────────────────── */

/** True on small screens — used to scale travel distances, not to disable motion. */
export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpoint]);
  return mobile;
}

/** True only for a real mouse — gates pointer-following effects. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return fine;
}

/* ─────────────────────────── layout shell ─────────────────────────── */

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16 ${className ?? ""}`}>
      {children}
    </div>
  );
}

/**
 * Section marker. Every section on the page uses this, so it carries the
 * page's structural language: a full-measure rule the section hangs from, an
 * oversized ghosted index numeral in the gutter, and the label set small and
 * wide against it. The scale contrast between a 44px numeral and an 11px
 * label is doing the design work — a small mono index and a short dash reads
 * as decoration, not structure.
 *
 * Colours are all `currentColor`, so the same component sits correctly on the
 * cream canvas and on the graphite inversion bands without a tone prop.
 */
export function Eyebrow({ index, children }: { index: string; children: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="relative"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.span
        className="block h-px w-full origin-left bg-current opacity-[.14]"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: DUR.cinematic, ease: EASE_OUT }}
      />
      <div className="flex items-start gap-5 pt-5">
        <motion.span
          className="pz-num select-none text-[clamp(30px,3.6vw,46px)] font-black leading-[0.8] tracking-tight opacity-[.16]"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 0.16, y: 0 } }}
          transition={{ duration: DUR.componentSlow, ease: EASE_OUT }}
        >
          {index}
        </motion.span>
        <motion.span
          className="pt-1.5 text-2xs font-extrabold uppercase tracking-[.3em] opacity-70"
          variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 0.7, x: 0 } }}
          transition={{ duration: DUR.component, ease: EASE_OUT }}
        >
          {children}
        </motion.span>
      </div>
    </motion.div>
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
  const mobile = useIsMobile();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: scaleDistance(y, mobile) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration: DUR.componentSlow, ease: EASE_OUT, delay }}
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
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: dy }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: DUR.component, ease: EASE_OUT }}
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
  as = "h1",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: delay + i * 0.09 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Word-level reveal for editorial headings. Words rise and sharpen together —
 * a per-character reveal on a long heading reads as a typewriter gimmick, so
 * this splits on words and keeps the stagger tight.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  gap = 0.045,
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
  inView?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  if (reduced) return <span className={className}>{text}</span>;

  const anim = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
    show: { opacity: 1, y: "0em", filter: "blur(0px)" },
  };
  const trigger = inView
    ? { whileInView: "show" as const, viewport: VIEWPORT }
    : { animate: "show" as const };

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={anim}
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

/**
 * Clip wipe. Reveals a panel or image by animating its clip edge rather than
 * fading it — a fade makes an image look like it failed to load, a wipe makes
 * it look composed.
 */
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
  const closed = from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <motion.div
      className={className}
      initial={{ clipPath: closed, opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Settles from slightly oversized to true size as it enters. The classic
 * editorial image entrance: the subject appears to come to rest.
 */
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
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const smooth = useSpring(scale, SPRING.scroll);
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ scale: smooth }}>{children}</motion.div>}
    </div>
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
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = scaleDistance(distance, mobile);
  const raw = useTransform(scrollYProgress, [0, 1], [d, -d]);
  const y = useSpring(raw, SPRING.scroll);
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}

/**
 * Layer speed relative to the page. speed < 1 lags (reads as far away),
 * speed > 1 leads (reads as close). This is what actually produces depth —
 * a single parallax layer just looks like a stray moving element.
 */
export function useLayerSpeed(speed: number, range = 240) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = scaleDistance(range * (1 - speed), mobile);
  const raw = useTransform(scrollYProgress, [0, 1], [d, -d]);
  const y = useSpring(raw, SPRING.scroll);
  return { ref, y };
}

/** Pointer-driven depth for layered hero art. Returns springs in px. */
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
      /* Coalesce to one write per frame: mousemove fires far faster than the
         compositor can use, and the extra sets are pure waste. */
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

/* ─────────────────────────── surfaces ─────────────────────────── */

/**
 * Multi-layer card interaction. One cursor event drives four things at once —
 * the card lifts, a violet spotlight follows the pointer, the top edge lights,
 * and children opted into `.pz-zoom` / `.pz-shift` move. A lone `scale(1.05)`
 * is the tell of a template; layered response is what reads as considered.
 * Every layer returns together on leave, so nothing is left mid-state.
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
  const reduced = useReducedMotion();
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const bg = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, rgba(124,58,237,.10), transparent 72%)`;
  const frame = useRef(0);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduced || frame.current) return;
        const cx = e.clientX;
        const cy = e.clientY;
        frame.current = requestAnimationFrame(() => {
          const r = ref.current?.getBoundingClientRect();
          if (r) {
            mx.set(cx - r.left);
            my.set(cy - r.top);
          }
          frame.current = 0;
        });
      }}
      onMouseLeave={() => {
        mx.set(-999);
        my.set(-999);
      }}
      whileHover={lift && !reduced ? { y: -4 } : undefined}
      transition={{ duration: DUR.microOut, ease: EASE_SOFT }}
      className={`pz-card group relative overflow-hidden rounded-lg border border-line bg-card shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent/35 hover:shadow-lift ${className ?? ""}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: bg }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** Magnetic wrapper — the element leans toward the cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
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

/**
 * Press feedback. Hover is handled in CSS by the consumer; this adds only the
 * tactile part — a short, stiff compression on pointer-down that makes the
 * control feel physical rather than like a link.
 */
export function Pressable({
  children,
  className,
  scale = 0.97,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={`inline-block ${className ?? ""}`}
      whileTap={reduced ? undefined : { scale }}
      transition={SPRING.press}
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
