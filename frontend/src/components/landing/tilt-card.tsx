"use client";

import { useRef, type ReactNode } from "react";

/**
 * 3D tilt card with a violet glare (Design Bible §19.4 v3.5 — light). White
 * card, hairline border, soft shadow that deepens on hover; inert on coarse
 * pointers and under prefers-reduced-motion.
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
    card.style.transform = `rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 7}deg)`;
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
      className={`group relative overflow-hidden rounded-lg border border-line bg-card p-6 shadow-card transition-[border-color,box-shadow] duration-300 will-change-transform [transform-style:preserve-3d] hover:border-accent/40 hover:shadow-lift ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(380px_circle_at_var(--gx,50%)_var(--gy,50%),rgba(124,58,237,.07),transparent_60%)]"
      />
      {children}
    </div>
  );
}
