"use client";

import { useEffect, useRef } from "react";

/**
 * NeuralMind — the auth-screen AI visual (Design Bible §19.1).
 * The founder's concept, literally: an organization's data drifts around as
 * an aimless mess — then slowly gathers and organizes itself into a central
 * BRAIN that works (signals travel neuron to neuron), holds, gently
 * dissolves, and reforms. Dots and lines only — no drawn borders:
 * the contour is dots placed evenly ALONG the brain curve, the cortex folds
 * are dotted chains, the interior is filled with neurons.
 * Cycle: drift 2.5s → gather 6s → work 9s → dissolve 2.5s.
 * Static (formed) under prefers-reduced-motion.
 */

type Cubic = [number, number, number, number, number, number, number, number];

/* Side-profile brain outline (facing left) in a 100×80 design space. */
const OUTLINE: Cubic[] = [
  [16, 52, 6, 50, 4, 40, 10, 33],
  [10, 33, 6, 24, 14, 13, 27, 11],
  [27, 11, 36, 5, 52, 4, 62, 8],
  [62, 8, 76, 4, 89, 12, 91, 26],
  [91, 26, 96, 34, 94, 46, 86, 51],
  [86, 51, 90, 57, 86, 66, 75, 67],
  [75, 67, 70, 73, 60, 73, 57, 66],
  [57, 66, 50, 70, 40, 69, 33, 64],
  [33, 64, 26, 66, 18, 60, 16, 52],
];

/* Cortex folds — dotted chains inside the shape. */
const FOLDS: Cubic[] = [
  [26, 34, 34, 24, 46, 26, 52, 35],
  [38, 48, 48, 39, 60, 41, 68, 50],
  [54, 16, 64, 12, 74, 18, 79, 27],
];

