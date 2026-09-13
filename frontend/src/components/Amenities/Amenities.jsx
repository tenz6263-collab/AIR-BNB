import * as Icons from '../icons';
import { Button } from '../ui/Button';
import styles from './Amenities.module.css';

export function AmenityRow({ item, className = '' }) {
  const Icon = Icons[item.icon];
  return (
    <div className={`${styles.row} ${item.unavailable ? styles.unavailable : ''} ${className}`}>
      <span className={styles.icon}>{Icon && <Icon />}</span>
      <span className={styles.label}>{item.label}</span>
    </div>
  );
}

export function Amenities({ items, total, onShowAll }) {
  return (
    <section className={styles.section} id="amenities">
      <h2 className={styles.heading}>What this place offers</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <AmenityRow key={item.label} item={item} />
        ))}
      </div>
      <Button variant="outline" onClick={onShowAll}>
        Show all {total} amenities
      </Button>
    </section>
  );
}
