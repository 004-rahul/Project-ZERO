"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleFace, type AiState } from "@/components/particle-face";
import { AURORA_FACE } from "./aurora";

/**
 * Pinned scroll story (Design Bible §19.4): the Signature Face stays fixed
 * while scrolling drives three product chapters — and the face itself moves
 * through its real AI states (listening → thinking → speaking). On small
 * screens and under reduced-motion the chapters stack normally.
 */

const CHAPTERS: {
  stage: string;
  title: string;
  body: string;
  pills: string[];
  state: AiState;
}[] = [
  {
    stage: "Stage 01 · Listening",
    title: "Connect what you already use.",
    body: "OAuth in. Read-only. Revocable any second.",
    pills: ["GitHub", "Slack", "Drive", "Notion"],
    state: "listening",
  },
  {
    stage: "Stage 02 · Thinking",
    title: "It becomes memory.",
    body: "Permanent. Versioned. Searchable. Knowledge that stays when people leave.",
    pills: ["12,482 documents", "3 years of context"],
    state: "thinking",
  },
  {
    stage: "Stage 03 · Speaking",
    title: "Answers with receipts.",
    body: "Citations, confidence, audit trail — on every single answer.",
    pills: ["✓ Cited", "✓ Scored", "✓ Audited"],
    state: "speaking",
  },
];

export function ScrollStory() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [faceSize, setFaceSize] = useState(360);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth > 860;
    setFaceSize(Math.min(360, window.innerWidth * 0.7));
    if (reduced || !wide) return;
    setPinned(true);

    const onScroll = () => {
      const root = rootRef.current;
      if (!root) return;
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / total));
      setIdx(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={rootRef} className={pinned ? "relative h-[340vh]" : "relative"}>
      <div
        className={
          pinned
            ? "sticky top-0 mx-auto grid h-screen max-w-5xl grid-cols-2 items-center gap-8 overflow-hidden px-8"
            : "mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-8 py-16 md:grid-cols-2"
        }
      >
        <div className="relative grid place-items-center">
          <div
            aria-hidden
            className="absolute h-[120%] w-[120%] rounded-full bg-[radial-gradient(circle,rgba(197,95,214,.14),transparent_65%)]"
          />
          <ParticleFace state={pinned ? CHAPTERS[idx].state : "idle"} size={faceSize} palette={AURORA_FACE} />
        </div>

        <div className={pinned ? "relative h-[340px]" : "space-y-14"}>
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.stage}
              className={
                pinned
                  ? `absolute inset-0 flex flex-col justify-center transition-all duration-700 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] ${
                      i === idx ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-11 opacity-0"
                    }`
                  : ""
              }
            >
              <p className="text-2xs font-extrabold uppercase tracking-[.26em] text-aurora-amber">{ch.stage}</p>
              <h3 className="mt-3.5 text-3xl font-black tracking-tight text-on-dark md:text-4xl">
                {ch.title}
              </h3>
              <p className="mt-3.5 max-w-sm text-md text-on-dark-muted">{ch.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ch.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/[.13] bg-white/[.09] px-3.5 py-1.5 text-xs text-on-dark-muted backdrop-blur-sm"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {pinned && (
          <div className="absolute right-7 top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
            {CHAPTERS.map((ch, i) => (
              <span
                key={ch.stage}
                className={`w-[7px] rounded-full transition-all duration-500 ${
                  i === idx ? "h-[22px] bg-aurora-bright shadow-[0_0_12px_#D9A1F5]" : "h-[7px] bg-white/15"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
