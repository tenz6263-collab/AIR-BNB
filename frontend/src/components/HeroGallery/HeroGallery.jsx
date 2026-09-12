import { forwardRef } from 'react';
import { Grid } from '../icons';
import styles from './HeroGallery.module.css';

/**
 * Five-photo mosaic. Every tile opens the photo tour scrolled to the room the
 * photo belongs to; the pill button opens the tour at the top.
 */
export const HeroGallery = forwardRef(function HeroGallery({ photos, title, onOpen, onShowAll }, ref) {
  return (
    <section className={styles.wrap} aria-label="Photos of this place">
      <div className={styles.grid} ref={ref}>
        {photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className={styles.tile}
            aria-label={`${title} image ${i + 1}`}
            onClick={() => onOpen(src)}
          >
            <img src={src} alt="" decoding="async" loading={i === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <button type="button" className={styles.showAll} onClick={onShowAll}>
        <span className={styles.gridIcon}>
          <Grid />
        </span>
        Show all photos
      </button>
    </section>
  );
});
