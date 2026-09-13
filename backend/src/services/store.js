import { randomUUID } from 'node:crypto';
import { isDatabaseConnected } from '../config/db.js';

/**
 * Tiny persistence facade: writes go to Mongo when connected, otherwise to
 * process memory, so every feature works without a database.
 */
const memory = { reservations: [], submissions: [] };

export async function createRecord(Model, bucket, data) {
  if (isDatabaseConnected()) return (await Model.create(data)).toObject();
  const record = { _id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  memory[bucket].push(record);
  return record;
}

export async function findRecords(Model, bucket, filter) {
  if (isDatabaseConnected()) return Model.find(filter).sort({ createdAt: -1 }).lean();
  return memory[bucket]
    .filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteRecord(Model, bucket, filter) {
  if (isDatabaseConnected()) return (await Model.deleteOne(filter)).deletedCount > 0;
  const i = memory[bucket].findIndex((r) => Object.entries(filter).every(([k, v]) => r[k] === v));
  if (i === -1) return false;
  memory[bucket].splice(i, 1);
  return true;
}
