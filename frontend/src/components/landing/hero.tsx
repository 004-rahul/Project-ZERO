"use client";

import { GlossyButton } from "./glossy-button";
import { HeroShowcase } from "./hero-showcase";
import {
  IconBrief,
  IconCheck,
  IconCite,
  IconKey,
  IconLink,
  IconMemory,
  IconShield,
  IconUsers,
  IconZap,
} from "./icons";

/**
 * Landing hero (Design Bible §19.4 v3.5 — light): centered headline over a
 * large self-running product window — the screenshot-led hero pattern.
 * Soft violet and amber washes keep the white canvas from feeling flat.
 */

const HEADLINE: { word: string; accent?: boolean; br?: boolean }[] = [
  { word: "Your" },
  { word: "company" },
  { word: "already" },
  { word: "knows", accent: true, br: true },
  { word: "the" },
  { word: "answer." },
];

const PROOF_POINTS = ["Free plan — no credit card", "5-minute setup", "Your keys, your models"];

/**
 * Floating app tiles at the hero edges (the Lindy pattern): they bob gently,
 * live only in the empty gutters on wide screens, scroll away with the hero,
 * and never overlap content.
 */
const FLOAT_TILES: {
  icon: (p: { className?: string }) => JSX.Element;
  pos: string;
  tone: string;
  delay: string;
}[] = [
  { icon: IconLink, pos: "left-[2%] top-[22%] rotate-[-6deg]", tone: "text-accent", delay: "0s" },
  { icon: IconCite, pos: "left-[6%] top-[58%] rotate-[5deg]", tone: "text-knowledge", delay: "-2.2s" },
  { icon: IconUsers, pos: "left-[3%] top-[82%] rotate-[-4deg]", tone: "text-success", delay: "-4.4s" },
  { icon: IconMemory, pos: "right-[2%] top-[18%] rotate-[6deg]", tone: "text-warning", delay: "-1.4s" },
  { icon: IconShield, pos: "right-[5%] top-[52%] rotate-[-5deg]", tone: "text-accent", delay: "-3.5s" },
  { icon: IconZap, pos: "right-[2%] top-[80%] rotate-[4deg]", tone: "text-warning", delay: "-5.6s" },
  { icon: IconKey, pos: "left-[44%] top-[6%] rotate-[5deg]", tone: "text-knowledge", delay: "-2.8s" },
  { icon: IconBrief, pos: "right-[38%] top-[8%] rotate-[-5deg]", tone: "text-success", delay: "-6.5s" },
];

export function Hero() {
  let delay = 0.05;
  return (
    <section className="relative overflow-hidden pb-20 pt-36">
      {/* floating app tiles — gutters only, scroll with the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
        {FLOAT_TILES.map(({ icon: Icon, pos, tone, delay }, i) => (
          <div
            key={i}
            className={`absolute flex h-12 w-12 animate-floaty items-center justify-center rounded-xl border border-line/70 bg-card shadow-card motion-reduce:animate-none ${pos}`}
            style={{ animationDelay: delay }}
          >
            <Icon className={`h-5 w-5 ${tone}`} />
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-[1920px] grid-cols-12 items-center gap-8 px-5 sm:px-8 lg:px-[5vw]">
        <div className="col-span-12 lg:col-span-6">
          <p className="animate-word-in text-xs font-extrabold uppercase tracking-[.28em] text-accent-strong">
            Enterprise Intelligence Platform
          </p>
          <h1 className="mt-6 max-w-2xl text-hero font-black text-ink">
            {HEADLINE.map(({ word, accent, br }) => {
              delay += 0.09;
              return (
                <span key={word}>
                  <span
                    className={`inline-block animate-word-in ${accent ? "text-warning" : ""}`}
                    style={{ animationDelay: `${delay}s` }}
                  >
                    {word}
                  </span>
                  {br ? <br /> : " "}
                </span>
              );
            })}
          </h1>
          <p
            className="mt-6 max-w-xl animate-word-in text-lg font-medium leading-relaxed text-muted"
            style={{ animationDelay: ".85s" }}
          >
            Project Zero connects the work apps your team already uses, remembers everything your
            team knows, and answers business questions with citations and confidence scores.{" "}
            <a
              href="#integrations"
              className="whitespace-nowrap font-semibold text-accent underline-offset-4 transition-colors hover:underline"
            >
              See all integrations →
            </a>
          </p>
          <div
            className="mt-8 flex flex-wrap gap-4 animate-word-in"
            style={{ animationDelay: "1.05s" }}
          >
            <GlossyButton href="/register">Start free</GlossyButton>
            <GlossyButton href="#how" variant="ghost">
              See how it works ↓
            </GlossyButton>
          </div>
          <ul
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 animate-word-in"
            style={{ animationDelay: "1.25s" }}
          >
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-muted">
                <IconCheck className="h-4 w-4 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 mt-12 animate-word-in lg:col-span-6 lg:mt-0" style={{ animationDelay: ".6s" }}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
