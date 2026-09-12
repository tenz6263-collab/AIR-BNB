export const TOUR_MODAL = 'PHOTO_TOUR_SCROLLABLE';
export const ITEM_BASE = 1000;

/**
 * Parses `?modal=PHOTO_TOUR_SCROLLABLE&modalItem=100x` into overlay state.
 * `modalItem` is only honoured while the tour modal is present.
 */
export function parseModalParams(search) {
  const p = new URLSearchParams(search);
  const tour = p.get('modal') === TOUR_MODAL;
  const item = p.get('modalItem');
  const index = tour && item !== null ? Number(item) - ITEM_BASE : null;
  return { tour, index: Number.isInteger(index) && index >= 0 ? index : null };
}

/** Builds the href for a new overlay state, preserving unrelated params. */
export function buildModalHref(currentHref, next) {
  const url = new URL(currentHref);
  url.searchParams.delete('modal');
  url.searchParams.delete('modalItem');
  if (next.tour) url.searchParams.set('modal', TOUR_MODAL);
  if (next.tour && Number.isInteger(next.index) && next.index >= 0) {
    url.searchParams.set('modalItem', String(ITEM_BASE + next.index));
  }
  return url.pathname + url.search + url.hash;
}