const evalCubic = (c: Cubic, t: number): [number, number] => {
  const u = 1 - t;
  const x = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
  const y = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
  return [x, y];
};

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function NeuralMind({ size = 340, className }: { size?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const s = (w * 0.9) / 100;
    const ox = w * 0.05;
    const oy = h * 0.5 - 40 * s;
    const X = (x: number) => ox + x * s;
    const Y = (y: number) => oy + y * s;

    /* Path2D for interior sampling only — never drawn */
    const path = new Path2D();
    path.moveTo(X(OUTLINE[0][0]), Y(OUTLINE[0][1]));
    for (const c of OUTLINE) path.bezierCurveTo(X(c[2]), Y(c[3]), X(c[4]), Y(c[5]), X(c[6]), Y(c[7]));
    path.closePath();

    interface Neuron {
      tx: number;
      ty: number;
      x: number;
      y: number;
      fx: number;
      fy: number;
      vx: number;
      vy: number;
      z: number;
      stag: number;
      kind: 0 | 1 | 2; // 0 contour · 1 fold · 2 interior
      ph: number;
    }
    const nodes: Neuron[] = [];
    const push = (tx: number, ty: number, kind: 0 | 1 | 2) =>
      nodes.push({
        tx,
        ty,
        x: Math.random() * w,
        y: Math.random() * h,
        fx: 0,
        fy: 0,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
        z: Math.random(),
        stag: Math.random(),
        kind,
        ph: Math.random() * 6.283,
      });

    /* contour dots — evenly along every outline segment */
    for (const c of OUTLINE) {
      for (let k = 0; k < 10; k++) {
        const [x, y] = evalCubic(c, (k + 0.5) / 10);
        push(X(x) + (Math.random() - 0.5) * dpr, Y(y) + (Math.random() - 0.5) * dpr, 0);
      }
    }
    /* fold dots */
    for (const c of FOLDS) {
      for (let k = 0; k < 8; k++) {
        const [x, y] = evalCubic(c, (k + 0.5) / 8);
        push(X(x), Y(y), 1);
      }
    }
    /* interior neurons */
    let guard = 0;
    let interior = 0;
    while (interior < 80 && guard++ < 20000) {
      const x = ox + Math.random() * 100 * s;
      const y = oy + Math.random() * 80 * s;
      if (ctx.isPointInPath(path, x, y)) {
        push(x, y, 2);
        interior++;
      }
    }

    const edges: [number, number][] = [];
    const thr = w * 0.1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].tx - nodes[j].tx, nodes[i].ty - nodes[j].ty) < thr) edges.push([i, j]);
      }
    }
    const edgesAt = (n: number) => edges.filter((e) => e[0] === n || e[1] === n);

    const pulses = Array.from({ length: 8 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.8 + Math.random() * 0.7,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    /* the story: drift → gather → work → dissolve */
    let mode: "drift" | "gather" | "work" | "dissolve" = "drift";
    let modeT = 0;
    let phase = 0;
    let t = Math.random() * 100;
    let raf = 0;
    const cx = w / 2;
    const cy = h / 2;

    const frame = () => {
      t += 0.016;
      modeT += 0.016;

      if (mode === "drift") {
        phase = 0;
        if (modeT >= 2.5) {
          for (const n of nodes) {
            n.fx = n.x;
            n.fy = n.y;
          }
          mode = "gather";
          modeT = 0;
        }
      } else if (mode === "gather") {
        phase = Math.min(1, modeT / 6);
        if (modeT >= 6) {
          mode = "work";
          modeT = 0;
        }
      } else if (mode === "work") {
        phase = 1;
        if (modeT >= 9) {
          for (const n of nodes) {
            n.vx = (Math.random() - 0.5) * 0.5 * dpr;
            n.vy = (Math.random() - 0.5) * 0.5 * dpr;
          }
          mode = "dissolve";
          modeT = 0;
        }
      } else {
        phase = 0;
        if (modeT >= 2.5) {
          mode = "drift";
          modeT = 0;
        }
      }

      ctx.clearRect(0, 0, w, h);
      const sway = mode === "work" ? 0.025 * Math.sin(t * 0.4) : 0;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sway);
      ctx.translate(-cx, -cy);

      /* neuron positions */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (mode === "drift" || mode === "dissolve") {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 4 * dpr || n.x > w - 4 * dpr) n.vx *= -1;
          if (n.y < 4 * dpr || n.y > h - 4 * dpr) n.vy *= -1;
        } else if (mode === "gather") {
          const q = easeInOut(Math.min(1, Math.max(0, (phase * 1.4 - n.stag * 0.4) / 1)));
          const amp = n.kind === 2 ? 2 : 0.9;
          n.x = n.fx + (n.tx - n.fx) * q + Math.sin(t * 1.1 + n.ph) * amp * dpr * q;
          n.y = n.fy + (n.ty - n.fy) * q + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr * q;
        } else {
          const amp = n.kind === 2 ? 2 : 0.9;
          n.x = n.tx + Math.sin(t * 1.1 + n.ph) * amp * dpr;
          n.y = n.ty + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr;
        }
        flash[i] = Math.max(0, flash[i] - 0.025);
      }

      /* synapses fade in as the brain gathers */
      const lineA = easeInOut(phase) * easeInOut(phase);
      if (lineA > 0.02) {
        for (const [a, b] of edges) {
          const na = nodes[a];
          const nb = nodes[b];
          const boost = na.kind === 0 && nb.kind === 0 ? 1.9 : 1;
          ctx.strokeStyle = `rgba(167,139,250,${(0.05 + 0.08 * ((na.z + nb.z) / 2)) * lineA * boost})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      /* working signals — calm speed, soft trails */
      if (mode === "work") {
        for (const p of pulses) {
          p.t += 0.016 * p.speed;
          if (p.t >= 1) {
            const arrived = p.from === 0 ? edges[p.edge][1] : edges[p.edge][0];
            flash[arrived] = 1;
            const next = edgesAt(arrived);
            const pick = next[Math.floor(Math.random() * next.length)] ?? edges[p.edge];
            p.edge = edges.indexOf(pick);
            p.from = pick[0] === arrived ? 0 : 1;
            p.t = 0;
            p.speed = 0.8 + Math.random() * 0.7;
          }
          const [a, b] = edges[p.edge];
          const start = p.from === 0 ? nodes[a] : nodes[b];
          const end = p.from === 0 ? nodes[b] : nodes[a];
          const t0 = Math.max(0, p.t - 0.18);
          const x0 = start.x + (end.x - start.x) * t0;
          const y0 = start.y + (end.y - start.y) * t0;
          const x1 = start.x + (end.x - start.x) * p.t;
          const y1 = start.y + (end.y - start.y) * p.t;
          const trail = ctx.createLinearGradient(x0, y0, x1, y1);
          trail.addColorStop(0, "rgba(233,213,255,0)");
          trail.addColorStop(1, "rgba(233,213,255,.85)");
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2 * dpr;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          const g = ctx.createRadialGradient(x1, y1, 0, x1, y1, 5.5 * dpr);
          g.addColorStop(0, "rgba(245,235,255,.95)");
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x1, y1, 5.5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* neurons — contour dots heavier so the brain outline reads */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        const base = n.kind === 0 ? 2 : n.kind === 1 ? 1.6 : 1.3;
        const r = (base + 0.9 * n.z + f * 2.4) * dpr;
        if (f > 0.01) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          g.addColorStop(0, `rgba(233,213,255,${0.5 * f})`);
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        const restA = mode === "drift" || mode === "dissolve" ? 0.4 : 0.5;
        ctx.globalAlpha = (n.kind === 0 ? restA + 0.15 : restA) + 0.35 * n.z + 0.3 * f;
        ctx.fillStyle = f > 0.3 ? "#E9D5FF" : "#A78BFA";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      mode = "work";
      phase = 1;
      for (const n of nodes) {
        n.x = n.tx;
        n.y = n.ty;
      }
      frame();
    } else {
      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      role="img"
      aria-label="Zero — from scattered data to a working brain"
    />
  );
}
