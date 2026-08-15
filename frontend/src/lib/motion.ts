/**
 * Motion tokens (Design Bible §15).
 *
 * One source of truth for every curve and duration on the marketing surface.
 * Durations are tiered by the JOB the animation is doing, not by taste:
 *
 *   micro      — the interface answering the cursor. Must feel instant.
 *   component  — an element taking its place. Fast enough to never be waited on.
 *   cinematic  — a deliberate, staged moment. Only the hero and section pivots.
 *
 * Everything here animates transform/opacity/filter only. Nothing in this file
 * may drive width, height, top, left or margin — those force layout on every
 * frame and are the usual cause of a "premium" page feeling cheap on a laptop.
 */

/* ── curves ──────────────────────────────────────────────────────────── */

/** Out-expo. The house curve: leaves hard, settles soft. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Out-quint — slightly less dramatic, for component-tier moves. */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;
/** In-out-quart, for scrubbed and reversible motion. */
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

/** Springs. Stiffer = more mechanical; heavier mass = more weight. */
export const SPRING = {
  /** Cursor-tracking: must keep up with the pointer without jitter. */
  pointer: { stiffness: 90, damping: 22, mass: 0.5 },
  /** Magnetic elements: snappier, returns cleanly to rest. */
  magnet: { stiffness: 260, damping: 20, mass: 0.6 },
  /** Scroll-linked parallax: heavy, so layers feel like they have depth. */
  scroll: { stiffness: 120, damping: 30, mass: 0.4 },
  /** Press feedback: very stiff, very short. */
  press: { stiffness: 520, damping: 26, mass: 0.4 },
} as const;

/* ── durations ───────────────────────────────────────────────────────── */

export const DUR = {
  micro: 0.18,
  microOut: 0.24,
  component: 0.55,
  componentSlow: 0.72,
  cinematic: 1.0,
  cinematicSlow: 1.35,
} as const;

/* ── viewport triggers ───────────────────────────────────────────────── */

/**
 * Fire when the element is meaningfully on screen, not when its first pixel
 * crosses the fold — that is what makes reveals feel late and janky.
 */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;
export const VIEWPORT_EARLY = { once: true, margin: "-5% 0px -5% 0px" } as const;

/* ── hero load timeline ──────────────────────────────────────────────── */

/**
 * Beats OVERLAP on purpose. Sequential animations read as a list of separate
 * events; overlapping them reads as one page coming alive. Each value is the
 * delay at which that beat *starts*, while the previous is still settling.
 */
export const HERO = {
  field: 0.0,
  panels: 0.14,
  headline: 0.26,
  sub: 0.52,
  cta: 0.66,
  rail: 0.8,
} as const;

/* ── responsive scaling ──────────────────────────────────────────────── */

/**
 * Mobile is not a smaller desktop. Travel distances that read as depth on a
 * 27" display read as things sliding around on a phone, so distances are
 * scaled rather than the animation being copied across.
 */
export const MOBILE_SCALE = 0.45;

export function scaleDistance(px: number, isMobile: boolean) {
  return isMobile ? Math.round(px * MOBILE_SCALE) : px;
}
