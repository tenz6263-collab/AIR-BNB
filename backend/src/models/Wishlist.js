import mongoose from 'mongoose';

/** One row per (visitor, listing) pair - toggled by the Save button. */
const WishlistSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    listingSlug: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

WishlistSchema.index({ visitorId: 1, listingSlug: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
