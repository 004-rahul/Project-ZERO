import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useScrollVelocity } from "@/motion/hooks/useScrollVelocity";
import { cn } from "@/lib/cn";

/**
 * Ticker whose speed is coupled to scroll velocity, and whose direction
 * flips when you scroll back up.
 *
 * A marquee running at a constant rate is wallpaper. One that reacts to the
 * page makes the whole document feel like a single physical object — this is
 * the moment most visitors register the site as "well made" without being
 * able to say why.
 */
export function Marquee({
  children,
  baseSpeed = 28,
  className,
}: {
  children: React.ReactNode;
  baseSpeed?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const track = useRef<HTMLDivElement>(null);
  const { normalised } = useScrollVelocity();

  useAnimationFrame((_, delta) => {
    const el = track.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (!half) return;

    const v = normalised.get();
    // Scroll momentum adds to the base drift and can reverse it entirely.
    const speed = baseSpeed * (1 + v * 4);
    let next = x.get() - (speed * delta) / 1000;

    // Wrap on the duplicated half so the loop is seamless in both directions.
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div ref={track} style={{ x }} className="flex w-max">
        {children}
        {children}
      </motion.div>
    </div>
  );
}
