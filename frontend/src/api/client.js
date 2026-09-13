const VISITOR_KEY = 'abnb.visitorId';

/**
 * API origin. Empty in development (Vite proxies /api) and when the API
 * serves the built frontend itself. Set VITE_API_BASE for a split deploy
 * (e.g. a Render static site talking to a Render web service); a bare
 * hostname is accepted and upgraded to https.
 */
function apiBase() {
  const raw = (import.meta.env.VITE_API_BASE || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

export const API_BASE = apiBase();

/** Stable anonymous id so wishlist state survives reloads. */
function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-visitor-id': getVisitorId(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getListing: (slug) => request(`/listings/${slug}`),
  getWishlist: (slug) => request(`/listings/${slug}/wishlist`),
  toggleWishlist: (slug) => request(`/listings/${slug}/wishlist`, { method: 'POST' }),
};
