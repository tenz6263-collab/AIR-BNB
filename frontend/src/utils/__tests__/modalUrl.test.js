import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildModalHref, parseModalParams } from '../modalUrl.js';

test('parseModalParams reads tour and lightbox state', () => {
  assert.deepEqual(parseModalParams(''), { tour: false, index: null });
  assert.deepEqual(parseModalParams('?modal=PHOTO_TOUR_SCROLLABLE'), { tour: true, index: null });
  assert.deepEqual(parseModalParams('?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1000'), { tour: true, index: 0 });
  assert.deepEqual(parseModalParams('?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1042'), { tour: true, index: 42 });
});

test('parseModalParams ignores items without the tour or out of range', () => {
  assert.deepEqual(parseModalParams('?modalItem=1003'), { tour: false, index: null });
  assert.deepEqual(parseModalParams('?modal=PHOTO_TOUR_SCROLLABLE&modalItem=999'), { tour: true, index: null });
  assert.deepEqual(parseModalParams('?modal=PHOTO_TOUR_SCROLLABLE&modalItem=abc'), { tour: true, index: null });
  assert.deepEqual(parseModalParams('?modal=OTHER&modalItem=1001'), { tour: false, index: null });
});

test('buildModalHref writes and clears params while keeping others', () => {
  const base = 'http://localhost/rooms/1?ref=email#reviews';
  assert.equal(buildModalHref(base, { tour: true, index: null }), '/rooms/1?ref=email&modal=PHOTO_TOUR_SCROLLABLE#reviews');
  assert.equal(
    buildModalHref(base, { tour: true, index: 7 }),
    '/rooms/1?ref=email&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1007#reviews',
  );
  assert.equal(buildModalHref('http://localhost/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1007', { tour: false }), '/');
});
