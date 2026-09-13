import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewsForTopic } from '../reviews.js';

const reviews = [
  { text: 'The jacuzzi was spotless and the host was helpful.' },
  { text: 'Great location near the beach.' },
];

test('reviewsForTopic matches keywords per topic and passes through with no topic', () => {
  assert.equal(reviewsForTopic(reviews, null).length, 2);
  assert.equal(reviewsForTopic(reviews, 'Hot tub').length, 1);
  assert.equal(reviewsForTopic(reviews, 'Location').length, 1);
  assert.equal(reviewsForTopic(reviews, 'Hospitality').length, 1);
  assert.equal(reviewsForTopic(reviews, 'Decor').length, 0);
});
