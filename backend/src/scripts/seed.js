import 'dotenv/config';
import { createRequire } from 'node:module';
import mongoose from 'mongoose';
import { Listing } from '../models/Listing.js';
import { connectDatabase } from '../config/db.js';

const require = createRequire(import.meta.url);
const listing = require('../data/listing.json');

/** Inserts the sample listing when the collection is empty. */
export async function seedIfEmpty() {
  const count = await Listing.countDocuments();
  if (count === 0) {
    await Listing.create(listing);
    console.log('[seed] inserted sample listing');
  }
}

/** `npm run seed` upserts the listing so re-running is safe. */
async function run() {
  const connected = await connectDatabase(process.env.MONGODB_URI);
  if (!connected) {
    console.error('[seed] no database connection');
    process.exit(1);
  }
  await Listing.findOneAndUpdate({ slug: listing.slug }, listing, { upsert: true, new: true });
  console.log('[seed] listing upserted');
  await mongoose.disconnect();
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
