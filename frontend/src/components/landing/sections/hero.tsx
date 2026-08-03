"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AutoAnswer } from "../answer-engine";
import { HERO_PROOF, INTEGRATION_CATEGORIES } from "../content";
import { IconCheck } from "../icons";
import { Magnetic, MaskLines, Shell, usePointerDepth } from "../primitives";
import { LatticeLayer } from "../three/lattice-layer";

/**
 * Hero (Design Bible §19.4): asymmetric 12-column split — editorial display
 * type held left, the live Answer Engine floating right on a pointer-parallax
 * stack over the R3F Knowledge Lattice. Deliberately off-centre and layered so
 * it reads as a designed composition, not a centred template block.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const near = usePointerDepth(16);
  const far = usePointerDepth(-8);

  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40">
      {/* depth stack: grid → lattice → wash */}
      <div aria-hidden className="pz-grid pointer-events-none absolute inset-0" />
      <LatticeLayer tone="light" className="pointer-events-none absolute -right-[12%] -top-[18%] h-[880px] w-[880px] opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/[.07] blur-[130px]"
      />

      <Shell className="relative">
        <div className="grid grid-cols-12 items-center gap-y-14 lg:gap-x-10">
          {/* ── copy: left 6 ── */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 shadow-card">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-2xs font-extrabold uppercase tracking-[.18em] text-muted">
                  Enterprise Intelligence Platform
                </span>
              </span>
            </motion.div>

            <MaskLines
              className="mt-7 text-[clamp(38px,5.4vw,74px)] font-black leading-[0.98] tracking-[-0.042em] text-ink"
              delay={0.1}
              lines={[
                <>Your company</>,
                <>
                  already <span className="text-accent">knows</span>
                </>,
                <>the answer.</>,
              ]}
            />

            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              className="mt-7 max-w-lg text-lg leading-relaxed text-muted"
            >
              Project Zero connects the work apps your team already uses, remembers everything your
              team knows, and answers business questions with citations and confidence scores.
            </motion.p>

            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.68 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.22}>
                <Link
                  href="/register"
                  className="group relative block overflow-hidden rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_28px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.35)] transition-colors hover:bg-accent-strong"
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
                  className="group flex items-center gap-2 rounded-lg border border-line-strong bg-card px-6 py-3.5 text-base font-semibold text-ink shadow-card transition-colors hover:border-accent hover:text-accent"
                >
                  See how it works
                  <motion.span
                    aria-hidden
                    animate={reduced ? undefined : { y: [0, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </a>
              </Magnetic>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } } }}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5"
            >
              {HERO_PROOF.map((point) => (
                <motion.li
                  key={point}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <IconCheck className="h-4 w-4 text-accent" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── engine: right 6, layered + parallax ── */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative mx-auto max-w-[620px] lg:max-w-none">
              {/* offset ghost panels build physical depth */}
              <motion.div
                aria-hidden
                style={reduced ? undefined : { x: far.x, y: far.y }}
                className="absolute -right-4 -top-6 hidden h-full w-full rounded-xl border border-line bg-card/60 sm:block"
              />
              <motion.div
                aria-hidden
                style={reduced ? undefined : { x: far.x, y: far.y }}
                className="absolute -right-2 -top-3 hidden h-full w-full rounded-xl border border-line bg-card/80 sm:block"
              />

              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 26, scale: 0.985 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
                style={reduced ? undefined : { x: near.x, y: near.y }}
                className="relative"
              >
                <AutoAnswer />
              </motion.div>

              {/* floating integration pills */}
              <motion.div
                aria-hidden
                style={reduced ? undefined : { x: near.x, y: near.y }}
                className="pointer-events-none absolute -bottom-7 left-1/2 hidden w-max -translate-x-1/2 md:block"
              >
                <div className="flex items-center gap-2 rounded-full border border-line bg-card/95 px-4 py-2.5 shadow-lift backdrop-blur-sm">
                  {INTEGRATION_CATEGORIES.slice(0, 4).map((c) => (
                    <span key={c} className="text-2xs font-bold uppercase tracking-[.12em] text-muted">
                      {c}
                    </span>
                  ))}
                  <span className="h-3 w-px bg-line" />
                  <a
                    href="#integrations"
                    className="pointer-events-auto text-2xs font-bold uppercase tracking-[.12em] text-accent"
                  >
                    40+ integrations
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
