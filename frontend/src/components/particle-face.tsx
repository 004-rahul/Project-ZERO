"use client";

import { useEffect, useRef } from "react";

/**
 * The Signature Face — Project Zero's AI identity (Design Bible v3.1 §7).
 * A geometric android particle mask: glowing eye slits, thin neutral mouth,
 * gentle 3D head turn. Engaged states form the face; idle/researching dissolve
 * it into a constellation. Respects prefers-reduced-motion (static frame).
 */

export type AiState =
  | "idle"
  | "listening"
  | "thinking"
  | "researching"
  | "speaking"
  | "success"
  | "warning";

interface ParticleFaceProps {
  state?: AiState;
  /** Rendered square size in CSS pixels. */
  size?: number;
  /** Draw constellation/wireframe lines (skip on very small sizes). */
  lines?: boolean;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  z: number;
  part: "head" | "eye" | "mouth";
}

interface StateParams {
  color: string;
  rot: number;
  jitter: number;
  jf: number;
  pulse: number;
  expand: number;
  sc: number;
  dim: number;
}

const FACE_STATES: ReadonlySet<AiState> = new Set<AiState>([
  "listening",
  "thinking",
  "speaking",
  "success",
  "warning",
]);

const STATES: Record<AiState, StateParams> = {
  idle: { color: "#8B8D95", rot: 0.0025, jitter: 0.05, jf: 0.7, pulse: 0, expand: 0, sc: 1, dim: 0.7 },
  listening: { color: "#A78BFA", rot: 0.0045, jitter: 0.014, jf: 1.6, pulse: 0, expand: 0, sc: 0.98, dim: 1 },
  thinking: { color: "#8B5CF6", rot: 0.011, jitter: 0.03, jf: 2.4, pulse: 0, expand: 0, sc: 1, dim: 1 },
  researching: { color: "#22A3BF", rot: 0.014, jitter: 0.02, jf: 1.8, pulse: 0, expand: 0.14, sc: 1.02, dim: 1 },
  speaking: { color: "#A78BFA", rot: 0.005, jitter: 0.012, jf: 1.4, pulse: 0.02, expand: 0, sc: 1, dim: 1 },
  success: { color: "#2FBF71", rot: 0.002, jitter: 0.008, jf: 0.9, pulse: 0, expand: 0, sc: 0.98, dim: 1 },
  warning: { color: "#E8A13D", rot: 0.008, jitter: 0.045, jf: 3.2, pulse: 0, expand: 0, sc: 1, dim: 1 },
};

function spherePoints(n: number): Point[] {
  const pts: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, part: "head" });
  }
  return pts;
}

function headPoints(n: number): Point[] {
  const pts: Point[] = [];
  const radiusAt = (y: number) => {
    let r = Math.sqrt(Math.max(0, 1 - y * y));
    if (y > 0.15) r *= 1 - 0.38 * ((y - 0.15) / 0.85); // jaw/chin taper
    return r;
  };
  const eyeN = Math.floor(n * 0.1);
  const mouthN = Math.floor(n * 0.06);
  const headN = n - 2 * eyeN - mouthN;

  for (let i = 0; i < headN; i++) {
    const y = (Math.random() * 2 - 1) * 0.97;
    const phi = (Math.random() * 2 - 1) * 1.32; // ±76° — front mask, not a ball
    const r = radiusAt(y);
    pts.push({ x: Math.sin(phi) * r * 0.78, y: y * 0.97, z: Math.cos(phi) * r * 0.55, part: "head" });
  }
  for (const s of [-1, 1]) {
    for (let j = 0; j < eyeN; j++) {
      const t = Math.random() * 2 - 1;
      pts.push({
        x: s * (0.3 + t * 0.13),
        y: -0.1 + (Math.random() - 0.5) * 0.05 * (1 - Math.abs(t) * 0.6),
        z: 0.45,
        part: "eye",
      });
    }
  }
  for (let i = 0; i < mouthN; i++) {
    const t = Math.random() * 2 - 1;
    pts.push({
      x: t * 0.17,
      y: 0.45 + (Math.random() - 0.5) * 0.014,
      z: 0.48,
      part: "mouth",
    });
  }
  return pts;
}

