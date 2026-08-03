"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NeuralMind — the auth-panel AI brain (Design Bible §19.1), per the founder
 * brief (Demos/SS/Brain-Design.txt): an unmistakable anatomical brain —
 * hemispherical fissure over the crown, dense gyri folds, occipital curve,
 * distinct cerebellum and brainstem — rendered as a luxury neural
 * visualization: nodes and fine network lines colored along an
 * electric-blue → cyan → violet → purple → magenta ramp with sparse gold
 * accents, additive emissive bloom (pre-rendered glow sprites), a dimmer
 * inner contour layer for depth, and glowing pulses racing the pathways.
 * The animation cycle is unchanged: data drifts as a mess across the whole
 * panel → gathers slowly into the brain → works → dissolves → repeats.
 * Static (formed) under prefers-reduced-motion.
 */

type Cubic = [number, number, number, number, number, number, number, number];
type RGB = [number, number, number];

/* Anatomical side-profile brain, facing left, in a 100×90 design space. */
const OUTLINE: Cubic[] = [
  [22, 60, 12, 58, 7, 50, 9, 41],
  [9, 41, 4, 32, 10, 18, 22, 13],
  [22, 13, 30, 6, 45, 4, 55, 8],
  [55, 8, 63, 4, 76, 6, 83, 14],
  [83, 14, 91, 20, 93, 32, 89, 41],
  [89, 41, 92, 47, 89, 53, 83, 55],
  [83, 55, 80, 56, 78, 57, 78, 59],
  [78, 59, 86, 60, 87, 70, 79, 73],
  [79, 73, 72, 76, 63, 74, 61, 67],
  [61, 67, 59, 70, 57, 73, 54, 78],
  [54, 78, 51, 82, 46, 82, 45, 78],
  [45, 78, 46, 74, 48, 71, 50, 68],
  [50, 68, 42, 70, 32, 68, 26, 64],
  [26, 64, 24, 63, 23, 62, 22, 60],
];

/* Hemisphere fissure (first, brighter) + gyri + cerebellum striations. */
const GYRI: Cubic[] = [
  [20, 18, 36, 9, 62, 8, 82, 17], // longitudinal fissure over the crown
  [14, 36, 22, 26, 32, 28, 36, 38],
  [20, 50, 28, 42, 38, 44, 42, 54],
  [36, 24, 44, 16, 54, 18, 58, 28],
  [44, 42, 52, 32, 62, 34, 68, 44],
  [30, 56, 40, 50, 50, 52, 56, 60],
  [60, 18, 68, 12, 76, 16, 80, 26],
  [66, 46, 74, 38, 82, 42, 84, 50],
  [63, 66, 68, 62, 74, 62, 78, 66],
  [64, 70, 70, 67, 76, 67, 80, 70],
];

const evalCubic = (c: Cubic, t: number): [number, number] => {
  const u = 1 - t;
  const x = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
  const y = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
  return [x, y];
};

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* Luxury neural ramp: electric blue → cyan → violet → purple → magenta. */
const STOPS: [number, RGB][] = [
  [0, [56, 189, 248]],
  [0.28, [34, 211, 238]],
  [0.55, [139, 92, 246]],
  [0.78, [192, 38, 211]],
  [1, [228, 95, 188]],
];
const GOLD: RGB = [245, 158, 11];

