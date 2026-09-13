import { useState } from 'react';
import { ChevronDown, Flag } from '../icons';
import { formatDayBefore, formatInr, formatRangeLabel, formatUs } from '../../utils/dates';
import { GuestsPicker } from './GuestsPicker';
import styles from './BookingCard.module.css';

/** Sticky right-hand column: promo banner, price/reserve card, report link. */
export function BookingCard({ promoConfig, booking, onReserve, onReport, onCancel }) {
  const { dates, guests, setGuests, guestsLabel, promo, claimPromo, price, reservations } = booking;
  const { checkIn, checkOut } = dates;
  const [guestsOpen, setGuestsOpen] = useState(false);
  const active = reservations[0];

  return (
    <div className={styles.sticky}>
      <div className={styles.promo}>
        <img className={styles.promoIcon} src="/assets/images/ui/discount.svg" alt="" aria-hidden="true" />
        <div className={styles.promoText}>
          {promo ? '10% off applied to this stay.' : promoConfig.text}
          <br />
          <a href="#" onClick={(e) => e.preventDefault()}>
            {promoConfig.linkText}
          </a>
        </div>
        <button
          className={styles.claim}
          type="button"
          onClick={claimPromo}
          disabled={promo}
          aria-pressed={promo}
        >
          {promo ? 'Claimed' : promoConfig.cta}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.priceRow}>
          {price.nights > 0 ? (
            <>
              {price.discount > 0 && <span className={styles.strike}>{formatInr(price.subtotal)}</span>}
              <span className={styles.price}>{formatInr(price.total)}</span>
              <span className={styles.nights}>
                for {price.nights} night{price.nights === 1 ? '' : 's'}
              </span>
            </>
          ) : (
            <span className={styles.price}>Add dates for prices</span>
          )}
        </div>

        <div className={styles.fields}>
          <div className={styles.dates}>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>CHECK-IN</div>
              <div className={styles.fieldValue}>{checkIn ? formatUs(checkIn) : 'Add date'}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>CHECKOUT</div>
              <div className={styles.fieldValue}>{checkOut ? formatUs(checkOut) : 'Add date'}</div>
            </div>
          </div>
          <div className={styles.guestsWrap}>
            <button
              type="button"
              className={styles.guests}
              data-guests-toggle
              aria-expanded={guestsOpen}
              aria-haspopup="dialog"
              onClick={() => setGuestsOpen((v) => !v)}
            >
              <div>
                <div className={styles.fieldLabel}>GUESTS</div>
                <div className={styles.fieldValue}>{guestsLabel}</div>
              </div>
              <span className={`${styles.chevron} ${guestsOpen ? styles.chevronUp : ''}`}>
                <ChevronDown />
              </span>
            </button>
            <GuestsPicker
              open={guestsOpen}
              guests={guests}
              onChange={setGuests}
              onClose={() => setGuestsOpen(false)}
            />
          </div>
        </div>

        {checkIn && (
          <div className={styles.cancel}>
            Free cancellation before <b>{formatDayBefore(checkIn)}</b>
          </div>
        )}

        <button className={styles.reserve} type="button" onClick={onReserve} disabled={price.nights === 0}>
          Reserve
        </button>
        <div className={styles.note}>You won&apos;t be charged yet</div>

        {active && (
          <div className={styles.reserved} role="status">
            <div>
              <div className={styles.reservedTitle}>
                Reserved · {formatRangeLabel(active.checkIn, active.checkOut)}
              </div>
              <div className={styles.reservedMeta}>
                {active.nights} night{active.nights === 1 ? '' : 's'} · {formatInr(active.total)}
              </div>
            </div>
            <button type="button" className={styles.cancelLink} onClick={() => onCancel(active._id)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className={styles.report}>
        <span className={styles.flag}>
          <Flag />
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onReport();
          }}
        >
          Report this listing
        </a>
      </div>
    </div>
  );
}
