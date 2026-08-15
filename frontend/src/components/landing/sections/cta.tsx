"use client";

import { AiOrb } from "../ai-orb";
import { LatticeLayer } from "../three/lattice-layer";
import { MaskLines, Reveal } from "@/components/motion";
import { Button, Mono, Pulse, Section, Shell } from "@/components/ui";

/**
 * Close — the page's final inversion, and the only section with no marker
 * index. Dropping the numbering signals the argument is over: this is the ask,
 * not another exhibit. Type is set larger here than anywhere except the hero,
 * so the page opens and closes on the same voice.
 */
export function Cta() {
  return (
    <Section tone="deep" className="py-28 md:py-40">
      <LatticeLayer
        tone="dark"
        className="pointer-events-none absolute -left-[10%] top-1/2 h-[760px] w-[760px] -translate-y-1/2 opacity-55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[4%] top-1/2 h-[420px] w-[620px] -translate-y-1/2 rounded-full bg-accent/[.09] blur-[150px]"
      />

      <Shell className="relative">
        <div className="grid grid-cols-12 items-center gap-y-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-7">
            <Pulse label="Free plan · no credit card" />
            <MaskLines
              as="h2"
              className="mt-7 text-[clamp(38px,5.6vw,80px)] font-black leading-[0.94] tracking-[-0.05em] text-ink"
              lines={[<>Ask your first</>, <>question in</>, <>five minutes.</>]}
            />
            <Reveal delay={0.12} className="mt-8 max-w-md">
              <p className="text-md leading-relaxed text-muted">
                Connect one tool, ask one question, and read the citations it comes back with.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <Button href="/register">Start free</Button>
                <Button href="/login" variant="ghost">
                  Log in
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.24} className="mt-8">
              <Mono className="text-faint">Read-only scopes · revoke any second</Mono>
            </Reveal>
          </div>

          <div className="col-span-12 flex justify-center lg:col-span-5">
            <AiOrb state="speaking" size={280} />
          </div>
        </div>
      </Shell>
    </Section>
  );
}
