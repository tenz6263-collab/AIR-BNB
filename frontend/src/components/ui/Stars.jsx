import { Star } from '../icons';
import styles from './Stars.module.css';

export function Stars({ count = 5, size = 10, gap = 2, className = '' }) {
  return (
    <span className={`${styles.stars} ${className}`} style={{ gap }} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ width: size, height: size }}>
          <Star />
        </span>
      ))}
    </span>
  );
}
