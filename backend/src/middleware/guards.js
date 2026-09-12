const SLUG = /^[a-z0-9-]{1,120}$/;

/** Rejects malformed slugs before they reach a database query. */
export function validateSlug(req, res, next) {
  if (!SLUG.test(req.params.slug)) return res.status(400).json({ error: 'Invalid listing slug' });
  return next();
}

/**
 * Minimal fixed-window rate limiter (per visitor id / IP) for write routes.
 * Production would use a shared store (Redis); this keeps the demo honest.
 */
export function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.visitorId || req.ip;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests' });
    }
    return next();
  };
}
