import { useState } from 'react';
import * as Icons from '../icons';
import { Stars } from '../ui/Stars';
import styles from './Overview.module.css';

function GuestFavouriteCard({ guestFavourite, rating }) {
  return (
    <div className={styles.favCard}>
      <div className={styles.favBadge}>
        <span className={styles.laurel}>
          <Icons.Laurel />
        </span>
        <span className={styles.favLabel}>
          Guest
          <br />
          favourite
        </span>
        <span className={`${styles.laurel} ${styles.laurelFlip}`}>
          <Icons.Laurel />
        </span>
      </div>
      <div className={styles.favBlurb}>{guestFavourite.blurb}</div>
      <div className={styles.favStats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{rating.value}</div>
          <Stars className={styles.statStars} label={`Rated ${rating.value} out of 5`} />
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <div className={styles.statValue}>{rating.count}</div>
          <div className={styles.statLabel}>Reviews</div>
        </div>
      </div>
    </div>
  );
}

function Description({ text, notice }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.description}>
      <div className={styles.translated}>
        <span>
          {notice} <a href="#">Show original</a>
        </span>
      </div>
      <p className={expanded ? '' : styles.clamped}>{text}</p>
      <button
        type="button"
        className={styles.showMore}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? 'Show less' : 'Show more'}{' '}
        <span className={styles.chevron}>
          <Icons.ChevronRightSm />
        </span>
      </button>
    </div>
  );
}

export function Overview({ listing }) {
  const { summary, guestFavourite, rating, host, highlights, description, translationNotice } = listing;
  return (
    <>
      <div className={styles.summary}>
        <h2>{summary.heading}</h2>
        <div className={styles.facts}>{summary.facts.join(' · ')}</div>
      </div>

      <GuestFavouriteCard guestFavourite={guestFavourite} rating={rating} />

      <div className={styles.hostRow}>
        <img className={styles.hostAvatar} src={host.avatar} alt="" />
        <div>
          <div className={styles.hostName}>Hosted by {host.name}</div>
          <div className={styles.hostMeta}>{host.hostedSince}</div>
        </div>
      </div>

      <div className={styles.highlights}>
        {highlights.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <div className={styles.highlight} key={item.title}>
              <div className={styles.highlightIcon}>{Icon && <Icon />}</div>
              <div>
                <div className={styles.highlightTitle}>{item.title}</div>
                <div className={styles.highlightText}>{item.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Description text={description} notice={translationNotice} />
    </>
  );
}
