import { useState } from 'react';
import { ChevronLeftSm, ChevronRightSm, Keyboard } from '../icons';
import { addMonths, formatRangeLabel, isoDate, nightsBetween, parseIso } from '../../utils/dates';
import styles from './Calendar.module.css';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Month({ year, month, checkIn, checkOut, blocked, onPick }) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = first.getDay();
  const cells = [];
  for (let i = 0; i < leading; i += 1)
    cells.push(<div key={`pad-${i}`} className={`${styles.day} ${styles.hidden}`} />);
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = isoDate(new Date(year, month, d));
    const isStart = iso === checkIn;
    const isEnd = iso === checkOut;
    const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut;
    const isBlocked = blocked.has(iso);
    const cls = [
      styles.day,
      isStart ? styles.start : '',
      isEnd ? styles.end : '',
      inRange ? styles.inRange : '',
      isBlocked ? styles.blocked : '',
    ].join(' ');
    cells.push(
      <button
        key={iso}
        type="button"
        className={cls}
        disabled={isBlocked}
        aria-pressed={isStart || isEnd}
        aria-label={`${d} ${MONTHS[month]} ${year}`}
        onClick={() => onPick(iso)}
      >
        {d}
      </button>,
    );
  }
  return (
    <div className={styles.month}>
      <div className={styles.monthTitle}>
        {MONTHS[month]} {year}
      </div>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w, i) => (
          <span key={w + i}>{w}</span>
        ))}
      </div>
      <div className={styles.days}>{cells}</div>
    </div>
  );
}

/**
 * Two-month availability calendar. Picking a day starts a new range, picking a
 * later day completes it; the booking card mirrors the selection.
 */
export function Calendar({ booking, checkIn, checkOut, onChange, blockedDates }) {
  const [offset, setOffset] = useState(0);
  const base = booking.months[0];
  const blocked = new Set(blockedDates || booking.blockedDates);
  const visible = [0, 1].map((i) => addMonths(base.year, base.month, offset + i));
  const nights = checkIn && checkOut ? nightsBetween(parseIso(checkIn), parseIso(checkOut)) : 0;

  const pick = (iso) => {
    if (!checkIn || (checkIn && checkOut)) onChange({ checkIn: iso, checkOut: null });
    else if (iso <= checkIn) onChange({ checkIn: iso, checkOut: null });
    else onChange({ checkIn, checkOut: iso });
  };

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.title}>
          {nights > 0
            ? `${nights} night${nights === 1 ? '' : 's'} in ${booking.location}`
            : 'Select check-in date'}
        </div>
        <div className={styles.subtitle}>
          {nights > 0 ? formatRangeLabel(checkIn, checkOut) : 'Add your travel dates for exact pricing'}
        </div>
      </div>

      <div className={styles.months}>
        <div className={styles.arrows}>
          <button type="button" aria-label="Previous month" onClick={() => setOffset((o) => o - 1)}>
            <span className={styles.arrowIcon}>
              <ChevronLeftSm />
            </span>
          </button>
          <button type="button" aria-label="Next month" onClick={() => setOffset((o) => o + 1)}>
            <span className={styles.arrowIcon}>
              <ChevronRightSm />
            </span>
          </button>
        </div>
        {visible.map((m) => (
          <Month
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            checkIn={checkIn}
            checkOut={checkOut}
            blocked={blocked}
            onPick={pick}
          />
        ))}
      </div>

      <div className={styles.foot}>
        <span className={styles.keyboard} aria-hidden="true">
          <Keyboard />
        </span>
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange({ checkIn: null, checkOut: null })}
        >
          Clear dates
        </button>
      </div>
    </section>
  );
}
