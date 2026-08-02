"use client";

import { useEffect, useRef } from "react";

/**
 * NeuralMind — the auth-screen AI visual (Design Bible §19.1): a recognizable
 * side-profile BRAIN. Neurons are sampled inside a drawn brain silhouette
 * (frontal lobe, occipital curve, cerebellum), connected by synapses, with
 * signal pulses traveling edge to edge and flaring each neuron they reach.
 * Faint cortex folds and a glowing outline keep the shape unmistakable; the
 * whole brain breathes and sways gently instead of rotating (which would
 * destroy the silhouette). Static under prefers-reduced-motion.
 */

/** Brain silhouette + cortex folds in a 100×80 design space (facing left). */
function brainPath(s: number, ox: number, oy: number): Path2D {
  const p = new Path2D();
  const M = (x: number, y: number) => p.moveTo(ox + x * s, oy + y * s);
  const C = (a: number, b: number, c: number, d: number, e: number, f: number) =>
    p.bezierCurveTo(ox + a * s, oy + b * s, ox + c * s, oy + d * s, ox + e * s, oy + f * s);
  M(20, 58);
  C(10, 56, 6, 46, 11, 38);
  C(6, 30, 12, 18, 24, 14);
  C(32, 8, 48, 6, 58, 10);
  C(72, 6, 86, 14, 88, 28);
  C(94, 36, 92, 48, 84, 54);
  C(88, 60, 84, 68, 74, 69);
  C(66, 72, 58, 70, 56, 64);
  C(50, 66, 42, 66, 36, 63);
  C(30, 66, 24, 62, 20, 58);
  p.closePath();
  return p;
}

function foldPaths(s: number, ox: number, oy: number): Path2D {
  const p = new Path2D();
  const M = (x: number, y: number) => p.moveTo(ox + x * s, oy + y * s);
  const C = (a: number, b: number, c: number, d: number, e: number, f: number) =>
    p.bezierCurveTo(ox + a * s, oy + b * s, ox + c * s, oy + d * s, ox + e * s, oy + f * s);
  M(28, 32);
  C(36, 24, 46, 26, 52, 34);
  M(40, 46);
  C(50, 38, 60, 40, 66, 48);
  M(22, 44);
  C(28, 38, 34, 42, 38, 50);
  M(56, 20);
  C(64, 16, 72, 20, 76, 28);
  M(60, 66);
  C(64, 62, 70, 62, 74, 65);
  return p;
}

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

    /* silhouette scaled into the canvas */
    const s = (w * 0.9) / 100;
    const ox = w * 0.05;
    const oy = h * 0.5 - 40 * s;
    const outline = brainPath(s, ox, oy);
    const folds = foldPaths(s, ox, oy);

    /* neurons: rejection-sample inside the silhouette */
    const nodes: { x: number; y: number; z: number }[] = [];
    let guard = 0;
    while (nodes.length < 88 && guard++ < 6000) {
      const x = ox + Math.random() * 100 * s;
      const y = oy + Math.random() * 80 * s;
      if (ctx.isPointInPath(outline, x, y)) nodes.push({ x, y, z: Math.random() });
    }

    const edges: [number, number][] = [];
    const thr = w * 0.13;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < thr) edges.push([i, j]);
      }
    }
    const edgesAt = (n: number) => edges.filter((e) => e[0] === n || e[1] === n);

    const pulses = Array.from({ length: 8 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.55 + Math.random() * 0.75,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    let t = Math.random() * 100;
    let raf = 0;
    const cx = w / 2;
    const cy = h / 2;

    const frame = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      /* breathing + gentle sway — silhouette always stays readable */
      const k = 1 + 0.014 * Math.sin(t * 1.1);
      const sway = 0.035 * Math.sin(t * 0.5);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sway);
      ctx.scale(k, k);
      ctx.translate(-cx, -cy);

      /* glowing silhouette */
      ctx.strokeStyle = "rgba(167,139,250,.55)";
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = "rgba(124,58,237,.8)";
      ctx.shadowBlur = 16 * dpr;
      ctx.stroke(outline);
      ctx.shadowBlur = 0;
      const fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.48);
      fill.addColorStop(0, "rgba(124,58,237,.16)");
      fill.addColorStop(1, "rgba(124,58,237,.05)");
      ctx.fillStyle = fill;
      ctx.fill(outline);

      /* cortex folds */
      ctx.strokeStyle = "rgba(167,139,250,.28)";
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke(folds);

      /* synapses */
      for (const [a, b] of edges) {
        const na = nodes[a];
        const nb = nodes[b];
        ctx.strokeStyle = `rgba(167,139,250,${0.07 + 0.08 * ((na.z + nb.z) / 2)})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      /* traveling pulses */
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
          p.speed = 0.55 + Math.random() * 0.75;
        }
        const [a, b] = edges[p.edge];
        const start = p.from === 0 ? nodes[a] : nodes[b];
        const end = p.from === 0 ? nodes[b] : nodes[a];
        const x = start.x + (end.x - start.x) * p.t;
        const y = start.y + (end.y - start.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7 * dpr);
        g.addColorStop(0, "rgba(233,213,255,.95)");
        g.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      /* neurons */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        flash[i] = Math.max(0, f - 0.02);
        const r = (1.3 + 1.1 * n.z + f * 2.6) * dpr;
        if (f > 0.01) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          g.addColorStop(0, `rgba(233,213,255,${0.55 * f})`);
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.4 + 0.45 * n.z + 0.3 * f;
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
      aria-label="Zero — neural intelligence"
    />
  );
}
