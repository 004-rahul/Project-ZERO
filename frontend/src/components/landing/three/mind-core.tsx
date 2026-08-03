"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * MindCore — Project Zero's AI identity (Design Bible §7).
 *
 * An abstract, volumetric intelligence core rendered in WebGL: a dense luminous
 * nucleus, a cold outer boundary of raw data, spiral filaments drawing that data
 * inward, and a counter-rotating accretion ring. ~31k GPU points in two draw
 * calls, driven by a hand-written shader — perspective size attenuation, depth
 * fog, additive falloff for bloom without postprocessing, and light that races
 * the filaments inward.
 *
 * Deliberately NOT figurative. Tracing a literal object (a face, a brain, a
 * head) in points reads as clip art at any density; the premium quality in the
 * founder's references comes from volume, depth and light, so those are what
 * this is built from.
 *
 * The lifecycle carries the founder's thesis unchanged: the organisation's data
 * begins as a scattered mess, is drawn inward along the filaments, ignites as
 * one working core, then releases and repeats.
 */

type RGB = [number, number, number];

/* Brand ramp, unchanged: electric blue → cyan → violet → purple → magenta. */
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
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSize;
  uniform float uPulse;

  attribute vec3 aScatter;
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aSize;
  attribute float aT;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    /* Staggered arrival — the field converges as a wave, never in lockstep. */
    float stag = fract(aSeed * 7.317);
    float p = clamp(uPhase * 1.4 - stag * 0.4, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);

    vec3 pos = mix(aScatter, position, p);

    /* Turbulent while scattered, a whisper once formed. */
    float amp = mix(0.13, 0.012, p);
    pos += vec3(
      sin(uTime * 0.70 + aSeed * 6.2),
      cos(uTime * 0.61 + aSeed * 4.7),
      sin(uTime * 0.53 + aSeed * 5.3)
    ) * amp;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = uSize * aSize * (2.6 / dist);

    /* Depth fog — this is what gives the form real volume. */
    float fog = smoothstep(7.4, 2.4, dist);

    /* Light racing the filaments inward. */
    float front = fract(uTime * 0.22);
    float d = abs(aT - front);
    d = min(d, 1.0 - d);
    float spark = aT > 0.0 ? smoothstep(0.055, 0.0, d) : 0.0;

    vColor = aColor + spark * 0.85;
    vFade = (0.10 + 0.90 * p) * fog * (0.86 + 0.14 * sin(uTime * 1.7 + aSeed * 3.1));
    vFade = (vFade + spark * 0.55) * (0.62 + 0.38 * uPulse);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    /* Soft radial falloff + additive blending = bloom with no postprocessing. */
    float a = pow(1.0 - d * 2.0, 2.4);
    gl_FragColor = vec4(vColor, a * vFade);
  }
