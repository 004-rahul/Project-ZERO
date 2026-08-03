"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * AiIdentity — the mount for Project Zero's AI identity (Design Bible §7).
 *
 * The identity itself is WebGL (`three/mind-core.tsx`); this wrapper keeps it
 * off the critical path. three.js is fetched on idle, never during first load,
 * and reduced-motion visitors get the formed core rendered once instead of an
 * animation loop. Beneath the canvas sits an off-centre ambient wash so the
 * panel reads as lit even before WebGL arrives — deliberately oversized and
 * asymmetric so no circular edge is ever visible.
 */

const MindCore = dynamic(() => import("./three/mind-core"), { ssr: false });

export function AiIdentity({ className }: { className?: string }) {
  const [state, setState] = useState<"off" | "still" | "live">("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const start = () => setState(reduced ? "still" : "live");
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 500);

    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  return (
    <div
      className={className ?? "absolute inset-0"}
      role="img"
      aria-label="Zero — an intelligence core drawing scattered organisation data into one working mind"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(130%_95%_at_38%_34%,rgba(124,58,237,.20),rgba(34,211,238,.06)_46%,transparent_72%)]"
      />
      {state !== "off" && <MindCore still={state === "still"} />}
    </div>
  );
}
