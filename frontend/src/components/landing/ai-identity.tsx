"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AiIdentity — Project Zero's signature AI presence (Design Bible §7).
 *
 * A SYNTHETIC HUMAN MIND, built from the founder references in Demos/SS
 * (Identity-1 … Identity-4): a human head in profile rendered as a field of
 * emissive voxels, the brain glowing *inside* the cranium, a spine of light
 * descending into the shoulders, and the signature element — a horizontal halo
 * ring cutting through the head at brow level with lens flares at both
 * extremes. Colour follows the axis of thought: electric blue and cyan at the
 * back of the skull where raw data arrives, violet and magenta at the front
 * where it becomes an answer, with sparse gold synapses.
 *
 * The narrative is the founder's own: an organisation's data is a mess, so the
 * cycle is scattered drift → slow gather into a mind → work → dissolve. While
 * it works, data streams in from the left, glitch-streaks shed off the back of
 * the skull, pulses race the pathways and answers beam out past the face.
 * Static (formed) under prefers-reduced-motion.
 */

type Cubic = [number, number, number, number, number, number, number, number];
type RGB = [number, number, number];

/* ---------------------------------------------------------------- geometry
   A ~100 × 126 design space. The head faces RIGHT and is built to real profile
   proportion: crown y=8 to chin y=76 against occiput x=10 to nose-tip x=74 —
   68 tall by 64 long, near-square, as a human head is in profile. Crown →
   hairline → brow → nose base → chin divide that height into quarters, which
   puts the eye line on the midpoint (y≈46), and the glabella→nasion notch is
   what lets the nose read as a nose instead of a bump.                       */

const HEAD: Cubic[] = [
  [40, 8, 52, 8, 61, 22, 62, 36], // crown → glabella (brow ridge)
  [62, 36, 62, 39, 60, 40, 58, 42], // glabella → nasion, the notch a nose needs
  [58, 42, 62, 47, 71, 51, 74, 57], // nasion → bridge → tip
  [74, 57, 72, 59, 69, 60, 66, 59], // tip → base of nose
  [66, 59, 62, 62, 68, 65, 64, 68], // philtrum → lips, one smooth S
  [64, 68, 62, 71, 67, 73, 60, 76], // labiomental crease → chin
  [60, 76, 48, 77, 37, 74, 30, 66], // jawline → jaw angle
  [30, 66, 27, 62, 23, 58, 19, 52], // jaw angle → below the ear
  [19, 52, 12, 44, 10, 31, 16, 21], // occipital curve
  [16, 21, 22, 11, 32, 8, 40, 8], // back of skull → crown
];

/* Cerebrum, seated in the cranium above the brow line. */
const BRAIN: Cubic[] = [
  [22, 34, 21, 25, 30, 17, 41, 16],
  [41, 16, 50, 16, 57, 22, 58, 30],
  [58, 30, 59, 36, 55, 40, 49, 41],
  [49, 41, 41, 44, 32, 43, 26, 39],
  [26, 39, 23, 38, 22, 36, 22, 34],
];

/* Longitudinal fissure first (rendered brightest), then the gyri folds. */
const FOLDS: Cubic[] = [
  [23, 27, 32, 19, 44, 18, 55, 23],
  [24, 33, 32, 26, 41, 26, 47, 33],
  [29, 39, 37, 31, 46, 31, 52, 37],
  [46, 24, 52, 20, 57, 25, 58, 30],
  [37, 42, 44, 37, 52, 36, 56, 39],
  [26, 23, 33, 17, 40, 17, 44, 21],
];

/* Cerebellum, brainstem root and the ear. */
const DETAIL: Cubic[] = [
  [24, 40, 27, 45, 32, 47, 38, 45], // cerebellum
  [28, 46, 33, 44, 36, 49, 33, 55], // helix
  [30, 49, 33, 48, 34, 51, 32, 53], // concha
];

/* Brow, eye and cheek — just enough structure to read as a person in profile,
   never a rendered face. */
