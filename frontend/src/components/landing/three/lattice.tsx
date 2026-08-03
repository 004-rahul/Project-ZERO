"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Knowledge Lattice (Design Bible §19.4) — a React Three Fiber layer used as
 * depth behind hero and closing sections: a slowly rotating volumetric graph
 * of nodes and edges that drifts with the pointer. Two tones: `light` renders
 * fine violet linework for the cream canvas, `dark` renders emissive nodes for
 * graphite bands. One Points + one LineSegments object, no postprocessing —
 * cheap enough to hold 60fps on integrated graphics.
 */

const PALETTE = {
  light: { node: "#7C3AED", edge: "#7C3AED", nodeOpacity: 0.5, edgeOpacity: 0.16, size: 0.045 },
  dark: { node: "#C4B5FD", edge: "#8B5CF6", nodeOpacity: 0.95, edgeOpacity: 0.3, size: 0.06 },
} as const;

function buildGraph(count: number, radius: number, linkDist: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    // Fibonacci shell, pushed inward randomly so it reads volumetric, not hollow.
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    const shell = radius * (0.62 + Math.random() * 0.38);
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * shell,
        y * shell * 0.82,
        Math.sin(theta) * r * shell,
      ),
    );
  }

  const positions = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  });

  const seg: number[] = [];
  const degree = new Uint8Array(pts.length);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (degree[i] > 3 || degree[j] > 3) continue;
      if (pts[i].distanceTo(pts[j]) < linkDist) {
        seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        degree[i]++;
        degree[j]++;
      }
    }
  }
  return { positions, edges: new Float32Array(seg) };
}

function Graph({ tone }: { tone: "light" | "dark" }) {
  const group = useRef<THREE.Group>(null);
  const { positions, edges } = useMemo(() => buildGraph(420, 2.6, 0.72), []);
  const c = PALETTE[tone];
  const pointer = useThree((s) => s.pointer);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.075;
    // ease toward the pointer instead of snapping — reads as weight
    g.rotation.x += (pointer.y * 0.22 - g.rotation.x) * 0.04;
    g.rotation.z += (pointer.x * 0.1 - g.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={c.node}
          size={c.size}
          sizeAttenuation
          transparent
          opacity={c.nodeOpacity}
          depthWrite={false}
          blending={tone === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={c.edge}
          transparent
          opacity={c.edgeOpacity}
          depthWrite={false}
          blending={tone === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function Lattice({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Canvas
      className="pointer-events-none"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Graph tone={tone} />
    </Canvas>
  );
}
