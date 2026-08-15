"use client";

import { motion } from "framer-motion";
import { AiOrb } from "../ai-orb";
import { FEATURES } from "../content";
import { ClipReveal, Eyebrow, Reveal, Shell, SpotlightCard } from "../primitives";

/**
 * Features (Design Bible §19.4): an asymmetric bento — a tall graphite feature
 * panel anchors the left column while six spotlight cards step down the right
 * in varied spans. Each card's icon animates on hover; nothing is a uniform
 * three-across grid.
 */


/** Column spans per index — deliberately uneven. */
const SPAN = ["lg:col-span-8", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-8"];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <Shell>
        <div className="grid grid-cols-12 gap-x-10 gap-y-6">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow index="01">Features</Eyebrow>
            <Reveal delay={0.06}>
              <h2 className="mt-6 max-w-md text-[clamp(30px,3.6vw,50px)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                One intelligence layer. Every tool.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
                Not another chatbot. A platform that understands your whole organization and shows
                its work on every answer.
              </p>
            </Reveal>

            {/* anchor panel — the AI presence, inverted for contrast */}
            <Reveal delay={0.18}>
              <div className="relative mt-10 overflow-hidden rounded-xl border border-white/10 bg-zone-header p-7">
                <div aria-hidden className="pz-grid-dark pointer-events-none absolute inset-0" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-[70px]"
                />
                <div className="relative flex items-start gap-5">
                  <AiOrb state="thinking" size={78} variant="dark" />
                  <div>
                    <p className="text-md font-bold text-on-dark">Zero, working</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-on-dark-muted">
                      Retrieval, reasoning and scoring run as visible stages — you always know what
                      the platform is doing.
                    </p>
                  </div>
                </div>
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {["Retrieve", "Reason", "Score", "Cite", "Audit"].map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0.35 }}
                      whileInView={{ opacity: [0.35, 1, 0.55] }}
                      viewport={{ once: false }}
                      transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, repeatDelay: 1.6 }}
                      className="rounded-md border border-white/10 bg-white/[.04] px-2.5 py-1 text-2xs font-bold uppercase tracking-[.14em] text-on-dark-muted"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* bento */}
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-12 gap-4">
              {FEATURES.map((f, i) => (
                /* Clip wipe rather than another fade-up: the bento is the third
                   reveal on the page, and repeating one entrance across every
                   section is what makes a site read as templated. */
                <ClipReveal
                  key={f.title}
                  delay={i * 0.05}
                  className={`col-span-12 sm:col-span-6 ${SPAN[i]}`}
                >
                  <SpotlightCard className="h-full p-6">
                    <div className="flex items-start gap-4">
                      {/* icon leads, copy follows a beat behind — one hover,
                          several layers responding (.pz-zoom / .pz-shift) */}
                      <span
                        className={`pz-zoom flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-cream transition-colors duration-300 group-hover:border-accent/40 ${f.tone}`}
                      >
                        <f.icon />
                      </span>
                      <div className="pz-shift">
                        <h3 className="text-md font-extrabold leading-snug text-ink">{f.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </ClipReveal>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
