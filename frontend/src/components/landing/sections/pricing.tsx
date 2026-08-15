"use client";

import { PLANS } from "../content";
import { IconCheck } from "../icons";
import { Reveal, Stagger } from "@/components/motion";
import { Button, Card, Marker, Mono, Section, Shell } from "@/components/ui";

/**
 * Pricing — a rate card, not four equal boxes.
 *
 * Four identical cards force the reader to diff them cell by cell. Here the
 * recommended tier physically breaks the row: taller, inverted, and lifted out
 * of alignment. The break IS the recommendation, so the layout carries the
 * message and the copy does not have to shout it.
 */
export function Pricing() {
  return (
    <Section id="pricing">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Marker index="006" label="Pricing" />
          <Mono className="text-faint">Every plan includes the audit trail</Mono>
        </div>

        <Reveal className="mt-8 max-w-2xl" delay={0.05}>
          <p className="text-[clamp(24px,2.6vw,34px)] font-black leading-[1.08] tracking-[-0.035em] text-ink">
            Start on the free tier with your own data.{" "}
            <span className="text-muted">Upgrade only when a team depends on it.</span>
          </p>
        </Reveal>

        <Stagger gap={0.06} className="mt-14 grid grid-cols-12 items-end gap-4" y={22}>
          {PLANS.map((plan) => {
            const featured = plan.hot;
            return (
              <div key={plan.name} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <Card
                  className={
                    featured
                      ? "flex h-full flex-col border-accent/55 bg-raised p-7 lg:-mb-4 lg:pb-11 lg:pt-11"
                      : "flex h-full flex-col p-7"
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-md font-extrabold tracking-tight text-ink">
                      {plan.name}
                    </span>
                    {featured && <Mono className="text-accent">Most popular</Mono>}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="pz-num text-[38px] font-black leading-none tracking-[-0.04em] text-ink">
                      {plan.price}
                    </span>
                    <span className="text-sm text-faint">{plan.per}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted">{plan.audience}</p>

                  <ul className="mt-6 space-y-2.5 pz-shift">
                    {plan.points.map((p: string) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-2">
                    <Button
                      href="/register"
                      size="sm"
                      variant={featured ? "primary" : "ghost"}
                      className="w-full justify-center"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </Stagger>
      </Shell>
    </Section>
  );
}
