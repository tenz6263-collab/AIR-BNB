import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const SLUG = 'romantic-jacuzzi-1bhk-candolim-mirashya-ug10';
let server;
let base;
const headers = { 'content-type': 'application/json', 'x-visitor-id': 'booker' };
const post = (path, body, h = headers) => fetch(`${base}${path}`, { method: 'POST', headers: h, body: JSON.stringify(body) });

before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    server = createApp({ clientOrigin: '' }).listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}/api/listings/${SLUG}`;
});
after(() => server.close());

test('quote prices nights server-side and applies the promo', async () => {
  const q = await (await fetch(`${base}/quote?checkIn=2026-10-18&checkOut=2026-10-23`)).json();
  assert.deepEqual(q, { nights: 5, subtotal: 28499, discount: 0, total: 28499 });
  const p = await (await fetch(`${base}/quote?checkIn=2026-10-18&checkOut=2026-10-23&promo=true`)).json();
  assert.equal(p.discount, 2850);
  assert.equal(p.total, 25649);
});

test('reservation lifecycle: create, blocks dates, rejects overlap, cancel', async () => {
  const created = await post(`/reservations`, { checkIn: '2026-12-01', checkOut: '2026-12-04', guests: { adults: 2 } });
  assert.equal(created.status, 201);
  const { reservation, blockedDates } = await created.json();
  assert.equal(reservation.nights, 3);
  assert.ok(blockedDates.includes('2026-12-02'));

  const clash = await post(`/reservations`, { checkIn: '2026-12-03', checkOut: '2026-12-05' }, { ...headers, 'x-visitor-id': 'other' });
  assert.equal(clash.status, 409);

  const mine = await (await fetch(`${base}/reservations`, { headers })).json();
  assert.equal(mine.reservations.length, 1);

  const gone = await fetch(`${base}/reservations/${reservation._id}`, { method: 'DELETE', headers });
  assert.equal(gone.status, 200);
  const after = await (await fetch(`${base}/reservations`, { headers })).json();
  assert.equal(after.reservations.length, 0);
  assert.ok(!after.blockedDates.includes('2026-12-02'));
});

test('reservation validation', async () => {
  assert.equal((await post(`/reservations`, { checkIn: '2026-12-05', checkOut: '2026-12-05' })).status, 400);
  assert.equal((await post(`/reservations`, { checkIn: '2026-11-18', checkOut: '2026-11-20' })).status, 409);
  assert.equal((await post(`/reservations`, { checkIn: '2026-12-10', checkOut: '2026-12-12', guests: { adults: 4 } })).status, 400);
});

test('messages and reports are stored', async () => {
  assert.equal((await post(`/messages`, { body: 'Hi, is early check-in possible?' })).status, 201);
  assert.equal((await post(`/messages`, { body: '' })).status, 400);
  assert.equal((await post(`/reports`, { reason: 'Inaccurate', body: 'Photos do not match' })).status, 201);
});
