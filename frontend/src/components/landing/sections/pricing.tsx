"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PLANS } from "../content";
import { Eyebrow, Magnetic, Reveal, Shell, SpotlightCard } from "../primitives";

/**
 * Pricing (Design Bible §19.4): the highlighted tier physically breaks the row
 * — taller, inverted to graphite, lifted out of the grid — so hierarchy is
 * structural rather than a badge on an identical card.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`mt-0.5 shrink-0 ${dark ? "text-accent-bright" : "text-accent"}`}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[.06] blur-[130px]"
      />
      <Shell className="relative">
        <div className="grid grid-cols-12 items-end gap-x-10 gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="03">Pricing</Eyebrow>
            <Reveal delay={0.06}>
              <h2 className="mt-6 max-w-xl text-[clamp(30px,3.6vw,50px)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                Start free. Scale when it proves itself.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Reveal delay={0.12}>
              <p className="max-w-sm text-base leading-relaxed text-muted lg:ml-auto lg:text-right">
                Per-user pricing, monthly or annual. Every paid plan starts with a 14-day
                Professional trial.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-12 items-end gap-5">
          {PLANS.map((plan, i) =>
            plan.hot ? (
              /* ── featured tier: inverted, taller, out of the row ── */
              <Reveal key={plan.name} delay={i * 0.06} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-zone-header p-7 pb-8 shadow-[0_30px_80px_-24px_rgba(23,24,28,.45)] lg:-mb-3 lg:pt-10"
                >
                  <div aria-hidden className="pz-grid-dark pointer-events-none absolute inset-0" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-accent/30 blur-[60px]"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-accent px-2.5 py-1 text-2xs font-extrabold uppercase tracking-[.14em] text-void">
                        Most popular
                      </span>
                    </div>
                    <h3 className="mt-5 text-sm font-extrabold uppercase tracking-[.12em] text-on-dark-muted">
                      {plan.name}
                    </h3>
                    <p className="pz-num mt-3 text-4xl font-black tracking-[-0.03em] text-on-dark">
                      {plan.price}
                    </p>
                    <p className="text-xs text-on-dark-muted/70">{plan.per}</p>
                    <p className="mt-4 text-sm text-on-dark-muted">{plan.audience}</p>
                    <ul className="mt-6 space-y-3">
                      {plan.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-on-dark-muted">
                          <Check dark />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Magnetic strength={0.16}>
                      <Link
                        href="/register"
                        className="group relative mt-8 block overflow-hidden rounded-lg bg-accent py-3 text-center text-sm font-bold text-void shadow-[0_6px_22px_rgba(61,219,217,.4),inset_0_1px_0_rgba(255,255,255,.3)] transition-colors hover:bg-accent-bright hover:text-ink"
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[400%] motion-reduce:hidden"
                        />
                        {plan.cta}
                      </Link>
                    </Magnetic>
                  </div>
                </motion.div>
              </Reveal>
            ) : (
              <Reveal key={plan.name} delay={i * 0.06} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <SpotlightCard className="flex h-full flex-col p-7">
                  <h3 className="text-sm font-extrabold uppercase tracking-[.12em] text-muted">
                    {plan.name}
                  </h3>
                  <p className="pz-num mt-3 text-4xl font-black tracking-[-0.03em] text-ink">
                    {plan.price}
                  </p>
                  <p className="text-xs text-faint">{plan.per}</p>
                  <p className="mt-4 text-sm text-muted">{plan.audience}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                        <Check />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="mt-8 block rounded-lg border border-line-strong py-3 text-center text-sm font-bold text-ink transition-colors hover:border-accent hover:bg-accent/[.05] hover:text-accent"
                  >
                    {plan.cta}
                  </Link>
                </SpotlightCard>
              </Reveal>
            ),
          )}
        </div>
      </Shell>
    </section>
  );
}
