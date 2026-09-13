import { Star } from '../icons';
import styles from './Stars.module.css';

export function Stars({ count = 5, size = 10, gap = 2, className = '', label }) {
  return (
    <span
      className={`${styles.stars} ${className}`}
      style={{ gap }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ width: size, height: size }}>
          <Star />
        </span>
      ))}
    </span>
  );
}
