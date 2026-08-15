"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll (Design Bible §15).
 *
 * Lenis drives the real window scroll position, so `useScroll` and every
 * IntersectionObserver on the page keep working untouched — this is a feel
 * layer, not a scroll hijack. It is the single largest contributor to a page
 * reading as "premium" rather than "a website", because every scroll-linked
 * animation inherits the eased position for free.
 *
 * Deliberately DISABLED for:
 *  - prefers-reduced-motion — momentum is exactly what those users switched off
 *  - coarse pointers — native touch momentum is better than anything we can
 *    synthesise, and smoothing it adds input latency on the device least able
 *    to afford it
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      /* Exponential ease-out: catches up quickly, then settles without drift. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      /* Never smooth an actual touch gesture, even on a hybrid device. */
      syncTouch: false,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* In-page anchors must ride the same easing, or nav jumps feel unrelated
       to the rest of the page. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -84, duration: 1.15 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
