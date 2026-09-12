import { useEffect } from 'react';

/**
 * Toggles a `kbd` class on <body> while the visitor navigates with the
 * keyboard. Focus rings are only drawn in that mode, mirroring the reference.
 */
export function useKeyboardMode() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') document.body.classList.add('kbd');
    };
    const onPointer = () => document.body.classList.remove('kbd');
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
    };
  }, []);
}
