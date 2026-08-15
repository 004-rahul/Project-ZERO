"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AutoAnswer } from "../answer-engine";
import { HERO_PROOF, INTEGRATION_CATEGORIES } from "../content";
import { IconCheck } from "../icons";
import { Magnetic, MaskLines, Pressable, Shell, usePointerDepth } from "../primitives";
import { LatticeLayer } from "../three/lattice-layer";
import { DUR, EASE_OUT, HERO } from "@/lib/motion";

/**
 * Hero (Design Bible §19.4): asymmetric 12-column split — editorial display
 * type held left, the live Answer Engine floating right on a pointer-parallax
 * stack over the R3F Knowledge Lattice.
 *
 * The load is a single OVERLAPPING timeline, not a queue of animations. Every
 * beat starts while the previous one is still settling (see HERO in
 * lib/motion), which is the difference between a page coming alive and a list
 * of elements taking turns. Order: field → panels → headline → sub → CTA → rail.
 */

export function Hero() {
  const reduced = useReducedMotion();
  const near = usePointerDepth(16);
  const far = usePointerDepth(-8);
  const ref = useRef<HTMLElement | null>(null);

  /* The hero recedes as the next section arrives, so the pages feel joined
     rather than stacked. Reversible, and it never fully disappears. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const driftO = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  const beat = (delay: number, y = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.componentSlow, ease: EASE_OUT, delay },
        };

  return (
    <section ref={ref} className="relative overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40">
      {/* ── beat 1: the field settles in before anything is legible ── */}
      <motion.div
        aria-hidden
        className="pz-grid pointer-events-none absolute inset-0"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: DUR.cinematicSlow, ease: EASE_OUT, delay: HERO.field }}
      />
      <LatticeLayer
        tone="light"
        className="pointer-events-none absolute -right-[12%] -top-[18%] h-[880px] w-[880px] opacity-70"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/[.07] blur-[130px]"
        initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: HERO.field }}
      />

      <Shell className="relative">
        <motion.div
          className="grid grid-cols-12 items-center gap-y-14 lg:gap-x-10"
          style={reduced ? undefined : { y: driftY, opacity: driftO }}
        >
          {/* ── copy: left 6 ── */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div {...beat(HERO.panels, 10)} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 shadow-card">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-2xs font-extrabold uppercase tracking-[.18em] text-muted">
                  Enterprise Intelligence Platform
                </span>
              </span>
            </motion.div>

            <MaskLines
              className="mt-7 text-[clamp(38px,5.4vw,74px)] font-black leading-[0.98] tracking-[-0.042em] text-ink"
              delay={HERO.headline}
              lines={[
                <>Your company</>,
                <>
                  already <span className="text-accent">knows</span>
                </>,
                <>the answer.</>,
              ]}
            />

            <motion.p
              {...beat(HERO.sub)}
              className="mt-7 max-w-lg text-lg leading-relaxed text-muted"
            >
              Project Zero connects the work apps your team already uses, remembers everything your
              team knows, and answers business questions with citations and confidence scores.
            </motion.p>

            <motion.div {...beat(HERO.cta)} className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <Pressable>
                  <Link
                    href="/register"
                    className="pz-sheen group block rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_28px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.35)] transition-colors hover:bg-accent-strong"
                  >
                    Start free
                  </Link>
                </Pressable>
              </Magnetic>
              <Magnetic strength={0.22}>
                <Pressable>
                  <a
                    href="#how"
                    className="group flex items-center gap-2 rounded-lg border border-line-strong bg-card px-6 py-3.5 text-base font-semibold text-ink shadow-card transition-colors hover:border-accent hover:text-accent"
                  >
                    See how it works
                    <motion.span
                      aria-hidden
                      animate={reduced ? undefined : { y: [0, 3, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ↓
                    </motion.span>
                  </a>
                </Pressable>
              </Magnetic>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: HERO.rail } },
              }}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5"
            >
              {HERO_PROOF.map((point) => (
                <motion.li
                  key={point}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: DUR.component, ease: EASE_OUT }}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <IconCheck className="h-4 w-4 text-accent" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── engine: right 6, layered + parallax ── */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative mx-auto max-w-[620px] lg:max-w-none">
              {/* Ghost panels land first and slightly apart, so the stack reads
                  as physical depth rather than a drop shadow. */}
              {[
                { cls: "-right-4 -top-6 bg-card/60", d: HERO.panels },
                { cls: "-right-2 -top-3 bg-card/80", d: HERO.panels + 0.07 },
              ].map((p) => (
                <motion.div
                  key={p.cls}
                  aria-hidden
                  style={reduced ? undefined : { x: far.x, y: far.y }}
                  initial={reduced ? undefined : { opacity: 0, y: 18 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: p.d }}
                  className={`absolute hidden h-full w-full rounded-xl border border-line sm:block ${p.cls}`}
                />
              ))}

              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 26, scale: 0.985 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: HERO.panels + 0.12 }}
                style={reduced ? undefined : { x: near.x, y: near.y }}
                className="relative"
              >
                <AutoAnswer />
              </motion.div>

              <motion.div
                aria-hidden
                style={reduced ? undefined : { x: near.x, y: near.y }}
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: DUR.componentSlow, ease: EASE_OUT, delay: HERO.rail }}
                className="pointer-events-none absolute -bottom-7 left-1/2 hidden w-max -translate-x-1/2 md:block"
              >
                <div className="flex items-center gap-2 rounded-full border border-line bg-card/95 px-4 py-2.5 shadow-lift backdrop-blur-sm">
                  {INTEGRATION_CATEGORIES.slice(0, 4).map((c) => (
                    <span key={c} className="text-2xs font-bold uppercase tracking-[.12em] text-muted">
                      {c}
                    </span>
                  ))}
                  <span className="h-3 w-px bg-line" />
                  <a
                    href="#integrations"
                    className="pointer-events-auto text-2xs font-bold uppercase tracking-[.12em] text-accent"
                  >
                    40+ integrations
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}
