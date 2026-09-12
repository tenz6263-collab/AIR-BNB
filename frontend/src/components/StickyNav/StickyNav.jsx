import styles from './StickyNav.module.css';

const LINKS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
];

/** Compact bar that slides in once the hero gallery scrolls out of view. */
export function StickyNav({ visible, active, booking, rating, onReserve }) {
  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-hidden={!visible}>
      <div className={styles.inner}>
        <nav className={styles.links} aria-label="Listing sections">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? styles.active : ''}
              aria-current={active === link.id ? 'true' : undefined}
              tabIndex={visible ? 0 : -1}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles.right}>
          <div className={styles.summary}>
            <div>
              <span className={styles.price}>{booking.priceLabel}</span>{' '}
              <span className={styles.nights}>{booking.nightsLabel}</span>
            </div>
            <div className={styles.ratingRow}>
              <span className={styles.star} aria-hidden="true" /> {rating.value} ·{' '}
              <span>{rating.count} reviews</span>
            </div>
          </div>
          <button className={styles.reserve} type="button" onClick={onReserve} tabIndex={visible ? 0 : -1}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
