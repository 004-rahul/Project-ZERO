"use client";

import { useEffect, useRef, useState } from "react";
import { Organism, ORGANISM_PHASES, type OrganismPhase } from "./organism";
import { GlossyButton } from "./glossy-button";

/**
 * Landing hero (Design Bible §19.4 v3.2): left-aligned headline over the
 * living Organism, which is biased to the right of the viewport. A live
 * caption narrates what the particles are forming. The copy block gets a
 * subtle counter-parallax to the cursor for physical depth.
 */

const HEADLINE: { word: string; grad?: boolean; br?: boolean }[] = [
  { word: "Your" },
  { word: "company" },
  { word: "already" },
  { word: "knows", grad: true, br: true },
  { word: "the" },
  { word: "answer." },
];

export function Hero() {
  const [phase, setPhase] = useState<OrganismPhase>(ORGANISM_PHASES[1]);
  const [centerX, setCenterX] = useState(0.63);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => setCenterX(window.innerWidth > 860 ? 0.63 : 0.5);
    onResize();
    window.addEventListener("resize", onResize);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => {
      const el = copyRef.current;
      if (!el) return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate(${dx * -10}px, ${dy * -7}px)`;
    };
    if (fine && !reduced) window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", onResize);
      if (fine && !reduced) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  let delay = 0.1;
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-28">
      {/* stage glow behind the organism — the right side is never raw black */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[2%] top-1/2 h-[76vmin] w-[76vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(197,95,214,.15),rgba(228,95,188,.06)_55%,transparent_70%)]"
      />
      <Organism className="absolute inset-0 h-full w-full" centerX={centerX} onPhase={setPhase} />
      {/* readability shade over the organism — void-toned, left and bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#080709_4%,transparent_58%),linear-gradient(0deg,#080709_2%,transparent_22%)]"
      />

      <div
        ref={copyRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-7 transition-transform duration-300 ease-out md:px-14"
      >
        <p className="animate-word-in text-xs font-extrabold uppercase tracking-[.3em] text-aurora-bright">
          Enterprise Intelligence Platform
        </p>
        <h1 className="mt-5 max-w-3xl text-hero font-black text-on-dark">
          {HEADLINE.map(({ word, grad, br }) => {
            delay += grad ? 0.15 : 0.1;
            return (
              <span key={word}>
                <span
                  className={
                    grad
                      ? "inline-block bg-gradient-to-r from-aurora-violet via-aurora-magenta to-aurora-amber bg-[length:200%_auto] bg-clip-text text-transparent [animation:word-in_1s_cubic-bezier(.2,.7,.2,1)_both,gradient-x_7s_ease-in-out_1.2s_infinite]"
                      : "inline-block animate-word-in"
                  }
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
          className="mt-6 max-w-md animate-word-in text-lg font-medium text-on-dark-muted"
          style={{ animationDelay: "1s" }}
        >
          Zero finds it — with proof you can audit.
        </p>
        <div
          className="mt-9 flex flex-wrap gap-3.5 animate-word-in"
          style={{ animationDelay: "1.25s" }}
        >
          <GlossyButton href="#demo">Try it — no signup ↓</GlossyButton>
          <GlossyButton href="/register" variant="ghost">
            Start free
          </GlossyButton>
        </div>
        <p
          className="mt-6 animate-word-in text-xs tracking-wide text-on-dark-muted/60"
          style={{ animationDelay: "1.5s" }}
        >
          No signup · No connection · Sample workspace
        </p>
      </div>

      {/* live caption: what the organism is forming right now */}
      <div className="absolute bottom-8 left-7 z-10 flex items-center gap-2.5 md:left-14">
        <span className="h-[7px] w-[7px] rounded-full bg-aurora-bright shadow-[0_0_10px_#D9A1F5]" />
        <span className="text-xs uppercase tracking-[.14em] text-on-dark-muted/60">
          now: <span key={phase.key} className="inline-block animate-word-in font-semibold text-on-dark-muted">{phase.label}</span>
        </span>
      </div>

      <div className="absolute bottom-7 right-14 z-10 hidden text-2xs uppercase tracking-[.24em] text-on-dark-muted/60 md:block">
        Scroll
        <span className="mx-auto mt-2.5 block h-10 w-px animate-drip bg-gradient-to-b from-aurora-bright to-transparent motion-reduce:animate-none" />
      </div>
    </section>
  );
}
