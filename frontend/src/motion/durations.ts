/**
 * Duration scale, in seconds (the unit `motion` expects).
 *
 * The brief is explicit that slow animations make a site feel sluggish, and
 * that is the most common way a "premium" attempt fails. These values are
 * deliberately at the fast end — the perception of quality comes from the
 * easing curve and from what moves, not from how long it takes.
 *
 * Rule of thumb: if a user is waiting for an animation to finish before they
 * can act, it is too slow regardless of how good it looks.
 */

export const duration = {
  /** Instant feedback — colour, opacity, border on hover. */
  instant: 0.12,
  /** Micro-interactions — icon travel, small transforms. */
  fast: 0.24,
  /** The default. Hover lifts, card transitions, most reveals. */
  base: 0.4,
  /** Entrances that need to be noticed — hero elements, section reveals. */
  slow: 0.65,
  /** Large surfaces and cinematic moments only. Use rarely. */
  cinematic: 1.0,
} as const;

/**
 * Stagger delays between children in a sequence.
 *
 * A stagger long enough to notice consciously is too long. These read as one
 * gesture arriving with texture, not as items appearing one at a time.
 */
export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * Scroll-reveal threshold — how far into the viewport an element is before
 * it animates. Too low and things animate offscreen; too high and the user
 * sees the un-animated state first, which is worse than no animation.
 */
export const viewport = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -12% 0px",
} as const;
