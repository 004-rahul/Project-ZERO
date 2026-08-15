"use client";

import { motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { STEPS } from "@/components/landing/content";
import { TryAnswer } from "@/components/landing/answer-engine";
import { Enter, Lines, useScrub } from "../motion";
import { Block, Bound, Label, Surface, Tag } from "../kit";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Process — three ordered beats, then the thing itself.
 *
 * The steps are numbered, so their ORDER is the content. Rather than three
 * cards in a row (which presents them as simultaneous options), the module
 * advances one stage at a time as the reader scrolls: you cannot reach the
 * third without passing the second. The claim is made, and then immediately
 * handed over — the demo directly beneath is the same product surface, driven
 * by the visitor instead of by a script.
 */
export function Process() {
  const [ref, progress] = useScrub();
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useMotionValueEvent(progress, "change", (v) =>
    setI(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 0.999))),
  );

  return (
    <section id="process" className="relative">
      <div ref={ref} className="lg:h-[280vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <Bound wide className="w-full py-24 lg:py-0">
            <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
              <div className="col-span-12 lg:col-span-5">
                <Label className="text-accent">Process</Label>
                <Lines
                  as="h2"
                  className="mt-6 text-[clamp(30px,3.6vw,54px)] font-black leading-[0.96] tracking-[-0.045em] text-ink"
                >
                  {["Connect.", "Remember.", "Ask."]}
                </Lines>

                <ol className="mt-10 border-t border-line">
                  {STEPS.map((s, k) => {
                    const on = k === i;
                    return (
                      <li key={s.n} className="border-b border-line">
                        <div className="flex items-start gap-5 py-5">
                          <Label className={on ? "mt-1 text-accent" : "mt-1 text-faint"}>
                            {s.n}
                          </Label>
                          <div className="min-w-0 flex-1">
                            <span
                              className={`block text-md font-extrabold tracking-tight transition-colors duration-300 ${
                                on ? "text-ink" : "text-faint"
                              }`}
                            >
                              {s.title}
                            </span>
                            <motion.span
                              initial={false}
                              animate={
                                reduced ? undefined : { height: on ? "auto" : 0, opacity: on ? 1 : 0 }
                              }
                              transition={{ duration: DUR.component, ease: EASE_OUT }}
                              className="block overflow-hidden"
                            >
                              <span className="block pt-2 text-sm leading-relaxed text-muted">
                                {s.body}
                              </span>
                            </motion.span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* the frame holds; only the stage inside it changes */}
              <div className="col-span-12 lg:col-span-7">
                <Surface className="relative aspect-[4/3] w-full lg:aspect-[16/11]">
                  <div aria-hidden className="pz-grid absolute inset-0" />
                  {STEPS.map((s, k) => (
                    <motion.div
                      key={s.n}
                      aria-hidden={k !== i}
                      initial={false}
                      animate={
                        reduced
                          ? { opacity: k === i ? 1 : 0 }
                          : { opacity: k === i ? 1 : 0, y: k === i ? 0 : 12 }
                      }
                      transition={{ duration: DUR.componentSlow, ease: EASE_OUT }}
                      style={{ pointerEvents: k === i ? "auto" : "none" }}
                      className="absolute inset-0 flex flex-col justify-center gap-6 p-8 md:p-14"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-accent">
                          <s.icon />
                        </span>
                        <span className="h-px w-16 bg-accent/50" />
                        <Label className="text-faint">{s.n}</Label>
                      </span>
                      <span className="max-w-lg text-[clamp(26px,3vw,44px)] font-black leading-[0.98] tracking-[-0.04em] text-ink">
                        {s.title}
                      </span>
                      <span className="max-w-md text-md leading-relaxed text-muted">{s.body}</span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {s.meta.map((m: string) => (
                          <Tag key={m}>{m}</Tag>
                        ))}
                      </span>
                    </motion.div>
                  ))}
                </Surface>
              </div>
            </div>
          </Bound>
        </div>
      </div>

      {/* claim, then proof you drive yourself */}
      <Block pad="lg">
        <Bound wide>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
            <Lines
              as="h2"
              className="text-[clamp(26px,3vw,42px)] font-black leading-[1.0] tracking-[-0.04em] text-ink"
            >
              {["Ask it something."]}
            </Lines>
            <Label className="text-faint">Synthetic workspace · no signup</Label>
          </div>
          <Enter className="mt-10" delay={0.06}>
            <TryAnswer />
          </Enter>
        </Bound>
      </Block>
    </section>
  );
}