const FACE: Cubic[] = [
  [49, 42, 54, 40, 58, 41, 59, 43], // brow
  [51, 46, 54, 44, 58, 45, 60, 47], // upper lid
  [60, 47, 57, 49, 53, 49, 51, 46], // lower lid
  [48, 50, 53, 52, 57, 55, 59, 58], // zygomatic
];

/* Neck, clavicle and shoulders — the body the mind sits on. */
const BODY: Cubic[] = [
  [54, 74, 53, 79, 53, 85, 54, 90], // front of neck
  [23, 57, 24, 67, 26, 78, 27, 90], // back of neck
  [30, 92, 41, 96, 55, 96, 64, 92], // clavicle
  [27, 90, 18, 93, 8, 99, 2, 112], // back shoulder
  [54, 90, 70, 93, 85, 100, 95, 114], // front shoulder
];

/* Closed neck-and-torso silhouette, filled with dim voxels that fade toward the
   bottom of the frame so the body has mass instead of being an outline. */
const TORSO: Cubic[] = [
  [23, 57, 24, 68, 26, 80, 27, 90], // back of neck, descending
  [27, 90, 18, 93, 8, 99, 2, 112], // back shoulder
  [2, 112, 20, 124, 60, 126, 95, 118], // lower edge
  [95, 118, 85, 100, 70, 93, 54, 90], // front shoulder, ascending
  [54, 90, 54, 85, 53, 79, 54, 74], // front of neck
  [54, 74, 44, 70, 32, 62, 23, 57], // under the jaw
];

/* Column of light: brainstem → cervical spine → chest. */
const SPINE: Cubic[] = [
  [30, 42, 32, 50, 34, 56, 35, 62],
  [35, 62, 36, 71, 37, 81, 38, 92],
];

const evalCubic = (c: Cubic, t: number): [number, number] => {
  const u = 1 - t;
  const x = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
  const y = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
  return [x, y];
};

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/* ------------------------------------------------------------------ colour
   Unchanged brand ramp: electric blue → cyan → violet → purple → magenta,
   mapped along the front-to-back axis of the head, plus gold synapses.     */

const STOPS: [number, RGB][] = [
  [0, [56, 189, 248]],
  [0.28, [34, 211, 238]],
  [0.55, [139, 92, 246]],
  [0.78, [192, 38, 211]],
  [1, [228, 95, 188]],
];
const GOLD: RGB = [245, 158, 11];
const CYAN: RGB = [34, 211, 238];

