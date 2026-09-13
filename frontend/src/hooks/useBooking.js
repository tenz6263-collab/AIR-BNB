import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { nightsBetween, parseIso } from '../utils/dates';

const PROMO_KEY = 'abnb.promoClaimed';
const PROMO_RATE = 0.1;
export const MAX_GUESTS = 3;

const readPromo = () => {
  try {
    return localStorage.getItem(PROMO_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Everything the booking card, calendar and reserve flow share: selected
 * dates, guest counts, the claimed promo, the visitor's reservations and the
 * dates blocked by the host or by other reservations.
 */
export function useBooking(slug, listing) {
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [promo, setPromo] = useState(readPromo);
  const [reservations, setReservations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    if (!listing) return;
    setDates({ checkIn: listing.booking.checkIn, checkOut: listing.booking.checkOut });
    setBlockedDates(listing.booking.blockedDates);
    api
      .getReservations(slug)
      .then((r) => {
        setReservations(r.reservations);
        setBlockedDates(r.blockedDates);
      })
      .catch(() => {});
  }, [slug, listing]);

  const claimPromo = useCallback(() => {
    setPromo(true);
    try {
      localStorage.setItem(PROMO_KEY, '1');
    } catch {
      /* private mode */
    }
  }, []);

  const nights =
    dates.checkIn && dates.checkOut ? nightsBetween(parseIso(dates.checkIn), parseIso(dates.checkOut)) : 0;
  const nightly = listing
    ? Number(String(listing.booking.priceLabel).replace(/[^\d]/g, '')) / listing.booking.nights
    : 0;
  const price = useMemo(() => {
    const subtotal = Math.round(nightly * nights);
    const discount = promo ? Math.round(subtotal * PROMO_RATE) : 0;
    return { nights, subtotal, discount, total: subtotal - discount };
  }, [nightly, nights, promo]);

  const reserve = useCallback(async () => {
    const r = await api.createReservation(slug, { ...dates, guests, promo });
    setReservations((list) => [r.reservation, ...list]);
    setBlockedDates(r.blockedDates);
    return r.reservation;
  }, [slug, dates, guests, promo]);

  const cancel = useCallback(
    async (id) => {
      const r = await api.cancelReservation(slug, id);
      setReservations((list) => list.filter((x) => x._id !== id));
      setBlockedDates(r.blockedDates);
    },
    [slug],
  );

  const guestCount = guests.adults + guests.children;
  const guestsLabel = `${guestCount} guest${guestCount === 1 ? '' : 's'}${guests.infants ? `, ${guests.infants} infant${guests.infants === 1 ? '' : 's'}` : ''}${guests.pets ? `, ${guests.pets} pet${guests.pets === 1 ? '' : 's'}` : ''}`;

  return {
    dates,
    setDates,
    guests,
    setGuests,
    guestsLabel,
    promo,
    claimPromo,
    price,
    blockedDates,
    reservations,
    reserve,
    cancel,
  };
}
