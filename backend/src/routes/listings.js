import { Router } from 'express';
import {
  getListing,
  getPhotos,
  getReviews,
  getWishlistState,
  removeWishlist,
  saveWishlist,
  toggleWishlist,
} from '../controllers/listingController.js';
import {
  cancelReservation,
  createMessage,
  createReport,
  createReservation,
  getQuote,
  getReservations,
} from '../controllers/bookingController.js';
import { rateLimit, validateSlug } from '../middleware/guards.js';

const router = Router();

router.param('slug', (req, res, next) => validateSlug(req, res, next));

// Listing content changes rarely; let clients and proxies cache briefly.
const cacheable = (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60');
  next();
};

router.get('/:slug', cacheable, getListing);
router.get('/:slug/photos', cacheable, getPhotos);
router.get('/:slug/reviews', cacheable, getReviews);
router.get('/:slug/wishlist', getWishlistState);
const writes = rateLimit({ max: 30 });
router.post('/:slug/wishlist', writes, toggleWishlist);
router.put('/:slug/wishlist', writes, saveWishlist);
router.delete('/:slug/wishlist', writes, removeWishlist);

router.get('/:slug/quote', getQuote);
router.get('/:slug/reservations', getReservations);
router.post('/:slug/reservations', writes, createReservation);
router.delete('/:slug/reservations/:id', writes, cancelReservation);
router.post('/:slug/messages', writes, createMessage);
router.post('/:slug/reports', writes, createReport);

export default router;