`;

interface Field {
  position: Float32Array;
  scatter: Float32Array;
  color: Float32Array;
  seed: Float32Array;
  size: Float32Array;
  t: Float32Array;
}

function allocate(n: number): Field {
  return {
    position: new Float32Array(n * 3),
    scatter: new Float32Array(n * 3),
    color: new Float32Array(n * 3),
    seed: new Float32Array(n),
    size: new Float32Array(n),
    t: new Float32Array(n),
  };
}

/**
 * Scattered start state. Deliberately CLUMPED rather than uniformly random: a
 * uniform cloud renders as television static, which reads as an unfinished
 * effect. Clumps read as scattered sources waiting to be gathered — the mess is
 * still composed. The volume is also kept close to the formed extent so the
 * panel never fills edge-to-edge with dust.
 */
function seedClusters(n: number) {
  return Array.from({ length: n }, () => {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const r = 1.55 + Math.random() * 1.05;
    return [
      Math.sin(ph) * Math.cos(th) * r,
      Math.cos(ph) * r * 0.8,
      Math.sin(ph) * Math.sin(th) * r,
    ] as const;
  });
}

function scatterInto(f: Field, i: number, cs: ReturnType<typeof seedClusters>) {
  const c = cs[(Math.random() * cs.length) | 0];
  /* sum of three uniforms ≈ normal, so clumps have soft edges */
  const bell = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.34;
  f.scatter[i * 3] = c[0] + bell();
  f.scatter[i * 3 + 1] = c[1] + bell();
  f.scatter[i * 3 + 2] = c[2] + bell();
}

function paint(f: Field, i: number, rgb: RGB, boost = 1) {
  f.color[i * 3] = (rgb[0] / 255) * boost;
  f.color[i * 3 + 1] = (rgb[1] / 255) * boost;
  f.color[i * 3 + 2] = (rgb[2] / 255) * boost;
}

/* Nucleus + cold boundary + spiral filaments, one buffer. */
function buildBody() {
  const CORE = 7200;
  const SHELL = 3600; // atmosphere, not a solid ball — contrast is the point
  const STREAMS = 20;
  const PER = 620;
  const FIL = STREAMS * PER;
  const n = CORE + SHELL + FIL;
  const f = allocate(n);
  const cs = seedClusters(16);
  let i = 0;

  /* Nucleus — density biased hard toward the centre, hot to near-white inside. */
  for (let k = 0; k < CORE; k++, i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const r = 0.28 * Math.pow(Math.random(), 0.38);
    f.position[i * 3] = Math.sin(ph) * Math.cos(th) * r;
    f.position[i * 3 + 1] = Math.cos(ph) * r;
    f.position[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r;
    const inner = Math.pow(1 - r / 0.28, 2);
    const c = ramp(0.66 + 0.32 * Math.random());
    paint(f, i, [
      c[0] + (255 - c[0]) * inner * 0.86,
      c[1] + (255 - c[1]) * inner * 0.86,
      c[2] + (255 - c[2]) * inner * 0.86,
    ]);
    f.size[i] = 0.42 + Math.random() * 0.36;
    f.seed[i] = Math.random();
    scatterInto(f, i, cs);
  }

  /* Cold outer boundary — Fibonacci sphere so coverage is even, not clumpy. */
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < SHELL; k++, i++) {
    const y = 1 - (k / (SHELL - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = GA * k;
    const r = 1.74 + Math.random() * 0.22;
    f.position[i * 3] = Math.cos(th) * rad * r;
    f.position[i * 3 + 1] = y * r * 0.92;
    f.position[i * 3 + 2] = Math.sin(th) * rad * r;
    paint(f, i, ramp(0.03 + Math.random() * 0.2), 0.62);
    f.size[i] = 0.3 + Math.random() * 0.22;
    f.seed[i] = Math.random();
    scatterInto(f, i, cs);
  }

  /* Spiral filaments — an accretion vortex. Every arm winds the SAME way and
     flattens toward the ring plane as it falls in; mixed directions read as
     floating debris instead of inflow, which is what makes this look designed. */
  for (let s = 0; s < STREAMS; s++) {
    const a0 = (s / STREAMS) * Math.PI * 2 + Math.random() * 0.22;
    const y0 = (Math.random() * 2 - 1) * 0.82;
    const swirl = 3.3 + Math.random() * 0.9;
    const wob = 0.5 + Math.random() * 1.6;
    for (let k = 0; k < PER; k++, i++) {
      const t = k / (PER - 1);
      const e = t * t * (3 - 2 * t);
      const r = 1.72 - 1.44 * e;
      const ang = a0 + e * swirl;
      /* tight cross-section — a filament must read as a strand, not a smear */
      const jit = (Math.random() - 0.5) * 0.028;
      f.position[i * 3] = Math.cos(ang) * r + jit;
      f.position[i * 3 + 1] = y0 * Math.pow(1 - e, 1.5) + Math.sin(t * 9 + wob) * 0.035 + jit;
      f.position[i * 3 + 2] = Math.sin(ang) * r + jit;
      paint(f, i, ramp(0.05 + 0.92 * t), 1.08);
      f.size[i] = 0.4 + Math.random() * 0.3;
      f.seed[i] = Math.random();
      f.t[i] = Math.max(0.002, t);
      scatterInto(f, i, cs);
    }
  }
  return f;
}

/* Accretion ring, its own buffer so it can counter-rotate. */
function buildRing() {
  const n = 6400;
  const f = allocate(n);
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2;
    /* A narrow, bright annulus outside the filaments: the one crisp graphic
       edge in the composition, and the whole silhouette hangs off it. */
    const r = 1.46 + Math.pow(Math.random(), 0.8) * 0.17;
    f.position[i * 3] = Math.cos(ang) * r;
    f.position[i * 3 + 1] = (Math.random() * 2 - 1) * 0.016;
    f.position[i * 3 + 2] = Math.sin(ang) * r;
    const gold = Math.random() < 0.045;
    paint(f, i, gold ? GOLD : ramp(0.46 + Math.random() * 0.3), gold ? 1.25 : 1.2);
    f.size[i] = 0.3 + Math.random() * 0.26;
    f.seed[i] = Math.random();
    /* The ring holds through the whole cycle: there is always one crisp,
       intentional element on screen, and the dust reads as data being gathered
       by it rather than as noise. */
    f.scatter[i * 3] = f.position[i * 3];
    f.scatter[i * 3 + 1] = f.position[i * 3 + 1];
    f.scatter[i * 3 + 2] = f.position[i * 3 + 2];
  }
  return f;
}

function Points({
  field,
  uniforms,
}: {
  field: Field;
  uniforms: Record<string, THREE.IUniform>;
}) {
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[field.position, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[field.scatter, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[field.color, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[field.seed, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[field.size, 1]} />
        <bufferAttribute attach="attributes-aT" args={[field.t, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Cycle, in seconds: scattered → drawn inward → working → released. */
const SCATTER = 1.6;
const CONVERGE = 4.4;
const WORK = 15.0; // the resolved core is the identity — it holds the screen
const RELEASE = 2.2;
const CYCLE = SCATTER + CONVERGE + WORK + RELEASE;

function Scene({ still }: { still: boolean }) {
  const body = useMemo(buildBody, []);
  const ring = useMemo(buildRing, []);
  const dpr = useThree((s) => s.viewport.dpr);
  const pointer = useThree((s) => s.pointer);
  const invalidate = useThree((s) => s.invalidate);

  /* Fit to whichever axis is tighter — the auth panel is portrait, and without
     this the outer field is cropped by the left and right edges. */
  const vw = useThree((s) => s.viewport.width);
  const vh = useThree((s) => s.viewport.height);
  const fit = Math.min(1, ((Math.min(vw, vh) / 2) * 0.94) / 1.95);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: still ? 1 : 0 },
      uSize: { value: 10 },
      uPulse: { value: 1 },
    }),
    [still],
  );

  /* Same clock and pulse, phase pinned formed — see buildRing(). */
  const ringUniforms = useMemo(
    () => ({
      uTime: uniforms.uTime,
      uPhase: { value: 1 },
      uSize: uniforms.uSize,
      uPulse: uniforms.uPulse,
    }),
    [uniforms],
  );

  useEffect(() => {
    uniforms.uSize.value = 10 * dpr;
    if (still) invalidate();
  }, [dpr, still, uniforms, invalidate]);

  const bodyRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (still) return;
    const d = Math.min(delta, 0.05);
    clock.current += d;
    const t = clock.current;
    uniforms.uTime.value = t;

    const c = t % CYCLE;
    if (c < SCATTER) {
      uniforms.uPhase.value = 0;
      uniforms.uPulse.value = 0.5;
    } else if (c < SCATTER + CONVERGE) {
      uniforms.uPhase.value = (c - SCATTER) / CONVERGE;
      uniforms.uPulse.value = 0.5 + 0.5 * uniforms.uPhase.value;
    } else if (c < SCATTER + CONVERGE + WORK) {
      uniforms.uPhase.value = 1;
      /* Working: the core breathes on a slow double beat. */
      const w = c - SCATTER - CONVERGE;
      uniforms.uPulse.value = 0.72 + 0.28 * Math.sin(w * 2.1) * Math.sin(w * 0.7);
    } else {
      const k = (c - SCATTER - CONVERGE - WORK) / RELEASE;
      uniforms.uPhase.value = 1 - k * k;
      uniforms.uPulse.value = 1 - k * 0.5;
    }

    const b = bodyRef.current;
    if (b) {
      b.rotation.y += d * 0.075;
      /* Ease toward the pointer rather than snapping — reads as weight. */
      b.rotation.x += (pointer.y * 0.16 - b.rotation.x) * 0.035;
      b.rotation.z += (pointer.x * 0.07 - b.rotation.z) * 0.035;
    }
    const r = ringRef.current;
    if (r) {
      r.rotation.y -= d * 0.16; // counter-rotation is the engineered detail
      r.rotation.x = 0.34 + Math.sin(t * 0.18) * 0.05 + pointer.y * 0.12;
      r.rotation.z = Math.sin(t * 0.13) * 0.04 + pointer.x * 0.05;
    }
  });

  return (
    <group scale={fit}>
      <group ref={bodyRef}>
        <Points field={body} uniforms={uniforms} />
      </group>
      <group ref={ringRef} rotation={[0.34, 0, 0]}>
        <Points field={ring} uniforms={ringUniforms} />
      </group>
    </group>
  );
}

export default function MindCore({ still = false }: { still?: boolean }) {
  return (
    <Canvas
      className="pointer-events-none"
      dpr={[1, 1.75]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0, 4.7], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene still={still} />
    </Canvas>
  );
}
