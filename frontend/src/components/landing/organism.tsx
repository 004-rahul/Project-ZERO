"use client";

import { useEffect, useRef } from "react";

/**
 * The Organism — Project Zero's living hero (Design Bible §19.4).
 * One continuous particle system that morphs through the product story:
 * scattered knowledge → the Signature Face → connected tools in orbit →
 * a memory torus → the word "PROOF." → the Z mark. Particles are never
 * reset between shapes; the narrative is one unbroken organism.
 * Respects prefers-reduced-motion (static formed face).
 */

export interface OrganismPhase {
  key: string;
  label: string;
}

export const ORGANISM_PHASES: OrganismPhase[] = [
  { key: "scatter", label: "scattered knowledge — commits, threads, documents" },
  { key: "face", label: "zero — your organization's mind" },
  { key: "orbit", label: "connect — github · slack · drive · notion" },
  { key: "torus", label: "remember — permanent organizational memory" },
  { key: "proof", label: "answer — every claim carries its proof" },
  { key: "zero", label: "project zero — see your organization think" },
];

/* Aurora palette (§10 landing scope): iridescent violet → magenta → amber. */
const PHASE_COLORS = ["#8D8A85", "#C084FC", "#E45FBC", "#F2A65A", "#F5F2EC", "#C084FC"];
const HOLD_MS = 3600;
const MORPH_MS = 1700;

interface Pt {
  x: number;
  y: number;
  z: number;
  /** 0 = body, 1 = eye (bright), 2 = mouth (dim) — only the face uses roles. */
  role: number;
}

interface OrganismProps {
  className?: string;
  /** Horizontal focus of the organism as a fraction of width (0.5 = centre). */
  centerX?: number;
  onPhase?: (phase: OrganismPhase) => void;
}

