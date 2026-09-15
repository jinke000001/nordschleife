import test from 'node:test';
import assert from 'node:assert/strict';
import { trackLabels, trackLabelId, trackLabelKey } from '../src/data/track-labels.js';
import { trackNameNotes } from '../src/data/track-name-notes.js';
import { cornerRecords } from '../src/data/corner-records/index.js';

test('the complete map preserves all 43 named locations and every location has a reading target', () => {
  assert.equal(trackLabels.length, 43);
  assert.equal(new Set(trackLabels.map(trackLabelId)).size, 43);
  assert.equal(new Set(trackLabels.map(trackLabelKey)).size, 43);
  for (const label of trackLabels) {
    const record = cornerRecords.find(corner => corner.slug === label.slug);
    assert.ok(record?.explanation || trackNameNotes[label.de], `Missing story for ${label.de}`);
    assert.ok(label.st < label.ed, `Invalid map range for ${label.de}`);
  }
});
test('reading order follows the original complete map, including places without an archive', () => {
  for (let index = 1; index < trackLabels.length; index++) {
    assert.ok(trackLabels[index].st >= trackLabels[index - 1].st, 'Map and reading order diverged');
  }
  assert.equal(trackLabelKey(trackLabels.find(label => label.de === 'Aremberg')), 'Aremberg');
  assert.equal(trackLabelKey(trackLabels.find(label => label.de === 'Caracciola-Karussell')), 'karussell');
});
