"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { TryAnswer } from "../answer-engine";
import { INTEGRATION_CATEGORIES, STEPS } from "../content";
import { Eyebrow, Reveal, Shell } from "../primitives";

/**
 * How it works (Design Bible §19.4): the page's signature interaction — a
 * pinned canvas where scrolling scrubs through Connect → Remember → Ask. The
 * left rail tracks progress; the right stage swaps a purpose-built visual per
 * stage. Below the pin, the visitor drives the real thing.
 * Collapses to a stacked, non-pinned layout on small screens.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── stage 01: sources converging into the core ── */
function ConnectStage() {
  return (
    <svg viewBox="0 0 460 300" className="h-full w-full" fill="none" aria-hidden>
      {INTEGRATION_CATEGORIES.slice(0, 6).map((label, i) => {
        const y = 34 + i * 46;
        const d = `M 84 ${y} C 190 ${y}, 220 150, 300 150`;
        return (
          <g key={label}>
            <path d={d} stroke="#E8E8EA" strokeWidth="1.5" />
            <motion.path
              d={d}
              stroke="#7C3AED"
              strokeWidth="1.5"
              strokeDasharray="26 200"
              initial={{ strokeDashoffset: 226 }}
              animate={{ strokeDashoffset: -226 }}
              transition={{ duration: 2.6, delay: i * 0.22, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="72"
              cy={y}
              r="5"
              fill="#7C3AED"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.6, delay: i * 0.22, repeat: Infinity }}
            />
            <text x="60" y={y + 4} textAnchor="end" className="fill-muted text-[11px] font-semibold">
              {label}
            </text>
          </g>
        );
      })}
      <circle cx="300" cy="150" r="46" fill="#7C3AED" fillOpacity=".06" />
      <motion.circle
        cx="300"
        cy="150"
        r="46"
        stroke="#7C3AED"
        strokeOpacity=".35"
        strokeWidth="1.5"
        animate={{ r: [46, 52, 46], strokeOpacity: [0.35, 0.12, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="300" cy="150" r="26" fill="#7C3AED" />
      <text x="300" y="156" textAnchor="middle" className="fill-white text-[13px] font-black">
        Z
      </text>
    </svg>
  );
}

/* ── stage 02: versioned memory layers being indexed ── */
function RememberStage() {
  return (
    <div className="relative h-full w-full overflow-hidden px-4 py-6">
      <div className="space-y-2.5">
        {["Decisions", "Threads", "Documents", "Commits", "Tickets"].map((layer, i) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
            className="flex items-center gap-3 rounded-lg border border-line bg-card px-4 py-3"
          >
            <span className="pz-num text-2xs font-bold text-accent">{`v${5 - i}`}</span>
            <span className="text-sm font-semibold text-ink">{layer}</span>
            <span className="ml-auto flex items-center gap-1.5">
              {Array.from({ length: 12 }).map((_, k) => (
                <motion.span
                  key={k}
                  className="h-3 w-1 rounded-full bg-accent/25"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.6, delay: k * 0.07 + i * 0.12, repeat: Infinity }}
                />
              ))}
            </span>
            <span className="pz-num text-2xs text-faint">indexed</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(124,58,237,.10),transparent)]"
        animate={{ y: ["-15%", "115%"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── stage 03: the answer, with its proof ── */
function AskStage() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 px-4">
      <div className="rounded-lg border border-line bg-cream/60 px-4 py-3">
        <span className="pz-num mr-2 text-sm font-bold text-accent">›</span>
        <span className="text-sm font-medium text-ink">What did we decide about the mobile rewrite?</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["GitHub", "PR #482"],
          ["Slack", "#eng-mobile"],
          ["Drive", "Strategy v2"],
        ].map(([src, doc], i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease: EASE }}
            className="rounded-lg border border-line bg-card px-3 py-2"
          >
            <p className="text-2xs font-extrabold uppercase tracking-[.12em] text-accent">{src}</p>
            <p className="mt-0.5 text-xs text-muted">{doc}</p>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-base leading-relaxed text-ink"
      >
        Approved on May 12 — React Native over Flutter, two-phase rollout starting Q4.
      </motion.p>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: "87%" }}
            transition={{ duration: 1, delay: 0.8, ease: EASE }}
          />
        </div>
        <span className="pz-num text-2xs font-bold uppercase tracking-[.1em] text-muted">87% · cited</span>
      </div>
    </div>
  );
}

const STAGES = [ConnectStage, RememberStage, AskStage];

export function How() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 0.999)));
  });

  const Stage = STAGES[active];

  return (
    <section id="how" className="relative border-y border-line bg-cream">
      {/* ── pinned scrub ── */}
      <div ref={pinRef} className="relative lg:h-[280vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <Shell className="py-20 lg:py-0">
            <div className="grid grid-cols-12 gap-x-10 gap-y-10">
              {/* rail */}
              <div className="col-span-12 lg:col-span-5">
                <Eyebrow index="02">How it works</Eyebrow>
                <Reveal delay={0.06}>
                  <h2 className="mt-6 text-[clamp(30px,3.6vw,50px)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                    Connect. Remember. Ask.
                  </h2>
                </Reveal>

                <div className="relative mt-10 pl-8">
                  {/* progress spine */}
                  <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-line" />
                  <motion.span
                    aria-hidden
                    style={{ height: fill }}
                    className="absolute left-[7px] top-2 w-px origin-top bg-accent"
                  />

                  <div className="space-y-7">
                    {STEPS.map((step, i) => {
                      const on = i === active;
                      return (
                        <div key={step.n} className="relative">
                          <span
                            aria-hidden
                            className={`absolute -left-8 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                              on ? "border-accent bg-accent" : "border-line-strong bg-cream"
                            }`}
                          >
                            {on && (
                              <motion.span
                                layoutId="how-dot"
                                className="h-1.5 w-1.5 rounded-full bg-white"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                          </span>
                          <motion.div
                            animate={{ opacity: on ? 1 : 0.42 }}
                            transition={{ duration: 0.45, ease: EASE }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="pz-num text-2xs font-bold tracking-[.2em] text-accent">
                                {step.n}
                              </span>
                              <h3 className="text-xl font-extrabold tracking-tight text-ink">
                                {step.title}
                              </h3>
                            </div>
                            <p className="mt-2 max-w-sm text-base leading-relaxed text-muted">
                              {step.body}
                            </p>
                            <AnimatePresence initial={false}>
                              {on && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.4, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-wrap gap-2 pt-3">
                                    {step.meta.map((m) => (
                                      <span
                                        key={m}
                                        className="rounded-md border border-line bg-card px-2.5 py-1 text-2xs font-semibold text-muted"
                                      >
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* stage */}
              <div className="col-span-12 lg:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-card shadow-[0_1px_2px_rgba(20,20,25,.04),0_24px_70px_-24px_rgba(23,24,28,.2)] lg:aspect-[16/11]">
                  <div aria-hidden className="pz-grid pointer-events-none absolute inset-0" />
                  <div className="absolute inset-x-0 top-0 flex items-center gap-2 border-b border-line bg-cream/70 px-4 py-2.5">
                    <span className="pz-num text-2xs font-bold uppercase tracking-[.16em] text-accent">
                      {STEPS[active].n}
                    </span>
                    <span className="text-2xs font-bold uppercase tracking-[.16em] text-muted">
                      {STEPS[active].title}
                    </span>
                  </div>
                  <div className="absolute inset-0 pt-11">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="h-full w-full"
                      >
                        <Stage />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </Shell>
        </div>
      </div>

      {/* ── the real thing ── */}
      <Shell className="pb-24 pt-4 md:pb-32">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <h3 className="text-[clamp(24px,2.6vw,36px)] font-black tracking-[-0.03em] text-ink">
                Now you try — no signup.
              </h3>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Reveal delay={0.06}>
              <p className="text-sm leading-relaxed text-muted lg:text-right">
                Synthetic sample workspace. Connect your real tools in minutes.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1} className="mt-8">
          <div className="mx-auto max-w-4xl">
            <TryAnswer />
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
