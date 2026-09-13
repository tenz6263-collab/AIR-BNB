# Deploying to Render

Two ways to run this on [Render](https://render.com). Both start from the
same step: push the repository to a **private** GitHub or GitLab repo (the
assignment forbids a public one) and connect that repo to Render.

## Option A - Blueprint (frontend static site + API web service)

`render.yaml` at the repo root describes both services and links them:

| Service | Type | Root | Build | Start / publish |
| --- | --- | --- | --- | --- |
| `airbnb-clone-api` | Node web service | `backend` | `npm ci` | `node src/server.js` |
| `airbnb-clone-web` | Static site | `frontend` | `npm ci && npm run build` | `dist` |

1. Render dashboard -> **New** -> **Blueprint** -> pick the repo -> **Apply**.
2. When asked, leave `MONGODB_URI` empty to run on the bundled dataset, or
   paste a MongoDB Atlas connection string (free M0 cluster is enough; allow
   access from `0.0.0.0/0` or Render's outbound IPs). The listing is seeded
   automatically on first start.
3. Wait for both deploys. The static site gets the API host injected as
   `VITE_API_BASE` at build time; the API gets the site host as
   `CLIENT_ORIGIN` for CORS. Nothing else to configure.
4. Open `https://airbnb-clone-web.onrender.com` (the exact host is shown on
   the service page; Render adds a suffix if the name is taken).

Health check: `https://<api-host>/api/health` returns
`{"ok":true,"database":"mongodb"|"memory"}`.

## Option B - single web service (API serves the built frontend)

Simplest possible setup, no CORS involved:

| Setting | Value |
| --- | --- |
| Type | Web service, Node |
| Root directory | *(repo root)* |
| Build command | `npm ci --ignore-scripts && node scripts/install-all.js && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Env vars | `NODE_ENV=production`, optional `MONGODB_URI` |

Express serves `frontend/dist` with an SPA fallback, so deep links such as
`/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1005` work directly.

## Troubleshooting

- **"We couldn't load this listing - Failed to fetch"** on the static site:
  the browser could not reach the API. Render's `fromService: host` injects
  the bare service slug (e.g. `airbnb-clone-api-e8n8`); the client expands
  it to `https://<slug>.onrender.com` and the API accepts the matching
  `<slug>.onrender.com` origin, so after redeploying both services this
  resolves itself. To check by hand: open the site's JS bundle and search
  for `onrender.com`, and hit `https://<api-host>/api/health` with an
  `Origin` header - the response must carry `Access-Control-Allow-Origin`.
- If you rename a service, redeploy the *other* one too: the values are
  baked in at build/start time.

## Notes

- Free instances sleep after inactivity; the first request can take ~30s.
  The in-memory wishlist resets on every restart - use Atlas for persistence.
- Node 18+ is required (`engines` is set in every `package.json`; Render
  reads it).
- Custom domains: add them in the dashboard and append the domain to
  `CLIENT_ORIGIN` (comma separated, with or without `https://`).
- Local production rehearsal: `npm run build && npm start`, or
  `docker compose up --build` for the API + MongoDB pair.
