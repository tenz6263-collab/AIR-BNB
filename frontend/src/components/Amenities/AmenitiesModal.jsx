import { useEffect, useRef } from 'react';
import { Close } from '../icons';
import { IconButton } from '../ui/IconButton';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { AmenityRow } from './Amenities';
import styles from './AmenitiesModal.module.css';

/** Centered dialog listing every amenity grouped by category. */
export function AmenitiesModal({ open, groups, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useBodyLock(open);
  useFocusTrap(dialogRef, open, { initialFocus: () => closeRef.current });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="What this place offers"
        ref={dialogRef}
      >
        <div className={styles.head}>
          <IconButton ref={closeRef} icon={Close} label="Close" className={styles.close} onClick={onClose} />
        </div>
        <div className={styles.body}>
          <h2>What this place offers</h2>
          {groups.map((group) => (
            <div className={styles.group} key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <AmenityRow key={group.title + item.label} item={item} className={styles.item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
