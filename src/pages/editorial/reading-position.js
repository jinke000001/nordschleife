export function readingStep(tops, boundary) {
  let active = -1;
  tops.forEach((top, index) => { if (top <= boundary) active = index; });
  return active;
}

export function restoreTop(saved, viewport, section) {
  if (!section || (saved.width === viewport.width && saved.height === viewport.height)) return saved.top;
  return Math.max(0, section.top + saved.progress * section.height);
}
