export function horizontalPosition(top, contentWidth, viewportWidth) {
  const travel = Math.max(0, contentWidth - viewportWidth);
  const offset = Math.max(0, Math.min(travel, -top));
  return { offset, progress: travel > 0 ? offset / travel : 0 };
}
