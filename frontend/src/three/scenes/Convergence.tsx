import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  coreFragment,
  coreVertex,
  nodesFragment,
  nodesVertex,
  tracesFragment,
  tracesVertex,
} from "../shaders/convergence";
import { readSceneColors } from "../readSceneColors";

const NODES = 2600;
const TRACES = 18;
const PER_TRACE = 72;
const CORE = 900;
const CYCLE = 11; // seconds for one question → answer → hold

/**
 * Builds the field, the paths, and the core.
 *
 * Two composition rules do most of the work here:
 *
 * The field is clumped, never uniform. Uniformly random points render as
 * television static; clumps read as distinct sources — repositories, threads,
 * documents — which is what they are meant to be.
 *
 * Paths are curved, never straight. Straight lines converging on a point is
 * a starburst, and a starburst reads as a cheap effect. An arc reads as a
 * route something travelled.
 */
function build() {
  /* ── the dormant field ── */
  const nodePos = new Float32Array(NODES * 3);
  const nodeSeed = new Float32Array(NODES);
  const nodeOrigin = new Float32Array(NODES).fill(-1);

  const CLUMPS = 22;
  const clumps: THREE.Vector3[] = Array.from({ length: CLUMPS }, () =>
    new THREE.Vector3().randomDirection().multiplyScalar(3.4 + Math.random() * 2.6),
  );

  for (let i = 0; i < NODES; i++) {
    const c = clumps[i % CLUMPS];
    nodePos[i * 3] = c.x + (Math.random() - 0.5) * 2.1;
    nodePos[i * 3 + 1] = c.y + (Math.random() - 0.5) * 2.1;
    nodePos[i * 3 + 2] = c.z + (Math.random() - 0.5) * 2.1;
    nodeSeed[i] = Math.random();
  }

  /* ── the traces: real nodes become sources, so the light comes from
        somewhere that already existed rather than from nowhere ── */
  const tracePos = new Float32Array(TRACES * PER_TRACE * 3);
  const traceT = new Float32Array(TRACES * PER_TRACE);
  const traceIdx = new Float32Array(TRACES * PER_TRACE);
  const traceSeed = new Float32Array(TRACES * PER_TRACE);

  const chosen = new Set<number>();
  for (let t = 0; t < TRACES; t++) {
    let n = Math.floor(Math.random() * NODES);
    while (chosen.has(n)) n = Math.floor(Math.random() * NODES);
    chosen.add(n);
    nodeOrigin[n] = t;

    const from = new THREE.Vector3(nodePos[n * 3], nodePos[n * 3 + 1], nodePos[n * 3 + 2]);
    const to = new THREE.Vector3(0, 0, 0);

    // Control point pushed perpendicular to the source direction, so every
    // path bows a different way and the set never reads as symmetric.
    const mid = from.clone().multiplyScalar(0.5);
    const perp = new THREE.Vector3().randomDirection();
    perp.sub(from.clone().normalize().multiplyScalar(perp.dot(from.clone().normalize())));
    const ctrl = mid.add(perp.normalize().multiplyScalar(1.1 + Math.random() * 1.4));

    const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to);
    const pts = curve.getPoints(PER_TRACE - 1);

    for (let p = 0; p < PER_TRACE; p++) {
      const k = t * PER_TRACE + p;
      tracePos[k * 3] = pts[p].x;
      tracePos[k * 3 + 1] = pts[p].y;
      tracePos[k * 3 + 2] = pts[p].z;
      traceT[k] = p / (PER_TRACE - 1);
      traceIdx[k] = t;
      traceSeed[k] = Math.random();
    }
  }

  /* ── the answer ── */
  const corePos = new Float32Array(CORE * 3);
  const coreSeed = new Float32Array(CORE);
  for (let i = 0; i < CORE; i++) {
    // Density biased hard inward so the core has a hot centre rather than
    // being an evenly-filled ball.
    const r = Math.pow(Math.random(), 2.4) * 0.42;
    const v = new THREE.Vector3().randomDirection().multiplyScalar(r);
    corePos[i * 3] = v.x;
    corePos[i * 3 + 1] = v.y;
    corePos[i * 3 + 2] = v.z;
    coreSeed[i] = Math.random();
  }

  return {
    nodePos, nodeSeed, nodeOrigin,
    tracePos, traceT, traceIdx, traceSeed,
    corePos, coreSeed,
  };
}

