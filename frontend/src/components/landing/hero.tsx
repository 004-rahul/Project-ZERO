"use client";

import { useEffect, useRef } from "react";
import { GlossyButton } from "./glossy-button";
import { HeroShowcase } from "./hero-showcase";
import { IconCheck } from "./icons";

/**
 * Landing hero (Design Bible §19.4 v3.4): 12-column grid — copy in the left
 * seven columns, the self-running product showcase in the right five. Solid
 * Aurora accents, no gradients. The copy block counter-parallaxes the cursor.
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
    <section className="relative overflow-hidden px-6 pb-20 pt-36 lg:px-10">
      <div className="grid grid-cols-12 items-center gap-6">
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

        <div className="col-span-12 animate-word-in lg:col-span-5" style={{ animationDelay: ".5s" }}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