export function Organism({ className, centerX = 0.5, onPhase }: OrganismProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseCb = useRef(onPhase);
  phaseCb.current = onPhase;
  const centerRef = useRef(centerX);
  centerRef.current = centerX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    const size = () => {
      W = canvas.width = canvas.offsetWidth * dpr;
      H = canvas.height = canvas.offsetHeight * dpr;
    };
    size();

    const box = Math.min(canvas.offsetWidth, canvas.offsetHeight) || 480;
    const N = box < 380 ? 700 : box < 520 ? 1100 : 1500;
    const shuffle = <T,>(a: T[]): T[] => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    /* ---- shape generators (unit space, N points each) ---- */
    const gScatter = (): Pt[] => {
      const p: Pt[] = [];
      for (let i = 0; i < N; i++) {
        p.push({
          x: (Math.random() * 2 - 1) * 1.7,
          y: (Math.random() * 2 - 1) * 1.05,
          z: (Math.random() * 2 - 1) * 0.7,
          role: 0,
        });
      }
      return p;
    };

    const gFace = (): Pt[] => {
      const p: Pt[] = [];
      const radAt = (y: number) => {
        let r = Math.sqrt(Math.max(0, 1 - y * y));
        if (y > 0.15) r *= 1 - 0.38 * ((y - 0.15) / 0.85);
        return r;
      };
      const eyeN = Math.floor(N * 0.09);
      const mouthN = Math.floor(N * 0.05);
      const headN = N - 2 * eyeN - mouthN;
      for (let i = 0; i < headN; i++) {
        const y = (Math.random() * 2 - 1) * 0.97;
        const phi = (Math.random() * 2 - 1) * 1.32;
        const r = radAt(y);
        p.push({ x: Math.sin(phi) * r * 0.78, y: y * 0.97, z: Math.cos(phi) * r * 0.55, role: 0 });
      }
      for (const s of [-1, 1]) {
        for (let j = 0; j < eyeN; j++) {
          const t = Math.random() * 2 - 1;
          p.push({
            x: s * (0.3 + t * 0.13),
            y: -0.1 + (Math.random() - 0.5) * 0.05 * (1 - Math.abs(t) * 0.6),
            z: 0.45,
            role: 1,
          });
        }
      }
      for (let i = 0; i < mouthN; i++) {
        const t = Math.random() * 2 - 1;
        p.push({ x: t * 0.17, y: 0.45 + (Math.random() - 0.5) * 0.014, z: 0.48, role: 2 });
      }
      return p;
    };

    const gOrbit = (): Pt[] => {
      const p: Pt[] = [];
      const coreN = Math.floor(N * 0.3);
      const satN = Math.floor(N * 0.09);
      for (let i = 0; i < coreN; i++) {
        const a = Math.random() * 6.283;
        const r = Math.pow(Math.random(), 0.5) * 0.2;
        p.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.85, z: (Math.random() - 0.5) * 0.2, role: 0 });
      }
      for (let s = 0; s < 4; s++) {
        const A = (s * Math.PI) / 2 + Math.PI / 4;
        const cx = Math.cos(A) * 0.82;
        const cy = Math.sin(A) * 0.55;
        for (let i = 0; i < satN; i++) {
          const a = Math.random() * 6.283;
          const r = Math.pow(Math.random(), 0.5) * 0.13;
          p.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, z: (Math.random() - 0.5) * 0.16, role: 0 });
        }
      }
      while (p.length < N) {
        const A = Math.random() * 6.283;
        const wob = 0.02 * Math.sin(A * 8);
        p.push({ x: Math.cos(A) * (0.82 + wob), y: Math.sin(A) * (0.55 + wob), z: (Math.random() - 0.5) * 0.1, role: 0 });
      }
      return p;
    };

    const gTorus = (): Pt[] => {
      const p: Pt[] = [];
      const R = 0.72;
      const r = 0.27;
      const tilt = 0.95;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      for (let i = 0; i < N; i++) {
        const u = Math.random() * 6.283;
        const v = Math.random() * 6.283;
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const z = (R + r * Math.cos(v)) * Math.sin(u);
        const y = r * Math.sin(v);
        p.push({ x, y: y * ct - z * st, z: y * st + z * ct, role: 0 });
      }
      return p;
    };

    const sampleText = (str: string, fontPx: number): Pt[] => {
      const oc = document.createElement("canvas");
      oc.width = 1200;
      oc.height = 420;
      const octx = oc.getContext("2d");
      if (!octx) return gScatter();
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `900 ${fontPx}px Inter, Arial, sans-serif`;
      octx.fillText(str, 600, 210);
      const img = octx.getImageData(0, 0, 1200, 420).data;
      const raw: Pt[] = [];
      for (let y = 0; y < 420; y += 3) {
        for (let x = 0; x < 1200; x += 3) {
          if (img[(y * 1200 + x) * 4 + 3] > 128) {
            raw.push({ x: (x - 600) / 430, y: (y - 210) / 430, z: (Math.random() - 0.5) * 0.12, role: 0 });
          }
        }
      }
      if (raw.length === 0) return gScatter();
      shuffle(raw);
      const p: Pt[] = [];
      for (let i = 0; i < N; i++) p.push({ ...raw[i % raw.length] });
      return p;
    };

    const SCENES: Pt[][] = [gScatter(), gFace(), gOrbit(), gTorus(), sampleText("PROOF.", 230), sampleText("Z", 330)];
    SCENES.forEach((s) => shuffle(s));
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        SCENES[4] = shuffle(sampleText("PROOF.", 230));
        SCENES[5] = shuffle(sampleText("Z", 330));
      });
    }

    /* ---- particles ---- */
    const P = SCENES[0].map((t) => ({
      x: t.x,
      y: t.y,
      z: t.z,
      st: Math.random() * 0.3,
      sz: 0.7 + Math.random() * 0.9,
      ph: Math.random() * 6.283,
    }));
    const proj: { x: number; y: number; role: number }[] = new Array(N);
    const lineIdx: number[] = [];
    for (let i = 0; i < N; i += Math.ceil(N / 210)) lineIdx.push(i);

    const hexA = (hex: string, a: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };
    const mixHex = (h1: string, h2: string, t: number): [number, number, number] => {
      const a = parseInt(h1.slice(1), 16);
      const b = parseInt(h2.slice(1), 16);
      const ch = (sh: number) => Math.round(((a >> sh) & 255) + (((b >> sh) & 255) - ((a >> sh) & 255)) * t);
      return [ch(16), ch(8), ch(0)];
    };
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    /* ---- phase cycle (hold → morph → hold …) ---- */
    let sceneA = 0;
    let sceneB = 1;
    let mix = 0;
    let morphing = true;
    let phaseStart = performance.now() - (HOLD_MS - 800); // scatter holds only briefly
    const announce = (idx: number) => phaseCb.current?.(ORGANISM_PHASES[idx]);
    announce(1);

    const M = { x: -9e3, y: -9e3 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      M.x = (e.clientX - r.left) * dpr;
      M.y = (e.clientY - r.top) * dpr;
    };
    if (fine && !reduced) window.addEventListener("mousemove", onMove);
    const onResize = () => size();
    window.addEventListener("resize", onResize);

    let t = 0;
    let raf = 0;

    const frame = (now: number) => {
      t += 0.016;

      if (!reduced) {
        const elapsed = now - phaseStart;
        if (morphing) {
          mix = Math.min(1, elapsed / MORPH_MS);
          if (mix >= 1) {
            sceneA = sceneB;
            mix = 0;
            morphing = false;
            phaseStart = now;
          }
        } else if (elapsed >= HOLD_MS) {
          sceneB = sceneA === 5 ? 1 : sceneA + 1;
          morphing = true;
          phaseStart = now;
          announce(sceneB);
        }
      }

      const A = SCENES[sceneA];
      const B = SCENES[sceneB];
      const m = ease(mix);
      const faceW = (sceneA === 1 ? 1 - m : 0) + (sceneB === 1 ? m : 0);

      ctx.fillStyle = "rgba(8,7,9,.4)";
      ctx.fillRect(0, 0, W, H);

      const scale = Math.min(W, H) * 0.36;
      const cx = W * centerRef.current;
      const cy = H / 2;
      // oscillate — never spin flat shapes edge-on to the camera
      const ang = faceW > 0.5 ? 0.3 * Math.sin(t * 0.35) : 0.35 * Math.sin(t * 0.22);
      const sa = Math.sin(ang);
      const ca = Math.cos(ang);
      const [r1, g1, b1] = mixHex(PHASE_COLORS[sceneA], PHASE_COLORS[sceneB], m);

      let exL = 0, eyL = 0, ecL = 0, exR = 0, eyR = 0, ecR = 0;

      for (let i = 0; i < N; i++) {
        const p = P[i];
        const a = A[i];
        const b = B[i];
        const q = ease(Math.min(1, Math.max(0, m * 1.35 - p.st)));
        let tx = a.x + (b.x - a.x) * q;
        let ty = a.y + (b.y - a.y) * q;
        const tz = a.z + (b.z - a.z) * q;
        tx += Math.sin(t * 1.4 + p.ph) * 0.007;
        ty += Math.cos(t * 1.2 + p.ph * 1.3) * 0.007;
        const rx = tx * ca + tz * sa;
        const rz = tz * ca - tx * sa;
        p.x += (rx - p.x) * 0.085;
        p.y += (ty - p.y) * 0.085;
        p.z += (rz - p.z) * 0.085;
        const depth = 1 / (1 + Math.max(-0.9, p.z) * 0.26);
        let px = cx + p.x * scale * depth;
        let py = cy + p.y * scale * depth;
        if (fine && !reduced) {
          const dx = px - M.x;
          const dy = py - M.y;
          const d2 = dx * dx + dy * dy;
          const RR = 150 * dpr;
          if (d2 < RR * RR && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = ((RR - d) / RR) * 22 * (dpr / d);
            px += dx * f;
            py += dy * f;
          }
        }
        const role = faceW > 0.5 ? (sceneA === 1 ? a.role : sceneB === 1 ? b.role : 0) : 0;
        proj[i] = { x: px, y: py, role };
        if (role === 1) {
          if (tx < 0) { exL += px; eyL += py; ecL++; }
          else { exR += px; eyR += py; ecR++; }
        }
      }

      /* constellation lines — face and torus only, subsampled */
      const lineW =
        (sceneA === 1 || sceneA === 3 ? 1 - m : 0) + (sceneB === 1 || sceneB === 3 ? m : 0);
      if (lineW > 0.15) {
        const thr = scale * 0.24;
        const thr2 = thr * thr;
        ctx.lineWidth = Math.max(0.5, W * 0.0008);
        ctx.strokeStyle = `rgb(${r1},${g1},${b1})`;
        for (let a2 = 0; a2 < lineIdx.length; a2++) {
          const pa = proj[lineIdx[a2]];
          for (let b2 = a2 + 1; b2 < lineIdx.length; b2++) {
            const pb = proj[lineIdx[b2]];
            const dx = pa.x - pb.x;
            const dy = pa.y - pb.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < thr2) {
              ctx.globalAlpha = (1 - d2 / thr2) * 0.1 * lineW;
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.stroke();
            }
          }
        }
      }

      /* glowing android eyes */
      if (faceW > 0.5 && ecL > 0 && ecR > 0) {
        for (const [ex, ey, ec] of [
          [exL, eyL, ecL],
          [exR, eyR, ecR],
        ]) {
          const gx = ex / ec;
          const gy = ey / ec;
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, scale * 0.16);
          g.addColorStop(0, hexA("#E9D5FF", 0.28 * faceW));
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(gx - scale * 0.17, gy - scale * 0.17, scale * 0.34, scale * 0.34);
        }
      }

      /* particles — chromatic shimmer only while morphing */
      const shimmer = mix > 0.02 && mix < 0.98 ? Math.sin(mix * Math.PI) : 0;
      for (let i = 0; i < N; i++) {
        const pr = proj[i];
        const base = P[i];
        const r = base.sz * (W / 1400) * 2.4;
        let al = 0.32 + 0.55 * Math.min(1, Math.max(0, (base.z + 1) / 2));
        if (pr.role === 1) al = 0.95;
        else if (pr.role === 2) al = 0.5;
        if (shimmer > 0.05) {
          ctx.globalAlpha = al * 0.35 * shimmer;
          ctx.fillStyle = "#E45FBC";
          ctx.beginPath();
          ctx.arc(pr.x + 2.2 * dpr, pr.y, r, 0, 6.283);
          ctx.fill();
          ctx.fillStyle = "#F2A65A";
          ctx.beginPath();
          ctx.arc(pr.x - 2.2 * dpr, pr.y, r, 0, 6.283);
          ctx.fill();
        }
        ctx.globalAlpha = al;
        ctx.fillStyle = pr.role === 1 ? "#E9D5FF" : `rgb(${r1},${g1},${b1})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.role === 1 ? r * 1.5 : r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      sceneA = 1;
      sceneB = 1;
      mix = 0;
      morphing = false;
      ctx.fillStyle = "#080709";
      ctx.fillRect(0, 0, W, H);
      for (let k = 0; k < 120; k++) frame(performance.now());
    } else {
      const loop = (now: number) => {
        frame(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (fine && !reduced) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Project Zero — living particle identity"
    />
  );
}
