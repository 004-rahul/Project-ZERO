/**
 * A technical grid that fades at the edges.
 *
 * Emits light rather than ink — an ink grid is invisible on a dark ground and
 * heavy on a light one, so it is drawn with the accent at very low alpha and
 * masked radially so it never reaches a hard edge.
 */
export function FieldLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(to right, color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--accent) 7%, transparent) 1px, transparent 1px)",
        backgroundSize: "78px 78px",
        maskImage: "radial-gradient(ellipse 72% 62% at 50% 38%, #000 28%, transparent 76%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 72% 62% at 50% 38%, #000 28%, transparent 76%)",
      }}
    />
  );
}
