"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useSpotlight } from "./motion";
import { DUR, EASE_SOFT, SPRING } from "@/lib/motion";

/**
 * Visual kit — every look decision, made once.
 *
 * The page's material language is INSTRUMENTATION: hairlines and labelled
 * readouts rather than rounded marketing cards. So the defaults here are a
 * bare surface and a divided grid, and a "card" is the exception you reach for
 * deliberately, not the container everything lives in.
 */

const cx = (...v: (string | false | null | undefined)[]) => v.filter(Boolean).join(" ");

/* ── measure ─────────────────────────────────────────────────────────── */

/** Content measure. `wide` runs closer to the viewport for full-bleed work. */
export function Bound({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-5 sm:px-8 lg:px-14",
        wide ? "max-w-[1680px]" : "max-w-[1240px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Vertical rhythm lives here so no module invents its own spacing. */
export function Block({
  id,
  children,
  className,
  pad = "lg",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  pad?: "sm" | "lg" | "none";
}) {
  const p = pad === "none" ? "" : pad === "sm" ? "py-20 md:py-24" : "py-28 md:py-40";
  return (
    <section id={id} className={cx("relative", p, className)}>
      {children}
    </section>
  );
}

/* ── labels ──────────────────────────────────────────────────────────── */

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("pz-num text-2xs font-bold uppercase tracking-[.24em]", className)}>
      {children}
    </span>
  );
}

/** Readout: a labelled value pair, the page's core information unit. */
export function Readout({
  k,
  v,
  className,
}: {
  k: string;
  v: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <Label className="text-faint">{k}</Label>
      <span className="text-sm font-semibold text-ink">{v}</span>
    </div>
  );
}

export function Pulse({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <Label className="text-faint">{label}</Label>
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-line px-3 py-1 text-2xs font-bold uppercase tracking-[.14em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── surfaces ────────────────────────────────────────────────────────── */

/**
 * Bare instrument surface. No radius by default — squared corners and a
 * hairline read as equipment; rounded corners with a soft shadow read as a
 * marketing card, which is the look we are avoiding.
 */
export function Surface({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const reduced = useReducedMotion();
  const spot = useSpotlight();
  if (!interactive) {
    return (
      <div className={cx("relative border border-line bg-card/60", className)}>{children}</div>
    );
  }
  return (
    <motion.div
      ref={spot.ref}
      onMouseMove={reduced ? undefined : spot.onMouseMove}
      onMouseLeave={spot.onMouseLeave}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: DUR.microOut, ease: EASE_SOFT }}
      className={cx(
        "pz-card group relative overflow-hidden border border-line bg-card/60",
        "transition-colors duration-300 hover:border-accent/50",
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
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

/**
 * Divided grid — cells separated by hairlines instead of gaps. This is the
 * page's default way to show a set, because gaps make items float and rules
 * make them read as one measured instrument.
 */
export function Divided({
  children,
  cols = 3,
  className,
}: {
  children: ReactNode[];
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  const g = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return (
    <div className={cx("grid grid-cols-1 border-t border-line", g, className)}>
      {children.map((c, i) => (
        <div
          key={i}
          className="border-b border-line px-0 py-8 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
        >
          {c}
        </div>
      ))}
    </div>
  );
}

/* ── action ──────────────────────────────────────────────────────────── */

export function Action({
  children,
  href,
  variant = "solid",
  size = "md",
  icon,
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: "solid" | "line" | "bare";
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const pad = size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base";
  const look = {
    solid: "pz-sheen bg-accent text-void font-bold hover:bg-accent-bright",
    line: "border border-line-strong text-ink font-semibold hover:border-accent hover:text-accent",
    bare: "text-ink font-semibold hover:text-accent",
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
          "group inline-flex items-center gap-2 transition-colors duration-200",
          variant === "bare" ? "px-0 py-2" : pad,
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
