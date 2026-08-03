"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AiState } from "@/components/particle-face";
import { AiOrb } from "./ai-orb";
import { DEMO_SCENES, type DemoScene } from "./content";
import { IconCite, IconShield } from "./icons";

/**
 * The Answer Engine (Design Bible §19.4) — the product surface itself, used
 * as the hero visual (auto-playing) and as the in-page trial (visitor-driven).
 * One shell, two drivers, so the marketing page and the demo can never drift
 * apart. Audit metadata is part of the design: the trust story is the UI.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

interface EngineState {
  question: string;
  phase: "idle" | "typing" | "thinking" | "evidence" | "answering" | "done";
  evidence: [string, string][];
  answer: string;
  conf: number | null;
}

const EMPTY: EngineState = { question: "", phase: "idle", evidence: [], answer: "", conf: null };

const PHASE_LABEL: Record<EngineState["phase"], string> = {
  idle: "Ready — ask anything about your organization",
  typing: "Receiving question",
  thinking: "Searching organizational memory",
  evidence: "Evidence located — reasoning",
  answering: "Composing answer",
  done: "Answer complete — every claim carries its proof",
};

/* ───────────────────────── presentational shell ───────────────────────── */

export function AnswerWindow({
  state,
  aiState,
  footer = true,
  children,
}: {
  state: EngineState;
  aiState: AiState;
  footer?: boolean;
  children?: React.ReactNode;
}) {
  const busy = state.phase === "thinking" || state.phase === "evidence";

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-card shadow-[0_1px_2px_rgba(20,20,25,.04),0_24px_70px_-20px_rgba(23,24,28,.22)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-cream/70 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-2xs font-black text-white">
          Z
        </span>
        <span className="pz-num text-2xs font-semibold tracking-wide text-muted">
          zero / workspace / ask
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-2xs font-semibold text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          tenant-isolated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[76px_1fr]">
        {/* presence rail */}
        <div className="relative hidden items-start justify-center border-r border-line bg-cream/40 py-5 sm:flex">
          <AiOrb state={aiState} size={52} variant="light" />
        </div>

        <div className="p-5">
          {/* question */}
          <div className="flex items-start gap-2.5 rounded-lg border border-line bg-cream/60 px-3.5 py-3">
            <span className="pz-num select-none pt-px text-sm font-bold text-accent">›</span>
            <p className="min-h-[20px] text-sm font-medium leading-snug text-ink">
              {state.question}
              {(state.phase === "typing" || state.phase === "idle") && (
                <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] animate-glow-pulse bg-accent align-middle motion-reduce:animate-none" />
              )}
            </p>
          </div>

          {/* status */}
          <div className="mt-3 flex items-center gap-2 text-2xs font-semibold uppercase tracking-[.14em] text-muted">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={busy ? { opacity: [1, 0.25, 1], scale: [1, 0.8, 1] } : { opacity: 1 }}
              transition={{ duration: 1.1, repeat: busy ? Infinity : 0, ease: "easeInOut" }}
            />
            {PHASE_LABEL[state.phase]}
          </div>

          {/* evidence */}
          <div className="mt-3 grid min-h-[52px] grid-cols-1 gap-2 sm:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {state.evidence.map(([src, title], i) => (
                <motion.div
                  key={`${src}-${title}`}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.02 }}
                  className="rounded-lg border border-line bg-cream/60 px-3 py-2"
                >
                  <span className="flex items-center gap-1.5 text-2xs font-extrabold uppercase tracking-[.12em] text-accent">
                    <IconCite className="h-3 w-3" />
                    {src}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{title}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* answer */}
          <p className="mt-3 min-h-[66px] text-base leading-relaxed text-ink">
            {state.answer}
            {state.phase === "answering" && (
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] bg-accent align-middle" />
            )}
          </p>

          {/* confidence */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: state.conf ? `${state.conf}%` : "0%" }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
            <span className="pz-num w-[132px] text-right text-2xs font-bold uppercase tracking-[.1em] text-muted">
              {state.conf ? `${state.conf}% · high · cited` : "confidence"}
            </span>
          </div>

          {children}
        </div>
      </div>

      {footer && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line bg-cream/70 px-4 py-2.5 text-2xs text-faint">
          <span className="pz-num">model: your-provider/latest</span>
          <span className="pz-num">prompt: v3.1</span>
          <span className="pz-num">latency: 1.2s</span>
          <span className="ml-auto flex items-center gap-1.5 font-semibold text-muted">
            <IconShield className="h-3 w-3" />
            logged to audit trail
          </span>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── shared script runner ───────────────────────── */

function useScriptRunner() {
  const [state, setState] = useState<EngineState>(EMPTY);
  const [aiState, setAiState] = useState<AiState>("idle");
  const timers = useRef<number[]>([]);
  const busy = useRef(false);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const run = useCallback(
    (scene: DemoScene, instant = false, onDone?: () => void) => {
      if (busy.current) return;
      busy.current = true;
      const at = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

      if (instant) {
        setState({
          question: scene.q,
          phase: "done",
          evidence: scene.ev,
          answer: scene.a,
          conf: scene.conf,
        });
        setAiState("success");
        busy.current = false;
        onDone?.();
        return;
      }

      setState({ ...EMPTY, phase: "typing" });
      setAiState("listening");

      /* type the question in small chunks — smooth, few renders */
      const step = 2;
      const chunks = Math.ceil(scene.q.length / step);
      for (let i = 1; i <= chunks; i++) {
        at(() => setState((s) => ({ ...s, question: scene.q.slice(0, i * step) })), 220 + i * 26);
      }
      const tTyped = 220 + chunks * 26 + 240;

      at(() => {
        setState((s) => ({ ...s, phase: "thinking" }));
        setAiState("thinking");
      }, tTyped);

      const tEv = tTyped + 900;
      at(() => setState((s) => ({ ...s, phase: "evidence" })), tEv);
      scene.ev.forEach((e, i) =>
        at(() => setState((s) => ({ ...s, evidence: [...s.evidence, e] })), tEv + i * 260),
      );

      const tAns = tEv + scene.ev.length * 260 + 420;
      at(() => {
        setState((s) => ({ ...s, phase: "answering" }));
        setAiState("speaking");
      }, tAns);
      const aChunks = Math.ceil(scene.a.length / 3);
      for (let i = 1; i <= aChunks; i++) {
        at(() => setState((s) => ({ ...s, answer: scene.a.slice(0, i * 3) })), tAns + i * 26);
      }

      const tDone = tAns + aChunks * 26 + 160;
      at(() => {
        setState((s) => ({ ...s, phase: "done", conf: scene.conf }));
        setAiState("success");
      }, tDone);
      at(() => {
        setAiState("idle");
        busy.current = false;
        onDone?.();
      }, tDone + 1500);
    },
    [],
  );

  return { state, aiState, run, clear, busyRef: busy };
}

/* ───────────────────────── hero: auto-playing ───────────────────────── */

export function AutoAnswer() {
  const { state, aiState, run } = useScriptRunner();
  const reduced = useReducedMotion();
  const idx = useRef(0);

  useEffect(() => {
    if (reduced) {
      run(DEMO_SCENES[0], true);
      return;
    }
    let cancelled = false;
    let hold: number;
    const cycle = () => {
      if (cancelled) return;
      const scene = DEMO_SCENES[idx.current % DEMO_SCENES.length];
      idx.current += 1;
      run(scene, false, () => {
        hold = window.setTimeout(cycle, 2600);
      });
    };
    cycle();
    return () => {
      cancelled = true;
      clearTimeout(hold);
    };
  }, [reduced, run]);

  return <AnswerWindow state={state} aiState={aiState} />;
}

/* ───────────────────────── demo: visitor-driven ───────────────────────── */

export function TryAnswer() {
  const { state, aiState, run, busyRef } = useScriptRunner();
  const [active, setActive] = useState<number | null>(null);

  return (
    <AnswerWindow state={state} aiState={aiState}>
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-2xs font-extrabold uppercase tracking-[.16em] text-faint">
          Pick a question — no signup, sample workspace
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_SCENES.map((scene, i) => (
            <motion.button
              key={scene.q}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              onClick={() => {
                if (busyRef.current) return;
                setActive(i);
                run(scene);
              }}
              className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                active === i
                  ? "border-accent bg-accent/[.06] text-ink"
                  : "border-line bg-cream/60 text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {scene.q}
            </motion.button>
          ))}
        </div>
      </div>
    </AnswerWindow>
  );
}
