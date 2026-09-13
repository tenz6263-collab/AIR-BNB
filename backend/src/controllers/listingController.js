import { createRequire } from 'node:module';
import { Listing } from '../models/Listing.js';
import { Wishlist } from '../models/Wishlist.js';
import { isDatabaseConnected } from '../config/db.js';

const require = createRequire(import.meta.url);
const seedListing = require('../data/listing.json');

// Visitor -> Set<slug>; used only when Mongo is unavailable.
const memoryWishlist = new Map();

async function findListing(slug) {
  if (isDatabaseConnected()) {
    const doc = await Listing.findOne({ slug }).lean();
    if (doc) return doc;
  }
  return seedListing.slug === slug ? seedListing : null;
}

/** Flattens room photos into the ordered list the photo tour and lightbox use. */
function flattenPhotos(listing) {
  return listing.rooms.flatMap((room, roomIndex) =>
    room.photos.map((src, photoIndex) => ({
      src,
      room: room.name,
      roomIndex,
      photoIndex,
      alt: `${listing.title} - ${room.name} ${photoIndex + 1}`,
    })),
  );
}

function notFound(res) {
  return res.status(404).json({ error: 'Listing not found' });
}

export async function getListing(req, res, next) {
  try {
    const listing = await findListing(req.params.slug);
    if (!listing) return notFound(res);
    res.json({ ...listing, photos: flattenPhotos(listing) });
  } catch (err) {
    next(err);
  }
}

export async function getPhotos(req, res, next) {
  try {
    const listing = await findListing(req.params.slug);
    if (!listing) return notFound(res);
    res.json({ rooms: listing.rooms, photos: flattenPhotos(listing) });
  } catch (err) {
    next(err);
  }
}

export async function getReviews(req, res, next) {
  try {
    const listing = await findListing(req.params.slug);
    if (!listing) return notFound(res);
    res.json({ summary: listing.reviewsSummary, reviews: listing.reviews });
  } catch (err) {
    next(err);
  }
}

export async function getWishlistState(req, res, next) {
  try {
    const { slug } = req.params;
    const visitorId = req.visitorId;
    let saved = false;
    if (isDatabaseConnected()) {
      saved = Boolean(await Wishlist.exists({ visitorId, listingSlug: slug }));
    } else {
      saved = memoryWishlist.get(visitorId)?.has(slug) ?? false;
    }
    res.json({ saved });
  } catch (err) {
    next(err);
  }
}

/** Reads, sets or clears the saved flag for one visitor/listing pair. */
async function setWishlist(visitorId, slug, mode) {
  if (isDatabaseConnected()) {
    const existing = await Wishlist.findOne({ visitorId, listingSlug: slug });
    const wantSaved = mode === 'toggle' ? !existing : mode === 'save';
    if (wantSaved && !existing) await Wishlist.create({ visitorId, listingSlug: slug });
    if (!wantSaved && existing) await existing.deleteOne();
    return wantSaved;
  }
  const set = memoryWishlist.get(visitorId) ?? new Set();
  const wantSaved = mode === 'toggle' ? !set.has(slug) : mode === 'save';
  if (wantSaved) set.add(slug);
  else set.delete(slug);
  memoryWishlist.set(visitorId, set);
  return wantSaved;
}

const wishlistHandler = (mode) => async (req, res, next) => {
  try {
    const { slug } = req.params;
    const listing = await findListing(slug);
    if (!listing) return notFound(res);
    const saved = await setWishlist(req.visitorId, slug, mode);
    res.json({ saved });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = wishlistHandler('toggle');
export const saveWishlist = wishlistHandler('save');
export const removeWishlist = wishlistHandler('remove');
