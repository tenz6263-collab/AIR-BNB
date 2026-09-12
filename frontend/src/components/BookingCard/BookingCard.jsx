import { ChevronDown, Flag } from '../icons';
import { formatDayBefore, formatInr, formatUs, nightsBetween, parseIso } from '../../utils/dates';
import styles from './BookingCard.module.css';

/** Sticky right-hand column: promo banner, price/reserve card, report link. */
export function BookingCard({ booking, checkIn, checkOut, onReserve, onClaim, onReport }) {
  const nights = checkIn && checkOut ? nightsBetween(parseIso(checkIn), parseIso(checkOut)) : 0;
  const isDefault = checkIn === booking.checkIn && checkOut === booking.checkOut;
  const perNight = Number(booking.priceLabel.replace(/[^\d]/g, '')) / booking.nights;
  const price = isDefault ? booking.priceLabel : formatInr(perNight * nights);

  return (
    <div className={styles.sticky}>
      <div className={styles.promo}>
        <img className={styles.promoIcon} src="/assets/images/ui/discount.svg" alt="" aria-hidden="true" />
        <div className={styles.promoText}>
          {booking.promo.text}
          <br />
          <a href="#">{booking.promo.linkText}</a>
        </div>
        <button className={styles.claim} type="button" onClick={onClaim}>
          {booking.promo.cta}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.priceRow}>
          {nights > 0 ? (
            <>
              <span className={styles.price}>{price}</span>
              <span className={styles.nights}>
                for {nights} night{nights === 1 ? '' : 's'}
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
          <div className={styles.guests}>
            <div>
              <div className={styles.fieldLabel}>GUESTS</div>
              <div className={styles.fieldValue}>{booking.guests}</div>
            </div>
            <span className={styles.chevron}>
              <ChevronDown />
            </span>
          </div>
        </div>

        {checkIn && (
          <div className={styles.cancel}>
            Free cancellation before <b>{formatDayBefore(checkIn)}</b>
          </div>
        )}

        <button className={styles.reserve} type="button" onClick={onReserve}>
          Reserve
        </button>
        <div className={styles.note}>You won&apos;t be charged yet</div>
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
