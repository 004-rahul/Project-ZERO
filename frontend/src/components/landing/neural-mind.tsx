"use client";

import { useEffect, useRef } from "react";

/**
 * NeuralMind — the auth-screen AI visual (Design Bible §19.1), dots+lines
 * only, no drawn border. Neurons start scattered across the panel, then
 * converge to assemble a side-profile brain: a dense ring of edge-dots
 * traces the contour (frontal lobe, occipital curve, cerebellum) while
 * interior neurons fill it. Once formed, synapses fade in and fast signal
 * pulses race point-to-point with light trails, flaring every neuron they
 * hit. The brain holds, dissolves back to chaos, and reforms on a loop.
 * Static (formed) under prefers-reduced-motion.
 */

/** Side-profile brain silhouette in a 100×80 design space (facing left). */
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
    const cx = w / 2;
    const cy = h / 2;

    /* silhouette used ONLY for sampling — it is never drawn */
    const s = (w * 0.9) / 100;
    const ox = w * 0.05;
    const oy = h * 0.5 - 40 * s;
    const outline = brainPath(s, ox, oy);
    const s2 = s * 0.86;
    const inner = brainPath(s2, ox + 50 * (s - s2), oy + 40 * (s - s2));

    interface Neuron {
      tx: number;
      ty: number;
      sx: number;
      sy: number;
      x: number;
      y: number;
      z: number;
      stag: number;
      edge: boolean;
      ph: number;
    }
    const nodes: Neuron[] = [];
    const scatter = () => ({
      sx: Math.random() * w,
      sy: Math.random() * h,
    });
    let guard = 0;
    while (nodes.length < 165 && guard++ < 20000) {
      const x = ox + Math.random() * 100 * s;
      const y = oy + Math.random() * 80 * s;
      if (!ctx.isPointInPath(outline, x, y)) continue;
      const isEdge = !ctx.isPointInPath(inner, x, y);
      const edgeCount = nodes.filter((n) => n.edge).length;
      const inCount = nodes.length - edgeCount;
      if (isEdge && edgeCount >= 62) continue;
      if (!isEdge && inCount >= 103) continue;
      nodes.push({
        tx: x,
        ty: y,
        ...scatter(),
        x: 0,
        y: 0,
        z: Math.random(),
        stag: Math.random(),
        edge: isEdge,
        ph: Math.random() * 6.283,
      });
    }

    const edges: [number, number][] = [];
    const thr = w * 0.105;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].tx - nodes[j].tx, nodes[i].ty - nodes[j].ty) < thr) edges.push([i, j]);
      }
    }
    const edgesAt = (n: number) => edges.filter((e) => e[0] === n || e[1] === n);

    const pulses = Array.from({ length: 10 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 1.8 + Math.random() * 1.6,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    /* formation cycle: form → hold → melt → reform */
    let mode: "form" | "hold" | "melt" = "form";
    let modeT = 0;
    let phase = 0;
    let t = Math.random() * 100;
    let raf = 0;

    const frame = () => {
      t += 0.016;
      modeT += 0.016;
      if (mode === "form") {
        phase = easeInOut(Math.min(1, modeT / 2.6));
        if (modeT >= 2.6) {
          mode = "hold";
          modeT = 0;
        }
      } else if (mode === "hold") {
        phase = 1;
        if (modeT >= 8) {
          mode = "melt";
          modeT = 0;
        }
      } else {
        phase = 1 - easeInOut(Math.min(1, modeT / 1.5));
        if (modeT >= 1.5) {
          for (const n of nodes) Object.assign(n, scatter());
          mode = "form";
          modeT = 0;
        }
      }

      ctx.clearRect(0, 0, w, h);
      const sway = 0.03 * Math.sin(t * 0.5) * phase;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sway);
      ctx.translate(-cx, -cy);

      /* position neurons: staggered lerp scatter ↔ brain */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const q = easeInOut(Math.min(1, Math.max(0, (phase * 1.35 - n.stag * 0.35) / 1)));
        const jx = Math.sin(t * 1.5 + n.ph) * 2.2 * dpr;
        const jy = Math.cos(t * 1.3 + n.ph * 1.4) * 2.2 * dpr;
        n.x = n.sx + (n.tx - n.sx) * q + jx * q;
        n.y = n.sy + (n.ty - n.sy) * q + jy * q;
        flash[i] = Math.max(0, flash[i] - 0.03);
      }

      /* synapses — appear as the brain assembles */
      const lineA = phase * phase;
      if (lineA > 0.02) {
        for (const [a, b] of edges) {
          const na = nodes[a];
          const nb = nodes[b];
          const boost = na.edge && nb.edge ? 1.7 : 1;
          ctx.strokeStyle = `rgba(167,139,250,${(0.06 + 0.09 * ((na.z + nb.z) / 2)) * lineA * boost})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      /* fast pulses with light trails — only when formed */
      if (phase > 0.95) {
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
            p.speed = 1.8 + Math.random() * 1.6;
          }
          const [a, b] = edges[p.edge];
          const start = p.from === 0 ? nodes[a] : nodes[b];
          const end = p.from === 0 ? nodes[b] : nodes[a];
          const t0 = Math.max(0, p.t - 0.22);
          const x0 = start.x + (end.x - start.x) * t0;
          const y0 = start.y + (end.y - start.y) * t0;
          const x1 = start.x + (end.x - start.x) * p.t;
          const y1 = start.y + (end.y - start.y) * p.t;
          const trail = ctx.createLinearGradient(x0, y0, x1, y1);
          trail.addColorStop(0, "rgba(233,213,255,0)");
          trail.addColorStop(1, "rgba(233,213,255,.9)");
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2.2 * dpr;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          const g = ctx.createRadialGradient(x1, y1, 0, x1, y1, 6.5 * dpr);
          g.addColorStop(0, "rgba(245,235,255,1)");
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x1, y1, 6.5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* neurons — edge dots slightly heavier so the contour reads */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        const r = ((n.edge ? 1.9 : 1.3) + 1 * n.z + f * 2.6) * dpr;
        if (f > 0.01) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          g.addColorStop(0, `rgba(233,213,255,${0.55 * f})`);
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = (n.edge ? 0.55 : 0.38) + 0.4 * n.z + 0.3 * f;
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
      mode = "hold";
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
      aria-label="Zero — neural intelligence"
    />
  );
}
