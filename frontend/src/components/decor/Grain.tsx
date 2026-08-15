/**
 * Film grain. Strength comes from the theme (`--grain-opacity`), so a theme
 * that should not have grain sets it to zero rather than the component
 * guessing.
 *
 * Purpose: large flat fills and gradients band visibly on real displays.
 * A fine grain breaks the banding and is the difference between a fill that
 * looks printed and one that looks like a CSS gradient.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
      style={{
        opacity: "var(--grain-opacity)",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
