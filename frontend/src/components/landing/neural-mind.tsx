"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NeuralMind — the auth-panel AI visual (Design Bible §19.1), modeled on the
 * classic wireframe-plexus brain: an anatomical side-profile (frontal lobe,
 * parietal crown, occipital, a DISTINCT cerebellum and brain stem) built
 * purely from dots and lines. The canvas fills the whole panel: ambient
 * bokeh particles drift and twinkle everywhere so no region is blank and
 * there is no visible bounding box. Story cycle — the organization's data
 * drifts as a mess, slowly gathers into the central brain, the brain works
 * (signals travel synapses, sparkles glint), then it releases and reforms.
 * Static (formed) under prefers-reduced-motion.
 */

type Cubic = [number, number, number, number, number, number, number, number];

/* Anatomical side-profile brain, facing left, in a 100×90 design space. */
const OUTLINE: Cubic[] = [
  [22, 60, 12, 58, 7, 50, 9, 41], // temporal front → forehead
  [9, 41, 4, 32, 10, 18, 22, 13], // frontal lobe bulge
  [22, 13, 30, 6, 45, 4, 55, 8], // crown front
  [55, 8, 63, 4, 76, 6, 83, 14], // crown back
  [83, 14, 91, 20, 93, 32, 89, 41], // occipital top
  [89, 41, 92, 47, 89, 53, 83, 55], // occipital lower
  [83, 55, 80, 56, 78, 57, 78, 59], // notch before cerebellum
  [78, 59, 86, 60, 87, 70, 79, 73], // cerebellum back
  [79, 73, 72, 76, 63, 74, 61, 67], // cerebellum belly
  [61, 67, 59, 70, 57, 73, 54, 78], // stem outer
  [54, 78, 51, 82, 46, 82, 45, 78], // stem tip
  [45, 78, 46, 74, 48, 71, 50, 68], // stem inner
  [50, 68, 42, 70, 32, 68, 26, 64], // temporal underside
  [26, 64, 24, 63, 23, 62, 22, 60], // close to start
];

/* Cortical folds + cerebellum striation — dotted chains. */
const FOLDS: Cubic[] = [
  [20, 30, 28, 20, 40, 22, 44, 32],
  [34, 46, 42, 36, 54, 38, 60, 48],
  [50, 16, 58, 10, 68, 14, 73, 24],
  [18, 46, 24, 40, 28, 44, 30, 52],
  [62, 32, 70, 26, 78, 30, 81, 40],
  [66, 68, 70, 64, 76, 64, 80, 68],
];

