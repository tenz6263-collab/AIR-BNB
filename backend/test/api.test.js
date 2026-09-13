import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const SLUG = 'romantic-jacuzzi-1bhk-candolim-mirashya-ug10';
let server;
let base;

before(async () => {
  process.env.NODE_ENV = 'test';
  const app = createApp({ clientOrigin: '' });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('health reports the in-memory dataset when Mongo is absent', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.database, 'memory');
});

test('listing endpoint returns the document with flattened photos', async () => {
  const res = await fetch(`${base}/api/listings/${SLUG}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.title, 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10');
  assert.equal(body.photos.length, 43);
  assert.equal(body.photos[0].room, 'Living room 1');
  assert.equal(body.photos[42].room, 'Additional photos');
  assert.equal(body.heroPhotos.length, 5);
  assert.equal(body.amenityGroups.reduce((n, g) => n + g.items.length, 0), 44);
});

test('unknown listing is a 404', async () => {
  const res = await fetch(`${base}/api/listings/nope`);
  assert.equal(res.status, 404);
});

test('wishlist toggles per visitor', async () => {
  const headers = { 'x-visitor-id': 'test-visitor' };
  const initial = await (await fetch(`${base}/api/listings/${SLUG}/wishlist`, { headers })).json();
  assert.equal(initial.saved, false);
  const on = await (await fetch(`${base}/api/listings/${SLUG}/wishlist`, { method: 'POST', headers })).json();
  assert.equal(on.saved, true);
  const other = await (await fetch(`${base}/api/listings/${SLUG}/wishlist`, { headers: { 'x-visitor-id': 'someone-else' } })).json();
  assert.equal(other.saved, false);
  const off = await (await fetch(`${base}/api/listings/${SLUG}/wishlist`, { method: 'POST', headers })).json();
  assert.equal(off.saved, false);
});

test('malformed slugs are rejected with 400', async () => {
  const res = await fetch(`${base}/api/listings/${encodeURIComponent('bad slug!')}`);
  assert.equal(res.status, 400);
});

test('listing responses are cacheable, wishlist state is not', async () => {
  const listing = await fetch(`${base}/api/listings/${SLUG}`);
  assert.equal(listing.headers.get('cache-control'), 'public, max-age=60');
  const wishlist = await fetch(`${base}/api/listings/${SLUG}/wishlist`, { headers: { 'x-visitor-id': 'v' } });
  assert.notEqual(wishlist.headers.get('cache-control'), 'public, max-age=60');
});
