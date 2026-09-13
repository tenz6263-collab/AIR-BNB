import { resolveApiBase } from '../utils/apiBase';

const VISITOR_KEY = 'abnb.visitorId';

export const API_BASE = resolveApiBase(import.meta.env.VITE_API_BASE);

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

const json = (body) => ({ body: JSON.stringify(body) });

export const api = {
  getListing: (slug) => request(`/listings/${slug}`),
  getWishlist: (slug) => request(`/listings/${slug}/wishlist`),
  toggleWishlist: (slug) => request(`/listings/${slug}/wishlist`, { method: 'POST' }),
  getQuote: (slug, { checkIn, checkOut, promo }) =>
    request(
      `/listings/${slug}/quote?checkIn=${checkIn}&checkOut=${checkOut}&promo=${promo ? 'true' : 'false'}`,
    ),
  getReservations: (slug) => request(`/listings/${slug}/reservations`),
  createReservation: (slug, payload) =>
    request(`/listings/${slug}/reservations`, { method: 'POST', ...json(payload) }),
  cancelReservation: (slug, id) => request(`/listings/${slug}/reservations/${id}`, { method: 'DELETE' }),
  sendMessage: (slug, body) => request(`/listings/${slug}/messages`, { method: 'POST', ...json({ body }) }),
  reportListing: (slug, reason, body) =>
    request(`/listings/${slug}/reports`, { method: 'POST', ...json({ reason, body }) }),
};
