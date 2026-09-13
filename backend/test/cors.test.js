import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corsOrigin } from '../src/config/cors.js';

const decide = (fn, origin) => new Promise((resolve) => fn(origin, (_err, ok) => resolve(ok)));

test('no configuration allows every origin', () => {
  assert.equal(corsOrigin(''), true);
  assert.equal(corsOrigin(undefined), true);
});

test('bare hosts and full origins are both accepted', async () => {
  const fn = corsOrigin('app.onrender.com, https://www.example.com/');
  assert.equal(await decide(fn, 'https://app.onrender.com'), true);
  assert.equal(await decide(fn, 'https://www.example.com'), true);
  assert.equal(await decide(fn, 'https://evil.example.com'), false);
  assert.equal(await decide(fn, 'http://localhost:5173'), true);
  assert.equal(await decide(fn, undefined), true);
});

test('a bare Render service slug also allows its public onrender.com host', async () => {
  const fn = corsOrigin('airbnb-clone-web-nja8');
  assert.equal(await decide(fn, 'https://airbnb-clone-web-nja8.onrender.com'), true);
  assert.equal(await decide(fn, 'https://airbnb-clone-web-other.onrender.com'), false);
});
