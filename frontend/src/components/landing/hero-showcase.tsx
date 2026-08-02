"use client";

import { useEffect, useRef, useState } from "react";
import { IconCite, IconLink, IconShield, IconZap } from "./icons";

/**
 * Hero showcase (Design Bible §19.4 v3.5 — light): a large self-running
 * product window — the question types itself, evidence chips snap in, the
 * answer streams, a confidence stamp lands — looping through three real
 * scenarios. Floating white satellite chips and dashed orbit rings give
 * depth; the assembly tilts subtly with the cursor. Static under
 * reduced-motion.
 */

interface Scene {
  q: string;
  ev: string[];
  a: string;
  conf: number;
}

const SCENES: Scene[] = [
  {
    q: "What did we decide about the mobile rewrite?",
    ev: ["GitHub · PR #482", "Slack · #eng-mobile", "Drive · Strategy v2.pdf"],
    a: "Approved May 12 — React Native over Flutter, two-phase rollout starting Q4.",
    conf: 87,
  },
  {
    q: "Why did Q3 shipping delays spike?",
    ev: ["Jira · OPS-1291", "Slack · #ops-alerts", "Notion · Q3 retro"],
    a: "Carrier API migration on Aug 4 silently dropped webhook events; cleared Sep 2.",
    conf: 78,
  },
  {
    q: "Who knows our billing system best?",
    ev: ["GitHub · contributors", "GitHub · review history", "Slack · #billing"],
    a: "Daniel R. — 61% of billing commits, reviewer on 9 of the last 10 PRs.",
    conf: 92,
  },
];

export function HeroShowcase() {
  const [typed, setTyped] = useState("");
  const [evChips, setEvChips] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [conf, setConf] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const sceneRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const s = SCENES[0];
      setTyped(s.q);
      setEvChips(s.ev);
      setAnswer(s.a);
      setConf(s.conf);
      return;
    }
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

    const play = () => {
      const s = SCENES[sceneRef.current % SCENES.length];
      sceneRef.current += 1;
      // previous answer stays visible while the next question types
      setTyped("");
      setThinking(false);
      for (let i = 1; i <= s.q.length; i++) later(() => setTyped(s.q.slice(0, i)), 300 + i * 26);
      const tThink = 300 + s.q.length * 26 + 200;
      later(() => {
        setThinking(true);
        setEvChips([]);
        setAnswer("");
        setConf(null);
      }, tThink);
      const tEv = tThink + 900;
      s.ev.forEach((_, i) => later(() => setEvChips(s.ev.slice(0, i + 1)), tEv + i * 280));
      const tAns = tEv + s.ev.length * 280 + 350;
      later(() => setThinking(false), tAns);
      for (let i = 1; i <= s.a.length; i++) later(() => setAnswer(s.a.slice(0, i)), tAns + i * 16);
      const tConf = tAns + s.a.length * 16 + 200;
      later(() => setConf(s.conf), tConf);
      later(play, tConf + 3400);
    };
    play();
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const onMove = (e: MouseEvent) => {
      const el = tiltRef.current;
      if (!el) return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `rotateY(${dx * 5}deg) rotateX(${dy * -4}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[640px] sm:h-[510px] [perspective:1400px]">
      {/* dashed orbit rings */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 hidden h-[130%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line-strong sm:block motion-reduce:animate-none"
        style={{ animation: "spin 70s linear infinite" }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 hidden h-[112%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/25 sm:block motion-reduce:animate-none"
        style={{ animation: "spin 48s linear infinite reverse" }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[.06] blur-2xl"
      />

      <div
        ref={tiltRef}
        className="relative h-full w-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      >
        {/* the product window */}
        <div className="absolute left-1/2 top-1/2 w-[94%] max-w-[620px] rounded-lg border border-line/70 bg-card shadow-[0_30px_90px_rgba(23,24,28,.14),0_2px_8px_rgba(23,24,28,.05)] [transform:translate(-50%,-50%)_translateZ(30px)]">
          <div className="flex items-center gap-2 rounded-t-lg border-b border-line/80 bg-cream px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="ml-2 text-2xs font-bold uppercase tracking-[.14em] text-muted">
              Zero — ask anything
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-2xs font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> live
            </span>
          </div>
          <div className="p-5">
            <div className="flex min-h-[42px] items-center rounded-lg border border-line bg-cream px-4 py-2.5 text-sm text-ink">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-glow-pulse bg-accent motion-reduce:hidden" />
            </div>
            <div className="mt-3 flex min-h-[30px] flex-wrap gap-2">
              {thinking && (
                <span className="inline-flex items-center gap-2 text-xs text-muted">
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-accent" />
                  searching organizational memory…
                </span>
              )}
              {evChips.map((chip) => (
                <span
                  key={chip}
                  className="animate-fade-up rounded-lg border border-line bg-cream px-2.5 py-1 text-xs font-medium text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-3 min-h-[63px] text-sm leading-relaxed text-ink">{answer}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700 [transition-timing-function:cubic-bezier(.2,.7,.2,1)]"
                  style={{ width: conf ? `${conf}%` : "0%" }}
                />
              </div>
              <span className="w-24 text-right text-xs font-bold text-muted">
                {conf ? `${conf}% · cited` : "confidence"}
              </span>
            </div>
          </div>
        </div>

        {/* floating satellites */}
        <div className="absolute left-0 top-8 hidden animate-floaty [transform:translateZ(70px)] sm:block motion-reduce:animate-none">
          <span className="flex items-center gap-2 rounded-lg border border-line/70 bg-card px-3 py-2 text-xs font-semibold text-ink shadow-lift">
            <IconLink className="h-4 w-4 text-accent" /> 40+ integrations
          </span>
        </div>
        <div
          className="absolute right-0 top-16 hidden animate-floaty [transform:translateZ(85px)] sm:block motion-reduce:animate-none"
          style={{ animationDelay: "-3s" }}
        >
          <span className="flex items-center gap-2 rounded-lg border border-line/70 bg-card px-3 py-2 text-xs font-semibold text-ink shadow-lift">
            <IconCite className="h-4 w-4 text-accent" /> Every claim cited
          </span>
        </div>
        <div
          className="absolute bottom-14 left-2 hidden animate-floaty [transform:translateZ(80px)] sm:block motion-reduce:animate-none"
          style={{ animationDelay: "-6s" }}
        >
          <span className="flex items-center gap-2 rounded-lg border border-line/70 bg-card px-3 py-2 text-xs font-semibold text-ink shadow-lift">
            <IconShield className="h-4 w-4 text-accent" /> Audit trail on
          </span>
        </div>
        <div
          className="absolute bottom-6 right-3 hidden animate-floaty [transform:translateZ(60px)] sm:block motion-reduce:animate-none"
          style={{ animationDelay: "-1.5s" }}
        >
          <span className="flex items-center gap-2 rounded-lg border border-line/70 bg-card px-3 py-2 text-xs font-semibold text-ink shadow-lift">
            <IconZap className="h-4 w-4 text-warning" /> 5-min setup
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
