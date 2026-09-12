import { useCallback, useEffect, useMemo, useState } from 'react';

const TOUR = 'PHOTO_TOUR_SCROLLABLE';
const ITEM_BASE = 1000;

function readParams() {
  const p = new URLSearchParams(window.location.search);
  const tour = p.get('modal') === TOUR;
  const item = p.get('modalItem');
  const index = item !== null && tour ? Number(item) - ITEM_BASE : null;
  return { tour, index: Number.isFinite(index) && index >= 0 ? index : null };
}

/**
 * Mirrors the overlay state into the URL (`?modal=PHOTO_TOUR_SCROLLABLE` and
 * `&modalItem=100x`) so the tour and lightbox are deep-linkable and the
 * browser back button closes them.
 */
export function useModalParams() {
  const [state, setState] = useState(readParams);

  useEffect(() => {
    const onPop = () => setState(readParams());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const write = useCallback((next, { replace = false } = {}) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('modal');
    url.searchParams.delete('modalItem');
    if (next.tour) url.searchParams.set('modal', TOUR);
    if (next.tour && next.index !== null && next.index !== undefined) {
      url.searchParams.set('modalItem', String(ITEM_BASE + next.index));
    }
    const href = url.pathname + (url.search ? url.search : '') + url.hash;
    if (replace) window.history.replaceState(null, '', href);
    else window.history.pushState(null, '', href);
    setState({ tour: Boolean(next.tour), index: next.tour ? (next.index ?? null) : null });
  }, []);

  return useMemo(
    () => ({
      tourOpen: state.tour,
      lightboxIndex: state.index,
      openTour: () => write({ tour: true, index: null }),
      closeTour: () => write({ tour: false, index: null }),
      openLightbox: (index) => write({ tour: true, index }),
      setLightboxIndex: (index) => write({ tour: true, index }, { replace: true }),
      closeLightbox: () => write({ tour: true, index: null }),
    }),
    [state, write],
  );
}
