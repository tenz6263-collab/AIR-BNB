import { useState } from 'react';
import * as Icons from '../icons';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Stars } from '../ui/Stars';
import styles from './Reviews.module.css';

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className={styles.review}>
      <div className={styles.reviewHead}>
        <Avatar
          src={review.avatar}
          initial={review.initial}
          bg={review.bg}
          fg={review.fg}
          name={review.name}
        />
        <div>
          <div className={styles.reviewer}>{review.name}</div>
          <div className={styles.tenure}>{review.tenure}</div>
        </div>
      </div>
      <div className={styles.meta}>
        <Stars count={review.stars} gap={1} />
        <span>·</span>
        <span>{review.date}</span>
      </div>
      <div className={`${styles.text} ${review.clamp && !expanded ? styles.clamped : ''}`}>{review.text}</div>
      {review.clamp && !expanded && (
        <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
          Show more
        </button>
      )}
    </article>
  );
}

export function Reviews({ summary, reviews, guestFavourite, onShowAll }) {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.hero}>
        <div className={styles.laurels}>
          <img src="/assets/images/ui/laurel-left.png" alt="" />
          <div className={styles.bigRating}>{summary.rating}</div>
          <img src="/assets/images/ui/laurel-right.png" alt="" />
        </div>
        <div className={styles.favTitle}>{guestFavourite.label}</div>
        <div className={styles.favText}>{guestFavourite.reviewsDescription}</div>
        <button type="button" className={styles.howLink}>
          How reviews work
        </button>
      </div>

      <div className={styles.breakdown}>
        <div className={styles.column}>
          <div className={styles.columnTitle}>Overall rating</div>
          <div className={styles.bars}>
            {summary.distribution.map((pct, i) => (
              <div className={styles.barRow} key={5 - i}>
                <span className={styles.barLabel}>{5 - i}</span>
                <div className={styles.track}>
                  <div className={styles.fill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {summary.categories.map((cat) => {
          const Icon = Icons[cat.icon];
          return (
            <div className={styles.column} key={cat.label}>
              <div className={styles.columnTitle}>{cat.label}</div>
              <div className={styles.columnValue}>{cat.value}</div>
              <div className={styles.columnIcon}>{Icon && <Icon />}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.chips}>
        {summary.chips.map((chip) => (
          <button type="button" className={styles.chip} key={chip.label}>
            <img className={styles.chipIcon} src={chip.image} alt="" aria-hidden="true" />
            {chip.label} <span className={styles.chipCount}>{chip.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {reviews.map((review) => (
          <ReviewCard key={review.name + review.date} review={review} />
        ))}
      </div>

      <Button variant="outline" onClick={onShowAll}>
        Show all {summary.count} reviews
      </Button>
    </section>
  );
}
