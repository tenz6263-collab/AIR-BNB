import { useMemo, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Stars } from '../ui/Stars';
import * as Icons from '../icons';
import { TOPIC_KEYWORDS, reviewsForTopic } from '../../utils/reviews';
import styles from './Modals.module.css';

/** Full review browser: summary on the left, searchable list on the right. */
export function ReviewsModal({ open, summary, reviews, initialTopic, onClose }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(initialTopic || null);
  const visible = useMemo(() => {
    const byTopic = reviewsForTopic(reviews, topic);
    const q = query.trim().toLowerCase();
    return q
      ? byTopic.filter((r) => r.text.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
      : byTopic;
  }, [reviews, topic, query]);

  return (
    <Modal open={open} onClose={onClose} label={`${summary.count} reviews`} width={1032}>
      <div className={styles.reviewsLayout}>
        <aside className={styles.reviewsSide}>
          <div className={styles.bigRating}>
            <span>★</span> {summary.rating}
          </div>
          <div className={styles.muted}>{summary.count} reviews · Guest favourite</div>
          <div className={styles.cats}>
            {summary.categories.map((c) => {
              const Icon = Icons[c.icon];
              return (
                <div className={styles.cat} key={c.label}>
                  <span className={styles.catIcon}>{Icon && <Icon />}</span>
                  <span>{c.label}</span>
                  <b>{c.value}</b>
                </div>
              );
            })}
          </div>
        </aside>
        <div>
          <div className={styles.reviewsHead}>
            <h2 className={styles.h2}>
              {visible.length === reviews.length
                ? `${summary.count} reviews`
                : `${visible.length} of ${reviews.length} shown`}
            </h2>
            <input
              className={styles.search}
              type="search"
              placeholder="Search reviews"
              aria-label="Search reviews"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.topicRow}>
            {Object.keys(TOPIC_KEYWORDS).map((t) => (
              <button
                type="button"
                key={t}
                className={`${styles.topic} ${topic === t ? styles.topicOn : ''}`}
                aria-pressed={topic === t}
                onClick={() => setTopic(topic === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
          {visible.length === 0 && <p className={styles.muted}>No reviews match.</p>}
          {visible.map((review) => (
            <article className={styles.review} key={review.name + review.date}>
              <div className={styles.reviewHead}>
                <Avatar
                  src={review.avatar}
                  initial={review.initial}
                  bg={review.bg}
                  fg={review.fg}
                  name={review.name}
                />
                <div>
                  <div className={styles.summaryTitle}>{review.name}</div>
                  <div className={styles.muted}>{review.tenure}</div>
                </div>
              </div>
              <div className={styles.reviewMeta}>
                <Stars count={review.stars} gap={1} label={`Rated ${review.stars} out of 5`} /> ·{' '}
                {review.date}
              </div>
              <p className={styles.reviewText}>{review.text}</p>
            </article>
          ))}
          <p className={styles.fine}>
            Showing the {reviews.length} most recent reviews available for this listing.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export function HowReviewsWorkModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label="How reviews work" title="How reviews work" width={560}>
      <h2 className={styles.h2}>Reviews you can trust</h2>
      <p className={styles.para}>
        Reviews are written by guests who completed a stay at this home. Hosts and guests have 14 days after
        checkout to leave a review, and neither can see the other&apos;s review until both are submitted or
        the window closes.
      </p>
      <p className={styles.para}>
        The overall rating is the average of every review. Category ratings (cleanliness, accuracy, check-in,
        communication, location, value) are averaged separately.
      </p>
      <p className={styles.para}>
        <b>Guest favourite</b> is awarded to homes that combine a high rating with consistent reviews and
        reliable hosting - low cancellation rates and few quality issues reported.
      </p>
    </Modal>
  );
}

const POLICIES = {
  'Cancellation policy': [
    ['Free cancellation', 'Cancel before 17 October for a full refund of the nightly rate and fees.'],
    [
      'Partial refund',
      'Cancel before check-in on 18 October to get a 50% refund of the nightly rate. Fees are non-refundable.',
    ],
    ['No refund', 'After check-in the stay is non-refundable, including unused nights.'],
  ],
  'House rules': [
    [
      'Check-in and out',
      'Check-in after 2:00 pm, checkout before 11:00 am. Self check-in with the building staff.',
    ],
    ['Guests', 'Maximum 3 guests. Infants do not count towards the guest limit.'],
    ['During your stay', 'Pets are allowed. No parties or events. Quiet hours after 10:00 pm.'],
  ],
  'Safety & property': [
    ['Safety devices', 'Carbon monoxide alarm and smoke alarm have not been reported by the host.'],
    ['Cameras', 'Exterior security cameras cover the building entrance and parking only.'],
    [
      'Property',
      'Shared pool and gym, jacuzzi on the private terrace. Use at your own risk; no lifeguard on duty.',
    ],
  ],
};

export function PolicyModal({ open, topic, onClose }) {
  const rows = POLICIES[topic] || [];
  return (
    <Modal open={open} onClose={onClose} label={topic || 'Details'} title={topic} width={560}>
      {rows.map(([heading, text]) => (
        <div key={heading} className={styles.policy}>
          <h3 className={styles.h3}>{heading}</h3>
          <p className={styles.para}>{text}</p>
        </div>
      ))}
    </Modal>
  );
}
