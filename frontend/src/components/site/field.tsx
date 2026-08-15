"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const Lattice = dynamic(() => import("@/components/landing/three/lattice"), { ssr: false });

/**
 * Field — ONE persistent backdrop for the entire page.
 *
 * A canvas per section is the usual approach and it is why those pages feel
 * like separate slides: each section announces its own effect. A single fixed
 * field that the content scrolls over does the opposite — it binds the
 * sections into one continuous space, and costs one WebGL context instead of
 * five.
 *
 * It stays out of first-load JS (idle-loaded, desktop-only, skipped for
 * reduced motion) and never renders above content.
 */
export function Field() {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* The field recedes as the reader descends: the page opens in the space and
     then leaves it behind, rather than the effect competing all the way down. */
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.35, 1], [0.85, 0.45, 0.22]), {
    stiffness: 60,
    damping: 24,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.18]), {
    stiffness: 50,
    damping: 26,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const start = () => setOn(true);
    const h = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 1400 })
      : window.setTimeout(start, 700);
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(h);
      else clearTimeout(h);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* the light the page sits in — present with or without WebGL */}
      <div className="absolute left-1/2 top-[-18%] h-[70vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-accent/[.07] blur-[160px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[55vh] w-[70vw] rounded-[50%] bg-second/[.05] blur-[150px]" />
      {on && (
        <motion.div
          className="absolute right-[-14%] top-[6%] h-[92vh] w-[92vh]"
          style={reduced ? undefined : { opacity, scale }}
        >
          <Lattice tone="light" />
        </motion.div>
      )}
    </div>
  );
}
