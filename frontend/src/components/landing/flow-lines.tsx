/**
 * Hero flow lines (Design Bible §19.4 v3.9): dashed connection paths curving
 * from the page edges toward the product window, each carrying a glowing
 * pulse that travels the path on loop — scattered tools flowing into Zero.
 * Pure SVG/SMIL, no libraries; hidden under reduced-motion.
 */

const PATHS: { d: string; color: string; dur: string; begin: string }[] = [
  { d: "M -20 140 C 300 80, 620 210, 980 330", color: "#7C3AED", dur: "6s", begin: "0s" },
  { d: "M -20 540 C 280 580, 640 480, 980 390", color: "#D97706", dur: "7.5s", begin: "-2.5s" },
  { d: "M 1460 90 C 1210 150, 1090 230, 1005 330", color: "#0E7490", dur: "6.8s", begin: "-4s" },
  { d: "M 1460 630 C 1260 570, 1110 480, 1005 400", color: "#7C3AED", dur: "8s", begin: "-1.2s" },
];

export function FlowLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden h-full w-full motion-reduce:hidden lg:block"
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {PATHS.map((p, i) => (
        <g key={i}>
          <path d={p.d} stroke={p.color} strokeOpacity=".22" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle r="4" fill={p.color} fillOpacity=".75">
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.d} />
          </circle>
          <circle r="8" fill={p.color} fillOpacity=".18">
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.d} />
          </circle>
        </g>
      ))}
    </svg>
  );
}
