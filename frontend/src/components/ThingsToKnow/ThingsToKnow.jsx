import * as Icons from '../icons';
import styles from './ThingsToKnow.module.css';

export function ThingsToKnow({ items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Things to know</h2>
      <div className={styles.grid}>
        {items.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <div className={styles.column} key={item.title}>
              <div className={styles.icon}>{Icon && <Icon />}</div>
              <div className={styles.title}>{item.title}</div>
              {item.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a className={styles.more} href="#">
                Learn more
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
