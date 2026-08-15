import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Container } from "@/components/layout/Container";
import { stages } from "@/content/copy";

/**
 * PINNED SCRUB — the page's centrepiece move.
 *
 * The section holds still while the page scrolls past it, and scroll
 * position drives the content forward through four states. Nothing plays on
 * a timer; the reader is operating it. That distinction is most of what
 * makes a page feel authored rather than assembled.
 *
 * Built on `position: sticky` plus scroll progress rather than a pinning
 * library. Sticky is native, never fights Lenis, cannot desynchronise, and
 * degrades to a normal stacked section if anything fails — a pinning library
 * that breaks leaves the page unusable.
 *
 * Note on structure: every element that reads scroll is its own component.
 * Hooks cannot be called inside a loop, so a "just map over it" version of
 * this file is quietly broken — the sub-components are the fix, not
 * decoration.
 */

const COUNT = stages.length;
const SOURCES = [
  { x: 40, y: 60 }, { x: 24, y: 148 }, { x: 62, y: 236 },
  { x: 150, y: 34 }, { x: 132, y: 210 }, { x: 196, y: 128 },
];
const TARGET = { x: 300, y: 140 };

const linkPath = (s: { x: number; y: number }, i: number) =>
  `M ${s.x} ${s.y} Q ${(s.x + TARGET.x) / 2} ${s.y - 30 + i * 12} ${TARGET.x} ${TARGET.y}`;

/* ── copy: each stage owns a window of the scroll range ────────────────── */

function StageCopy({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const stage = stages[i];
  const span = 1 / COUNT;
  const start = i * span;

  // Windows overlap slightly so there is never a dead frame with nothing
  // legible on screen.
  const range = [
    start - span * 0.35,
    start + span * 0.12,
    start + span * 0.88,
    start + span * 1.35,
  ];
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [28, 0, 0, -28]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center">
      <p className="font-mono text-2xs tracking-[0.2em] text-accent-contrast uppercase">
        {String(i + 1).padStart(2, "0")} — {stage.label}
      </p>
      <h3 className="mt-5 max-w-[16ch] text-3xl leading-[1.05] font-semibold tracking-[-0.035em] text-text">
        {stage.title}
      </h3>
      <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-text-muted">{stage.body}</p>
    </motion.div>
  );
}

/* ── schematic parts ───────────────────────────────────────────────────── */

function Link({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const pathLength = useTransform(progress, [0.22, 0.58], [0, 1]);
  return (
    <motion.path
      d={linkPath(SOURCES[i], i)}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1"
      opacity={0.42}
      style={{ pathLength }}
    />
  );
}

function Trace({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.74, 0.92], [0, 0.55]);
  return (
    <motion.path
      d={linkPath(SOURCES[i], i)}
      fill="none"
      stroke="var(--second)"
      strokeWidth="0.75"
      style={{ opacity }}
    />
  );
}

function Source({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const s = SOURCES[i];
  const scale = useTransform(progress, [i * 0.028, 0.2 + i * 0.028], [0, 1]);
  return (
    <motion.circle
      cx={s.x}
      cy={s.y}
      r="3.5"
      fill="var(--accent)"
      style={{ scale, transformOrigin: `${s.x}px ${s.y}px` }}
    />
  );
}

/**
 * The visual half. A schematic that *builds* as you scrub — sources appear,
 * links draw between them, a result lands, then the links back to the
 * sources persist as the citation trail.
 *
 * SVG with animated path length rather than WebGL: it is a diagram, it must
 * stay crisp at every size, and it costs a few kilobytes instead of three
 * hundred.
 */
function Schematic({ progress }: { progress: MotionValue<number> }) {
  const p = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.6 });

  const targetScale = useTransform(p, [0.52, 0.72], [0, 1]);
  const haloOpacity = useTransform(p, [0.52, 0.78], [0, 0.16]);
  const ringScale = useTransform(p, [0.72, 1], [0.6, 1.25]);
  const ringOpacity = useTransform(p, [0.72, 0.88, 1], [0, 0.5, 0]);
  const origin = `${TARGET.x}px ${TARGET.y}px`;

  return (
    <svg viewBox="0 0 360 280" className="h-auto w-full max-w-[34rem]" aria-hidden="true">
      {SOURCES.map((_, i) => <Link key={`l${i}`} i={i} progress={p} />)}
      {SOURCES.map((_, i) => <Trace key={`t${i}`} i={i} progress={p} />)}
      {SOURCES.map((_, i) => <Source key={`s${i}`} i={i} progress={p} />)}

      <motion.circle
        cx={TARGET.x} cy={TARGET.y} r="26"
        fill="none" stroke="var(--second)" strokeWidth="1"
        style={{ scale: ringScale, opacity: ringOpacity, transformOrigin: origin }}
      />
      <motion.circle
        cx={TARGET.x} cy={TARGET.y} r="18" fill="var(--second)"
        style={{ scale: targetScale, opacity: haloOpacity, transformOrigin: origin }}
      />
      <motion.circle
        cx={TARGET.x} cy={TARGET.y} r="9" fill="var(--second)"
        style={{ scale: targetScale, transformOrigin: origin }}
      />
    </svg>
  );
}

/* ── stage markers ─────────────────────────────────────────────────────── */

function Marker({ i, label, progress }: { i: number; label: string; progress: MotionValue<number> }) {
  const active = useTransform(
    progress,
    [i / COUNT - 0.06, i / COUNT + 0.02, (i + 1) / COUNT - 0.02, (i + 1) / COUNT + 0.06],
    [0, 1, 1, 0],
  );
  const dot = useTransform(active, [0, 1], [0.22, 1]);
  const text = useTransform(active, [0, 1], [0.35, 1]);

  return (
    <li className="flex items-center gap-2.5">
      <motion.span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ opacity: dot }} />
      <motion.span
        className="font-mono text-2xs tracking-[0.16em] text-text uppercase"
        style={{ opacity: text }}
      >
        {label}
      </motion.span>
    </li>
  );
}

export function Pipeline() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    /* Tall enough to give the pin room to scrub through four stages. */
    <section ref={section} id="how" className="relative h-[420svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* Progress rail. Doubles as the section's structure — the reader
            always knows how much of the sequence is left, which is what makes
            a long pin feel intentional rather than stuck. */}
        <div className="absolute top-0 left-0 h-px w-full bg-line-subtle">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: railScale }} />
        </div>

        <Container className="w-full">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="relative h-[19rem] lg:col-span-5">
              {stages.map((s, i) => (
                <StageCopy key={s.label} i={i} progress={scrollYProgress} />
              ))}
            </div>
            <div className="flex justify-center lg:col-span-7 lg:justify-end">
              <Schematic progress={scrollYProgress} />
            </div>
          </div>

          <ul className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3">
            {stages.map((s, i) => (
              <Marker key={s.label} i={i} label={s.label} progress={scrollYProgress} />
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
