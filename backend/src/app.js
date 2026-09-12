import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import listingsRouter from './routes/listings.js';
import { visitorId } from './middleware/visitor.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { isDatabaseConnected } from './config/db.js';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');

export function createApp({ clientOrigin }) {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: clientOrigin ? clientOrigin.split(',') : true }));
  app.use(express.json());
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
  app.use(visitorId);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, database: isDatabaseConnected() ? 'mongodb' : 'memory' });
  });
  app.use('/api/listings', listingsRouter);

  // In production the API also serves the built frontend (npm run build).
  if (fs.existsSync(DIST)) {
    app.use(express.static(DIST, { maxAge: '1h', index: false }));
    app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
