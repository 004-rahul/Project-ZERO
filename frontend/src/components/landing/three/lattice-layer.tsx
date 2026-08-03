"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Client-only, viewport-gated mount for the R3F Knowledge Lattice: the WebGL
 * bundle is fetched on idle and the canvas only renders while its section is
 * on screen. Skipped entirely for reduced-motion and small screens so mobile
 * never pays for it (Design Bible §15.3 performance budget).
 */

const Lattice = dynamic(() => import("./lattice"), { ssr: false });

export function LatticeLayer({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 900) return;

    // requestIdleCallback is unavailable on Safari — fall back to a timer.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const start = () => setEnabled(true);
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 600);

    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden className={className ?? "pointer-events-none absolute inset-0"}>
      <Lattice tone={tone} />
    </div>
  );
}
