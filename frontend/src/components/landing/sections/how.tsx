"use client";

import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { useState } from "react";
import { STEPS } from "../content";
import { TryAnswer } from "../answer-engine";
import { useSectionScrub } from "@/components/motion";
import { Chip, Marker, Mono, Panel, Section, Shell } from "@/components/ui";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * How it works — the page's one pinned scrub.
 *
 * Three steps as three cards side by side gives them equal weight and no
 * sequence, which is wrong for something that is explicitly ordered. Pinning
 * the panel and advancing it with scroll position makes the ORDER the
 * interaction: you cannot reach step three without passing step two.
 *
 * Budget rule: exactly one pinned scrub per page. Below `lg` it unpins into a
 * plain stack, because fighting a sticky viewport on a phone is miserable.
 */
export function How() {
  const [ref, progress] = useSectionScrub();
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useMotionValueEvent(progress, "change", (v) => {
    setI(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 0.999)));
  });
  const fill = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="how" tone="raised" className="py-0 md:py-0">
      <div ref={ref} className="relative lg:h-[300vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <Shell className="py-24 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Marker index="004" label="How it works" />
              <Mono className="text-faint">Connect · Remember · Ask</Mono>
            </div>

            <div className="mt-12 grid grid-cols-12 gap-y-10 lg:gap-x-14">
              {/* progress spine — position in the sequence, always visible */}
              <div className="col-span-12 lg:col-span-4">
                <div className="relative flex gap-6 lg:block">
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-2 hidden h-[calc(100%-16px)] w-px bg-line lg:block"
                  >
                    <motion.span
                      className="absolute inset-x-0 top-0 block bg-accent"
                      style={reduced ? { height: "100%" } : { height: fill }}
                    />
                  </span>

                  <ul className="flex w-full gap-6 lg:block lg:space-y-9">
                    {STEPS.map((s, k) => {
                      const on = k <= i;
                      return (
                        <li key={s.n} className="relative lg:pl-9">
                          <span
                            aria-hidden
                            className={`absolute left-0 top-1.5 hidden h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 lg:block ${
                              on ? "border-accent bg-accent" : "border-line bg-cream"
                            }`}
                          />
                          <span
                            className={`block text-lg font-extrabold tracking-tight transition-colors duration-300 ${
                              k === i ? "text-ink" : "text-faint"
                            }`}
                          >
                            {s.title}
                          </span>
                          <span className="mt-1 hidden max-w-xs text-sm leading-relaxed text-muted lg:block">
                            {k === i ? s.body : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* the stage swaps, the frame does not */}
              <div className="col-span-12 lg:col-span-8">
                <Panel className="relative aspect-[16/10] w-full">
                  <div aria-hidden className="pz-grid absolute inset-0" />
                  {STEPS.map((s, k) => (
                    <motion.div
                      key={s.n}
                      aria-hidden={k !== i}
                      initial={false}
                      animate={
                        reduced
                          ? { opacity: k === i ? 1 : 0 }
                          : { opacity: k === i ? 1 : 0, scale: k === i ? 1 : 0.985 }
                      }
                      transition={{ duration: DUR.componentSlow, ease: EASE_OUT }}
                      className="absolute inset-0 flex flex-col justify-center gap-5 p-8 md:p-12"
                      style={{ pointerEvents: k === i ? "auto" : "none" }}
                    >
                      <span className="flex items-center gap-3">
                        <Mono className="text-accent">{s.n}</Mono>
                        <span className="text-accent">
                          <s.icon />
                        </span>
                      </span>
                      <span className="max-w-md text-[clamp(24px,2.8vw,38px)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                        {s.title}
                      </span>
                      <span className="max-w-md text-md leading-relaxed text-muted">{s.body}</span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {s.meta.map((m: string) => (
                          <Chip key={m}>{m}</Chip>
                        ))}
                      </span>
                    </motion.div>
                  ))}
                </Panel>
              </div>
            </div>
          </Shell>
        </div>
      </div>

      {/* the claim, then the proof you can drive yourself */}
      <Shell className="pb-24 md:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-12">
          <Marker index="005" label="Try it" />
          <Mono className="text-faint">Synthetic sample workspace · no signup</Mono>
        </div>
        <div className="mt-10">
          <TryAnswer />
        </div>
      </Shell>
    </Section>
  );
}
