import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { springs } from "@/motion/easings";
import { cn } from "@/lib/cn";

/**
 * A Decision Brief, rendered as the real product surface.
 *
 * This is the single most important component on the landing page. A B2B
 * platform whose site never shows its own interface reads as a template no
 * matter how good the typography is — specificity is what proves the thing
 * exists. Real file paths, a real confidence number, a real audit line.
 *
 * It tilts toward the cursor in perspective. The tilt is small (≈7°) and
 * spring-damped: enough to make the panel feel like an object with a
 * position in space, not so much that it becomes a gimmick.
 */

const EVIDENCE = [
  { src: "payments-api", path: "docs/adr/0042-idempotency.md", line: "L18–34" },
  { src: "payments-api", path: "src/billing/RetryPolicy.cs", line: "L91" },
  { src: "#eng-platform", path: "thread · 14 Mar", line: "9 replies" },
  { src: "linear", path: "PLAT-2291 · Duplicate charges", line: "closed" },
];

export function DecisionBrief({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, springs.pointer);
  const sy = useSpring(py, springs.pointer);

  const rotateY = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{ perspective: 1400 }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-xl border border-line-strong bg-surface"
      >
        {/* Specular top edge. On a near-black ground a panel needs a lit edge
            to sit above the page rather than look like a hole cut in it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-line-subtle px-5 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-second" />
            <p className="truncate font-mono text-2xs tracking-wide text-text-faint">
              DECISION BRIEF · DB-0417
            </p>
          </div>
          <span className="shrink-0 rounded border border-line-subtle px-2 py-0.5 font-mono text-2xs text-text-faint">
            2 min ago
          </span>
        </div>

        {/* the question */}
        <div className="px-5 pt-5">
          <p className="font-mono text-2xs tracking-[0.14em] text-text-faint uppercase">Question</p>
          <p className="mt-2 text-[15px] leading-snug text-text-muted">
            Why did we not add idempotency keys to the refund endpoint?
          </p>
        </div>

        {/* the answer — the largest thing in the panel, because it is the point */}
        <div className="px-5 pt-5">
          <p className="font-mono text-2xs tracking-[0.14em] text-accent-contrast uppercase">
            Recommendation
          </p>
          <p className="mt-2 text-[17px] leading-[1.45] font-medium text-text">
            It was deferred, not rejected. ADR-0042 accepted the risk while
            refund volume was low; PLAT-2291 shows that assumption broke in
            March. Re-open it before the billing migration.
          </p>
        </div>

        {/* confidence — stated honestly, including that it is not certainty */}
        <div className="mt-5 px-5">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-2xs tracking-[0.14em] text-text-faint uppercase">
              Confidence
            </p>
            <p className="font-mono text-sm text-text tabular">0.78</p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-sunken">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-second"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.78 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </div>

        {/* evidence — the differentiator, so it gets real paths */}
        <div className="mt-5 px-5 pb-5">
          <p className="font-mono text-2xs tracking-[0.14em] text-text-faint uppercase">
            Evidence · 4 sources
          </p>
          <ul className="mt-2.5 flex flex-col gap-1">
            {EVIDENCE.map((e, i) => (
              <motion.li
                key={e.path}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 -mx-2 transition-colors duration-200 hover:bg-surface-raised"
              >
                <span className="shrink-0 font-mono text-2xs text-second">{e.src}</span>
                <span className="truncate font-mono text-2xs text-text-muted">{e.path}</span>
                <span className="ml-auto shrink-0 font-mono text-2xs text-text-faint tabular">
                  {e.line}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* audit + actions */}
        <div className="flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-3">
          <p className="truncate font-mono text-2xs text-text-faint">
            claude-opus · prompt v12 · 4.1s
          </p>
          <div className="flex shrink-0 gap-1.5">
            <button className="rounded border border-line-subtle px-2.5 py-1 font-mono text-2xs text-text-muted transition-colors duration-150 hover:border-line-strong hover:text-text">
              Reject
            </button>
            <button className="rounded bg-accent px-2.5 py-1 font-mono text-2xs text-text-on-accent transition-colors duration-150 hover:bg-accent-hover">
              Approve
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
