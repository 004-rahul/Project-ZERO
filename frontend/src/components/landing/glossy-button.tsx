import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing CTA (Design Bible §19.4 v3.3): solid Aurora accents, 12px radius,
 * specular top edge and a sheen sweep on hover — no gradients. Magnetic on
 * fine pointers.
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
      ? "group relative block overflow-hidden rounded-lg bg-aurora-strong px-6 py-3 text-base font-bold text-white shadow-[0_8px_28px_rgba(197,95,214,.4),inset_0_1px_0_rgba(255,255,255,.3)] transition-[background-color,box-shadow] duration-300 hover:bg-aurora-pink hover:shadow-[0_12px_40px_rgba(228,89,156,.5),inset_0_1px_0_rgba(255,255,255,.3)]"
      : "group relative block overflow-hidden rounded-lg border border-white/[.16] bg-white/5 px-6 py-3 text-base font-semibold text-on-dark shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-md transition-colors duration-300 hover:border-aurora-bright/70 hover:bg-white/[.08]";

  return (
    <Magnetic>
      <Link href={href} className={cls}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/20 opacity-0 blur-md group-hover:animate-sheen group-hover:opacity-100 motion-reduce:hidden"
        />
        {children}
      </Link>
    </Magnetic>
  );
}
