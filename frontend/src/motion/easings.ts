/**
 * Easing curves — the single source of feel.
 *
 * Mirrored in styles/index.css so a CSS transition and a JS animation never
 * disagree about how the product moves. If you need a curve that is not
 * here, add it here first; an inline cubic-bezier in a component is a defect.
 *
 * The brief asks for "premium, not template". Most of that impression comes
 * from ONE decision: a fast start that settles gently, never a symmetric
 * ease-in-out. Symmetric easing is what makes an animation read as default.
 */

/** The signature curve. Fast out, long settle. Default for anything a user
 *  triggers — hovers, reveals, panel transitions. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Symmetric and decisive. For things that move BOTH ways under one gesture:
 *  accordions, drawers, layout shifts. */
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

/** Slight overshoot. Reserved for elements that should feel physical —
 *  magnetic buttons, drag release. Overshoot on text reads as cheap. */
export const easeSpring = [0.34, 1.4, 0.64, 1] as const;

/** No overshoot, very long tail. For large surfaces where any bounce would
 *  read as unstable — full-bleed images, hero media, section backgrounds. */
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

/** Exit curve. Things leaving should accelerate away, not settle. */
export const easeInQuart = [0.5, 0, 0.75, 0] as const;

/** Spring configs for `motion` — preferred over duration-based easing for
 *  anything following a pointer, where a fixed duration always lags. */
export const springs = {
  /** Pointer-following: magnetic buttons, cursor parallax. */
  pointer: { stiffness: 260, damping: 32, mass: 0.6 },
  /** UI elements settling into place. */
  settle: { stiffness: 200, damping: 26, mass: 0.9 },
  /** Heavy, deliberate — large panels. */
  weighted: { stiffness: 120, damping: 24, mass: 1.4 },
} as const;
