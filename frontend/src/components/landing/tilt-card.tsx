"use client";

import { useRef, type ReactNode } from "react";

/**
 * 3D tilt card with a cursor-tracked glare (Design Bible §19.4). Pure CSS
 * transforms driven by mouse position; inert on coarse pointers and under
 * prefers-reduced-motion.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 12}deg)`;
    card.style.setProperty("--gx", `${px * 100}%`);
    card.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 will-change-transform [transform-style:preserve-3d] hover:border-aurora-bright/50 hover:shadow-[0_30px_80px_rgba(0,0,0,.6),0_0_40px_rgba(197,95,214,.15),inset_0_1px_0_rgba(255,255,255,.16)] ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,.14),transparent_55%)]"
      />
      {children}
    </div>
  );
}
