import { createRequire } from 'node:module';
import { Reservation } from '../models/Reservation.js';
import { Submission } from '../models/Submission.js';
import { createRecord, deleteRecord, findRecords } from '../services/store.js';

const require = createRequire(import.meta.url);
const seedListing = require('../data/listing.json');

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const PROMO_RATE = 0.1;
const MAX_GUESTS = 3;

const nightsBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/** Every night in [checkIn, checkOut) as ISO strings. */
function nightsOf(checkIn, checkOut) {
  const out = [];
  const d = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (d < end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

function nightlyRate(listing) {
  const price = Number(String(listing.booking.priceLabel).replace(/[^\d]/g, ''));
  return price / listing.booking.nights;
}

/** Dates blocked by the host plus every confirmed reservation. */
async function blockedDates(slug, listing) {
  const reservations = await findRecords(Reservation, 'reservations', { listingSlug: slug, status: 'confirmed' });
  const set = new Set(listing.booking.blockedDates);
  for (const r of reservations) nightsOf(r.checkIn, r.checkOut).forEach((d) => set.add(d));
  return [...set].sort();
}

/** Server-side price so the client cannot tamper with totals. */
export function quote(listing, { checkIn, checkOut, promo }) {
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = Math.round(nightlyRate(listing) * nights);
  const discount = promo ? Math.round(subtotal * PROMO_RATE) : 0;
  return { nights, subtotal, discount, total: subtotal - discount };
}

export async function getReservations(req, res, next) {
  try {
    const { slug } = req.params;
    const listing = seedListing; // schema is shared; pricing/blocked dates come from the seed
    const mine = await findRecords(Reservation, 'reservations', { listingSlug: slug, visitorId: req.visitorId });
    res.json({ reservations: mine, blockedDates: await blockedDates(slug, listing) });
  } catch (err) {
    next(err);
  }
}

export async function createReservation(req, res, next) {
  try {
    const { slug } = req.params;
    const listing = seedListing;
    const { checkIn, checkOut, guests = {}, promo = false } = req.body || {};

    if (!ISO.test(checkIn || '') || !ISO.test(checkOut || '') || checkOut <= checkIn) {
      return res.status(400).json({ error: 'Choose a check-in date before the checkout date' });
    }
    const adults = Number(guests.adults ?? 1);
    const children = Number(guests.children ?? 0);
    if (adults < 1 || adults + children > MAX_GUESTS) {
      return res.status(400).json({ error: `This place allows up to ${MAX_GUESTS} guests` });
    }
    const taken = new Set(await blockedDates(slug, listing));
    const clash = nightsOf(checkIn, checkOut).find((d) => taken.has(d));
    if (clash) return res.status(409).json({ error: `Those dates are not available (${clash})` });

    const record = await createRecord(Reservation, 'reservations', {
      visitorId: req.visitorId,
      listingSlug: slug,
      checkIn,
      checkOut,
      guests: { adults, children, infants: Number(guests.infants ?? 0), pets: Number(guests.pets ?? 0) },
      ...quote(listing, { checkIn, checkOut, promo: Boolean(promo) }),
      status: 'confirmed',
    });
    res.status(201).json({ reservation: record, blockedDates: await blockedDates(slug, listing) });
  } catch (err) {
    next(err);
  }
}

export async function cancelReservation(req, res, next) {
  try {
    const { slug, id } = req.params;
    const removed = await deleteRecord(Reservation, 'reservations', { _id: id, listingSlug: slug, visitorId: req.visitorId });
    if (!removed) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ ok: true, blockedDates: await blockedDates(slug, seedListing) });
  } catch (err) {
    next(err);
  }
}

export async function getQuote(req, res) {
  const { checkIn, checkOut, promo } = req.query;
  if (!ISO.test(checkIn || '') || !ISO.test(checkOut || '') || checkOut <= checkIn) {
    return res.status(400).json({ error: 'Invalid dates' });
  }
  res.json(quote(seedListing, { checkIn, checkOut, promo: promo === 'true' }));
}

const submission = (kind) => async (req, res, next) => {
  try {
    const body = String(req.body?.body || '').trim();
    if (body.length < 2) return res.status(400).json({ error: 'Please write a message' });
    const record = await createRecord(Submission, 'submissions', {
      kind,
      visitorId: req.visitorId,
      listingSlug: req.params.slug,
      body: body.slice(0, 2000),
      reason: req.body?.reason ? String(req.body.reason).slice(0, 120) : undefined,
    });
    res.status(201).json({ ok: true, id: record._id });
  } catch (err) {
    next(err);
  }
};

export const createMessage = submission('message');
export const createReport = submission('report');
