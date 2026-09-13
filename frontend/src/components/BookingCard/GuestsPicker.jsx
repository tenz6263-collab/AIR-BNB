import { useEffect, useRef } from 'react';
import { MAX_GUESTS } from '../../hooks/useBooking';
import styles from './GuestsPicker.module.css';

const ROWS = [
  { key: 'adults', label: 'Adults', hint: 'Age 13+', min: 1 },
  { key: 'children', label: 'Children', hint: 'Ages 2-12', min: 0 },
  { key: 'infants', label: 'Infants', hint: 'Under 2', min: 0, max: 5 },
  { key: 'pets', label: 'Pets', hint: 'Bringing a service animal?', min: 0, max: 2 },
];

/** Popover with +/- counters, anchored under the guests field. */
export function GuestsPicker({ open, guests, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-guests-toggle]'))
        onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  const total = guests.adults + guests.children;

  const step = (key, delta) => {
    const row = ROWS.find((r) => r.key === key);
    const next = guests[key] + delta;
    if (next < row.min) return;
    if (row.max !== undefined && next > row.max) return;
    if ((key === 'adults' || key === 'children') && delta > 0 && total >= MAX_GUESTS) return;
    onChange({ ...guests, [key]: next });
  };

  return (
    <div className={styles.popover} ref={ref} role="dialog" aria-label="Guests">
      {ROWS.map((row) => {
        const value = guests[row.key];
        const atMax =
          (row.max !== undefined && value >= row.max) ||
          ((row.key === 'adults' || row.key === 'children') && total >= MAX_GUESTS);
        return (
          <div className={styles.row} key={row.key}>
            <div>
              <div className={styles.label}>{row.label}</div>
              <div className={styles.hint}>{row.hint}</div>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                aria-label={`Remove ${row.label.toLowerCase()}`}
                disabled={value <= row.min}
                onClick={() => step(row.key, -1)}
              >
                −
              </button>
              <span aria-live="polite">{value}</span>
              <button
                type="button"
                aria-label={`Add ${row.label.toLowerCase()}`}
                disabled={atMax}
                onClick={() => step(row.key, 1)}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      <p className={styles.note}>
        This place has a maximum of {MAX_GUESTS} guests, not including infants. Pets are welcome.
      </p>
      <button type="button" className={styles.done} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
