"use client";

import { useEffect, useRef, useState } from "react";
import { Organism, ORGANISM_PHASES, type OrganismPhase } from "./organism";
import { GlossyButton } from "./glossy-button";
import { IconCheck } from "./icons";

/**
 * Landing hero (Design Bible §19.4 v3.3): 12-column grid — copy in the left
 * seven columns, the living Organism contained in the right five with a live
 * caption naming what it is forming. Solid Aurora accents, no gradients.
 * The copy block counter-parallaxes the cursor for physical depth.
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
  const [phase, setPhase] = useState<OrganismPhase>(ORGANISM_PHASES[1]);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => {
      const el = copyRef.current;
      if (!el) return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate(${dx * -8}px, ${dy * -6}px)`;
    };
    if (fine && !reduced) window.addEventListener("mousemove", onMove);
    return () => {
      if (fine && !reduced) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  let delay = 0.05;
  return (
    <section className="relative overflow-hidden pb-16 pt-36">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 items-center gap-6 px-6">
        <div ref={copyRef} className="col-span-12 transition-transform duration-300 ease-out lg:col-span-7">
          <p className="animate-word-in text-xs font-extrabold uppercase tracking-[.28em] text-aurora-bright">
            Enterprise Intelligence Platform
          </p>
          <h1 className="mt-6 max-w-2xl text-hero font-black text-on-dark">
            {HEADLINE.map(({ word, accent, br }) => {
              delay += 0.09;
              return (
                <span key={word}>
                  <span
                    className={`inline-block animate-word-in ${accent ? "text-aurora-magenta" : ""}`}
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
            className="mt-6 max-w-lg animate-word-in text-lg font-medium leading-relaxed text-on-dark-muted"
            style={{ animationDelay: ".85s" }}
          >
            Project Zero connects GitHub, Slack, Drive and Notion, remembers everything your team
            knows, and answers business questions with citations and confidence scores.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-word-in" style={{ animationDelay: "1.05s" }}>
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
              <li key={point} className="flex items-center gap-2 text-sm text-on-dark-muted">
                <IconCheck className="h-4 w-4 text-aurora-violet" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="relative mx-auto h-[320px] w-full max-w-[560px] sm:h-[420px] lg:h-[540px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(197,95,214,.16),rgba(228,95,188,.06)_55%,transparent_72%)]"
            />
            <Organism className="absolute inset-0 h-full w-full" centerX={0.5} onPhase={setPhase} />
            <div className="absolute inset-x-0 -bottom-1 flex items-center justify-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-bright shadow-[0_0_10px_#D9A1F5]" />
              <span className="text-2xs uppercase tracking-[.16em] text-on-dark-muted/70">
                now:{" "}
                <span key={phase.key} className="inline-block animate-word-in font-semibold text-on-dark-muted">
                  {phase.label}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
