import { forwardRef } from 'react';
import styles from './IconButton.module.css';

/** Round 40px button that hosts an 18px icon (share, save, back, close...). */
export const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, className = '', size = 18, ...rest },
  ref,
) {
  return (
    <button ref={ref} type="button" aria-label={label} className={`${styles.button} ${className}`} {...rest}>
      <span className={styles.icon} style={{ width: size, height: size }}>
        <Icon />
      </span>
    </button>
  );
});
