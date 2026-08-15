"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { TESTIMONIALS } from "../content";
import { Marker, Mono, Section, Shell } from "@/components/ui";
import { DUR, EASE_OUT } from "@/lib/motion";

/**
 * Testimonials — one quote at editorial scale, selected from a rail.
 *
 * Three quote cards side by side means all three get skimmed and none get
 * read. Giving a single quote the full measure at display size makes it
 * legible as a statement; the other voices stay available as a list the
 * reader chooses from. The quote mark is set oversized and behind the text,
 * so it reads as typography rather than as an icon.
 */
export function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const t = TESTIMONIALS[i];

  return (
    <Section tone="deep">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Marker index="007" label="In practice" />
          <Mono className="text-faint">
            {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </Mono>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <figure className="relative col-span-12 lg:col-span-8">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-3 -top-14 select-none font-serif text-[190px] leading-none text-accent/10 lg:-left-10"
            >
              &ldquo;
            </span>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: DUR.component, ease: EASE_OUT }}
                className="relative"
              >
                <p className="text-[clamp(24px,3.1vw,44px)] font-extrabold leading-[1.14] tracking-[-0.035em] text-ink">
                  {t.quote}
                </p>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-accent/60" />
                  <span>
                    <span className="block text-sm font-bold text-ink">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </motion.blockquote>
            </AnimatePresence>
          </figure>

          {/* voice rail — the other quotes stay addressable */}
          <ul className="col-span-12 border-t border-line lg:col-span-4 lg:border-t-0">
            {TESTIMONIALS.map((q, k) => (
              <li key={q.name} className="border-b border-line lg:border-b lg:first:border-t">
                <button
                  type="button"
                  onMouseEnter={() => setI(k)}
                  onFocus={() => setI(k)}
                  onClick={() => setI(k)}
                  aria-current={k === i}
                  className="group flex w-full items-center gap-4 py-5 text-left"
                >
                  <Mono className={k === i ? "text-accent" : "text-faint"}>
                    {String(k + 1).padStart(2, "0")}
                  </Mono>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-bold transition-colors ${
                        k === i ? "text-ink" : "text-muted group-hover:text-ink"
                      }`}
                    >
                      {q.name}
                    </span>
                    <span className="block truncate text-xs text-faint">{q.role}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`pz-travel text-accent transition-opacity ${
                      k === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
