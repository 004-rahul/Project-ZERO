"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AutoAnswer } from "../answer-engine";
import { HERO_PROOF, INTEGRATION_CATEGORIES } from "../content";
import { LatticeLayer } from "../three/lattice-layer";
import { MaskLines, usePointerDepth } from "@/components/motion";
import { Button, Chip, Mono, Pulse, Shell } from "@/components/ui";
import { DUR, EASE_OUT, HERO } from "@/lib/motion";

/**
 * Hero — composed, not stacked.
 *
 * The structure that reads as a template is heading → paragraph → buttons →
 * bullets in one centred column. This instead sets display type across
 * columns 1–8, hangs the supporting copy and actions in a SIDE column at 9–12
 * aligned to the headline's foot, and lets the product surface bleed past the
 * right viewport edge while rising into the headline block. Proof is a divided
 * rail across the full measure.
 *
 * Load is one overlapping timeline (HERO in lib/motion): field → panels →
 * headline → sub → CTA → rail, each beat starting before the last settles.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const near = usePointerDepth(14);
  const far = usePointerDepth(-7);
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.28]);

  const beat = (delay: number, dy = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: dy },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.componentSlow, ease: EASE_OUT, delay },
        };

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 md:pt-36">
      {/* the column grid is structure the page shows, not a texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Shell className="grid h-full grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="block h-full w-px bg-line/60"
              initial={reduced ? undefined : { scaleY: 0 }}
              animate={reduced ? undefined : { scaleY: 1 }}
              style={{ transformOrigin: "top" }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: HERO.field + i * 0.028 }}
            />
          ))}
        </Shell>
      </div>
      <LatticeLayer
        tone="light"
        className="pointer-events-none absolute -right-[14%] -top-[22%] h-[820px] w-[820px] opacity-70"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[6%] h-[480px] w-[860px] rounded-full bg-accent/[.08] blur-[150px]"
        initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: HERO.field }}
      />

      <Shell className="relative">
        <motion.div style={reduced ? undefined : { y, opacity }}>
          <motion.div
            {...beat(HERO.panels, 8)}
            className="flex items-center gap-5 border-t border-line pt-4"
          >
            <Mono className="text-accent">001</Mono>
            <Mono className="text-muted">Enterprise Intelligence Platform</Mono>
            <span className="ml-auto hidden md:block">
              <Pulse label="Live" />
            </span>
          </motion.div>

          <div className="mt-10 grid grid-cols-12 gap-y-10 lg:mt-14 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <MaskLines
                onLoad
                as="h1"
                delay={HERO.headline}
                className="text-[clamp(44px,8.4vw,116px)] font-black leading-[0.88] tracking-[-0.052em] text-ink"
                lines={[
                  <>Your company</>,
                  <>
                    already <span className="text-accent">knows</span>
                  </>,
                  <>the answer.</>,
                ]}
              />
            </div>

            {/* side column, aligned to the foot of the headline */}
            <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:pb-4">
              <motion.p
                {...beat(HERO.sub)}
                className="border-l-2 border-accent/60 pl-5 text-md leading-relaxed text-muted"
              >
                Project Zero connects the work apps your team already uses, remembers everything
                your team knows, and answers business questions with citations and confidence
                scores.
              </motion.p>
              <motion.div {...beat(HERO.cta)} className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/register">Start free</Button>
                <Button href="#how" variant="link" icon="→">
                  See how it works
                </Button>
              </motion.div>
            </div>
          </div>

          {/* product surface: overlaps upward, bleeds right */}
          <div className="relative mt-14 lg:-mt-4 lg:pl-[14%]">
            <div className="relative lg:-mr-[9vw]">
              {[
                { cls: "-right-5 -top-7 bg-card/40", d: HERO.panels },
                { cls: "-right-2.5 -top-3.5 bg-card/70", d: HERO.panels + 0.07 },
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
                initial={reduced ? undefined : { opacity: 0, y: 30 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: HERO.panels + 0.12 }}
                style={reduced ? undefined : { x: near.x, y: near.y }}
                className="relative"
              >
                <AutoAnswer />
              </motion.div>
            </div>
            <span
              aria-hidden
              className="absolute left-0 top-10 hidden select-none text-2xs font-bold uppercase tracking-[.42em] text-faint lg:block"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll
            </span>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: HERO.rail } },
            }}
            className="mt-16 grid grid-cols-2 border-t border-line md:grid-cols-4"
          >
            {[...HERO_PROOF, `${INTEGRATION_CATEGORIES.length * 10}+ integrations`].map((p, i) => (
              <motion.div
                key={p}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: DUR.component, ease: EASE_OUT }}
                className="border-b border-line px-1 py-6 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
              >
                <Mono className="block text-accent/70">{String(i + 1).padStart(2, "0")}</Mono>
                <span className="mt-2 block text-sm font-semibold leading-snug text-ink">{p}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="hidden gap-2 pb-20 pt-8 md:flex">
            {INTEGRATION_CATEGORIES.slice(0, 5).map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
            <a href="#integrations" className="ml-1 self-center">
              <Mono className="text-accent">40+ integrations →</Mono>
            </a>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}
