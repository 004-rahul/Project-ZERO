"use client";

import { useEffect, useRef } from "react";

/**
 * Count-up stat: animates from 0 to `end` when scrolled into view
 * (Design Bible §15 — motion explains change; static under reduced-motion).
 */
export function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = `${end}${suffix}`;
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1400);
          el.textContent = `${Math.round(end * (1 - Math.pow(1 - p, 3)))}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