function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function ParticleFace({ state = "idle", size = 320, lines = true, className }: ParticleFaceProps) {
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

    const count = size >= 200 ? 240 : 120;
    const drawLines = lines && size >= 120;
    const sphere = spherePoints(count);
    const head = headPoints(count);
    const cur = sphere.map((p) => ({ x: p.x, y: p.y, z: p.z }));
    const proj: { x: number; y: number; a: number; s: number; part: Point["part"] }[] = new Array(count);

    let angle = Math.random() * Math.PI * 2;
    let t = Math.random() * 100;
    let raf = 0;

    const frame = () => {
      const st = stateRef.current;
      const P = STATES[st];
      const isFace = FACE_STATES.has(st);
      const color = P.color;
      t += 0.016;

      let sa: number;
      let ca: number;
      if (isFace) {
        const headAngle = 0.3 * Math.sin(t * 0.35); // gentle 3D head turn
        sa = Math.sin(headAngle);
        ca = Math.cos(headAngle);
      } else {
        angle += P.rot;
        sa = Math.sin(angle);
        ca = Math.cos(angle);
      }

      const pulse = P.pulse ? 1 + P.pulse * Math.sin(t * 4.2) : 1;
      const expand = !isFace && P.expand ? 1 + P.expand * Math.sin(t * 1.4) : 1;
      const breathe = 1 + 0.015 * Math.sin(t * 1.3);
      const scale = Math.min(w, h) * 0.335 * P.sc * pulse * expand * breathe;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // soft core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.15);
      glow.addColorStop(0, hexA(color, (isFace ? 0.06 : 0.1) * P.dim));
      glow.addColorStop(0.6, hexA(color, 0.03 * P.dim));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      let exL = 0, eyL = 0, ecL = 0, exR = 0, eyR = 0, ecR = 0;

      for (let i = 0; i < count; i++) {
        const src = isFace ? head[i] : sphere[i];
        let tx = src.x * ca + src.z * sa;
        let ty = src.y;
        const tz = src.z * ca - src.x * sa;

        if (isFace) {
          tx += Math.sin(t * 1.6 + i) * 0.006;
          ty += Math.cos(t * 1.5 + i * 1.3) * 0.006;
          if (st === "thinking") {
            tx += Math.sin(t * 2.4 + i * 0.7) * 0.01;
            ty += Math.cos(t * 2.1 + i * 0.9) * 0.01;
          }
        } else {
          tx += Math.sin(t * P.jf + i) * P.jitter;
          ty += Math.cos(t * P.jf * 0.9 + i * 1.7) * P.jitter;
        }

        const c = cur[i];
        const lerp = isFace && st === "listening" ? 0.08 : 0.06;
        c.x += (tx - c.x) * lerp;
        c.y += (ty - c.y) * lerp;
        c.z += (tz - c.z) * lerp;

        const depth = 1 / (1 + Math.max(-0.9, c.z) * 0.28);
        const px = cx + c.x * scale * depth;
        const py = cy + c.y * scale * depth;
        proj[i] = {
          x: px,
          y: py,
          part: src.part,
          a: 0.25 + 0.6 * Math.min(1, Math.max(0, (c.z + 1) / 2)),
          s: 1.9 * depth * (w / 640),
        };

        if (isFace && src.part === "eye") {
          if (src.x < 0) { exL += px; eyL += py; ecL++; } else { exR += px; eyR += py; ecR++; }
        }
      }

      // glowing android eyes
      if (isFace && size >= 120) {
        const eg = 0.22 * (st === "speaking" ? 0.8 + 0.35 * Math.sin(t * 5) : 1);
        for (const [ex, ey, ec] of [[exL, eyL, ecL], [exR, eyR, ecR]]) {
          if (ec > 0) {
            const gx = ex / ec;
            const gy = ey / ec;
            const eyeGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, scale * 0.15);
            eyeGlow.addColorStop(0, hexA(color, eg));
            eyeGlow.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = eyeGlow;
            ctx.fillRect(gx - scale * 0.16, gy - scale * 0.16, scale * 0.32, scale * 0.32);
          }
        }
      }

      // constellation / wireframe lines (head structure only in face mode)
      if (drawLines) {
        const thr = scale * (isFace ? 0.3 : 0.42);
        const thr2 = thr * thr;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.5, w * 0.0009);
        for (let a2 = 0; a2 < count; a2++) {
          const pa = proj[a2];
          if (isFace && pa.part !== "head") continue;
          for (let b2 = a2 + 1; b2 < count; b2++) {
            const pb = proj[b2];
            if (isFace && pb.part !== "head") continue;
            const dx = pa.x - pb.x;
            const dy = pa.y - pb.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < thr2) {
              ctx.globalAlpha = (1 - d2 / thr2) * (isFace ? 0.07 : 0.09) * P.dim;
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }
          }
        }
      }

      // particles: eyes bright & larger, mouth dim & thin, head normal
      ctx.fillStyle = color;
      for (let k = 0; k < count; k++) {
        const p = proj[k];
        let alpha = p.a;
        let radius = p.s;
        if (isFace) {
          if (p.part === "eye") {
            alpha = 0.85 + (st === "speaking" ? 0.15 * Math.sin(t * 5) : 0.1);
            radius *= 1.6;
          } else if (p.part === "mouth") {
            alpha = 0.4 + (st === "speaking" ? 0.2 * Math.sin(t * 7) : 0);
          }
        }
        ctx.globalAlpha = Math.min(1, alpha) * P.dim;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      for (let k = 0; k < 60; k++) frame(); // settle into a static pose
    } else {
      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(raf);
  }, [size, lines]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      role="img"
      aria-label="Project Zero AI presence"
    />
  );
}