const evalCubic = (c: Cubic, t: number): [number, number] => {
  const u = 1 - t;
  const x = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
  const y = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
  return [x, y];
};

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function NeuralMind({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () =>
      setDims({ w: canvas.offsetWidth || 600, h: canvas.offsetHeight || 700 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dims) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = dims.w * dpr;
    const h = dims.h * dpr;
    canvas.width = w;
    canvas.height = h;

    /* brain placement: centered, upper-middle of the panel */
    const S = (Math.min(w, h) * 0.66) / 100; // px per design unit
    const bx = w / 2 - 50 * S;
    const by = h * 0.42 - 45 * S;
    const X = (x: number) => bx + x * S;
    const Y = (y: number) => by + y * S;

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
      kind: 0 | 1 | 2;
      ph: number;
    }
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const nodes: Neuron[] = [];
    const push = (tx: number, ty: number, kind: 0 | 1 | 2) =>
      nodes.push({
        tx,
        ty,
        x: Math.random() * w,
        y: Math.random() * h,
        fx: 0,
        fy: 0,
        vx: rand(-0.28, 0.28) * dpr,
        vy: rand(-0.28, 0.28) * dpr,
        z: Math.random(),
        stag: Math.random(),
        kind,
        ph: Math.random() * 6.283,
      });

    /* contour dots — spaced by segment length so density stays even */
    for (const c of OUTLINE) {
      const len = Math.hypot(c[6] - c[0], c[7] - c[1]);
      const k = Math.max(2, Math.min(10, Math.round(len / 3.2)));
      for (let i = 0; i < k; i++) {
        const [x, y] = evalCubic(c, (i + 0.5) / k);
        push(X(x), Y(y), 0);
      }
    }
    for (const c of FOLDS) {
      for (let i = 0; i < 7; i++) {
        const [x, y] = evalCubic(c, (i + 0.5) / 7);
        push(X(x), Y(y), 1);
      }
    }
    let guard = 0;
    let interior = 0;
    while (interior < 68 && guard++ < 20000) {
      const x = bx + Math.random() * 100 * S;
      const y = by + Math.random() * 90 * S;
      if (ctx.isPointInPath(path, x, y)) {
        push(x, y, 2);
        interior++;
      }
    }

    /* ambient bokeh — free particles across the whole panel, never join */
    const ambient = Array.from({ length: 42 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.16, 0.16) * dpr,
      vy: rand(-0.16, 0.16) * dpr,
      r: rand(1, 4.6) * dpr,
      ph: Math.random() * 6.283,
      soft: Math.random() > 0.55,
    }));

    const edges: [number, number][] = [];
    const thr = 11 * S;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].tx - nodes[j].tx, nodes[i].ty - nodes[j].ty) < thr) edges.push([i, j]);
      }
    }
    const edgesAt = (n: number) => edges.filter((e) => e[0] === n || e[1] === n);

    const pulses = Array.from({ length: 7 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.8 + Math.random() * 0.6,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    let mode: "drift" | "gather" | "work" | "dissolve" = "drift";
    let modeT = 0;
    let phase = 0;
    let t = Math.random() * 100;
    let raf = 0;

    const wrap = (p: { x: number; y: number; vx: number; vy: number }) => {
      if (p.x < -12 * dpr) p.x = w + 10 * dpr;
      if (p.x > w + 12 * dpr) p.x = -10 * dpr;
      if (p.y < -12 * dpr) p.y = h + 10 * dpr;
      if (p.y > h + 12 * dpr) p.y = -10 * dpr;
    };

    const frame = () => {
      t += 0.016;
      modeT += 0.016;

      if (mode === "drift") {
        phase = 0;
        if (modeT >= 3) {
          for (const n of nodes) {
            n.fx = n.x;
            n.fy = n.y;
          }
          mode = "gather";
          modeT = 0;
        }
      } else if (mode === "gather") {
        phase = Math.min(1, modeT / 6.5);
        if (modeT >= 6.5) {
          mode = "work";
          modeT = 0;
        }
      } else if (mode === "work") {
        phase = 1;
        if (modeT >= 10) {
          for (const n of nodes) {
            n.vx = rand(-0.4, 0.4) * dpr;
            n.vy = rand(-0.4, 0.4) * dpr;
          }
          mode = "dissolve";
          modeT = 0;
        }
      } else {
        phase = 0;
        if (modeT >= 3) {
          mode = "drift";
          modeT = 0;
        }
      }

      ctx.clearRect(0, 0, w, h);

      /* ambient bokeh — always alive, whole panel */
      for (const a of ambient) {
        a.x += a.vx;
        a.y += a.vy;
        wrap(a);
        const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + a.ph);
        if (a.soft) {
          const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 3);
          g.addColorStop(0, `rgba(167,139,250,${0.16 * tw})`);
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.r * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.12 + 0.3 * tw;
          ctx.fillStyle = "#C4B5FD";
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      /* neurons: drift everywhere ↔ gather into the brain */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (mode === "drift" || mode === "dissolve") {
          n.x += n.vx;
          n.y += n.vy;
          wrap(n);
        } else if (mode === "gather") {
          const q = easeInOut(Math.min(1, Math.max(0, (phase * 1.4 - n.stag * 0.4) / 1)));
          const amp = n.kind === 2 ? 1.8 : 0.7;
          n.x = n.fx + (n.tx - n.fx) * q + Math.sin(t * 1.1 + n.ph) * amp * dpr * q;
          n.y = n.fy + (n.ty - n.fy) * q + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr * q;
        } else {
          const amp = n.kind === 2 ? 1.8 : 0.7;
          n.x = n.tx + Math.sin(t * 1.1 + n.ph) * amp * dpr;
          n.y = n.ty + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr;
        }
        flash[i] = Math.max(0, flash[i] - 0.02);
      }

      /* random glints on the formed brain (the reference's sparkles) */
      if (mode === "work" && Math.random() < 0.05) {
        flash[Math.floor(Math.random() * nodes.length)] = 0.9;
      }

      /* synapses assemble with the brain */
      const lineA = easeInOut(phase) * easeInOut(phase);
      if (lineA > 0.02) {
        for (const [a, b] of edges) {
          const na = nodes[a];
          const nb = nodes[b];
          const boost = na.kind === 0 && nb.kind === 0 ? 2 : 1;
          ctx.strokeStyle = `rgba(167,139,250,${(0.05 + 0.08 * ((na.z + nb.z) / 2)) * lineA * boost})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      /* working signals */
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
            p.speed = 0.8 + Math.random() * 0.6;
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

      /* neurons */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        const base = n.kind === 0 ? 1.9 : n.kind === 1 ? 1.5 : 1.25;
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
        ctx.globalAlpha = (n.kind === 0 ? 0.62 : 0.45) + 0.32 * n.z + 0.3 * f;
        ctx.fillStyle = f > 0.3 ? "#E9D5FF" : "#A78BFA";
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
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
  }, [dims]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
      role="img"
      aria-label="Zero — from scattered data to a working brain"
    />
  );
}
