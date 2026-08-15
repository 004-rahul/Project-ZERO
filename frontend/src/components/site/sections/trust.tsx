"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FAQS, TESTIMONIALS } from "@/components/landing/content";
import { Enter, Lines } from "../motion";
import { Action, Block, Bound, Label } from "../kit";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Trust — the objections module.
 *
 * Quotes and security questions are the same argument from two directions
 * (people who bought it, and what you have to satisfy before you can), so they
 * are one module rather than two sections. One quote is given display scale
 * because a wall of three gets skimmed; the questions sit beneath it as a
 * plain list, deliberately undecorated — ornament on a security answer reads
 * as deflection.
 */
export function Trust() {
  const [q, setQ] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const t = TESTIMONIALS[q];

  return (
    <Block id="trust" className="border-t border-line bg-zone-header/50">
      <Bound wide>
        {/* voices */}
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
          <figure className="relative col-span-12 lg:col-span-8">
            <Label className="text-accent">In practice</Label>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={q}
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: DUR.component, ease: EASE_OUT }}
                className="mt-7"
              >
                <p className="text-[clamp(24px,3vw,42px)] font-extrabold leading-[1.16] tracking-[-0.035em] text-ink">
                  {t.quote}
                </p>
                <figcaption className="mt-7 flex items-center gap-4">
                  <span className="h-px w-12 bg-accent/60" />
                  <span className="text-sm">
                    <span className="font-bold text-ink">{t.name}</span>
                    <span className="text-muted"> · {t.role}</span>
                  </span>
                </figcaption>
              </motion.blockquote>
            </AnimatePresence>
          </figure>

          <ul className="col-span-12 self-end lg:col-span-4">
            {TESTIMONIALS.map((v, k) => (
              <li key={v.name} className="border-t border-line last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setQ(k)}
                  onFocus={() => setQ(k)}
                  onClick={() => setQ(k)}
                  aria-current={k === q}
                  className="group flex w-full items-center gap-4 py-4 text-left"
                >
                  <Label className={k === q ? "text-accent" : "text-faint"}>
                    {String(k + 1).padStart(2, "0")}
                  </Label>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm font-semibold transition-colors ${
                      k === q ? "text-ink" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {v.name}
                  </span>
                  <span
                    aria-hidden
                    className={`pz-travel text-accent transition-opacity ${
                      k === q ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* objections */}
        <div className="mt-28 grid grid-cols-12 gap-y-10 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Label className="text-accent">Security</Label>
              <Lines
                as="h2"
                className="mt-6 text-[clamp(26px,2.9vw,40px)] font-black leading-[1.0] tracking-[-0.04em] text-ink"
              >
                {["Questions security", "teams ask first."]}
              </Lines>
              <Enter delay={0.1} className="mt-8">
                <Action href="/register" variant="line" size="sm" icon="→">
                  Trust center
                </Action>
              </Enter>
            </div>
          </div>

          <ul className="col-span-12 border-t border-line lg:col-span-8">
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
                      <Label className={on ? "mt-1 text-accent" : "mt-1 text-faint"}>
                        {String(i + 1).padStart(2, "0")}
                      </Label>
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
                    <p className="max-w-2xl pb-7 pl-[3.2rem] text-sm leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </Bound>
    </Block>
  );
}
