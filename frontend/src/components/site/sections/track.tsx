"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { FEATURES } from "@/components/landing/content";
import { Lines, useScrub } from "../motion";
import { Bound, Label, Surface } from "../kit";

/**
 * Track — capabilities as a HORIZONTAL run driven by vertical scroll.
 *
 * A vertical grid of six feature cards is the most-copied block in SaaS, and
 * it flattens everything to equal weight. Turning the axis does two things a
 * grid cannot: it makes the set feel finite (you can see the run end) and it
 * gives each capability the full height of the viewport, so each one is read
 * rather than skimmed.
 *
 * Below `lg` the track becomes an ordinary vertical list — a horizontal
 * scroll-jack on a phone is hostile, and the content survives the change.
 */
export function Track() {
  const [ref, progress] = useScrub();
  const reduced = useReducedMotion();

  /* Travel = (number of panels - 1) screens' worth, expressed in viewport
     units so it stays correct at any width without measuring the DOM. */
  const x = useTransform(progress, [0, 1], ["0vw", `-${(FEATURES.length - 1) * 42}vw`]);
  const bar = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="capabilities" className="relative">
      {/* ── desktop: pinned viewport, panels run sideways ── */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${FEATURES.length * 62}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <Bound wide className="relative z-10">
            <div className="flex items-end justify-between gap-8">
              <Lines
                as="h2"
                className="max-w-xl text-[clamp(30px,3.4vw,50px)] font-black leading-[0.98] tracking-[-0.04em] text-ink"
              >
                {["Built to be audited,", "not trusted blindly."]}
              </Lines>
              <div className="flex flex-col items-end gap-3 pb-2">
                <Label className="text-faint">
                  {FEATURES.length} capabilities · scroll
                </Label>
                <span className="block h-px w-44 bg-line">
                  <motion.span
                    className="block h-px bg-accent"
                    style={reduced ? { width: "100%" } : { width: bar }}
                  />
                </span>
              </div>
            </div>
          </Bound>

          <motion.ul
            className="mt-14 flex gap-6 pl-[max(1.25rem,calc((100vw-1680px)/2+3.5rem))]"
            style={reduced ? undefined : { x }}
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="w-[38vw] shrink-0">
                <Surface interactive className="flex h-[46vh] flex-col justify-between p-9">
                  <div className="flex items-start justify-between">
                    <span className={`text-2xl ${f.tone}`}>
                      <f.icon />
                    </span>
                    <Label className="text-faint">{String(i + 1).padStart(2, "0")}</Label>
                  </div>
                  <div className="pz-shift">
                    <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{f.body}</p>
                  </div>
                </Surface>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ── small screens: the same content, no scroll-jacking ── */}
      <div className="lg:hidden">
        <Bound className="py-24">
          <Lines
            as="h2"
            className="text-[clamp(28px,7vw,40px)] font-black leading-[1.0] tracking-[-0.04em] text-ink"
          >
            {["Built to be audited,", "not trusted blindly."]}
          </Lines>
          <ul className="mt-10 border-t border-line">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="border-b border-line py-7">
                <div className="flex items-center gap-3">
                  <Label className="text-faint">{String(i + 1).padStart(2, "0")}</Label>
                  <span className={f.tone}>
                    <f.icon />
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </Bound>
      </div>
    </section>
  );
}
