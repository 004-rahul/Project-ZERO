"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FEATURES } from "../content";
import { AiOrb } from "../ai-orb";
import { ClipReveal, MaskLines, Reveal } from "@/components/motion";
import { Marker, Mono, Section, Shell } from "@/components/ui";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Features — a specification index, not a card grid.
 *
 * Six equal cards in a bento is the single most common SaaS feature layout,
 * and equal weight means no hierarchy: the eye has nowhere to go. This is a
 * sticky thesis column against a list of numbered rows, where only the active
 * row is expanded. Hierarchy comes from state, so one thing is always the
 * subject and the rest are context.
 */
export function Features() {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();

  return (
    <Section id="features">
      <Shell>
        <div className="grid grid-cols-12 gap-y-14 lg:gap-x-16">
          {/* sticky thesis */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Marker index="003" label="Capabilities" />
              <MaskLines
                as="h2"
                className="mt-7 text-[clamp(32px,3.8vw,52px)] font-black leading-[0.98] tracking-[-0.04em] text-ink"
                lines={[<>Built to be</>, <>audited, not</>, <>trusted blindly.</>]}
              />
              <Reveal delay={0.1} className="mt-7 max-w-sm">
                <p className="text-md leading-relaxed text-muted">
                  Every capability exists to make an answer checkable by the person who has to act
                  on it.
                </p>
              </Reveal>
              <ClipReveal delay={0.15} className="mt-10 hidden lg:block">
                <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-lg border border-line bg-zone-header">
                  <div aria-hidden className="pz-grid-dark absolute inset-0" />
                  <AiOrb state="thinking" size={130} />
                </div>
              </ClipReveal>
            </div>
          </div>

          {/* rows — hierarchy by state, not by size */}
          <ul className="col-span-12 border-t border-line lg:col-span-8">
            {FEATURES.map((f, i) => {
              const active = open === i;
              return (
                <li key={f.title} className="border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    onClick={() => setOpen(i)}
                    aria-expanded={active}
                    className="group flex w-full items-start gap-6 py-7 text-left"
                  >
                    <Mono
                      className={`mt-1.5 shrink-0 transition-colors duration-300 ${
                        active ? "text-accent" : "text-faint"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </Mono>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`flex items-center gap-3 text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                          active ? "text-ink" : "text-muted group-hover:text-ink"
                        }`}
                      >
                        <span
                          className={`transition-colors duration-300 ${active ? f.tone : "text-faint"}`}
                        >
                          <f.icon />
                        </span>
                        {f.title}
                      </span>

                      <motion.span
                        initial={false}
                        animate={
                          reduced
                            ? undefined
                            : { height: active ? "auto" : 0, opacity: active ? 1 : 0 }
                        }
                        transition={{ duration: DUR.component, ease: EASE_OUT }}
                        className="block overflow-hidden"
                      >
                        <span className="block max-w-xl pt-3 text-sm leading-relaxed text-muted">
                          {f.body}
                        </span>
                      </motion.span>
                    </span>

                    {/* the marker rotates rather than swapping glyphs */}
                    <motion.span
                      aria-hidden
                      animate={reduced ? undefined : { rotate: active ? 45 : 0 }}
                      transition={{ duration: DUR.microOut, ease: EASE_OUT }}
                      className={`mt-1 text-lg leading-none transition-colors duration-300 ${
                        active ? "text-accent" : "text-faint"
                      }`}
                    >
                      +
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
