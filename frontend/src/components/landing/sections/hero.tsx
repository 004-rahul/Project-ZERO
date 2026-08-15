"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AutoAnswer } from "../answer-engine";
import { HERO_PROOF, INTEGRATION_CATEGORIES } from "../content";
import { Magnetic, MaskLines, Pressable, Shell, usePointerDepth } from "../primitives";
import { LatticeLayer } from "../three/lattice-layer";
import { DUR, EASE_OUT, HERO } from "@/lib/motion";

/**
 * Hero (Design Bible §19.4 — editorial composition).
 *
 * The previous version was a heading / paragraph / two-buttons / bullet-list
 * stack beside a panel: the exact structure that reads as a template no matter
 * how well it animates. This is composed instead of stacked:
 *
 *   · a visible 12-column rule grid the content is demonstrably set on
 *   · display type at editorial scale (up to 112px) occupying columns 1–8
 *   · supporting copy and actions as a SIDE column in 9–12, baseline-aligned
 *     to the foot of the headline rather than sitting underneath it
 *   · the product surface bleeding past the right viewport edge and rising
 *     into the headline block, so the layers overlap instead of queueing
 *   · proof as a divided rail across the full measure, not a bullet list
 *
 * Load order is unchanged (field → panels → headline → sub → CTA → rail) and
 * still overlaps — see HERO in lib/motion.
 */

export function Hero() {
  const reduced = useReducedMotion();
  const near = usePointerDepth(14);
  const far = usePointerDepth(-7);
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const driftO = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);

  const beat = (delay: number, y = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.componentSlow, ease: EASE_OUT, delay },
        };

  return (
    <section ref={ref} className="relative overflow-hidden pb-0 pt-28 md:pt-36">
      {/* ── the grid is part of the design, not a background texture ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-12 px-6 md:px-10 lg:px-16">
          {Array.from({ length: 13 }).map((_, i) => (
            <motion.span
              key={i}
              className="col-span-1 block h-full w-px bg-line/45"
              style={{ gridColumn: `${Math.min(i + 1, 12)} / span 1` }}
              initial={reduced ? undefined : { scaleY: 0 }}
              animate={reduced ? undefined : { scaleY: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: HERO.field + i * 0.03 }}
            />
          ))}
        </div>
      </div>
      <LatticeLayer
        tone="light"
        className="pointer-events-none absolute -right-[16%] -top-[24%] h-[820px] w-[820px] opacity-60"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-[8%] h-[520px] w-[900px] rounded-full bg-accent/[.06] blur-[140px]"
        initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: HERO.field }}
      />

      <Shell className="relative">
        <motion.div style={reduced ? undefined : { y: driftY, opacity: driftO }}>
          {/* ── index rule: the page announces its own structure ── */}
          <motion.div
            {...beat(HERO.panels, 8)}
            className="flex items-center gap-5 border-t border-ink/10 pt-4"
          >
            <span className="pz-num text-2xs font-bold tracking-[.2em] text-accent">001</span>
            <span className="text-2xs font-extrabold uppercase tracking-[.28em] text-muted">
              Enterprise Intelligence Platform
            </span>
            <span className="ml-auto hidden items-center gap-2 md:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-2xs font-bold uppercase tracking-[.16em] text-faint">Live</span>
            </span>
          </motion.div>

          {/* ── display type in 1–8, support column in 9–12 ── */}
          <div className="mt-10 grid grid-cols-12 gap-y-10 lg:mt-14 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <MaskLines
                className="text-[clamp(44px,8.2vw,112px)] font-black leading-[0.9] tracking-[-0.05em] text-ink"
                delay={HERO.headline}
                lines={[
                  <>Your company</>,
                  <>
                    already <span className="text-accent">knows</span>
                  </>,
                  <>the answer.</>,
                ]}
              />
            </div>

            {/* Baseline-aligned support column. Sitting beside the headline
                rather than under it is what stops this reading as a stack. */}
            <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:pb-3">
              <motion.p
                {...beat(HERO.sub)}
                className="border-l-2 border-accent/50 pl-5 text-md leading-relaxed text-muted"
              >
                Project Zero connects the work apps your team already uses, remembers everything
                your team knows, and answers business questions with citations and confidence
                scores.
              </motion.p>

              <motion.div {...beat(HERO.cta)} className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.2}>
                  <Pressable>
                    <Link
                      href="/register"
                      className="pz-sheen group block rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-void shadow-[0_8px_28px_rgba(61,219,217,.35),inset_0_1px_0_rgba(255,255,255,.28)] transition-colors hover:bg-accent-strong"
                    >
                      Start free
                    </Link>
                  </Pressable>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Pressable>
                    <a
                      href="#how"
                      className="group flex items-center gap-2 px-2 py-3.5 text-base font-semibold text-ink underline-offset-8 transition-colors hover:text-accent hover:underline"
                    >
                      See how it works
                      <span aria-hidden className="pz-travel">
                        →
                      </span>
                    </a>
                  </Pressable>
                </Magnetic>
              </motion.div>
            </div>
          </div>

          {/* ── product surface: rises into the headline block and bleeds off
                the right edge, so the composition layers instead of queues ── */}
          <div className="relative mt-16 lg:-mt-6 lg:pl-[16%]">
            <div className="relative lg:-mr-[10vw]">
              {[
                { cls: "-right-5 -top-7 bg-card/50", d: HERO.panels },
                { cls: "-right-2.5 -top-3.5 bg-card/75", d: HERO.panels + 0.07 },
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
                initial={reduced ? undefined : { opacity: 0, y: 30, scale: 0.99 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: HERO.panels + 0.12 }}
                style={reduced ? undefined : { x: near.x, y: near.y }}
                className="relative"
              >
                <AutoAnswer />
              </motion.div>
            </div>

            {/* vertical edge marker — anchors the left gutter the bleed creates */}
            <span
              aria-hidden
              className="absolute left-0 top-8 hidden select-none text-2xs font-bold uppercase tracking-[.4em] text-faint lg:block"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll
            </span>
          </div>

          {/* ── proof as a divided rail across the full measure ── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: HERO.rail } },
            }}
            className="mt-16 grid grid-cols-2 border-t border-ink/10 md:grid-cols-4"
          >
            {[...HERO_PROOF, `${INTEGRATION_CATEGORIES.length * 10}+ integrations`].map(
              (point, i) => (
                <motion.div
                  key={point}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: DUR.component, ease: EASE_OUT }}
                  className="border-b border-ink/10 px-1 py-6 md:border-b-0 md:border-l md:first:border-l-0 md:px-6"
                >
                  <span className="pz-num block text-2xs font-bold tracking-[.2em] text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-snug text-ink">
                    {point}
                  </span>
                </motion.div>
              ),
            )}
          </motion.div>
        </motion.div>
      </Shell>
    </section>
  );
}
