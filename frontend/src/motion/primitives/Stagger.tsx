import { motion } from "motion/react";
import { easeOutExpo } from "@/motion/easings";
import { duration, stagger, viewport } from "@/motion/durations";
import { cn } from "@/lib/cn";

const parent = (gap: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

const child = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOutExpo },
  },
};

/** Wrap a group; each direct child arrives fractionally after the last. */
export function Stagger({
  children,
  className,
  gap = stagger.base,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={parent(gap)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={child}>
      {children}
    </motion.div>
  );
}
