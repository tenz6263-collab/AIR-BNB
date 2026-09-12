import { useEffect, useRef, useState } from 'react';
import { ChevronLeftSm, ChevronRightSm, Star } from '../icons';
import styles from './SimilarStays.module.css';

/** Cards per page follows the CSS breakpoints (5 / 3 / 2). */
function perPage() {
  if (typeof window === 'undefined') return 5;
  if (window.matchMedia('(max-width: 743px)').matches) return 2;
  if (window.matchMedia('(max-width: 1128px)').matches) return 3;
  return 5;
}

/** Horizontal carousel that pages five cards at a time. */
export function SimilarStays({ items }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(perPage);
  const pages = Math.max(1, Math.ceil(items.length / size));

  useEffect(() => {
    const onResize = () => setSize(perPage());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const go = (next) => {
    const clamped = Math.min(Math.max(next, 0), pages - 1);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    }
    setPage(clamped);
  };

  // Keep the page indicator in sync with manual (trackpad) scrolling.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => {
      const p = Math.round(track.scrollLeft / track.clientWidth);
      setPage(Math.min(Math.max(p, 0), pages - 1));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [pages]);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.heading}>More stays nearby</h2>
        <div className={styles.controls}>
          <span className={styles.counter}>
            {page + 1} / {pages}
          </span>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="Previous"
          >
            <span className={styles.arrowIcon}>
              <ChevronLeftSm />
            </span>
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(page + 1)}
            disabled={page === pages - 1}
            aria-label="Next"
          >
            <span className={styles.arrowIcon}>
              <ChevronRightSm />
            </span>
          </button>
        </div>
      </div>
      <div className={styles.track} ref={trackRef}>
        {items.map((item, i) => (
          <a className={styles.card} href="#" key={item.title + i}>
            <img src={item.image} alt="" loading="lazy" decoding="async" />
            <div className={styles.title}>{item.title}</div>
            <div className={styles.price}>
              {item.price} &nbsp;
              <span className={styles.star}>
                <Star />
              </span>{' '}
              {item.rating}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
