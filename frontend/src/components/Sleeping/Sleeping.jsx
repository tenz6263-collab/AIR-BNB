import styles from './Sleeping.module.css';

export function Sleeping({ items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Where you&apos;ll sleep</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <div className={styles.card} key={item.title}>
            <img src={item.image} alt="" />
            <div className={styles.title}>{item.title}</div>
            <div className={styles.subtitle}>{item.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
