import { useEffect, useRef } from 'react';
import { Close } from '../icons';
import { IconButton } from './IconButton';
import { useBodyLock } from '../../hooks/useBodyLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Modal.module.css';

/**
 * Centered dialog with the amenities-modal chrome: dimmed backdrop, 64px
 * header with a close button, scrollable body. Escape / backdrop click close
 * it and focus returns to the trigger.
 */
export function Modal({ open, label, title, onClose, width = 780, children, footer }) {
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
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={dialogRef}
      >
        <div className={styles.head}>
          <IconButton ref={closeRef} icon={Close} label="Close" className={styles.close} onClick={onClose} />
          {title && <div className={styles.headTitle}>{title}</div>}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