function ramp(u: number): RGB {
  const x = Math.min(1, Math.max(0, u));
  for (let i = 1; i < STOPS.length; i++) {
    if (x <= STOPS[i][0]) {
      const [u0, c0] = STOPS[i - 1];
      const [u1, c1] = STOPS[i];
      const k = (x - u0) / (u1 - u0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * k),
        Math.round(c0[1] + (c1[1] - c0[1]) * k),
        Math.round(c0[2] + (c1[2] - c0[2]) * k),
      ];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

function glowSprite(rgb: RGB): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,.85)");
  gr.addColorStop(0.22, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.5)`);
  gr.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export function NeuralMind({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => setDims({ w: canvas.offsetWidth || 600, h: canvas.offsetHeight || 700 });
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

    const S = (Math.min(w, h) * 0.68) / 100;
    const bx = w / 2 - 50 * S;
    const by = h * 0.42 - 45 * S;
    const X = (x: number) => bx + x * S;
    const Y = (y: number) => by + y * S;

    const path = new Path2D();
    path.moveTo(X(OUTLINE[0][0]), Y(OUTLINE[0][1]));
    for (const c of OUTLINE) path.bezierCurveTo(X(c[2]), Y(c[3]), X(c[4]), Y(c[5]), X(c[6]), Y(c[7]));
    path.closePath();

    /* sprite palette: 7 ramp glows + gold + white flash */
    const sprites = Array.from({ length: 7 }, (_, i) => glowSprite(ramp(i / 6)));
    const goldSprite = glowSprite(GOLD);
    const whiteSprite = glowSprite([255, 255, 255]);

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
      kind: 0 | 1 | 2 | 3; // contour · gyri · interior · inner-contour depth layer
      ph: number;
      rgb: RGB;
      sprite: HTMLCanvasElement;
    }
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const nodes: Neuron[] = [];
    const push = (tx: number, ty: number, kind: 0 | 1 | 2 | 3) => {
      const u = (tx - bx) / (100 * S);
      const gold = kind !== 3 && Math.random() < 0.05;
      const rgb = gold ? GOLD : ramp(u);
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
        rgb,
        sprite: gold ? goldSprite : sprites[Math.round(Math.min(1, Math.max(0, u)) * 6)],
      });
    };

    /* outer contour — dense */
    for (const c of OUTLINE) {
      const len = Math.hypot(c[6] - c[0], c[7] - c[1]);
      const k = Math.max(3, Math.min(13, Math.round(len / 2.4)));
      for (let i = 0; i < k; i++) {
        const [x, y] = evalCubic(c, (i + 0.5) / k);
        push(X(x), Y(y), 0);
      }
    }
    /* inner contour depth layer — same silhouette, shrunk toward centroid */
    for (const c of OUTLINE) {
      const len = Math.hypot(c[6] - c[0], c[7] - c[1]);
      const k = Math.max(2, Math.min(8, Math.round(len / 4.2)));
      for (let i = 0; i < k; i++) {
        const [x, y] = evalCubic(c, (i + 0.5) / k);
        push(X(50 + (x - 50) * 0.9), Y(45 + (y - 45) * 0.9), 3);
      }
    }
    /* gyri chains */
    for (let gi = 0; gi < GYRI.length; gi++) {
      const n = gi === 0 ? 11 : 8;
      for (let i = 0; i < n; i++) {
        const [x, y] = evalCubic(GYRI[gi], (i + 0.5) / n);
        push(X(x), Y(y), 1);
      }
    }
    /* interior fill */
    let guard = 0;
    let interior = 0;
    while (interior < 105 && guard++ < 25000) {
      const x = bx + Math.random() * 100 * S;
      const y = by + Math.random() * 90 * S;
      if (ctx.isPointInPath(path, x, y)) {
        push(x, y, 2);
        interior++;
      }
    }

    /* ambient bokeh across the whole panel, ramp-colored */
    const ambient = Array.from({ length: 44 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.16, 0.16) * dpr,
      vy: rand(-0.16, 0.16) * dpr,
      r: rand(1.4, 5) * dpr,
      ph: Math.random() * 6.283,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
    }));

    /* fine network lines, pruned for elegance */
    let edges: { a: number; b: number; rgb: string }[] = [];
    const thr = 10 * S;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const na = nodes[i];
        const nb = nodes[j];
        if (Math.hypot(na.tx - nb.tx, na.ty - nb.ty) < thr) {
          edges.push({
            a: i,
            b: j,
            rgb: `${(na.rgb[0] + nb.rgb[0]) >> 1},${(na.rgb[1] + nb.rgb[1]) >> 1},${(na.rgb[2] + nb.rgb[2]) >> 1}`,
          });
        }
      }
    }
    for (let i = edges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [edges[i], edges[j]] = [edges[j], edges[i]];
    }
    edges = edges.slice(0, 780);
    const edgesAt = (n: number) => edges.filter((e) => e.a === n || e.b === n);

    const pulses = Array.from({ length: 8 }, () => ({
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

    const wrap = (p: { x: number; y: number }) => {
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
      /* everything is emissive — additive blending gives the bloom */
      ctx.globalCompositeOperation = "lighter";

      /* deep emissive backdrop behind the formed brain */
      if (phase > 0.05) {
        const cxb = X(50);
        const cyb = Y(42);
        const g = ctx.createRadialGradient(cxb, cyb, 0, cxb, cyb, 62 * S);
        g.addColorStop(0, `rgba(99,102,241,${0.16 * phase})`);
        g.addColorStop(0.55, `rgba(139,92,246,${0.08 * phase})`);
        g.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      /* ambient bokeh */
      for (const a of ambient) {
        a.x += a.vx;
        a.y += a.vy;
        wrap(a);
        const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + a.ph);
        ctx.globalAlpha = 0.1 + 0.22 * tw;
        const d = a.r * 4;
        ctx.drawImage(a.sprite, a.x - d / 2, a.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;

      /* neuron positions */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (mode === "drift" || mode === "dissolve") {
          n.x += n.vx;
          n.y += n.vy;
          wrap(n);
        } else if (mode === "gather") {
          const q = easeInOut(Math.min(1, Math.max(0, (phase * 1.4 - n.stag * 0.4) / 1)));
          const amp = n.kind === 2 ? 1.6 : 0.6;
          n.x = n.fx + (n.tx - n.fx) * q + Math.sin(t * 1.1 + n.ph) * amp * dpr * q;
          n.y = n.fy + (n.ty - n.fy) * q + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr * q;
        } else {
          const amp = n.kind === 2 ? 1.6 : 0.6;
          n.x = n.tx + Math.sin(t * 1.1 + n.ph) * amp * dpr;
          n.y = n.ty + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr;
        }
        flash[i] = Math.max(0, flash[i] - 0.02);
      }

      /* sparkle glints on the working brain */
      if (mode === "work" && Math.random() < 0.06) {
        flash[Math.floor(Math.random() * nodes.length)] = 0.9;
      }

      /* fine network lines — ramp-colored, assemble with the brain */
      const lineA = easeInOut(phase) * easeInOut(phase);
      if (lineA > 0.02) {
        ctx.lineWidth = 0.9 * dpr;
        for (const e of edges) {
          const na = nodes[e.a];
          const nb = nodes[e.b];
          const boost = na.kind === 0 && nb.kind === 0 ? 1.9 : na.kind === 3 && nb.kind === 3 ? 0.6 : 1;
          ctx.strokeStyle = `rgba(${e.rgb},${(0.05 + 0.07 * ((na.z + nb.z) / 2)) * lineA * boost})`;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      /* glowing pulses racing the pathways */
      if (mode === "work") {
        for (const p of pulses) {
          p.t += 0.016 * p.speed;
          if (p.t >= 1) {
            const e = edges[p.edge];
            const arrived = p.from === 0 ? e.b : e.a;
            flash[arrived] = 1;
            const next = edgesAt(arrived);
            const pick = next[Math.floor(Math.random() * next.length)] ?? e;
            p.edge = edges.indexOf(pick);
            p.from = pick.a === arrived ? 0 : 1;
            p.t = 0;
            p.speed = 0.8 + Math.random() * 0.6;
          }
          const e = edges[p.edge];
          const start = p.from === 0 ? nodes[e.a] : nodes[e.b];
          const end = p.from === 0 ? nodes[e.b] : nodes[e.a];
          const t0 = Math.max(0, p.t - 0.18);
          const x0 = start.x + (end.x - start.x) * t0;
          const y0 = start.y + (end.y - start.y) * t0;
          const x1 = start.x + (end.x - start.x) * p.t;
          const y1 = start.y + (end.y - start.y) * p.t;
          const trail = ctx.createLinearGradient(x0, y0, x1, y1);
          trail.addColorStop(0, `rgba(${e.rgb},0)`);
          trail.addColorStop(1, `rgba(${e.rgb},.9)`);
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2 * dpr;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          const d = 13 * dpr;
          ctx.drawImage(whiteSprite, x1 - d / 2, y1 - d / 2, d, d);
        }
      }

      /* neurons — emissive sprites, contour heavier, inner layer dim */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        const base = n.kind === 0 ? 2 : n.kind === 1 ? 1.7 : n.kind === 3 ? 1.1 : 1.4;
        const r = (base + 0.8 * n.z + f * 2.2) * dpr;
        const restA = mode === "drift" || mode === "dissolve" ? 0.4 : n.kind === 3 ? 0.3 : 0.62;
        ctx.globalAlpha = Math.min(1, restA + 0.25 * n.z + 0.4 * f);
        const d = r * 5.4;
        ctx.drawImage(n.sprite, n.x - d / 2, n.y - d / 2, d, d);
        if (f > 0.25) {
          const dw = r * 7;
          ctx.globalAlpha = f * 0.8;
          ctx.drawImage(whiteSprite, n.x - dw / 2, n.y - dw / 2, dw, dw);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
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
      aria-label="Zero — a luxury neural brain assembling from scattered data"
    />
  );
}
