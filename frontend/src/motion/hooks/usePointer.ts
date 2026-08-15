import { useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { springs } from "@/motion/easings";

/**
 * Normalised pointer position, spring-smoothed.
 * Returns -1..1 on both axes, centred on the viewport.
 *
 * Springs rather than durations: anything following a pointer with a fixed
 * duration always feels like it is lagging behind the cursor.
 */
export function usePointer() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springs.pointer);
  const sy = useSpring(y, springs.pointer);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  return { x: sx, y: sy };
}
