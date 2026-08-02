"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleFace, type AiState } from "@/components/particle-face";
import { LANDING_FACE } from "./aurora";

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
    <div className="relative mx-auto mt-12 grid max-w-4xl grid-cols-1 overflow-hidden rounded-lg bg-card shadow-lift md:grid-cols-[240px_1fr]">
      <div className="relative grid place-items-center border-b border-line/70 bg-warning/[.08] p-4 md:border-b-0 md:border-r">
        <ParticleFace state={face} size={210} lines={false} palette={LANDING_FACE} />
      </div>

      <div className="relative p-7">
        <p className="mb-4 text-xs text-muted">
          <span className="mr-1.5 text-accent">●</span>
          {status}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {QA.map((qa) => (
            <button
              key={qa.q}
              type="button"
              onClick={() => run(qa)}
              className="rounded-lg border border-line bg-cream px-3.5 py-2 text-sm text-muted transition-all duration-200 hover:border-accent hover:text-ink hover:shadow-card"
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
            className="min-w-0 flex-1 rounded-lg border border-line bg-cream px-5 py-3 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
          <span className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.35)]">
            Ask
          </span>
        </div>

        {evidence.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {evidence.map(([src, title]) => (
              <div
                key={title}
                className="animate-fade-up rounded-lg border border-line bg-cream p-3 text-xs text-muted"
              >
                <span className="mb-1 block text-2xs font-extrabold uppercase tracking-[.14em] text-accent-strong">
                  {src}
                </span>
                {title}
              </div>
            ))}
          </div>
        )}

        {answer && <p className="mt-4 text-md leading-relaxed text-ink">{answer}</p>}

        {conf !== null && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-1000 [transition-timing-function:cubic-bezier(.2,.7,.2,1)]"
                style={{ width: `${conf}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {conf}% · {conf >= 85 ? "High" : "Medium"} confidence — sources cited above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
