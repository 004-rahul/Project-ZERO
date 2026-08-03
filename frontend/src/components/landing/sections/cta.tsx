"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AiOrb } from "../ai-orb";
import { HERO_PROOF } from "../content";
import { IconCheck } from "../icons";
import { Magnetic, MaskLines, Reveal, Shell } from "../primitives";
import { LatticeLayer } from "../three/lattice-layer";

/**
 * Closing CTA (Design Bible §19.4): a full-bleed graphite finale where the R3F
 * Knowledge Lattice is finally shown at full strength on dark, with the AI
 * presence anchoring an asymmetric type block. The page opens light and closes
 * dark — a deliberate tonal arc.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Cta() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-zone-header py-28 md:py-36">
      <div aria-hidden className="pz-grid-dark pointer-events-none absolute inset-0" />
      <LatticeLayer tone="dark" className="pointer-events-none absolute inset-0 opacity-90" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/25 blur-[140px]"
      />

      <Shell className="relative">
        <div className="grid grid-cols-12 items-center gap-y-12 lg:gap-x-10">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent-bright/50" />
                <span className="text-2xs font-extrabold uppercase tracking-[.26em] text-accent-bright">
                  Ready when you are
                </span>
              </div>
            </Reveal>

            <MaskLines
              className="mt-7 text-[clamp(34px,5vw,68px)] font-black leading-[0.98] tracking-[-0.04em] text-on-dark"
              lines={[<>See your organization</>, <span key="t" className="text-accent-bright">think.</span>]}
            />

            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-on-dark-muted">
                Connect a tool in five minutes and ask your first real question — the answer comes
                with proof.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Magnetic strength={0.22}>
                  <Link
                    href="/register"
                    className="group relative block overflow-hidden rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(124,58,237,.45),inset_0_1px_0_rgba(255,255,255,.35)] transition-colors hover:bg-accent-bright hover:text-ink"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[400%] motion-reduce:hidden"
                    />
                    Start free
                  </Link>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <a
                    href="#how"
                    className="block rounded-lg border border-white/20 px-6 py-3.5 text-base font-semibold text-on-dark transition-colors hover:border-accent-bright hover:bg-white/5"
                  >
                    Replay the demo ↑
                  </a>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
                {HERO_PROOF.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-on-dark-muted">
                    <IconCheck className="h-4 w-4 text-accent-bright" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, scale: 0.94 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative mx-auto grid place-items-center"
            >
              <AiOrb state="speaking" size={280} variant="dark" />
              <div className="pointer-events-none absolute inset-x-0 -bottom-2 text-center">
                <span className="pz-num text-2xs font-bold uppercase tracking-[.2em] text-on-dark-muted/70">
                  zero · always cited
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
