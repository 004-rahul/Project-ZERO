import { motion } from "motion/react";
import { easeInOutQuart } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";
import { cn } from "@/lib/cn";

/**
 * Clip-path wipe.
 *
 * Content is uncovered rather than faded in. A fade says "this appeared";
 * a wipe says "this was always here and is being shown to you" — which is
 * the difference in feel between a template and a designed page, and it
 * costs exactly the same.
 *
 * Directions exist because a wipe should travel with the reading order:
 * left for text blocks, up for media.
 */
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
  const closed =
    from === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";

  return (
    <motion.div
      className={cn(className)}
      initial={{ clipPath: closed }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={viewport}
      transition={{ duration: duration.cinematic, ease: easeInOutQuart, delay }}
    >
      {children}
    </motion.div>
  );
}
