import test from 'node:test';
import assert from 'node:assert/strict';
import { readingStep, restoreTop } from '../src/pages/editorial/reading-position.js';

test('reading follows crossed boundaries in both directions, including before first step', () => {
  assert.equal(readingStep([500, 1100, 1700], 300), -1);
  assert.equal(readingStep([-100, 500, 1100], 300), 0);
  assert.equal(readingStep([-800, -200, 400], 300), 1);
  assert.equal(readingStep([-1500, -900, -300], 300), 2);
  assert.equal(readingStep([-100, 500, 1100], 300), 0);
  assert.equal(readingStep([], 300), -1);
});
test('return keeps exact desktop scroll and scales a section after viewport changes', () => {
  const saved = { top: 6400, width: 1280, height: 720, progress: .4 };
  assert.equal(restoreTop(saved, { width: 1280, height: 720 }, { top: 3000, height: 1000 }), 6400);
  assert.equal(restoreTop(saved, { width: 390, height: 844 }, { top: 7000, height: 2000 }), 7800);
  assert.equal(restoreTop(saved, { width: 390, height: 844 }, null), 6400);
});
