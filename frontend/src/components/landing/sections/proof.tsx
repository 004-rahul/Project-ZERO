"use client";

import { motion } from "framer-motion";
import { INTEGRATION_CATEGORIES, PROOF_STATS, WORDMARKS } from "../content";
import { Marquee, Reveal, Shell, Ticker } from "../primitives";

/**
 * Social proof (Design Bible §19.4): a graphite inversion band — the first
 * tonal shift on the page — carrying a wordmark marquee, integration
 * categories, and three outcome metrics on a divided rule grid.
 */
export function Proof() {
  return (
    <section id="integrations" aria-label="Social proof" className="relative overflow-hidden bg-zone-header py-16 md:py-20">
      <div aria-hidden className="pz-grid-dark pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[320px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="relative">
        <Shell>
          <Reveal>
            <p className="text-center text-sm font-medium text-on-dark-muted">
              Trusted in pilots by operations-heavy teams — connected to the tools they already use
            </p>
          </Reveal>
        </Shell>

        <Reveal delay={0.06}>
          <Marquee className="mt-9" duration={38}>
            <div className="flex shrink-0 items-center gap-14 pr-14">
              {WORDMARKS.map((brand) => (
                <span
                  key={brand}
                  className="whitespace-nowrap text-lg font-extrabold uppercase tracking-[.14em] text-on-dark/25 transition-colors hover:text-on-dark/60"
                >
                  {brand}
                </span>
              ))}
            </div>
          </Marquee>
        </Reveal>

        <Shell className="mt-12">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {INTEGRATION_CATEGORIES.map((cat) => (
                <motion.span
                  key={cat}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-white/10 bg-white/[.04] px-3.5 py-1.5 text-xs font-semibold text-on-dark-muted backdrop-blur-sm transition-colors hover:border-accent-bright/40 hover:text-on-dark"
                >
                  {cat}
                </motion.span>
              ))}
              <span className="px-2 text-xs font-semibold text-accent-bright">
                40+ integrations — full list at launch
              </span>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PROOF_STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.09}>
                <div className="px-2 py-7 text-center sm:px-8 sm:py-2">
                  <p className="text-[clamp(34px,3.4vw,48px)] font-black leading-none tracking-[-0.03em] text-on-dark">
                    <Ticker end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="mx-auto mt-3 max-w-[210px] text-sm leading-snug text-on-dark-muted">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </div>
    </section>
  );
}
