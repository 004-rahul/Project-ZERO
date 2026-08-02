"use client";

import { GlossyButton } from "./glossy-button";
import { HeroShowcase } from "./hero-showcase";
import { IconCheck } from "./icons";

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

export function Hero() {
  let delay = 0.05;
  return (
    <section className="relative overflow-hidden pb-20 pt-36">
      {/* soft pastel washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-64 h-[380px] w-[620px] rounded-full bg-warning/[.07] blur-[110px]"
      />

      <div className="relative mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[5vw]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-word-in text-xs font-extrabold uppercase tracking-[.28em] text-accent-strong">
            Enterprise Intelligence Platform
          </p>
          <h1 className="mt-6 text-hero font-black text-ink">
            {HEADLINE.map(({ word, accent, br }) => {
              delay += 0.09;
              return (
                <span key={word}>
                  <span
                    className={`inline-block animate-word-in ${accent ? "text-accent" : ""}`}
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
            className="mx-auto mt-6 max-w-xl animate-word-in text-lg font-medium leading-relaxed text-muted"
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
            className="mt-8 flex flex-wrap justify-center gap-4 animate-word-in"
            style={{ animationDelay: "1.05s" }}
          >
            <GlossyButton href="/register">Start free</GlossyButton>
            <GlossyButton href="#how" variant="ghost">
              See how it works ↓
            </GlossyButton>
          </div>
          <ul
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 animate-word-in"
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

        <div className="mt-16 animate-word-in" style={{ animationDelay: ".6s" }}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
