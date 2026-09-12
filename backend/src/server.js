import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { seedIfEmpty } from './scripts/seed.js';

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  const connected = await connectDatabase(process.env.MONGODB_URI);
  if (connected) await seedIfEmpty();

  const app = createApp({ clientOrigin: process.env.CLIENT_ORIGIN });
  app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
