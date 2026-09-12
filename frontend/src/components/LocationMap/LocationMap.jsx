import { useState } from 'react';
import { ChevronRightSm, HomeMarker, Search, ZoomIn, ZoomOut } from '../icons';
import styles from './LocationMap.module.css';

/**
 * Stylised static map (no third-party tiles) with a home marker and zoom
 * controls. Zoom scales the drawn terrain so the buttons feel alive.
 */
export function LocationMap({ location }) {
  const [zoom, setZoom] = useState(1);
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.section} id="location">
      <h2 className={styles.heading}>{location.title}</h2>
      <div className={styles.place}>{location.place}</div>

      <div className={styles.map}>
        <div className={styles.terrain} style={{ transform: `scale(${zoom})` }} />
        <button type="button" className={styles.search} aria-label="Search">
          <span style={{ width: 16, height: 16 }}>
            <Search />
          </span>
        </button>
        <div className={styles.zoom}>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}>
            <span className={styles.zoomIcon}>
              <ZoomIn />
            </span>
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}>
            <span className={styles.zoomIcon}>
              <ZoomOut />
            </span>
          </button>
        </div>
        <div className={styles.marker}>
          <HomeMarker />
        </div>
      </div>

      <div className={styles.note}>{location.note}</div>
      <div className={styles.subheading}>{location.neighbourhoodTitle}</div>
      <div className={styles.text}>
        {location.neighbourhood}
        {expanded && (
          <>
            {' '}
            Candolim Beach is a short walk away, with Fort Aguada, Sinquerim and the Calangute market all within a
            ten-minute drive. Cafes, beach shacks and nightlife line the main road.
          </>
        )}
      </div>
      <button type="button" className={styles.showMore} onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        {expanded ? 'Show less' : 'Show more'}{' '}
        <span className={styles.chevron}>
          <ChevronRightSm />
        </span>
      </button>
    </section>
  );
}
