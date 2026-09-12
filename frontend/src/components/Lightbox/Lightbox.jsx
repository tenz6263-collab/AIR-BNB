import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Close, Grid } from '../icons';
import { IconButton } from '../ui/IconButton';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Lightbox.module.css';

/**
 * Single-photo viewer. `index` is the global photo index or null when closed.
 * Arrow keys step through photos, Escape returns to the tour.
 */
export function Lightbox({ photos, index, onChange, onClose }) {
  const open = index !== null && index !== undefined;
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [animKey, setAnimKey] = useState(0);
  const lastIndex = useRef(index);

  useFocusTrap(panelRef, open, { initialFocus: () => closeRef.current });

  const photo = open ? photos[index] : null;
  const hasPrev = open && index > 0;
  const hasNext = open && index < photos.length - 1;

  const step = (delta) => {
    if (!open) return;
    const next = index + delta;
    if (next < 0 || next >= photos.length) return;
    onChange(next);
  };

  // Re-key the image so the fade animation replays on every change.
  useEffect(() => {
    if (open && lastIndex.current !== index) setAnimKey((k) => k + 1);
    lastIndex.current = index;
  }, [index, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  // Preload neighbours so stepping feels instant.
  useEffect(() => {
    if (!open) return;
    [index - 1, index + 1].forEach((i) => {
      if (photos[i]) {
        const img = new Image();
        img.src = photos[i].src;
      }
    });
  }, [open, index, photos]);

  return (
    <div
      className={`${styles.panel} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      aria-hidden={!open}
      ref={panelRef}
    >
      <header className={styles.bar}>
        <IconButton icon={Grid} label="Show all photos" className={styles.grid} size={16} onClick={onClose} />
        <div className={styles.title}>{photo ? photo.room : ''}</div>
        <div className={styles.right}>
          <span className={styles.counter}>{open ? `${index + 1} of ${photos.length}` : ''}</span>
          <IconButton ref={closeRef} icon={Close} label="Close" onClick={onClose} />
        </div>
      </header>

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        aria-label="Previous"
        disabled={!hasPrev}
        onClick={() => step(-1)}
      >
        <span className={styles.navIcon}>
          <ChevronLeft />
        </span>
      </button>

      <div className={styles.stage}>
        {photo && <img key={animKey} src={photo.src} alt={photo.room} className={styles.image} />}
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        aria-label="Next"
        disabled={!hasNext}
        onClick={() => step(1)}
      >
        <span className={styles.navIcon}>
          <ChevronRight />
        </span>
      </button>
    </div>
  );
}
