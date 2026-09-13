import { Router } from 'express';
import {
  getListing,
  getPhotos,
  getReviews,
  getWishlistState,
  toggleWishlist,
} from '../controllers/listingController.js';
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
router.post('/:slug/wishlist', rateLimit({ max: 30 }), toggleWishlist);

export default router;
