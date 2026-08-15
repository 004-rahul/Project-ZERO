/**
 * LATTICE — the hero's shader.
 *
 * A field of points that resolves from noise into an ordered crystalline
 * lattice, holds, and disperses again. Abstract by intent: no figure, no
 * object, nothing to recognise. The read is structure emerging from disorder,
 * which is what the product does, and it stays legible at any scale because
 * it never depends on resemblance.
 *
 * Craft notes, since each of these is doing real work:
 *  - Per-point stagger so the field arrives as a wave rather than a switch.
 *  - Perspective size attenuation, so depth is legible without any geometry.
 *  - Depth fog toward the page ground — this is what makes it volumetric
 *    rather than a flat scatter of dots.
 *  - Radial falloff in the fragment stage instead of a texture: no asset to
 *    load, and it stays crisp at any device pixel ratio.
 *  - Colour is driven by *resolution state*, not position — resolved points
 *    shift toward the rim hue, so the structure reads as it forms.
 */

export const latticeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0 = scattered, 1 = resolved
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uPointer;

  attribute vec3  aLattice;  // ordered target position
  attribute float aSeed;     // 0..1 per-point randomness
  attribute float aStagger;  // 0..1 arrival offset

  varying float vDepth;
  varying float vResolved;
  varying float vSeed;

  // Smooth, staggered per-point progress. Each point gets its own window
  // inside the global cycle, so the field converges as a travelling front.
  float stagger(float p, float offset) {
    float w = 0.55;                     // width of a point's own transition
    float s = clamp((p - offset * (1.0 - w)) / w, 0.0, 1.0);
    return s * s * (3.0 - 2.0 * s);     // smoothstep
  }

  void main() {
    float t = stagger(uProgress, aStagger);
    vResolved = t;
    vSeed = aSeed;

    // Idle drift, strongest while scattered — the field is never fully still,
    // but the resolved state is calm enough to read as deliberate.
    float drift = (1.0 - t) * 0.5 + 0.06;
    vec3 wander = vec3(
      sin(uTime * 0.32 + aSeed * 34.0),
      cos(uTime * 0.27 + aSeed * 51.0),
      sin(uTime * 0.21 + aSeed * 73.0)
    ) * drift * 0.34;

    vec3 pos = mix(position, aLattice, t) + wander;

    // Parallax: far points respond more than near ones, which reads as depth
    // rather than as the whole object being dragged.
    pos.xy += uPointer * (0.16 + 0.24 * (1.0 - t)) * (1.0 + aSeed * 0.5);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;

    gl_Position = projectionMatrix * mv;

    // Resolved points tighten; scattered points are larger and softer, so the
    // transition carries a change in density as well as position.
    float size = uSize * mix(1.5, 0.85, t) * (0.55 + aSeed * 0.75);
    gl_PointSize = size * uPixelRatio * (14.0 / max(vDepth, 0.1));
  }
`;

export const latticeFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uKey;
  uniform vec3  uRim;
  uniform vec3  uFog;
  uniform float uOpacity;

  varying float vDepth;
  varying float vResolved;
  varying float vSeed;

  void main() {
    // Round the point and give it a soft core. Cheaper and sharper than a
    // sprite texture, and it never blurs on a high-DPI display.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.5, d);
    core = pow(core, 2.4);

    // Hue follows resolution state, with a little per-point variance so the
    // field does not read as a single flat colour.
    vec3 col = mix(uKey, uRim, vResolved * (0.55 + vSeed * 0.45));

    // Resolved points burn slightly hotter — the structure is the subject.
    col += vec3(0.16) * vResolved * core;

    // Depth fog toward the page ground. This is the line between a flat
    // scatter of dots and something that occupies space.
    float fog = 1.0 - smoothstep(7.0, 24.0, vDepth);
    col = mix(uFog, col, fog);

    float alpha = core * uOpacity * mix(0.42, 1.0, vResolved) * fog;
    gl_FragColor = vec4(col, alpha);
  }
`;
