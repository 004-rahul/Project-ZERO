import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { latticeFragment, latticeVertex } from "../shaders/lattice";
import { readSceneColors } from "../readSceneColors";

const COUNT = 16000;

/**
 * Builds the two position sets the shader interpolates between.
 *
 * Scatter: clumped, never uniform. Uniform random points render as television
 * static — clumping is what makes it read as scattered *sources* rather than
 * noise. The scatter volume also stays close to the resolved extent so the
 * field never fills the frame with dust.
 *
 * Lattice: a cubic grid clipped to a sphere, jittered very slightly. Perfect
 * regularity looks synthetic; a fraction of a percent of jitter reads as
 * grown rather than generated.
 */
function buildGeometry() {
  const scatter = new Float32Array(COUNT * 3);
  const lattice = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  const stagger = new Float32Array(COUNT);

  // Clump centres for the scattered state.
  const CLUMPS = 14;
  const centres: THREE.Vector3[] = Array.from({ length: CLUMPS }, () => {
    const v = new THREE.Vector3().randomDirection();
    return v.multiplyScalar(2.2 + Math.random() * 2.4);
  });

  const step = 0.42;
  const radius = 3.1;
  let i = 0;

  // Walk a cubic grid, keep what falls inside the sphere.
  const targets: THREE.Vector3[] = [];
  for (let x = -radius; x <= radius; x += step) {
    for (let y = -radius; y <= radius; y += step) {
      for (let z = -radius; z <= radius; z += step) {
        const v = new THREE.Vector3(x, y, z);
        const r = v.length();
        if (r > radius) continue;
        // Bias toward a shell so the interior does not read as a solid mass.
        if (r < radius * 0.45 && Math.random() > 0.25) continue;
        targets.push(v);
      }
    }
  }

  for (i = 0; i < COUNT; i++) {
    const t = targets[i % targets.length];
    const j = 0.05;
    lattice[i * 3] = t.x + (Math.random() - 0.5) * j;
    lattice[i * 3 + 1] = t.y + (Math.random() - 0.5) * j;
    lattice[i * 3 + 2] = t.z + (Math.random() - 0.5) * j;

    const c = centres[i % CLUMPS];
    const spread = 1.15;
    scatter[i * 3] = c.x + (Math.random() - 0.5) * spread * 2;
    scatter[i * 3 + 1] = c.y + (Math.random() - 0.5) * spread * 2;
    scatter[i * 3 + 2] = c.z + (Math.random() - 0.5) * spread * 2;

    seed[i] = Math.random();
    // Stagger by height so the field resolves as a front sweeping upward,
    // rather than everywhere at once.
    stagger[i] = (lattice[i * 3 + 1] + radius) / (radius * 2);
  }

  return { scatter, lattice, seed, stagger };
}

export default function LatticeField() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const attrs = useMemo(buildGeometry, []);
  const colors = useMemo(readSceneColors, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 5.2 },
      uPixelRatio: { value: Math.min(viewport.dpr, 2) },
      uPointer: { value: new THREE.Vector2() },
      uKey: { value: new THREE.Color(colors.key) },
      uRim: { value: new THREE.Color(colors.rim) },
      uFog: { value: new THREE.Color(colors.fog) },
      uOpacity: { value: 0.9 },
    }),
    [colors, viewport.dpr],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;

    // The cycle: resolve, hold resolved, disperse, hold scattered briefly.
    // Resolved holds longest — the structure is the subject, so it owns most
    // of the screen time.
    const CYCLE = 15;
    const p = (u.uTime.value % CYCLE) / CYCLE;
    const eased =
      p < 0.28
        ? p / 0.28
        : p < 0.72
          ? 1
          : p < 0.9
            ? 1 - (p - 0.72) / 0.18
            : 0;
    u.uProgress.value = THREE.MathUtils.damp(u.uProgress.value, eased, 3.5, delta);

    u.uPointer.value.set(state.pointer.x, state.pointer.y);

    if (points.current) {
      points.current.rotation.y += delta * 0.055;
      points.current.rotation.x = Math.sin(u.uTime.value * 0.14) * 0.09;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attrs.scatter, 3]} />
        <bufferAttribute attach="attributes-aLattice" args={[attrs.lattice, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[attrs.seed, 1]} />
        <bufferAttribute attach="attributes-aStagger" args={[attrs.stagger, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={latticeVertex}
        fragmentShader={latticeFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        key={size.width}
      />
    </points>
  );
}
