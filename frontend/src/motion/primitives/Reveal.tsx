import { motion } from "motion/react";
import { easeOutExpo } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal. Deliberately restrained: a short rise and an opacity change.
 *
 * No blur, no scale. Both are the tells of a template — blur is expensive and
 * reads as unfocused, and scaling text makes it visibly resample.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}
