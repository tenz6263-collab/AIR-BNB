import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addMonths,
  formatDayBefore,
  formatInr,
  formatRangeLabel,
  formatUs,
  isoDate,
  nightsBetween,
  parseIso,
} from '../dates.js';

test('iso round trip keeps local dates stable', () => {
  assert.equal(isoDate(parseIso('2026-10-18')), '2026-10-18');
  assert.equal(isoDate(new Date(2026, 0, 5)), '2026-01-05');
});

test('addMonths wraps years', () => {
  assert.deepEqual(addMonths(2026, 11, 1), { year: 2027, month: 0 });
  assert.deepEqual(addMonths(2026, 0, -1), { year: 2025, month: 11 });
});

test('nights and labels match the listing copy', () => {
  assert.equal(nightsBetween(parseIso('2026-10-18'), parseIso('2026-10-23')), 5);
  assert.equal(formatRangeLabel('2026-10-18', '2026-10-23'), '18 Oct 2026 - 23 Oct 2026');
  assert.equal(formatUs('2026-10-18'), '10/18/2026');
  assert.equal(formatDayBefore('2026-10-18'), '17 October');
});

test('formatInr uses Indian grouping and the rupee sign', () => {
  assert.equal(formatInr(28499), '\u20B928,499');
  assert.equal(formatInr(123456.7), '\u20B91,23,457');
});
