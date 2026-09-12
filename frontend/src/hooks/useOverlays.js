import { useCallback, useRef, useState } from 'react';
import { useModalParams } from './useModalParams';

/**
 * Photo tour + lightbox state: URL-synced open/closed flags plus the focus
 * bookkeeping needed to return focus to whatever opened each overlay.
 */
export function useOverlays() {
  const modal = useModalParams();
  const tourOpenerRef = useRef(null);
  const lightboxReturnFocus = useRef(null);
  const [tourScrollTarget, setTourScrollTarget] = useState(null);

  const openTour = useCallback(
    (target, opener) => {
      tourOpenerRef.current = opener || document.activeElement;
      setTourScrollTarget(target ?? null);
      modal.openTour();
    },
    [modal],
  );

  const closeTour = useCallback(() => {
    modal.closeTour();
    const opener = tourOpenerRef.current;
    if (opener && typeof opener.focus === 'function') {
      setTimeout(() => opener.focus({ preventScroll: true }), 0);
    }
  }, [modal]);

  const openLightbox = useCallback(
    (index, returnFocus) => {
      lightboxReturnFocus.current = returnFocus;
      modal.openLightbox(index);
    },
    [modal],
  );

  const closeLightbox = useCallback(() => {
    modal.closeLightbox();
    const fn = lightboxReturnFocus.current;
    if (fn) setTimeout(fn, 0);
  }, [modal]);

  return {
    tourOpen: modal.tourOpen,
    lightboxIndex: modal.lightboxIndex,
    setLightboxIndex: modal.setLightboxIndex,
    tourScrollTarget,
    openTour,
    closeTour,
    openLightbox,
    closeLightbox,
  };
}
