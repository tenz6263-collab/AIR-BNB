import { randomUUID } from 'node:crypto';

/**
 * Identifies anonymous visitors with a header the client persists in
 * localStorage. Falls back to a fresh id so every request has one.
 */
export function visitorId(req, _res, next) {
  req.visitorId = req.get('x-visitor-id') || randomUUID();
  next();
}
