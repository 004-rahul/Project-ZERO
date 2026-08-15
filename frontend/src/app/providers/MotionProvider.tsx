import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { easeOutExpo } from "@/motion/easings";
import { duration } from "@/motion/durations";

/**
 * One place that decides how the product moves, and one place that turns it
 * off. Reduced motion is handled here and in the base stylesheet — never
 * per component, which is how a component eventually forgets.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", !!reduced);
  }, [reduced]);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: duration.base, ease: easeOutExpo }}
    >
      {children}
    </MotionConfig>
  );
}
