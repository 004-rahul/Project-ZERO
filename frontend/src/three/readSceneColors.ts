/**
 * Reads the scene colour tokens off the document.
 *
 * The 3D layer must belong to the theme rather than float on top of it, so
 * its colours come from the same contract as everything else — swap the
 * theme and the shader follows.
 */
export function readSceneColors() {
  const s = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;

  return {
    key: read("--scene-key", "#3b6ff5"),
    rim: read("--scene-rim", "#22d3a7"),
    fog: read("--scene-fog", "#08090b"),
  };
}
