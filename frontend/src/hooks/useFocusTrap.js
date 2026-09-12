import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `ref` while `active`. On activation focus moves to
 * `initialFocus()` (or the first focusable) unless focus is already inside the
 * dialog - e.g. when a nested overlay closes and has restored focus itself. On
 * deactivation focus returns to the element that was focused beforehand.
 */
export function useFocusTrap(ref, active, { initialFocus } = {}) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const root = ref.current;
    const previouslyFocused = document.activeElement;

    const focusables = () =>
      Array.from(root.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const timer = setTimeout(() => {
      if (root.contains(document.activeElement)) return;
      const target = (initialFocus && initialFocus()) || focusables()[0] || root;
      target.focus({ preventScroll: true });
    }, 0);

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    root.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      root.removeEventListener('keydown', onKeyDown);
      const current = document.activeElement;
      const shouldRestore = current === document.body || root.contains(current);
      if (shouldRestore && previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
