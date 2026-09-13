import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { formatInr, formatRangeLabel } from '../../utils/dates';
import styles from './Modals.module.css';

/** Trip summary with a server-priced breakdown; confirming creates the reservation. */
export function ReserveModal({ open, listing, booking, onClose, onConfirmed }) {
  const { dates, guestsLabel, price, reserve } = booking;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const reservation = await reserve();
      setSuccess(reservation);
      onConfirmed(reservation);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    setSuccess(null);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={close} label="Confirm your reservation" title="Confirm and pay" width={560}>
      {success ? (
        <div className={styles.success}>
          <div className={styles.check} aria-hidden="true">
            ✓
          </div>
          <h2>You&apos;re booked!</h2>
          <p>
            {formatRangeLabel(success.checkIn, success.checkOut)} · {guestsLabel}
          </p>
          <p className={styles.muted}>
            A confirmation would normally be emailed to you. Nothing has been charged.
          </p>
          <button type="button" className={styles.primary} onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <img src={listing.heroPhotos[0]} alt="" />
            <div>
              <div className={styles.summaryTitle}>{listing.title}</div>
              <div className={styles.muted}>{listing.summary.heading}</div>
              <div className={styles.rating}>
                ★ {listing.rating.value} · {listing.rating.count} reviews
              </div>
            </div>
          </div>

          <h3 className={styles.h3}>Your trip</h3>
          <div className={styles.row}>
            <span>Dates</span>
            <b>{dates.checkIn && dates.checkOut ? formatRangeLabel(dates.checkIn, dates.checkOut) : '-'}</b>
          </div>
          <div className={styles.row}>
            <span>Guests</span>
            <b>{guestsLabel}</b>
          </div>

          <h3 className={styles.h3}>Price details</h3>
          <div className={styles.row}>
            <span>
              {formatInr(price.subtotal / Math.max(price.nights, 1))} × {price.nights} night
              {price.nights === 1 ? '' : 's'}
            </span>
            <span>{formatInr(price.subtotal)}</span>
          </div>
          {price.discount > 0 && (
            <div className={`${styles.row} ${styles.discount}`}>
              <span>10% promo</span>
              <span>-{formatInr(price.discount)}</span>
            </div>
          )}
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total (INR)</span>
            <span>{formatInr(price.total)}</span>
          </div>

          <p className={styles.fine}>
            Free cancellation before check-in. This is a demo: no payment is taken, but the reservation is
            stored and the dates are blocked for everyone.
          </p>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button type="button" className={styles.primary} onClick={confirm} disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm and reserve'}
          </button>
        </>
      )}
    </Modal>
  );
}
