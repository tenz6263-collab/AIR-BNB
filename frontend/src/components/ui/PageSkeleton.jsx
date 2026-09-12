import { Header } from '../Header/Header';
import styles from './PageSkeleton.module.css';

/** Shimmering placeholder that mirrors the listing layout while data loads. */
export function PageSkeleton() {
  return (
    <>
      <Header />
      <main className="container" aria-busy="true" aria-label="Loading listing">
        <div className={styles.titleRow}>
          <div className={`${styles.block} ${styles.title}`} />
          <div className={`${styles.block} ${styles.actions}`} />
        </div>
        <div className={styles.hero}>
          <div className={`${styles.block} ${styles.heroMain}`} />
          <div className={styles.block} />
          <div className={styles.block} />
          <div className={styles.block} />
          <div className={styles.block} />
        </div>
        <div className={styles.columns}>
          <div>
            <div className={`${styles.block} ${styles.line}`} style={{ width: '60%' }} />
            <div className={`${styles.block} ${styles.line}`} style={{ width: '40%' }} />
            <div className={`${styles.block} ${styles.card}`} />
            <div className={`${styles.block} ${styles.line}`} style={{ width: '90%' }} />
            <div className={`${styles.block} ${styles.line}`} style={{ width: '85%' }} />
            <div className={`${styles.block} ${styles.line}`} style={{ width: '70%' }} />
          </div>
          <div className={`${styles.block} ${styles.sidebar}`} />
        </div>
      </main>
    </>
  );
}
