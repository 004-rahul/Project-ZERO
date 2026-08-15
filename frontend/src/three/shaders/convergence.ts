/**
 * CONVERGENCE — the system's identity.
 *
 * What it shows, and why this and not something else:
 *
 * A dormant field of knowledge. A question fires. A specific handful of
 * sources ignite, send a pulse inward along its own path, and an answer
 * assembles at the centre as each one lands. Then — the part that matters —
 * **the threads back to those sources do not disappear.** The answer stays
 * wired to what produced it until the next question begins.
 *
 * Every other AI visual shows connections appearing and vanishing, because
 * every other product forgets. Ours does not, so the persistence is the beat
 * that carries the identity. It is also literally the Trust Layer: an answer
 * you can trace back to its evidence.
 *
 * Abstract by construction — no figure, no object, nothing to recognise, so
 * it cannot read as clip art at any density.
 */

/* ─────────────────────────── the dormant field ─────────────────────────── */

export const nodesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCycle;
  uniform float uPixelRatio;
  uniform vec2  uPointer;

  attribute float aSeed;
  attribute float aOriginOf;  // trace index if this node is a source, else -1

  varying float vIgnite;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vSeed = aSeed;

    // Source nodes ignite when their own trace fires, then cool slowly. The
    // rest of the field breathes almost imperceptibly — present, not asleep.
    float ignite = 0.0;
    if (aOriginOf >= 0.0) {
      float phase = fract(uTime / uCycle + aOriginOf * 0.6180339887);
      // Sharp attack, long decay: a source lights the instant it is used.
      ignite = exp(-phase * 5.0) * step(phase, 0.85);
    }
    vIgnite = ignite;

    vec3 pos = position;

    // Idle drift. Small enough that the field reads as stable — a knowledge
    // base that visibly churns would say the wrong thing about the product.
    pos += vec3(
      sin(uTime * 0.21 + aSeed * 40.0),
      cos(uTime * 0.17 + aSeed * 63.0),
      sin(uTime * 0.13 + aSeed * 27.0)
    ) * 0.045;

    // Depth-weighted parallax: far nodes travel further, which reads as
    // volume rather than as the whole object being dragged by the cursor.
    pos.xy += uPointer * (0.10 + aSeed * 0.22);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;

    float size = mix(1.5, 5.0, ignite) * (0.6 + aSeed * 0.7);
    gl_PointSize = size * uPixelRatio * (13.0 / max(vDepth, 0.1));
  }
`;

export const nodesFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uDim;
  uniform vec3 uKey;
  uniform vec3 uFog;

  varying float vIgnite;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);

    vec3 col = mix(uDim, uKey, vIgnite);
    col += vec3(0.35) * vIgnite * core;

    // Depth fog toward the page ground — the difference between a volume
    // and a flat scatter of dots.
    float fog = 1.0 - smoothstep(6.0, 22.0, vDepth);
    col = mix(uFog, col, fog);

    float alpha = core * fog * mix(0.30, 1.0, vIgnite) * (0.5 + vSeed * 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;

/* ──────────────────── the traces: pulse, then persist ──────────────────── */

export const tracesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCycle;
  uniform float uPixelRatio;
  uniform vec2  uPointer;

  attribute float aT;      // 0 at the source, 1 at the core
  attribute float aTrace;  // which trace this point belongs to
  attribute float aSeed;

  varying float vBright;
  varying float vT;
  varying float vDepth;

  void main() {
    vT = aT;

    float phase = fract(uTime / uCycle + aTrace * 0.6180339887);

    // The pulse crosses the trace in the first fifth of the cycle, easing out
    // so it decelerates into the core rather than slamming into it.
    float travel = clamp(phase / 0.2, 0.0, 1.0);
    travel = 1.0 - pow(1.0 - travel, 3.0);

    // Bright head, gaussian-tight.
    float head = exp(-pow((travel - aT) / 0.055, 2.0));

    // Residual: everything the pulse has already crossed keeps a low glow.
    // This is the citation trail, and it is the whole idea.
    float residual = smoothstep(0.0, 0.04, travel - aT) * 0.16;

    // Both fade near the end of the cycle so the next question starts clean.
    float alive = 1.0 - smoothstep(0.80, 0.97, phase);

    vBright = (head + residual) * alive;

    vec3 pos = position;
    pos.xy += uPointer * (0.10 + (1.0 - aT) * 0.14);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;

    float size = (0.9 + head * 3.6) * (0.7 + aSeed * 0.5);
    gl_PointSize = size * uPixelRatio * (13.0 / max(vDepth, 0.1));
  }
`;

export const tracesFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uKey;
  uniform vec3 uRim;
  uniform vec3 uFog;

  varying float vBright;
  varying float vT;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);

    // Colour shifts along the path: raw source at the far end, resolved
    // answer as it nears the centre. The journey is legible in the hue.
    vec3 col = mix(uKey, uRim, smoothstep(0.35, 1.0, vT));
    col += vec3(0.4) * pow(vBright, 1.5) * core;

    float fog = 1.0 - smoothstep(6.0, 22.0, vDepth);
    col = mix(uFog, col, fog);

    gl_FragColor = vec4(col, core * vBright * fog);
  }
`;

/* ───────────────────────────── the answer ──────────────────────────────── */

export const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCharge;   // 0..1, driven by how many pulses have landed
  uniform float uPixelRatio;
  uniform vec2  uPointer;

  attribute float aSeed;

  varying float vSeed;

  void main() {
    vSeed = aSeed;

    // The core contracts as it charges: a resolved answer is dense and small.
    // A large soft core reads as a smudge, which is the failure mode here.
    vec3 pos = position * mix(1.5, 0.72, uCharge);

    pos += vec3(
      sin(uTime * 1.1 + aSeed * 30.0),
      cos(uTime * 0.9 + aSeed * 44.0),
      sin(uTime * 1.3 + aSeed * 57.0)
    ) * 0.02;

    pos.xy += uPointer * 0.06;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = (1.4 + uCharge * 3.2) * (0.6 + aSeed * 0.8)
                 * uPixelRatio * (13.0 / max(-mv.z, 0.1));
  }
`;

export const coreFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uRim;
  uniform float uCharge;

  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = pow(1.0 - smoothstep(0.0, 0.5, d), 1.8);

    // Burns toward white as it resolves — the one genuinely hot thing on the
    // page, which is what makes it read as the subject.
    vec3 col = mix(uRim, vec3(1.0), uCharge * 0.7);

    gl_FragColor = vec4(col, core * (0.25 + uCharge * 0.75) * (0.5 + vSeed * 0.5));
  }
`;
