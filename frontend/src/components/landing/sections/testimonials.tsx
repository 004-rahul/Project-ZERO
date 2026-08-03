"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "../content";
import { DragRail, Eyebrow, Reveal, Shell } from "../primitives";

/**
 * Testimonials (Design Bible §19.4): an editorial quote rail the visitor can
 * drag. Oversized quote marks and staggered card offsets break the uniform
 * three-column pattern used elsewhere on the page.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const OFFSET = ["lg:mt-0", "lg:mt-10", "lg:mt-4"];

export function Testimonials() {
  return (
    <section aria-label="Testimonials" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <Shell>
        <div className="grid grid-cols-12 items-end gap-x-10 gap-y-6">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow index="04">Testimonials</Eyebrow>
            <Reveal delay={0.06}>
              <h2 className="mt-6 max-w-2xl text-[clamp(30px,3.6vw,50px)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                Teams stopped losing what they know.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Reveal delay={0.12}>
              <p className="text-2xs font-bold uppercase tracking-[.16em] text-faint lg:text-right">
                Drag to explore →
              </p>
            </Reveal>
          </div>
        </div>
      </Shell>

      <Reveal delay={0.1}>
        <DragRail className="pz-fade-x mt-14 px-6 md:px-10 lg:px-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`relative mr-5 flex w-[86vw] shrink-0 flex-col rounded-xl border border-line bg-card p-8 shadow-card transition-colors hover:border-accent/35 hover:shadow-lift sm:w-[420px] ${OFFSET[i]}`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-3 select-none font-serif text-[92px] leading-none text-accent/10"
              >
                &rdquo;
              </span>
              <blockquote className="relative flex-1 text-lg font-medium leading-relaxed tracking-[-0.01em] text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-black text-accent">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
          <span aria-hidden className="w-6 shrink-0 md:w-10 lg:w-16" />
        </DragRail>
      </Reveal>
    </section>
  );
}
