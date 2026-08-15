import { motion } from "motion/react";
import { easeOutExpo } from "@/motion/easings";
import { duration, stagger } from "@/motion/durations";
import { cn } from "@/lib/cn";

/**
 * Line-masked headline reveal — lines rise out from behind a clip edge
 * rather than fading in.
 *
 * Masking is the single technique that most separates considered motion from
 * a default fade: the text has somewhere to come *from*. Splitting by line
 * rather than by character is deliberate — per-character animation on a
 * headline is the most over-used effect on the web and reads as decoration.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: duration.cinematic,
              ease: easeOutExpo,
              delay: delay + i * stagger.loose,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
