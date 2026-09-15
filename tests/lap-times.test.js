import test from 'node:test';
import assert from 'node:assert/strict';
import { getSortedTimes, lapTimes } from '../src/data/lap-times.js';

test('default comparison includes only the full 20.832 km lap', () => {
  const result = getSortedTimes();
  assert.ok(result.length > 0);
  assert.ok(result.every(entry => entry.circuit === '20.832 km'));
});

test('historical layout never mixes full-lap entries into its benchmark', () => {
  const result = getSortedTimes('all', true, '20.6 km');
  assert.ok(result.length > 0);
  assert.ok(result.every(entry => entry.circuit === '20.6 km'));
});

test('powertrain and prototype filters remain effective within a layout', () => {
  const result = getSortedTimes('electric', false, '20.832 km');
  assert.ok(result.length > 0);
  assert.ok(result.every(entry => entry.powerType === 'electric' && entry.category !== 'prototype'));
  assert.ok(getSortedTimes('hybrid', true, '20.832 km').some(entry => entry.category === 'prototype'));
});

test('sorting is ascending and does not mutate the source archive', () => {
  const before = lapTimes.map(entry => entry.name);
  const result = getSortedTimes('all', true, '20.832 km');
  assert.deepEqual(lapTimes.map(entry => entry.name), before);
  assert.ok(result.every((entry, index) => index === 0 || entry.timeMs >= result[index - 1].timeMs));
});

test('unrecognised layout safely falls back to the full circuit', () => {
  assert.ok(getSortedTimes('all', true, 'invalid').every(entry => entry.circuit === '20.832 km'));
});
