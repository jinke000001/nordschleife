// Illustrative geometry in arbitrary model units. These are NOT surveyed dimensions.
export function roadPoint(progress, radius) {
  const t = Math.max(0, Math.min(1, progress));
  const angle = (-110 + 220 * t) * Math.PI / 180;
  const edge = Math.min(1, t / .15, (1 - t) / .15);
  const transition = edge * edge * (3 - 2 * edge);
  const height = 1 - Math.max(0, (17 - radius) / 5) * 2.8 * transition;
  return [Math.sin(angle) * radius, height, Math.cos(angle) * radius];
}

