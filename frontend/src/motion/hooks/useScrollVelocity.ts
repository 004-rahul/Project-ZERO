import { useScroll, useSpring, useTransform, useVelocity } from "motion/react";

/**
 * Scroll velocity, smoothed.
 *
 * This is the single cheapest trick that separates a studio site from a
 * template: elements respond to how fast you are scrolling, not just to
 * where you are. A marquee that accelerates with the page, a card that
 * skews a degree under momentum — the page acquires weight.
 *
 * Kept deliberately subtle. Velocity coupling is very easy to overdo, and
 * once it is visible as an effect it has failed.
 */
export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const raw = useVelocity(scrollY);

  const smooth = useSpring(raw, { stiffness: 300, damping: 50, mass: 0.4 });

  /** -1..1, clamped. Direction and intensity of current scroll. */
  const normalised = useTransform(smooth, [-2500, 0, 2500], [-1, 0, 1], {
    clamp: true,
  });

  /** Small skew, in degrees. Apply to wide horizontal elements only. */
  const skew = useTransform(normalised, [-1, 1], [-2.2, 2.2]);

  return { velocity: smooth, normalised, skew };
}
