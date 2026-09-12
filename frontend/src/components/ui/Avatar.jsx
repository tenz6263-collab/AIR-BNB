import styles from './Avatar.module.css';

/** Photo avatar, or a tinted initial when the person has no picture. */
export function Avatar({ src, initial, bg, fg, name, size = 42, fontSize = 17 }) {
  const style = { width: size, height: size };
  if (src) return <img className={styles.image} src={src} alt="" style={style} />;
  return (
    <div className={styles.initial} style={{ ...style, background: bg, color: fg, fontSize }} aria-hidden="true">
      {initial || (name ? name[0] : '')}
    </div>
  );
}
