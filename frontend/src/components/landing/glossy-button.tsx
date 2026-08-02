import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./magnetic";

/**
 * Glossy CTA (Design Bible §19.4): gradient body with a specular top edge,
 * pressed-glass inner shadow, and a sheen sweep on hover. Magnetic on fine
 * pointers via the Magnetic wrapper.
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
      ? "group relative block overflow-hidden rounded-full bg-gradient-to-br from-aurora-strong to-aurora-pink px-6 py-3 text-base font-bold text-white shadow-[0_8px_32px_rgba(197,95,214,.45),inset_0_1px_0_rgba(255,255,255,.35),inset_0_-1px_0_rgba(0,0,0,.25)] transition-shadow duration-300 hover:shadow-[0_14px_48px_rgba(197,95,214,.6),inset_0_1px_0_rgba(255,255,255,.35),inset_0_-1px_0_rgba(0,0,0,.25)]"
      : "group relative block overflow-hidden rounded-full border border-white/[.18] bg-white/5 px-6 py-3 text-base font-semibold text-on-dark shadow-[inset_0_1px_0_rgba(255,255,255,.15)] backdrop-blur-md transition-colors duration-300 hover:border-aurora-bright/70";

  return (
    <Magnetic>
      <Link href={href} className={cls}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25 opacity-0 blur-md group-hover:animate-sheen group-hover:opacity-100 motion-reduce:hidden"
        />
        {children}
      </Link>
    </Magnetic>
  );
}
