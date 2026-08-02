"use client";

import { useEffect, useRef } from "react";

/**
 * NeuralMind — the auth-screen AI visual (Design Bible §19.1): a two-lobe
 * neural network rotating slowly in 3D. Signal pulses travel along synapses,
 * flare the neuron they arrive at, then jump to a connected edge — the
 * network visibly "thinks". Dark-panel tuned; static under reduced-motion.
 */

interface Node3 {
  x: number;
  y: number;
  z: number;
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

    /* ---- build the brain: two lobes + bridge neurons ---- */
    const nodes: Node3[] = [];
    const lobe = (cx: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(2 * Math.random() - 1);
        const rr = Math.cbrt(Math.random());
        nodes.push({
          x: cx + Math.sin(v) * Math.cos(u) * 0.5 * rr,
          y: Math.sin(v) * Math.sin(u) * 0.72 * rr,
          z: Math.cos(v) * 0.55 * rr,
        });
      }
    };
    lobe(-0.38, 21);
    lobe(0.38, 21);
    for (let i = 0; i < 5; i++) {
      nodes.push({ x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.7, z: (Math.random() - 0.5) * 0.4 });
    }

    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.5) edges.push([i, j]);
      }
    }
    const edgesAt = (n: number) => edges.filter((e) => e[0] === n || e[1] === n);

    /* traveling synapse pulses */
    const pulses = Array.from({ length: 7 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.5 + Math.random() * 0.7,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    const proj = new Array<{ x: number; y: number; d: number }>(nodes.length);
    let ang = Math.random() * Math.PI * 2;
    let raf = 0;

    const frame = () => {
      ang += 0.0038;
      const sa = Math.sin(ang);
      const ca = Math.cos(ang);
      const scale = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const rx = n.x * ca + n.z * sa;
        const rz = n.z * ca - n.x * sa;
        const depth = 1 / (1 + rz * 0.45);
        proj[i] = { x: cx + rx * scale * depth, y: cy + n.y * scale * depth, d: depth };
        flash[i] = Math.max(0, flash[i] - 0.025);
      }

      /* synapses */
      for (const [a, b] of edges) {
        const pa = proj[a];
        const pb = proj[b];
        const alpha = 0.05 + 0.1 * Math.min(pa.d, pb.d);
        ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
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
          p.speed = 0.5 + Math.random() * 0.7;
        }
        const [a, b] = edges[p.edge];
        const start = p.from === 0 ? proj[a] : proj[b];
        const end = p.from === 0 ? proj[b] : proj[a];
        const x = start.x + (end.x - start.x) * p.t;
        const y = start.y + (end.y - start.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7 * dpr);
        g.addColorStop(0, "rgba(216,180,254,.95)");
        g.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      /* neurons */
      for (let i = 0; i < nodes.length; i++) {
        const p = proj[i];
        const f = flash[i];
        const r = (1.6 + 1.2 * p.d + f * 2.4) * dpr;
        if (f > 0.01) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
          g.addColorStop(0, `rgba(216,180,254,${0.5 * f})`);
          g.addColorStop(1, "rgba(124,58,237,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.45 + 0.5 * Math.min(1, p.d - 0.3) + 0.3 * f;
        ctx.fillStyle = f > 0.3 ? "#E9D5FF" : "#A78BFA";
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
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
