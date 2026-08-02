"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleFace, type AiState } from "@/components/particle-face";
import { AURORA_FACE } from "./aurora";

/**
 * In-page live demo (Design Bible §19.4): visitors try the product before
 * connecting anything. A scripted client-side run over a synthetic sample
 * workspace — question types itself, the face moves through its AI states,
 * evidence cards land, the answer streams, confidence fills. Honest label:
 * sample data, no backend.
 */

interface DemoQA {
  q: string;
  a: string;
  ev: [string, string][];
  conf: number;
}

const QA: DemoQA[] = [
  {
    q: "What did we decide about the mobile rewrite?",
    a: "Approved on May 12 — React Native over Flutter, two-phase rollout starting Q4. Owned by the platform team.",
    ev: [
      ["GitHub", "PR #482 — RFC: mobile rewrite"],
      ["Slack", "#eng-mobile — decision thread"],
      ["Drive", "Mobile Strategy v2.pdf"],
    ],
    conf: 87,
  },
  {
    q: "Why did Q3 shipping delays spike?",
    a: "Root cause: the carrier API migration on Aug 4 silently dropped webhook events. Backlog cleared Sep 2.",
    ev: [
      ["Jira", "OPS-1291 — webhook incident"],
      ["Slack", "#ops-alerts — Aug 4"],
      ["Notion", "Q3 operations retro"],
    ],
    conf: 78,
  },
  {
    q: "Who knows our billing system best?",
    a: "Daniel R. — 61% of billing-service commits and reviewer on 9 of the last 10 billing pull requests.",
    ev: [
      ["GitHub", "billing-service contributors"],
      ["GitHub", "review history"],
      ["Slack", "#billing activity"],
    ],
    conf: 92,
  },
];

export function LiveDemo() {
  const [face, setFace] = useState<AiState>("idle");
  const [status, setStatus] = useState("Pick a question — the AI answers with proof.");
  const [typed, setTyped] = useState("");
  const [evidence, setEvidence] = useState<[string, string][]>([]);
  const [answer, setAnswer] = useState("");
  const [conf, setConf] = useState<number | null>(null);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const run = (qa: DemoQA) => {
    if (busy.current) return;
    busy.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setTyped("");
    setEvidence([]);
    setAnswer("");
    setConf(null);
    setFace("listening");
    setStatus("Listening…");

    const typeMs = reduced ? 0 : qa.q.length * 17 + 250;
    if (reduced) setTyped(qa.q);
    else for (let i = 1; i <= qa.q.length; i++) later(() => setTyped(qa.q.slice(0, i)), i * 17);

    later(() => {
      setFace("thinking");
      setStatus("Searching organizational memory…");
    }, typeMs);

    const evStart = typeMs + (reduced ? 0 : 1300);
    later(() => setStatus("Evidence found — reasoning…"), evStart);
    qa.ev.forEach((e, i) =>
      later(() => setEvidence((prev) => [...prev, e]), evStart + (reduced ? 0 : i * 260)),
    );

    const ansStart = evStart + (reduced ? 0 : qa.ev.length * 260 + 520);
    later(() => {
      setFace("speaking");
      setStatus("Answering…");
    }, ansStart);
    if (reduced) later(() => setAnswer(qa.a), ansStart);
    else for (let i = 1; i <= qa.a.length; i++) later(() => setAnswer(qa.a.slice(0, i)), ansStart + i * 15);

    const doneAt = ansStart + (reduced ? 0 : qa.a.length * 15 + 100);
    later(() => {
      setConf(qa.conf);
      setFace("success");
      setStatus("Answer complete. Every claim carries its proof.");
    }, doneAt);
    later(() => {
      setFace("idle");
      busy.current = false;
    }, doneAt + 1700);
  };

  return (
    <div className="relative mx-auto mt-12 grid max-w-3xl grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-white/[.03] shadow-[0_40px_110px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,255,255,.06),transparent_60%)] md:grid-cols-[200px_1fr]">
      <div className="relative grid place-items-center border-b border-white/[.07] bg-[radial-gradient(circle_at_50%_45%,rgba(197,95,214,.13),transparent_70%)] p-4 md:border-b-0 md:border-r">
        <ParticleFace state={face} size={170} lines={false} palette={AURORA_FACE} />
      </div>

      <div className="relative p-7">
        <p className="mb-4 text-xs text-on-dark-muted">
          <span className="mr-1.5 text-aurora-amber">●</span>
          {status}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {QA.map((qa) => (
            <button
              key={qa.q}
              type="button"
              onClick={() => run(qa)}
              className="rounded-full border border-white/[.13] bg-white/5 px-3.5 py-2 text-sm text-on-dark-muted shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition-all duration-200 hover:border-aurora-bright hover:text-on-dark hover:shadow-[0_4px_18px_rgba(197,95,214,.35)]"
            >
              {qa.q}
            </button>
          ))}
        </div>

        <div className="flex gap-2.5">
          <input
            value={typed}
            readOnly
            placeholder="Ask about your organization…"
            aria-label="Demo question"
            className="min-w-0 flex-1 rounded-full border border-white/[.13] bg-black/30 px-5 py-3 text-base text-on-dark shadow-[inset_0_2px_6px_rgba(0,0,0,.4)] outline-none transition-colors placeholder:text-on-dark-muted/60 focus:border-aurora-bright"
          />
          <span className="rounded-full bg-gradient-to-br from-aurora-strong to-aurora-pink px-5 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)]">
            Ask
          </span>
        </div>

        {evidence.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {evidence.map(([src, title]) => (
              <div
                key={title}
                className="animate-fade-up rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-on-dark-muted"
              >
                <span className="mb-1 block text-2xs font-extrabold uppercase tracking-[.14em] text-aurora-bright">
                  {src}
                </span>
                {title}
              </div>
            ))}
          </div>
        )}

        {answer && <p className="mt-4 text-md leading-relaxed text-on-dark">{answer}</p>}

        {conf !== null && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aurora-magenta to-aurora-amber transition-[width] duration-1000 [transition-timing-function:cubic-bezier(.2,.7,.2,1)]"
                style={{ width: `${conf}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-on-dark-muted">
              {conf}% · {conf >= 85 ? "High" : "Medium"} confidence — sources cited above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
