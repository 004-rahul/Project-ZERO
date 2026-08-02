"use client";

import { useEffect, useRef } from "react";

/**
 * Custom landing cursor (Design Bible §19.4): a glowing dot with a trailing
 * ring that grows over interactive elements. Fine pointers only; disabled
 * entirely under prefers-reduced-motion (native cursor is kept).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.classList.add("pz-cursor");
    dot.style.display = "block";
    ring.style.display = "block";

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };
    const onOver = (e: MouseEvent) => {
      const hot = (e.target as Element | null)?.closest?.("a,button,input,[data-hot]");
      ring.classList.toggle("scale-[1.7]", Boolean(hot));
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.body.classList.remove("pz-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-aurora-bright/50 transition-transform duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora-bright shadow-[0_0_12px_#D9A1F5]"
      />
    </>
  );
}
