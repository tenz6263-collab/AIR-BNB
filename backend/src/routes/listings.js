import { Router } from 'express';
import {
  getListing,
  getPhotos,
  getReviews,
  getWishlistState,
  toggleWishlist,
} from '../controllers/listingController.js';

const router = Router();

router.get('/:slug', getListing);
router.get('/:slug/photos', getPhotos);
router.get('/:slug/reviews', getReviews);
router.get('/:slug/wishlist', getWishlistState);
router.post('/:slug/wishlist', toggleWishlist);

export default router;
