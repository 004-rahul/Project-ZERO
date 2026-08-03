"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQS } from "../content";
import { Eyebrow, Reveal, Shell } from "../primitives";

/**
 * FAQ (Design Bible §19.4): a two-column split — the section statement stays
 * anchored left while the accordion runs right, so the block never reads as a
 * centred stack. One item open at a time, height animated, numbered rows.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative border-t border-line bg-cream py-24 md:py-32">
      <Shell>
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow index="05">FAQ</Eyebrow>
              <Reveal delay={0.06}>
                <h2 className="mt-6 text-[clamp(28px,3.2vw,44px)] font-black leading-[1.04] tracking-[-0.035em] text-ink">
                  Questions security teams ask first.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xs text-base leading-relaxed text-muted">
                  Straight answers on data handling, providers and access control — the questions
                  that decide whether a pilot happens.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-line">
              {FAQS.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={faq.q} delay={i * 0.04}>
                    <div className="border-b border-line">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="group flex w-full items-start gap-5 py-6 text-left"
                      >
                        <span className="pz-num pt-1 text-2xs font-bold tracking-[.18em] text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`flex-1 text-lg font-bold leading-snug tracking-[-0.015em] transition-colors ${
                            isOpen ? "text-accent" : "text-ink group-hover:text-accent"
                          }`}
                        >
                          {faq.q}
                        </span>
                        <span
                          className={`relative mt-1.5 h-4 w-4 shrink-0 transition-colors ${
                            isOpen ? "text-accent" : "text-muted group-hover:text-accent"
                          }`}
                          aria-hidden
                        >
                          <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
                          <motion.span
                            className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-current"
                            animate={{ scaleY: isOpen ? 0 : 1 }}
                            transition={{ duration: 0.3, ease: EASE }}
                          />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.42, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-2xl pb-7 pl-[52px] pr-8 text-base leading-relaxed text-muted">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
