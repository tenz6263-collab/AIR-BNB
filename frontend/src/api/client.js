const VISITOR_KEY = 'abnb.visitorId';

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
  const res = await fetch(`/api${path}`, {
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
