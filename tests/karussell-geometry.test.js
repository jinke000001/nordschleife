import test from 'node:test';
import assert from 'node:assert/strict';

import * as model from '../src/three/karussell-geometry.js';

test('model provides a finite road surface and returns to level at each end', () => {
  assert.equal(typeof model.roadPoint, 'function', 'road surface is not implemented');
  for (let step = 0; step <= 100; step++) {
    const t = step / 100;
    for (const radius of [12, 17, 23]) {
      assert.ok(model.roadPoint(t, radius).every(Number.isFinite));
    }
  }
  for (const t of [0, 1]) {
    assert.equal(model.roadPoint(t, 12)[1], model.roadPoint(t, 17)[1]);
  }
});

test('banked concrete rises to the outside, and meets level asphalt without a crack', () => {
  assert.equal(typeof model.roadPoint, 'function');
  const inner = model.roadPoint(.5, 12);
  const seam = model.roadPoint(.5, 17);
  const outer = model.roadPoint(.5, 23);
  assert.ok(inner[1] < seam[1]);
  assert.equal(seam[1], outer[1]);
});

test('surface mesh contains finite vertices and upward-facing triangles', () => {
  assert.equal(typeof model.createRoadGeometry, 'function');
  const geometry = model.createRoadGeometry(12, 17);
  assert.ok(geometry.attributes.position.count > 100);
  assert.ok(Array.from(geometry.attributes.position.array).every(Number.isFinite));
  for (let i = 1; i < geometry.attributes.normal.array.length; i += 3) {
    assert.ok(geometry.attributes.normal.array[i] > 0);
  }
  geometry.dispose();
});