export default function Convergence() {
  const group = useRef<THREE.Group>(null);
  const nodesMat = useRef<THREE.ShaderMaterial>(null);
  const tracesMat = useRef<THREE.ShaderMaterial>(null);
  const coreMat = useRef<THREE.ShaderMaterial>(null);

  const g = useMemo(build, []);
  const c = useMemo(readSceneColors, []);
  const { viewport } = useThree();
  const dpr = Math.min(viewport.dpr, 2);

  const shared = useMemo(
    () => ({
      time: { value: 0 },
      pointer: { value: new THREE.Vector2() },
      key: new THREE.Color(c.key),
      rim: new THREE.Color(c.rim),
      fog: new THREE.Color(c.fog),
      // The dormant field sits close to the ground colour, lifted just enough
      // to be present. Too bright and the ignition has nowhere to go.
      dim: new THREE.Color(c.fog).lerp(new THREE.Color(c.key), 0.34),
    }),
    [c],
  );

  const nodesU = useMemo(
    () => ({
      uTime: shared.time,
      uCycle: { value: CYCLE },
      uPixelRatio: { value: dpr },
      uPointer: shared.pointer,
      uDim: { value: shared.dim },
      uKey: { value: shared.key },
      uFog: { value: shared.fog },
    }),
    [shared, dpr],
  );

  const tracesU = useMemo(
    () => ({
      uTime: shared.time,
      uCycle: { value: CYCLE },
      uPixelRatio: { value: dpr },
      uPointer: shared.pointer,
      uKey: { value: shared.key },
      uRim: { value: shared.rim },
      uFog: { value: shared.fog },
    }),
    [shared, dpr],
  );

  const coreU = useMemo(
    () => ({
      uTime: shared.time,
      uCharge: { value: 0 },
      uPixelRatio: { value: dpr },
      uPointer: shared.pointer,
      uRim: { value: shared.rim },
    }),
    [shared, dpr],
  );

  useFrame((state, delta) => {
    shared.time.value += delta;
    const t = shared.time.value;

    shared.pointer.value.lerp(state.pointer, 1 - Math.pow(0.001, delta));

    // Charge = the fraction of traces whose pulse has already landed. The
    // core brightens as evidence arrives, not on a timer — the answer is
    // built by its sources, and the animation should be honest about that.
    let landed = 0;
    for (let i = 0; i < TRACES; i++) {
      const phase = ((t / CYCLE + i * 0.6180339887) % 1 + 1) % 1;
      if (phase >= 0.2 && phase < 0.9) landed++;
    }
    const target = landed / TRACES;
    if (coreMat.current) {
      const u = coreMat.current.uniforms.uCharge;
      u.value = THREE.MathUtils.damp(u.value, target, 4, delta);
    }

    if (group.current) {
      group.current.rotation.y += delta * 0.038;
      group.current.rotation.x = Math.sin(t * 0.11) * 0.07;
    }
  });

  return (
    <group ref={group}>
      {/* the dormant field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[g.nodePos, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[g.nodeSeed, 1]} />
          <bufferAttribute attach="attributes-aOriginOf" args={[g.nodeOrigin, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={nodesMat}
          vertexShader={nodesVertex}
          fragmentShader={nodesFragment}
          uniforms={nodesU}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* the evidence threads */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[g.tracePos, 3]} />
          <bufferAttribute attach="attributes-aT" args={[g.traceT, 1]} />
          <bufferAttribute attach="attributes-aTrace" args={[g.traceIdx, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[g.traceSeed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={tracesMat}
          vertexShader={tracesVertex}
          fragmentShader={tracesFragment}
          uniforms={tracesU}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* the answer */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[g.corePos, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[g.coreSeed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={coreMat}
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={coreU}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
