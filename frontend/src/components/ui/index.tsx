"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DrawRule, useSpotlight } from "@/components/motion";
import { DUR, EASE_SOFT, SPRING } from "@/lib/motion";

/**
 * UI kit. The design layer: every visual decision on the marketing surface is
 * made once here and consumed by name. Sections are then free to be about
 * COMPOSITION, which is the only way ten sections can each look distinct
 * without the page falling apart.
 *
 * Rule: sections may compose these freely but must not re-declare colours,
 * radii, borders or shadows. A hard-coded value in a section is a defect.
 */

const cx = (...v: (string | false | null | undefined)[]) => v.filter(Boolean).join(" ");

/* ── layout ──────────────────────────────────────────────────────────── */

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16", className)}>
      {children}
    </div>
  );
}

/**
 * Section wrapper. Owns the vertical rhythm and the top hairline so no section
 * invents its own spacing — the single biggest cause of a page reading as
 * assembled rather than designed.
 */
export function Section({
  id,
  children,
  className,
  tone = "base",
  rule = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "base" | "deep" | "raised";
  rule?: boolean;
}) {
  const bg = tone === "deep" ? "bg-zone-header" : tone === "raised" ? "bg-card/40" : "bg-cream";
  return (
    <section
      id={id}
      className={cx("relative overflow-hidden py-24 md:py-32", bg, className)}
    >
      {rule && <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line/70" />}
      {children}
    </section>
  );
}

/** Section marker: index numeral, drawn rule, wide-tracked label. */
export function Marker({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="pz-num text-2xs font-bold tracking-[.22em] text-accent">{index}</span>
      <DrawRule className="block h-px w-12 bg-accent/40" />
      <span className="text-2xs font-extrabold uppercase tracking-[.3em] text-muted">{label}</span>
    </div>
  );
}

/* ── typography ──────────────────────────────────────────────────────── */

export function Display({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "block text-[clamp(38px,5.6vw,76px)] font-black leading-[0.94] tracking-[-0.045em] text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("text-md leading-relaxed text-muted", className)}>{children}</p>;
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("pz-num text-2xs font-bold uppercase tracking-[.2em]", className)}>
      {children}
    </span>
  );
}

/* ── surfaces ────────────────────────────────────────────────────────── */

/**
 * Interactive surface. One cursor event drives four layers — lift, spotlight,
 * top-edge light, and any child marked `.pz-zoom` / `.pz-shift` — and they all
 * return together. A lone scale(1.05) is the tell of a template.
 */
export function Card({
  children,
  className,
  lift = true,
  as: Tag = "div",
  href,
}: {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  as?: "div" | "article" | "li";
  href?: string;
}) {
  const reduced = useReducedMotion();
  const spot = useSpotlight();
  const Motion = motion[Tag] as typeof motion.div;

  const body = (
    <Motion
      ref={spot.ref}
      onMouseMove={reduced ? undefined : spot.onMouseMove}
      onMouseLeave={spot.onMouseLeave}
      whileHover={lift && !reduced ? { y: -4 } : undefined}
      transition={{ duration: DUR.microOut, ease: EASE_SOFT }}
      className={cx(
        "pz-card group relative overflow-hidden rounded-lg border border-line-strong bg-card shadow-card",
        "transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-lift",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spot.background }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </Motion>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

/** Static panel — structure without the interaction cost. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-lg border border-line bg-card/70 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-2xs font-bold uppercase tracking-[.14em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Live indicator — the one place a pulse is justified. */
export function Pulse({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <Mono className="text-faint">{label}</Mono>
    </span>
  );
}

/* ── actions ─────────────────────────────────────────────────────────── */

/**
 * One button, three intents. Hover and press are both handled here so no
 * section ever hand-rolls a control: hover moves background and icon, press
 * gives a short stiff compression that makes it feel physical.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const pad = size === "sm" ? "px-4 py-2 text-sm" : "px-7 py-3.5 text-base";

  const look = {
    primary:
      "pz-sheen bg-accent text-void font-bold shadow-accent-glow hover:bg-accent-bright border border-transparent",
    ghost:
      "border border-line-strong bg-card/60 text-ink font-semibold hover:border-accent hover:text-accent",
    link: "text-ink font-semibold hover:text-accent underline-offset-8 hover:underline border border-transparent",
  }[variant];

  return (
    <motion.span
      className="inline-block"
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={SPRING.press}
    >
      <Link
        href={href}
        className={cx(
          "group inline-flex items-center gap-2 rounded-lg transition-colors duration-200",
          variant === "link" ? "px-1 py-2" : pad,
          look,
          className,
        )}
      >
        {children}
        {icon && (
          <span aria-hidden className="pz-travel">
            {icon}
          </span>
        )}
      </Link>
    </motion.span>
  );
}

/* ── structure ───────────────────────────────────────────────────────── */

/** Hairline that fades at both ends — a divider that does not box things in. */
export function Rule({ className }: { className?: string }) {
  return <span aria-hidden className={cx("pz-rule block w-full", className)} />;
}

/**
 * Divided grid. Cells are separated by hairlines rather than gaps, which is
 * what makes a spec table read as engineered instead of as floating boxes.
 */
export function Divided({
  children,
  cols = 4,
  className,
}: {
  children: ReactNode[];
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[
    cols
  ];
  return (
    <div className={cx("grid grid-cols-1 border-t border-line", grid, className)}>
      {children.map((child, i) => (
        <div key={i} className="border-b border-line px-1 py-7 sm:border-l sm:px-7 sm:first:border-l-0">
          {child}
        </div>
      ))}
    </div>
  );
}