function ramp(u: number): RGB {
  const x = clamp01(u);
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

/* Voxel classes. Emissive weight and voxel size are driven off these. */
const HEAD_EDGE = 0;
const HEAD_DEPTH = 1;
const HEAD_FILL = 2;
const BRAIN_EDGE = 3;
const BRAIN_FOLD = 4;
const BRAIN_FILL = 5;
const BODY_EDGE = 6;
const SPINE_NODE = 7;
const FACE_LINE = 8;
const BODY_FILL = 9;

const BASE_R = [2.1, 1.05, 1.1, 1.7, 1.9, 1.3, 1.55, 2.15, 1.75, 1.15];
const REST_A = [0.72, 0.19, 0.21, 0.68, 0.78, 0.46, 0.5, 0.82, 0.58, 0.24];
const CHUNKY = [true, false, false, true, true, false, true, true, false, false];

export function AiIdentity({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => setDims({ w: canvas.offsetWidth || 620, h: canvas.offsetHeight || 780 });
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

    /* Fit the composition (x 2–95, y 8–120), biased upward so the head — not
       the shoulders — sits on the optical centre. */
    const S = Math.min(w / 100, h / 120);
    const bx = w / 2 - 48 * S;
    const by = h / 2 - 60 * S;
    const X = (x: number) => bx + x * S;
    const Y = (y: number) => by + y * S;

    /* Voxel grid: positions snap to it as the mind forms, which is what gives
       the references their digital-not-organic character. */
    const Q = Math.max(1, Math.round(1.4 * dpr));
    const snap = (v: number) => Math.round(v / Q) * Q;

    const traced = (curves: Cubic[]) => {
      const p = new Path2D();
      p.moveTo(X(curves[0][0]), Y(curves[0][1]));
      for (const c of curves) p.bezierCurveTo(X(c[2]), Y(c[3]), X(c[4]), Y(c[5]), X(c[6]), Y(c[7]));
      p.closePath();
      return p;
    };
    const headPath = traced(HEAD);
    const brainPath = traced(BRAIN);
    const torsoPath = traced(TORSO);

    const sprites = Array.from({ length: 7 }, (_, i) => glowSprite(ramp(i / 6)));
    const goldSprite = glowSprite(GOLD);
    const whiteSprite = glowSprite([255, 255, 255]);
    const cyanSprite = glowSprite(CYAN);

    interface Voxel {
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
      kind: number;
      ph: number;
      dim: number;
      rgb: RGB;
      css: string;
      sprite: HTMLCanvasElement;
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const nodes: Voxel[] = [];

    const push = (tx: number, ty: number, kind: number) => {
      /* Hue spans the full ramp across the head itself — occiput to nose tip —
         so cold arriving data and warm finished answers both read. The brain is
         biased warm so it stays a distinct organ inside a cooler skull. */
      const axis = clamp01((tx - X(8)) / (68 * S));
      const isBrain = kind === BRAIN_EDGE || kind === BRAIN_FOLD || kind === BRAIN_FILL;
      const u = clamp01(isBrain ? axis * 0.6 + 0.3 : axis);
      /* Torso voxels fade toward the bottom of the frame (Identity-2). */
      const dim =
        kind === BODY_FILL ? 1 - clamp01((ty - Y(88)) / (36 * S)) * 0.78 : 1;
      const gold = (kind === BRAIN_FOLD || kind === HEAD_EDGE) && Math.random() < 0.055;
      const rgb = gold ? GOLD : ramp(u);
      nodes.push({
        tx,
        ty,
        x: Math.random() * w,
        y: Math.random() * h,
        fx: 0,
        fy: 0,
        vx: rand(-0.3, 0.3) * dpr,
        vy: rand(-0.3, 0.3) * dpr,
        z: Math.random(),
        stag: Math.random(),
        kind,
        ph: Math.random() * 6.283,
        dim,
        rgb,
        css: `${rgb[0]},${rgb[1]},${rgb[2]}`,
        sprite: gold ? goldSprite : sprites[Math.round(u * 6)],
      });
    };

    /* Trace every chain at a density proportional to its length. */
    const trace = (curves: Cubic[], kind: number, per: number, shrink = 1) => {
      for (const c of curves) {
        const len = Math.hypot(c[6] - c[0], c[7] - c[1]) + Math.hypot(c[4] - c[2], c[5] - c[3]);
        const k = Math.max(3, Math.min(15, Math.round(len / per)));
        for (let i = 0; i < k; i++) {
          const [x, y] = evalCubic(c, (i + 0.5) / k);
          /* shrink pivots on the head centroid, not the canvas centre */
          push(X(42 + (x - 42) * shrink), Y(42 + (y - 42) * shrink), kind);
        }
      }
    };

    trace(HEAD, HEAD_EDGE, 2.6); // the profile must dominate everything else
    trace(HEAD, HEAD_DEPTH, 7.5, 0.94); // hugs the profile as thickness, not a second rim
    trace(BRAIN, BRAIN_EDGE, 3.4);
    trace(FOLDS, BRAIN_FOLD, 3.2);
    trace(DETAIL, BRAIN_FOLD, 3.4);
    trace(FACE, FACE_LINE, 3.0);
    trace(BODY, BODY_EDGE, 3.4);
    trace(SPINE, SPINE_NODE, 4.2);

    /* Volumetric fills by rejection sampling — dim inside the skull, denser
       and brighter inside the cerebrum. */
    const fill = (path: Path2D, kind: number, target: number, y0: number, y1: number) => {
      let placed = 0;
      let guard = 0;
      while (placed < target && guard++ < 30000) {
        const x = bx + Math.random() * 100 * S;
        const y = by + (y0 + Math.random() * (y1 - y0)) * S;
        if (ctx.isPointInPath(path, x, y)) {
          push(x, y, kind);
          placed++;
        }
      }
    };
    fill(headPath, HEAD_FILL, 54, 6, 77);
    fill(brainPath, BRAIN_FILL, 46, 14, 45);
    fill(torsoPath, BODY_FILL, 120, 56, 124);

    /* Ambient motes across the whole panel so the frame never feels empty. */
    const ambient = Array.from({ length: 38 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.16, 0.16) * dpr,
      vy: rand(-0.16, 0.16) * dpr,
      r: rand(1.3, 4.6) * dpr,
      ph: Math.random() * 6.283,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
    }));

    /* Synapse network, pruned for elegance rather than density. */
    let edges: { a: number; b: number; rgb: string }[] = [];
    const thr = 8.6 * S;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const na = nodes[i];
        const nb = nodes[j];
        /* The torso is a voxel mass, not a network — synapses there would draw
           long skinny triangles across the shoulders. */
        if (na.kind === BODY_FILL || nb.kind === BODY_FILL) continue;
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
    edges = edges.slice(0, 720);
    const edgesAt = (n: number) => edges.filter((e) => e.a === n || e.b === n);

    const pulses = Array.from({ length: 9 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.85 + Math.random() * 0.6,
      from: 0,
    }));
    const flash = new Float32Array(nodes.length);

    /* Voxel rain shedding off the silhouette (Identity-2). */
    const edgeIdx = nodes.reduce<number[]>((acc, n, i) => {
      if (n.kind === HEAD_EDGE || n.kind === BODY_EDGE) acc.push(i);
      return acc;
    }, []);
    const drips = Array.from({ length: 18 }, () => ({
      node: edgeIdx[Math.floor(Math.random() * edgeIdx.length)],
      len: rand(5, 20) * S,
      travel: rand(0, 1),
      speed: rand(0.16, 0.5),
    }));

    /* Glitch streaks bleeding off the back of the skull (Identity-1). */
    const streaks = Array.from({ length: 16 }, () => ({
      x: rand(4, 30) * S,
      y: rand(12, 68) * S,
      len: rand(3, 26) * S,
      speed: rand(0.5, 2.2) * dpr,
      life: Math.random(),
    }));

    /* Data in from the left, answers out past the face (Identity-3). */
    const flows = Array.from({ length: 18 }, (_, i) => ({
      out: i % 3 === 0,
      t: Math.random(),
      lane: rand(14, 70),
      speed: rand(0.004, 0.011),
      sprite: i % 3 === 0 ? sprites[5] : sprites[1],
    }));

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

    /* The signature halo: an ellipse through the head with lens flares at both
       extremes, exactly as in Identity-2. */
    const drawHalo = (cy: number, alpha: number, scale: number, tilt: number, thin: boolean) => {
      const rx = 34 * S * scale;
      const ry = 7.2 * S * scale;
      ctx.save();
      ctx.translate(X(42), cy);
      ctx.rotate(tilt);
      const g = ctx.createLinearGradient(-rx, 0, rx, 0);
      g.addColorStop(0, "rgba(34,211,238,0)");
      g.addColorStop(0.14, `rgba(34,211,238,${alpha})`);
      g.addColorStop(0.5, `rgba(214,245,255,${alpha * 0.5})`);
      g.addColorStop(0.86, `rgba(139,92,246,${alpha})`);
      g.addColorStop(1, "rgba(139,92,246,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = (thin ? 0.9 : 1.7) * dpr;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (!thin) {
        const fw = 40 * dpr * scale;
        const fh = 15 * dpr * scale;
        ctx.globalAlpha = alpha;
        for (const s of [-1, 1]) {
          ctx.drawImage(cyanSprite, s * rx - fw / 2, -fh / 2, fw, fh);
          ctx.drawImage(whiteSprite, s * rx - fw / 5, -fh / 5, fw / 2.5, fh / 2.5);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
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
            n.vx = rand(-0.42, 0.42) * dpr;
            n.vy = rand(-0.42, 0.42) * dpr;
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

      const formed = easeInOut(phase);
      const gridK = easeInOut(clamp01((phase - 0.5) / 0.5));

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      /* Emissive backdrop centred on the cerebrum. */
      if (phase > 0.05) {
        const g = ctx.createRadialGradient(X(40), Y(28), 0, X(40), Y(28), 68 * S);
        g.addColorStop(0, `rgba(99,102,241,${0.17 * formed})`);
        g.addColorStop(0.5, `rgba(139,92,246,${0.09 * formed})`);
        g.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const a of ambient) {
        a.x += a.vx;
        a.y += a.vy;
        wrap(a);
        const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + a.ph);
        ctx.globalAlpha = 0.1 + 0.2 * tw;
        const d = a.r * 4;
        ctx.drawImage(a.sprite, a.x - d / 2, a.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;

      /* Voxel positions. */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (mode === "drift" || mode === "dissolve") {
          n.x += n.vx;
          n.y += n.vy;
          wrap(n);
        } else if (mode === "gather") {
          const q = easeInOut(clamp01(phase * 1.4 - n.stag * 0.4));
          const amp = n.kind === HEAD_FILL || n.kind === BRAIN_FILL ? 1.5 : 0.6;
          n.x = n.fx + (n.tx - n.fx) * q + Math.sin(t * 1.1 + n.ph) * amp * dpr * q;
          n.y = n.fy + (n.ty - n.fy) * q + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr * q;
        } else {
          const amp = n.kind === HEAD_FILL || n.kind === BRAIN_FILL ? 1.5 : 0.6;
          n.x = n.tx + Math.sin(t * 1.1 + n.ph) * amp * dpr;
          n.y = n.ty + Math.cos(t * 0.9 + n.ph * 1.4) * amp * dpr;
        }
        flash[i] = Math.max(0, flash[i] - 0.02);
      }

      if (mode === "work" && Math.random() < 0.07) {
        flash[Math.floor(Math.random() * nodes.length)] = 0.9;
      }

      /* Synapse lines assemble with the mind. */
      const lineA = formed * formed;
      if (lineA > 0.02) {
        ctx.lineWidth = 0.9 * dpr;
        for (const e of edges) {
          const na = nodes[e.a];
          const nb = nodes[e.b];
          const boost =
            na.kind === HEAD_EDGE && nb.kind === HEAD_EDGE
              ? 1.9
              : na.kind === HEAD_DEPTH && nb.kind === HEAD_DEPTH
                ? 0.55
                : na.kind === BRAIN_FOLD || nb.kind === BRAIN_FOLD
                  ? 1.5
                  : 1;
          ctx.strokeStyle = `rgba(${e.rgb},${(0.05 + 0.07 * ((na.z + nb.z) / 2)) * lineA * boost})`;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }

      if (mode === "work") {
        /* Pulses racing the pathways, lighting each node they reach. */
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
            p.speed = 0.85 + Math.random() * 0.6;
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

        /* Glitch streaks shedding off the occipital edge. */
        for (const s of streaks) {
          s.x -= s.speed;
          s.life -= 0.006;
          if (s.life <= 0 || s.x + s.len < 0) {
            s.x = rand(6, 32) * S;
            s.y = rand(8, 78) * S;
            s.len = rand(3, 26) * S;
            s.speed = rand(0.5, 2.2) * dpr;
            s.life = 1;
          }
          ctx.fillStyle = `rgba(34,211,238,${0.3 * s.life})`;
          ctx.fillRect(bx + s.x - s.len, by + s.y, s.len, Q);
        }

        /* Data in from the left, answers out past the face. */
        for (const f of flows) {
          f.t += f.speed;
          if (f.t > 1) f.t = 0;
          const fade = Math.sin(f.t * Math.PI);
          const x = f.out ? X(74) + f.t * 26 * S : bx + (-14 + f.t * 26) * S;
          const y = Y(f.out ? 52 + Math.sin(f.lane) * 6 : f.lane);
          ctx.globalAlpha = fade * (f.out ? 0.75 : 0.5);
          const d = (f.out ? 15 : 11) * dpr;
          ctx.drawImage(f.sprite, x - d / 2, y - d / 2, d, d);
          ctx.fillStyle = f.out ? "rgba(228,95,188,.5)" : "rgba(56,189,248,.4)";
          ctx.globalAlpha = fade;
          ctx.fillRect(x - 9 * S, y, 9 * S, Q);
          ctx.globalAlpha = 1;
        }
      }

      /* Halo — drawn under the voxels so the head reads as occluding it. */
      if (formed > 0.04) {
        const tilt = Math.sin(t * 0.22) * 0.06;
        drawHalo(
          Y(42),
          0.5 * formed * (0.8 + 0.2 * Math.sin(t * 1.6)),
          0.9 + 0.1 * formed,
          tilt,
          false,
        );
        if (mode === "work") {
          /* Second, thinner ring scanning the length of the body. */
          const sweep = (Math.sin(t * 0.5) + 1) / 2;
          drawHalo(Y(10 + sweep * 100), 0.2, 0.62 + sweep * 0.3, tilt, true);
        }
      }

      /* Voxels — square, snapped to the grid as the mind resolves. */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const f = flash[i];
        const r = (BASE_R[n.kind] + 0.8 * n.z + f * 2.2) * dpr;
        const px = n.x + (snap(n.x) - n.x) * gridK;
        const py = n.y + (snap(n.y) - n.y) * gridK;

        const rest = mode === "drift" || mode === "dissolve" ? 0.42 : REST_A[n.kind];
        ctx.globalAlpha = Math.min(1, rest + 0.22 * n.z + 0.4 * f) * n.dim;
        const d = r * 5.2;
        ctx.drawImage(n.sprite, px - d / 2, py - d / 2, d, d);

        /* The voxel core itself — this is what makes it read as built, not drawn. */
        const vox = CHUNKY[n.kind] ? Q * 2 : Q;
        ctx.fillStyle = `rgba(${n.css},${Math.min(1, 0.5 + 0.5 * n.z) * (0.35 + 0.65 * gridK) * n.dim})`;
        ctx.fillRect(px - vox / 2, py - vox / 2, vox, vox);

        if (f > 0.25) {
          const dw = r * 7;
          ctx.globalAlpha = f * 0.8;
          ctx.drawImage(whiteSprite, px - dw / 2, py - dw / 2, dw, dw);
        }
      }

      /* Voxel rain — after the body so it falls in front of the shoulders. */
      if (formed > 0.4) {
        for (const dp of drips) {
          dp.travel += dp.speed * 0.016;
          if (dp.travel > 1) {
            dp.travel = 0;
            dp.node = edgeIdx[Math.floor(Math.random() * edgeIdx.length)];
            dp.len = rand(5, 20) * S;
            dp.speed = rand(0.16, 0.5);
          }
          const src = nodes[dp.node];
          const head = dp.travel * dp.len;
          const steps = Math.max(2, Math.round(dp.len / (Q * 2.4)));
          for (let k = 0; k < steps; k++) {
            const off = head - k * (dp.len / steps);
            if (off < 0) continue;
            const a = (1 - off / dp.len) * (1 - k / steps) * formed * 0.85;
            if (a <= 0.02) continue;
            ctx.fillStyle = `rgba(${src.css},${a})`;
            ctx.fillRect(snap(src.x) - Q / 2, snap(src.y + off), Q, Q);
          }
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
      aria-label="Zero — a synthetic mind assembling itself from scattered organisation data"
    />
  );
}
