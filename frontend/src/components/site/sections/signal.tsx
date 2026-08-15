"use client";

import { PROOF_STATS, WORDMARKS } from "@/components/landing/content";
import { Count, Draw, Enter, Ticker } from "../motion";
import { Block, Bound, Divided, Label } from "../kit";

/**
 * Signal — the evidence band.
 *
 * Deliberately the quietest module on the page. It sits between two loud ones
 * and does nothing but state measured facts, which is what gives the numbers
 * their weight: a metric shouted alongside everything else reads as marketing,
 * a metric stated plainly reads as a measurement.
 */
export function Signal() {
  return (
    <Block pad="sm" className="border-y border-line bg-zone-header/60">
      <Bound wide>
        <div className="flex items-center gap-6">
          <Label className="text-faint">Deployed with</Label>
          <Draw className="block h-px flex-1 bg-line" />
        </div>

        <Enter className="mt-8" delay={0.05}>
          <Ticker duration={42}>
            {WORDMARKS.map((w) => (
              <span
                key={w}
                className="whitespace-nowrap px-10 text-lg font-extrabold tracking-tight text-muted/60"
              >
                {w}
              </span>
            ))}
          </Ticker>
        </Enter>

        <Divided cols={3} className="mt-12">
          {PROOF_STATS.map((s) => (
            <div key={s.label}>
              <span className="block text-[clamp(32px,4vw,54px)] font-black leading-none tracking-[-0.045em] text-ink">
                <Count end={s.end} suffix={s.suffix} />
              </span>
              <span className="mt-4 block max-w-[26ch] text-sm leading-relaxed text-muted">
                {s.label}
              </span>
            </div>
          ))}
        </Divided>
      </Bound>
    </Block>
  );
}
