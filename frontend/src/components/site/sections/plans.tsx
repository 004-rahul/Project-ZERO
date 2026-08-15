"use client";

import { PLANS } from "@/components/landing/content";
import { IconCheck } from "@/components/landing/icons";
import { Enter, Lines, Sequence } from "../motion";
import { Action, Block, Bound, Label, Surface } from "../kit";

/**
 * Plans — a rate table read across, not four boxes compared cell by cell.
 *
 * Tiers share one baseline and one set of rules, so the eye can run
 * horizontally across a row. The recommended tier is marked by INVERSION —
 * it carries the accent edge and a filled action — rather than by being
 * bigger, because scale competes with the price figures for attention.
 */
export function Plans() {
  return (
    <Block id="plans">
      <Bound wide>
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Label className="text-accent">Plans</Label>
            <Lines
              as="h2"
              className="mt-6 text-[clamp(30px,3.6vw,54px)] font-black leading-[0.96] tracking-[-0.045em] text-ink"
            >
              {["Start on your own data.", "Pay when a team depends on it."]}
            </Lines>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Enter delay={0.08}>
              <p className="text-sm leading-relaxed text-muted">
                Every plan carries the full audit trail. The free tier is not a demo — it runs
                against your own workspace.
              </p>
            </Enter>
          </div>
        </div>

        <Sequence gap={0.06} className="mt-16 grid grid-cols-12 border-t border-line" y={16}>
          {PLANS.map((plan) => (
            <div key={plan.name} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Surface
                interactive
                className={`flex h-full flex-col border-t-0 border-b-0 border-l-0 p-8 lg:border-l lg:first:border-l-0 ${
                  plan.hot ? "bg-raised/70" : "bg-transparent"
                }`}
              >
                {plan.hot && (
                  <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-md font-extrabold tracking-tight text-ink">
                    {plan.name}
                  </span>
                  {plan.hot && <Label className="text-accent">Most popular</Label>}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="pz-num text-[40px] font-black leading-none tracking-[-0.05em] text-ink">
                    {plan.price}
                  </span>
                  <span className="text-sm text-faint">{plan.per}</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{plan.audience}</p>

                <ul className="mt-7 flex-1 space-y-3 pz-shift">
                  {plan.points.map((pt: string) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-muted">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  <Action
                    href="/register"
                    size="sm"
                    variant={plan.hot ? "solid" : "line"}
                    className="w-full justify-center"
                  >
                    {plan.cta}
                  </Action>
                </div>
              </Surface>
            </div>
          ))}
        </Sequence>
      </Bound>
    </Block>
  );
}
