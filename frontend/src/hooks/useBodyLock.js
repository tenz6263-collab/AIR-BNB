import { useEffect } from 'react';

let lockCount = 0;

/** Locks page scrolling while any overlay is open (reference-counted). */
export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lockCount += 1;
    document.body.classList.add('is-locked');
    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.classList.remove('is-locked');
    };
  }, [active]);
}
