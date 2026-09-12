import mongoose from 'mongoose';

/**
 * Connects to MongoDB when MONGODB_URI is configured. Resolves to `true` on a
 * live connection and `false` when the API should fall back to the bundled
 * dataset (no URI, or the server is unreachable). The fallback keeps the
 * listing page fully functional on a machine without a local Mongo instance.
 */
export async function connectDatabase(uri) {
  if (!uri) {
    console.log('[db] MONGODB_URI not set - serving the in-memory dataset');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('[db] connected to MongoDB');
    return true;
  } catch (err) {
    console.warn(`[db] could not connect (${err.message}) - serving the in-memory dataset`);
    return false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
