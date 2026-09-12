import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { Listing } from '../src/models/Listing.js';

const require = createRequire(import.meta.url);
const seed = require('../src/data/listing.json');

test('seed listing satisfies the Mongoose schema', () => {
  const doc = new Listing(seed);
  const err = doc.validateSync();
  assert.equal(err, undefined, err && Object.keys(err.errors).join(', '));
});

test('seed content is internally consistent', () => {
  const photos = seed.rooms.flatMap((r) => r.photos);
  assert.equal(photos.length, 43);
  assert.equal(seed.rating.count, seed.reviewsSummary.count);
  assert.equal(String(seed.rating.value), seed.reviewsSummary.rating);
  assert.equal(seed.reviewsSummary.distribution.reduce((a, b) => a + b, 0), 100);
  for (const src of [...photos, ...seed.heroPhotos, ...seed.sleeping.map((s) => s.image)]) {
    assert.match(src, /^\/assets\/images\/[\w./-]+\.jpe?g$/);
  }
  const icons = new Set(seed.amenityGroups.flatMap((g) => g.items.map((i) => i.icon)));
  assert.ok(icons.size > 30, 'amenity icons present');
});
