import styles from './Toast.module.css';

/** Bottom-centre status message; `message` is null when hidden. */
export function Toast({ message }) {
  return (
    <div className={`${styles.toast} ${message ? styles.visible : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
