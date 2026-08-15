"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AutoAnswer } from "@/components/landing/answer-engine";
import { HERO_PROOF } from "@/components/landing/content";
import { Lines, usePointer } from "../motion";
import { Action, Bound, Label, Pulse } from "../kit";
import { DUR, EASE_OUT, HERO } from "@/lib/motion";

/**
 * Hero — a viewport the reader looks INTO, not a banner they look at.
 *
 * Composition: the headline is set hard against the left edge of the measure
 * and allowed to run large enough to break the column; the product surface is
 * docked to the lower right and cropped by the viewport edge, so it reads as a
 * live instrument continuing past the frame rather than a screenshot placed on
 * a slide. Supporting copy and actions sit in the gutter between them.
 *
 * Load is one overlapping timeline — see HERO in lib/motion.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const p = usePointer();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  /* pointer depth, applied in opposite directions so the layers separate */
  const px = useTransform(p.x, (v) => v * 22);
  const py = useTransform(p.y, (v) => v * 16);
  const bx = useTransform(p.x, (v) => v * -10);

  const beat = (delay: number, dy = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: dy },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.componentSlow, ease: EASE_OUT, delay },
        };

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden pt-32 md:pt-40">
      <Bound wide className="relative">
        <motion.div style={reduced ? undefined : { y, opacity: fade }}>
          <motion.div {...beat(HERO.panels, 8)} className="flex items-center gap-6">
            <Label className="text-accent">Zero / 001</Label>
            <span className="h-px flex-1 bg-line" />
            <Pulse label="Live" />
          </motion.div>

          <div className="mt-12 grid grid-cols-12 items-end gap-y-12 lg:mt-16">
            {/* headline — deliberately oversized for its column */}
            <div className="col-span-12 lg:col-span-7">
              <Lines
                as="h1"
                onLoad
                delay={HERO.headline}
                className="text-[clamp(46px,9vw,132px)] font-black leading-[0.86] tracking-[-0.055em] text-ink"
              >
                {["Your company", "already knows", "the answer."]}
              </Lines>
            </div>

            {/* gutter column */}
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <motion.p
                {...beat(HERO.sub)}
                className="max-w-sm text-md leading-relaxed text-muted"
              >
                Project Zero connects the work apps your team already uses, remembers everything
                your team knows, and answers business questions with citations and confidence
                scores.
              </motion.p>
              <motion.div {...beat(HERO.cta)} className="mt-8 flex flex-wrap items-center gap-5">
                <Action href="/register">Start free</Action>
                <Action href="#process" variant="bare" icon="→">
                  See how it works
                </Action>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Bound>

      {/* docked instrument, cropped by the viewport edge */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 40 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: HERO.panels + 0.1 }}
        className="relative mt-16 lg:mt-24"
      >
        <motion.div
          style={reduced ? undefined : { x: px, y: py }}
          className="ml-auto w-full max-w-[1180px] pr-0 lg:-mr-[7vw] lg:w-[78vw]"
        >
          <div className="relative border border-line bg-card/70 backdrop-blur-sm">
            <motion.span
              aria-hidden
              style={reduced ? undefined : { x: bx }}
              className="pointer-events-none absolute -left-px -top-px h-14 w-14 border-l-2 border-t-2 border-accent/70"
            />
            <AutoAnswer />
          </div>
        </motion.div>
      </motion.div>

      {/* proof, set as instrument readouts along the base */}
      <Bound wide>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: HERO.rail } },
          }}
          className="mt-16 flex flex-wrap gap-x-12 gap-y-5 border-t border-line pt-6"
        >
          {HERO_PROOF.map((t, i) => (
            <motion.div
              key={t}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: DUR.component, ease: EASE_OUT }}
              className="flex items-baseline gap-3"
            >
              <Label className="text-accent/70">{String(i + 1).padStart(2, "0")}</Label>
              <span className="text-sm font-semibold text-ink">{t}</span>
            </motion.div>
          ))}
        </motion.div>
      </Bound>
    </section>
  );
}
