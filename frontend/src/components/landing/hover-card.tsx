import type { ReactNode } from "react";

/**
 * Landing card (Design Bible §19.4 v3.7): violet-tinted surface, no border
 * at rest — on hover it lifts, brightens to white, and gains a violet
 * hairline. Pure CSS; replaces the earlier 3D tilt.
 */
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-line/80 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
