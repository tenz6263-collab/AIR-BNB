import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildModalHref, parseModalParams } from '../utils/modalUrl';

const readParams = () => parseModalParams(window.location.search);

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
    const href = buildModalHref(window.location.href, next);
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
