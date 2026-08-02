"use client";

import { useEffect, useRef } from "react";
import type { AiState } from "@/components/particle-face";

/**
 * The Zero Orb — Project Zero's AI presence on public surfaces (Design Bible
 * §19.4): a glossy energy core with rotating scan arcs and orbiting motes.
 * Every state has its own full animation:
 *   idle       — slow breathing, calm arcs
 *   listening  — violet rings ripple outward from the core
 *   thinking / researching — arcs accelerate + a radial scan sweep rotates
 *   speaking   — a ring of equalizer bars pulses around the core
 *   success    — green bloom ring; warning — amber jitter
 * Static single frame under prefers-reduced-motion.
 */

interface OrbParams {
  color: string;
  arcSpeed: number;
  moteSpeed: number;
  pulse: number;
  ripples?: boolean;
  scan?: boolean;
  bars?: boolean;
  bloom?: boolean;
  jitter?: number;
}

const STATES: Record<AiState, OrbParams> = {
  idle: { color: "#7C3AED", arcSpeed: 0.35, moteSpeed: 0.25, pulse: 0.03 },
  listening: { color: "#8B5CF6", arcSpeed: 0.55, moteSpeed: 0.35, pulse: 0.05, ripples: true },
  thinking: { color: "#6D28D9", arcSpeed: 1.9, moteSpeed: 1.4, pulse: 0.04, scan: true },
  researching: { color: "#0E7490", arcSpeed: 1.6, moteSpeed: 1.2, pulse: 0.04, scan: true },
  speaking: { color: "#7C3AED", arcSpeed: 0.6, moteSpeed: 0.4, pulse: 0.02, bars: true },
  success: { color: "#16A34A", arcSpeed: 0.3, moteSpeed: 0.2, pulse: 0.05, bloom: true },
  warning: { color: "#D97706", arcSpeed: 1.2, moteSpeed: 0.9, pulse: 0.06, jitter: 1.6 },
};

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function AiOrb({
  state = "idle",
  size = 200,
  variant = "light",
  className,
}: {
  state?: AiState;
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<AiState>(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size * dpr;
    const h = size * dpr;
    canvas.width = w;
    canvas.height = h;

    const dark = variant === "dark";
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.155;
    const MOTES = Array.from({ length: 11 }, (_, i) => ({
      a: (i / 11) * Math.PI * 2,
      r: R * (1.9 + (i % 3) * 0.28),
      s: 0.7 + (i % 4) * 0.16,
      sz: (1.4 + (i % 3) * 0.7) * dpr,
    }));

    let t = Math.random() * 100;
    let arcRot = Math.random() * Math.PI * 2;
    let scanRot = 0;
    let raf = 0;

    const frame = () => {
      const P = STATES[stateRef.current] ?? STATES.idle;
      const c = P.color;
      t += 0.016;
      arcRot += 0.016 * P.arcSpeed;
      scanRot += 0.016 * 2.4;

      const jx = P.jitter ? (Math.random() - 0.5) * P.jitter * dpr : 0;
      const jy = P.jitter ? (Math.random() - 0.5) * P.jitter * dpr : 0;
      const breathe = 1 + P.pulse * Math.sin(t * 2.2);
      const r = R * breathe;

      ctx.clearRect(0, 0, w, h);

      /* halo */
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
      halo.addColorStop(0, hexA(c, dark ? 0.34 : 0.22));
      halo.addColorStop(0.55, hexA(c, dark ? 0.1 : 0.06));
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      /* listening ripples — expand outward and fade */
      if (P.ripples) {
        for (let k = 0; k < 3; k++) {
          const p = ((t * 0.55 + k / 3) % 1 + 1) % 1;
          const rr = r + p * (w * 0.32);
          ctx.globalAlpha = (1 - p) * 0.4;
          ctx.strokeStyle = c;
          ctx.lineWidth = 1.6 * dpr;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      /* success bloom — one calm ring */
      if (P.bloom) {
        const p = ((t * 0.4) % 1 + 1) % 1;
        ctx.globalAlpha = (1 - p) * 0.45;
        ctx.strokeStyle = c;
        ctx.lineWidth = 2.2 * dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, r + p * (w * 0.26), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* scan sweep — searching */
      if (P.scan) {
        const g = ctx.createConicGradient
          ? ctx.createConicGradient(scanRot, cx, cy)
          : null;
        if (g) {
          g.addColorStop(0, hexA(c, 0.28));
          g.addColorStop(0.12, "rgba(0,0,0,0)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* speaking bars — radial equalizer */
      if (P.bars) {
        const N = 26;
        ctx.strokeStyle = c;
        ctx.lineWidth = 2.2 * dpr;
        ctx.lineCap = "round";
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2;
          const len = (0.16 + 0.14 * Math.abs(Math.sin(t * 6 + i * 1.7))) * r;
          const r0 = r * 1.32;
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
          ctx.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len));
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      /* rotating scan arcs */
      const arcs: [number, number, number, number][] = [
        [r * 1.55, arcRot, 1.25 * Math.PI, 0.55],
        [r * 1.85, -arcRot * 0.7 + 1.2, 0.85 * Math.PI, 0.4],
        [r * 2.2, arcRot * 0.45 + 2.6, 0.55 * Math.PI, 0.28],
      ];
      for (const [ar, start, span, alpha] of arcs) {
        ctx.strokeStyle = hexA(c, alpha);
        ctx.lineWidth = 1.8 * dpr;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(cx + jx, cy + jy, ar, start, start + span);
        ctx.stroke();
      }

      /* orbiting motes */
      for (const m of MOTES) {
        const a = m.a + t * P.moteSpeed * m.s;
        const px = cx + Math.cos(a) * m.r;
        const py = cy + Math.sin(a) * m.r * 0.62;
        ctx.globalAlpha = 0.35 + 0.4 * ((Math.sin(a) + 1) / 2);
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(px, py, m.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* the core — glossy energy sphere */
      const core = ctx.createRadialGradient(
        cx - r * 0.3 + jx,
        cy - r * 0.35 + jy,
        r * 0.1,
        cx + jx,
        cy + jy,
        r,
      );
      core.addColorStop(0, "rgba(255,255,255,.95)");
      core.addColorStop(0.35, hexA(c, 0.85));
      core.addColorStop(1, hexA(c, dark ? 0.55 : 0.7));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx + jx, cy + jy, r, 0, Math.PI * 2);
      ctx.fill();

      /* specular highlight */
      ctx.fillStyle = "rgba(255,255,255,.5)";
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.32 + jx, cy - r * 0.42 + jy, r * 0.3, r * 0.16, -0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      frame();
    } else {
      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, [size, variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      role="img"
      aria-label="Zero — AI presence"
    />
  );
}
