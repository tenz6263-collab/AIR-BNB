import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunkPhotos } from '../photos.js';

test('chunkPhotos matches the reference row pattern', () => {
  assert.deepEqual(chunkPhotos(1), [1]);
  assert.deepEqual(chunkPhotos(2), [2]);
  assert.deepEqual(chunkPhotos(3), [1, 2]);
  assert.deepEqual(chunkPhotos(5), [1, 2, 2]);
  assert.deepEqual(chunkPhotos(6), [1, 2, 1, 2]);
  assert.deepEqual(chunkPhotos(7), [1, 2, 1, 2, 1]);
  assert.deepEqual(chunkPhotos(10), [1, 2, 1, 2, 1, 2, 1]);
});

test('chunkPhotos always accounts for every photo', () => {
  for (let n = 0; n <= 20; n += 1) {
    const total = chunkPhotos(n).reduce((a, b) => a + b, 0);
    assert.equal(total, n);
  }
});
