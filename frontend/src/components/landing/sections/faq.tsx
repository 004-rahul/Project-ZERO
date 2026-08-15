"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FAQS } from "../content";
import { MaskLines, Reveal } from "@/components/motion";
import { Button, Marker, Mono, Section, Shell } from "@/components/ui";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * FAQ — a split: a fixed position on the left, the questions on the right.
 *
 * A centred accordion makes security questions feel like fine print. Anchoring
 * a standing claim beside them frames the whole list as an argument the
 * product is making, and the sticky column means that claim stays on screen
 * for every answer the reader opens.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <Section id="faq">
      <Shell>
        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Marker index="008" label="Security" />
              <MaskLines
                as="h2"
                className="mt-7 text-[clamp(30px,3.6vw,50px)] font-black leading-[1.0] tracking-[-0.04em] text-ink"
                lines={[<>Questions security</>, <>teams ask first.</>]}
              />
              <Reveal delay={0.1} className="mt-6 max-w-sm">
                <p className="text-md leading-relaxed text-muted">
                  Your data stays in your tenant, under your keys, with every answer traceable to
                  its source.
                </p>
              </Reveal>
              <Reveal delay={0.16} className="mt-8">
                <Button href="/register" variant="ghost" size="sm" icon="→">
                  Read the trust center
                </Button>
              </Reveal>
            </div>
          </div>

          <ul className="col-span-12 border-t border-line lg:col-span-7">
            {FAQS.map((f, i) => {
              const on = open === i;
              return (
                <li key={f.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(on ? null : i)}
                      aria-expanded={on}
                      className="group flex w-full items-start gap-5 py-6 text-left"
                    >
                      <Mono className={`mt-1 shrink-0 ${on ? "text-accent" : "text-faint"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </Mono>
                      <span
                        className={`flex-1 text-md font-bold leading-snug transition-colors ${
                          on ? "text-ink" : "text-muted group-hover:text-ink"
                        }`}
                      >
                        {f.q}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={reduced ? undefined : { rotate: on ? 45 : 0 }}
                        transition={{ duration: DUR.microOut, ease: EASE_OUT }}
                        className={`mt-0.5 text-lg leading-none ${on ? "text-accent" : "text-faint"}`}
                      >
                        +
                      </motion.span>
                    </button>
                  </h3>
                  <motion.div
                    initial={false}
                    animate={reduced ? undefined : { height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: DUR.component, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-7 pl-[3.4rem] pr-8 text-sm leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
