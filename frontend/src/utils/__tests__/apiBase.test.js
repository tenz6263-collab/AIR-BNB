import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBase } from '../apiBase.js';

test('resolveApiBase handles empty, full, bare host and Render slug values', () => {
  assert.equal(resolveApiBase(''), '');
  assert.equal(resolveApiBase(undefined), '');
  assert.equal(resolveApiBase('https://api.example.com/'), 'https://api.example.com');
  assert.equal(resolveApiBase('http://localhost:4000'), 'http://localhost:4000');
  assert.equal(resolveApiBase('api.example.com'), 'https://api.example.com');
  assert.equal(resolveApiBase('airbnb-clone-api-e8n8'), 'https://airbnb-clone-api-e8n8.onrender.com');
});
