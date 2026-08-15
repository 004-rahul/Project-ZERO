"use client";

import { PROOF_STATS, WORDMARKS } from "../content";
import { Marquee, Reveal, Ticker } from "@/components/motion";
import { Divided, Marker, Mono, Section, Shell } from "@/components/ui";

/**
 * Proof — the page's first tonal inversion. Sitting on the deepest surface
 * gives the eye a floor between the hero and the feature material, which is
 * what stops a long page reading as one undifferentiated scroll.
 *
 * Metrics are set in a divided grid rather than as cards: hairlines imply a
 * measured instrument, boxes imply marketing.
 */
export function Proof() {
  return (
    <Section tone="deep" className="py-20 md:py-24">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Marker index="002" label="Evidence" />
          <Mono className="text-faint">Measured across pilot workspaces</Mono>
        </div>

        <Reveal className="mt-12" delay={0.05}>
          <Marquee duration={38}>
            {WORDMARKS.map((w) => (
              <span
                key={w}
                className="whitespace-nowrap px-8 text-lg font-extrabold tracking-tight text-muted/70"
              >
                {w}
              </span>
            ))}
          </Marquee>
        </Reveal>

        <Divided cols={3} className="mt-14">
          {PROOF_STATS.map((s) => (
            <div key={s.label}>
              <span className="block text-[clamp(34px,4.4vw,58px)] font-black leading-none tracking-[-0.04em] text-ink">
                <Ticker end={s.end} suffix={s.suffix} />
              </span>
              <span className="mt-4 block max-w-[24ch] text-sm leading-relaxed text-muted">
                {s.label}
              </span>
            </div>
          ))}
        </Divided>
      </Shell>
    </Section>
  );
}
