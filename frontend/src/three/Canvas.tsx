import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useTheme } from "@/app/providers/ThemeProvider";

const LatticeField = lazy(() => import("./scenes/LatticeField"));

/**
 * The only place three.js enters the app.
 *
 * Four gates before a single WebGL byte is fetched: the section must be on
 * screen, the browser must be idle, the viewport must be wide enough to
 * justify it, and the user must not have asked for reduced motion. This is
 * what keeps the scene out of the critical path — the page is fully usable
 * and fully readable if it never loads at all.
 */
export function Scene({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 900) return;

    const el = host.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const idle =
          "requestIdleCallback" in window
            ? window.requestIdleCallback
            : (cb: () => void) => setTimeout(cb, 200);
        idle(() => setActive(true));
      },
      { rootMargin: "200px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      {active && (
        <R3FCanvas
          // Remount on theme change so the shader picks up new scene colours.
          key={theme}
          camera={{ position: [0, 0, 11], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <Suspense fallback={null}>
            <LatticeField />
          </Suspense>
        </R3FCanvas>
      )}
    </div>
  );
}
