import { Heart, Share } from '../icons';
import styles from './TitleBar.module.css';

export function TitleBar({ title, saved, onShare, onSave }) {
  return (
    <section className={styles.bar} id="photos">
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button className={styles.action} type="button" onClick={onShare}>
          <span className={styles.icon}>
            <Share />
          </span>
          <span className={styles.label}>Share</span>
        </button>
        <button
          className={`${styles.action} ${saved ? styles.saved : ''}`}
          type="button"
          onClick={onSave}
          aria-pressed={saved}
        >
          <span className={styles.icon}>
            <Heart style={saved ? { fill: 'currentColor' } : undefined} />
          </span>
          <span className={styles.label}>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </section>
  );
}
