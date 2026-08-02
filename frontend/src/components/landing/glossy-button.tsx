import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing CTA (Design Bible §19.4 v3.5 — light): solid violet primary with a
 * sheen sweep on hover, quiet bordered ghost. 12px radius, no gradients.
 */
export function GlossyButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const cls =
    variant === "primary"
      ? "group relative block overflow-hidden rounded-lg bg-accent px-6 py-3 text-base font-bold text-white shadow-accent-glow transition-[background-color,box-shadow] duration-300 hover:bg-accent-strong hover:shadow-[0_8px_30px_rgba(124,58,237,.45)]"
      : "group relative block overflow-hidden rounded-lg border border-line-strong bg-card px-6 py-3 text-base font-semibold text-ink shadow-card transition-colors duration-300 hover:border-accent hover:text-accent";

  return (
    <Magnetic>
      <Link href={href} className={cls}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 opacity-0 blur-md group-hover:animate-sheen group-hover:opacity-100 motion-reduce:hidden"
        />
        {children}
      </Link>
    </Magnetic>
  );
}
