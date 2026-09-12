/**
 * Splits a room's photos into rows: a full-width photo followed by a pair,
 * repeating, but never leaving a lone photo when exactly two remain.
 * e.g. 3 -> [1, 2], 5 -> [1, 2, 2], 7 -> [1, 2, 1, 2, 1].
 */
export function chunkPhotos(count) {
  const rows = [];
  let remaining = count;
  let single = true;
  while (remaining > 0) {
    let size = remaining === 2 ? 2 : single ? 1 : 2;
    size = Math.min(size, remaining);
    rows.push(size);
    remaining -= size;
    single = !single;
  }
  return rows;
}
