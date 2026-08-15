import { motion, useTransform, type MotionValue } from "motion/react";
import { easeOutExpo } from "@/motion/easings";
import { cn } from "@/lib/cn";

/**
 * The visual half of the pinned section.
 *
 * The previous version was an abstract diagram — dots joined by curves.
 * Abstract diagrams are what a landing page uses when it has no product to
 * show, and they read that way. This shows the actual interface at each of
 * the four stages instead, in one panel that swaps its contents as you
 * scrub. The Decision Brief in the hero worked for exactly this reason.
 *
 * One panel, four states. Keeping the frame fixed while only the contents
 * change is what makes the sequence read as one system doing four things,
 * rather than four unrelated illustrations.
 */

const CONNECTORS = [
  { name: "payments-api", meta: "1,284 files", done: true },
  { name: "#eng-platform", meta: "6,102 messages", done: true },
  { name: "Linear · PLAT", meta: "418 issues", done: true },
  { name: "Notion · Eng", meta: "212 pages", done: false },
];

const MEMORY = [
  { k: "Documents indexed", v: "8,016" },
  { k: "Decisions recorded", v: "147" },
  { k: "Superseded, kept", v: "39" },
  { k: "Embedding model", v: "swappable" },
];

const RETRIEVED = [
  { p: "docs/adr/0042-idempotency.md", s: "0.91" },
  { p: "src/billing/RetryPolicy.cs", s: "0.86" },
  { p: "#eng-platform · 14 Mar", s: "0.79" },
  { p: "PLAT-2291", s: "0.74" },
];

function useStage(progress: MotionValue<number>, i: number, count: number) {
  const span = 1 / count;
  const start = i * span;
  const range = [start - span * 0.3, start + span * 0.14, start + span * 0.86, start + span * 1.3];
  return {
    opacity: useTransform(progress, range, [0, 1, 1, 0]),
    y: useTransform(progress, range, [16, 0, 0, -16]),
  };
}

const Row = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-lg bg-surface-sunken px-3.5 py-2.5",
      className,
    )}
  >
    {children}
  </div>
);

function Connect({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const s = useStage(progress, i, n);
  return (
    <motion.div style={s} className="absolute inset-0 flex flex-col gap-2">
      {CONNECTORS.map((c, k) => (
        <Row key={c.name}>
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              c.done ? "bg-second" : "bg-line-strong",
            )}
          />
          <span className="truncate font-mono text-2xs text-text">{c.name}</span>
          <span className="ml-auto shrink-0 font-mono text-2xs text-text-faint tabular">
            {c.meta}
          </span>
          {c.done ? (
            <span className="shrink-0 font-mono text-2xs text-second">synced</span>
          ) : (
            <motion.span
              className="shrink-0 font-mono text-2xs text-accent-contrast"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.1 }}
            >
              syncing
            </motion.span>
          )}
        </Row>
      ))}
    </motion.div>
  );
}

function Remember({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const s = useStage(progress, i, n);
  return (
    <motion.div style={s} className="absolute inset-0 grid grid-cols-2 gap-2">
      {MEMORY.map((m) => (
        <div key={m.k} className="flex flex-col justify-center rounded-lg bg-surface-sunken px-4 py-3">
          <span className="font-mono text-2xs tracking-[0.1em] text-text-faint uppercase">
            {m.k}
          </span>
          <span className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-text tabular">
            {m.v}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function Reason({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const s = useStage(progress, i, n);
  return (
    <motion.div style={s} className="absolute inset-0 flex flex-col gap-2">
      <Row className="bg-transparent px-0">
        <span className="font-mono text-2xs text-text-faint">retrieving · hybrid</span>
        <span className="ml-auto font-mono text-2xs text-text-faint tabular">4 of 20 kept</span>
      </Row>
      {RETRIEVED.map((r, k) => (
        <Row key={r.p}>
          <span className="truncate font-mono text-2xs text-text-muted">{r.p}</span>
          <span className="ml-auto shrink-0 font-mono text-2xs text-accent-contrast tabular">
            {r.s}
          </span>
          <span className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-surface-raised">
            <motion.span
              className="block h-full rounded-full bg-accent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: Number(r.s) }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: k * 0.08 }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </Row>
      ))}
    </motion.div>
  );
}

function Decide({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const s = useStage(progress, i, n);
  return (
    <motion.div style={s} className="absolute inset-0 flex flex-col">
      <span className="font-mono text-2xs tracking-[0.14em] text-second uppercase">
        Recommendation
      </span>
      <p className="mt-2.5 text-[15px] leading-snug font-medium text-text">
        It was deferred, not rejected. Re-open before the billing migration.
      </p>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-2xs text-text-faint">confidence</span>
          <span className="font-mono text-sm text-text tabular">0.78</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-surface-sunken">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-second"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 0.78 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeOutExpo }}
            style={{ transformOrigin: "left" }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="truncate font-mono text-2xs text-text-faint">
            4 sources · prompt v12
          </span>
          <div className="flex gap-1.5">
            <span className="rounded border border-line-subtle px-2 py-0.5 font-mono text-2xs text-text-muted">
              Reject
            </span>
            <span className="rounded bg-accent px-2 py-0.5 font-mono text-2xs text-text-on-accent">
              Approve
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function StageVisual({ progress, count }: { progress: MotionValue<number>; count: number }) {
  return (
    <div className="panel relative w-full max-w-[30rem] rounded-xl">
      <div className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-mono text-2xs tracking-wide text-text-faint">
          workspace · payments
        </span>
      </div>
      {/* Fixed height so the frame never resizes between stages — a panel
          that jumps size while scrubbing destroys the illusion of one
          continuous system. */}
      <div className="relative h-[13.5rem] p-4">
        <Connect progress={progress} i={0} n={count} />
        <Remember progress={progress} i={1} n={count} />
        <Reason progress={progress} i={2} n={count} />
        <Decide progress={progress} i={3} n={count} />
      </div>
    </div>
  );
}
