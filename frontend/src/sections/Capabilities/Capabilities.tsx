import { motion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { easeOutExpo } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";
import { cn } from "@/lib/cn";

/**
 * BENTO.
 *
 * The previous version was six identical cards on a rail — same size, same
 * shape, same internal structure. Uniformity is the giveaway: a designer
 * varies weight because some claims matter more than others, and a template
 * cannot.
 *
 * So cells differ in span *and in kind*: one holds a live queue, one holds a
 * config diff, one is a single number, one is a list. Each earns its size.
 * The section also opens on a two-column editorial header rather than the
 * mono-eyebrow-then-heading pattern used everywhere else.
 */

function Cell({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease: easeOutExpo, delay }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-line-subtle bg-surface p-6 transition-colors duration-500 hover:border-line-strong",
        className,
      )}
    >
      {/* Light arriving from the pointer-facing corner. One gradient, no
          extra DOM, and it costs nothing to composite. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, var(--accent-subtle), transparent 60%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-2xs tracking-[0.14em] text-text-faint uppercase">{children}</p>
);

export function Capabilities() {
  return (
    <section id="capabilities" className="relative border-t border-line-subtle py-28 md:py-36">
      <Container>
        {/* Editorial header — the claim on the left, the qualifier on the
            right, no eyebrow. Deliberately not the pattern used elsewhere. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-text lg:col-span-7">
            Six things that are true here
            <br />
            <span className="text-text-faint">and not true of an assistant.</span>
          </h2>
          <p className="max-w-[38ch] self-end text-base leading-relaxed text-text-muted lg:col-span-4 lg:col-start-9">
            None of these are features you enable. They are properties of how
            the platform is built, which is why a wrapper cannot add them later.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[repeat(4,minmax(0,auto))]">
          {/* ── wide: the queue, because it is the positioning ── */}
          <Cell className="md:col-span-4 md:row-span-2">
            <Label>The surface</Label>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-text">
              It opens on what needs deciding.
            </h3>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-text-muted">
              Not an empty text box waiting for you to think of a question.
            </p>

            <ul className="mt-6 flex flex-col gap-2">
              {[
                { t: "Refund idempotency was deferred, not rejected", m: "4 sources · 0.78", hot: true },
                { t: "Three services still read the legacy billing table", m: "7 sources · 0.71" },
                { t: "Q3 retro raised the same on-call gap as Q2", m: "5 sources · 0.66" },
              ].map((row, i) => (
                <motion.li
                  key={row.t}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: easeOutExpo }}
                  className="flex items-center gap-3 rounded-lg border border-line-subtle bg-surface-sunken px-3.5 py-3 transition-colors duration-200 hover:border-line-strong"
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      row.hot ? "bg-second" : "bg-line-strong",
                    )}
                  />
                  <span className="truncate text-sm text-text">{row.t}</span>
                  <span className="ml-auto shrink-0 font-mono text-2xs text-text-faint tabular">
                    {row.m}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Cell>

          {/* ── tall: provider switch as a config diff ── */}
          <Cell className="md:col-span-2 md:row-span-2" delay={0.06}>
            <Label>Provider agnostic</Label>
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-text">
              Switching models is a config change.
            </h3>
            <div className="mt-5 overflow-hidden rounded-lg border border-line-subtle bg-surface-sunken font-mono text-2xs">
              <div className="border-b border-line-subtle px-3 py-2 text-text-faint">
                tenant.config
              </div>
              <div className="px-3 py-2.5">
                <p className="text-danger/80">- provider: anthropic</p>
                <p className="text-success">+ provider: local/llama</p>
                <p className="mt-2 text-text-faint">memory: unchanged</p>
                <p className="text-text-faint">evidence: unchanged</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Your memory does not belong to whichever model answered last week.
            </p>
          </Cell>

          {/* ── the number ── */}
          <Cell className="md:col-span-2" delay={0.1}>
            <Label>Isolation</Label>
            <p className="mt-4 text-[2.6rem] leading-none font-semibold tracking-[-0.045em] text-text tabular">
              0
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Cross-tenant reads permitted. Enforced in the query layer, proven
              by a suite that runs on every merge.
            </p>
          </Cell>

          {/* ── export ── */}
          <Cell className="md:col-span-2" delay={0.14}>
            <Label>Memory you own</Label>
            <h3 className="mt-3 text-base font-semibold tracking-[-0.015em] text-text">
              One endpoint, everything you put in.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Documents, decisions, evidence, approvals — in a documented
              format. No lock-in you cannot walk away from.
            </p>
          </Cell>

          {/* ── audit ── */}
          <Cell className="md:col-span-2" delay={0.18}>
            <Label>Auditable</Label>
            <ul className="mt-4 flex flex-col gap-1.5 font-mono text-2xs text-text-muted">
              {["who asked", "what was retrieved", "which model", "what was answered", "who approved"].map(
                (x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="h-px w-3 bg-accent" />
                    {x}
                  </li>
                ),
              )}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Searchable and permanent.
            </p>
          </Cell>
        </div>
      </Container>
    </section>
  );
}
