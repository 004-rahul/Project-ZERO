import { motion } from "motion/react";
import { easeInOutQuart } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";
import { cn } from "@/lib/cn";

/**
 * Clip-path wipe.
 *
 * Content is uncovered rather than faded in. A fade says "this appeared";
 * a wipe says "this was always here and is being shown to you" — which is
 * much of the difference in feel between a template and a designed page,
 * and it costs exactly the same.
 *
 * Directions exist because a wipe should travel with the reading order:
 * left for text blocks, up for media.
 *
 * ── Why every value carries a unit ──────────────────────────────────────
 * Motion interpolates `clip-path` by parsing each inset value into a number
 * plus a unit and tweening them pairwise. Mixing a bare `0` with a `100%` in
 * the same property means one side parses as unitless and the other as a
 * percentage, and the interpolation fails at animation time — in the browser
 * only, which is why it survives a server render and a type check.
 *
 * So: all four values are always percentages, and the open state is written
 * out per direction rather than shared. Do not "simplify" `0%` to `0` here.
 */

const CLOSED = {
  left: "inset(0% 100% 0% 0%)",
  up: "inset(100% 0% 0% 0%)",
} as const;

const OPEN = {
  left: "inset(0% 0% 0% 0%)",
  up: "inset(0% 0% 0% 0%)",
} as const;

export function MaskReveal({
  children,
  className,
  from = "left",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "up";
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ clipPath: CLOSED[from] }}
      whileInView={{ clipPath: OPEN[from] }}
      viewport={viewport}
      transition={{ duration: duration.cinematic, ease: easeInOutQuart, delay }}
    >
      {children}
    </motion.div>
  );
}
