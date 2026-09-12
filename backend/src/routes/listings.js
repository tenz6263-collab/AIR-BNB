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

router.get('/:slug', getListing);
router.get('/:slug/photos', getPhotos);
router.get('/:slug/reviews', getReviews);
router.get('/:slug/wishlist', getWishlistState);
router.post('/:slug/wishlist', rateLimit({ max: 30 }), toggleWishlist);

export default router;
