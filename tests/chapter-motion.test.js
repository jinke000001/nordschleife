import test from 'node:test';
import assert from 'node:assert/strict';
import { horizontalPosition } from '../src/pages/editorial/chapter-motion.js';

test('chapter stays at the first image before entry and releases at the last full frame', () => {
  assert.deepEqual(horizontalPosition(300, 2600, 1000), { offset: 0, progress: 0 });
  assert.deepEqual(horizontalPosition(-800, 2600, 1000), { offset: 800, progress: .5 });
  assert.deepEqual(horizontalPosition(-2400, 2600, 1000), { offset: 1600, progress: 1 });
});

test('resizing to a gallery that fits never produces NaN or negative movement', () => {
  assert.deepEqual(horizontalPosition(-800, 900, 1000), { offset: 0, progress: 0 });
  assert.deepEqual(horizontalPosition(-800, 1000, 1000), { offset: 0, progress: 0 });
});

test('reverse scrolling returns to exactly the same composition', () => {
  const stops = [0, -100, -600, -1600];
  const forward = stops.map(top => horizontalPosition(top, 2600, 1000));
  const reverse = [...stops].reverse().map(top => horizontalPosition(top, 2600, 1000)).reverse();
  assert.deepEqual(forward, reverse);
});
