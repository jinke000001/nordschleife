import { trackLabels } from '../../data/track-labels.js';
import { cornerRecords } from '../../data/corner-records/index.js';

// Story anchors are the corners whose archive photo is verified to show the
// actual location — the same guard the home chapter uses before showing one.
export const photographedSlugs = new Set(['hatzenbach', 'schwedenkreuz', 'fuchsroehre', 'adenauer-forst', 'metzgesfeld', 'karussell', 'hohe-acht', 'brunnchen', 'pflanzgarten', 'kleines-karussell', 'galgenkopf', 'doettinger-hoehe']);

const archivedSlugs = new Set(cornerRecords.map(corner => corner.slug));

export function isStoryAnchor(label) {
  return Boolean(label.slug && archivedSlugs.has(label.slug) && photographedSlugs.has(label.slug));
}

// Split the lap into anchor cards and the plain names between them, derived
// entirely from trackLabels order. A run of two or more consecutive plain
// names collapses into one gap summary; a lone plain name stays a stop.
export function buildCircuitItems(labels = trackLabels) {
  const items = [];
  let buffer = [];
  const flush = nextAnchor => {
    if (!buffer.length) return;
    if (buffer.length >= 2) {
      const previousAnchor = items.findLast(item => item.type === 'anchor')?.label ?? null;
      items.push({ type: 'gap', key: `gap-${buffer[0].index}`, labels: buffer, from: previousAnchor, to: nextAnchor });
    } else {
      items.push({ type: 'stop', label: buffer[0].label, index: buffer[0].index });
    }
    buffer = [];
  };
  labels.forEach((label, index) => {
    if (isStoryAnchor(label)) {
      flush(label);
      items.push({ type: 'anchor', label, index });
    } else {
      buffer.push({ label, index });
    }
  });
  flush(null);
  return items;
}
