import test from 'node:test';
import assert from 'node:assert/strict';
import { trackLabels } from '../src/data/track-labels.js';
import { buildCircuitItems, isStoryAnchor } from '../src/pages/editorial/circuit-groups.js';

test('circuit items keep all 43 names exactly once and in lap order', () => {
  const items = buildCircuitItems();
  const indices = items.flatMap(item => item.type === 'gap' ? item.labels.map(entry => entry.index) : [item.index]);
  assert.deepEqual(indices, trackLabels.map((_, index) => index));
});

test('story anchors are the 12 photographed archive corners', () => {
  const anchors = trackLabels.filter(isStoryAnchor);
  assert.equal(anchors.length, 12);
  for (const label of anchors) assert.ok(label.slug, `Anchor without slug: ${label.de}`);
});

test('gaps fold runs of at least two plain names and know their bounding anchors', () => {
  const items = buildCircuitItems();
  const gaps = items.filter(item => item.type === 'gap');
  for (const gap of gaps) assert.ok(gap.labels.length >= 2, 'Gap with fewer than two names');
  const stops = items.filter(item => item.type === 'stop');
  for (const stop of stops) assert.ok(!isStoryAnchor(stop.label), 'Anchor rendered as plain stop');
  const first = gaps.find(gap => gap.labels[0].index === 0);
  assert.equal(first.from, null);
  assert.equal(first.to.de, 'Hatzenbach');
  const last = gaps.at(-1);
  assert.equal(last.to, null);
  assert.equal(last.from.de, 'Döttinger Höhe');
});
