# Airbnb Listing Clone (MERN)

Pixel-perfect clone of an Airbnb listing page - the listing itself, the
full-screen **Photo Tour**, and the **Lightbox** - built with MongoDB,
Express, React and Node for the Playpower Labs take-home assignment.

Reference: https://airbnb-clone-umber-two.vercel.app (desktop, 1440x900)

Author: Rishi Detroja

## Quick start

Requires Node 18+ (Node 22 used during development).

```bash
npm install          # installs root, backend and frontend dependencies
npm run dev          # API on http://localhost:4000, app on http://localhost:5173
```

Production-style run (single port, the API serves the built frontend):

```bash
npm run build && npm start   # http://localhost:4000
```

Docker: `docker compose up --build` starts the API (serving the built
frontend) together with MongoDB on http://localhost:4000.

MongoDB is optional. Copy `backend/.env.example` to `backend/.env` and set
`MONGODB_URI` to use a database (the listing is seeded automatically on first
start, or run `npm run seed`). Without it the API serves the bundled dataset
from memory so the page works out of the box.

```bash
npm test             # API tests (node:test) + frontend utility tests
npm run lint --prefix frontend
npm run e2e          # headless-Chrome behaviour checks against the dev server
npm run snapshot     # headless screenshots of every view -> .snapshots/
npm run package      # creates airbnb-clone-submission.zip (no node_modules)
```

| Listing | Photo tour | Lightbox |
| --- | --- | --- |
| ![Listing](docs/screenshots/listing.png) | ![Photo tour](docs/screenshots/photo-tour.png) | ![Lightbox](docs/screenshots/lightbox.png) |

## What is implemented

| View | Details |
| --- | --- |
| Listing page | Header with search pill, sticky section nav (appears when the hero scrolls out, underline follows the section), Share (copies link + toast) / Save (persists to the wishlist API, filled heart), 5-photo hero mosaic, overview, guest-favourite card, host, highlights, clamped description, sleeping arrangements, amenities preview + full modal, two-month calendar with range selection and blocked dates, sticky booking card whose price follows the selected nights, reviews (laurels, distribution, categories, topic chips, cards with show-more), stylised map with zoom, host profile, things to know, similar-stays carousel. |
| Photo tour | Full-screen panel that slides up, 8-column category grid that smooth-scrolls to each room, sticky room titles, 1-2-1-2 photo rows with hover zoom. Opened from *Show all photos* or any hero tile (which scrolls to that photo's room). URL: `?modal=PHOTO_TOUR_SCROLLABLE`. |
| Lightbox | Single photo viewer with prev/next, `n of 43` counter, ArrowLeft/ArrowRight, Escape back to the tour, neighbour preloading. URL: `&modalItem=1000+index`. |

Functional features (all backed by the API, persisted in MongoDB or in memory):
guest picker with the 3-guest limit, promo claim (10% off, price updates
everywhere), reservation flow with server-side pricing, overlap checks,
blocked dates in the calendar and cancellation; message the host; report the
listing; topic chips that filter reviews; full reviews browser with search;
"How reviews work" and policy dialogs; wishlist save.

Accessibility: skip link, semantic buttons with labels, `role="dialog"` +
`aria-modal`, focus trapping, focus restoration to the opener, keyboard-only
focus rings (`body.kbd`), `aria-live` toast, `prefers-reduced-motion`.

## Project structure

```
frontend/                Vite + React 18 + CSS Modules
  public/assets/         images and the Cereal variable font
  src/App.jsx            page composition and overlay state
  src/components/        one folder per component (jsx + module.css)
  src/components/icons/  generated inline-SVG icon components
  src/hooks/             useListing, useWishlist, useOverlays (+ useModalParams),
                         useScrollSpy, useFocusTrap, useBodyLock, useKeyboardMode, useToast
  src/styles/            tokens.css (design tokens), global.css
backend/                 Express + Mongoose
  src/app.js             middleware and routes
  src/models/            Listing, Wishlist
  src/controllers/       listing + wishlist handlers (Mongo or memory)
  src/data/listing.json  seed / fallback dataset
  src/scripts/seed.js    npm run seed
docs/                    architecture diagram (svg/png/pdf), PROMPTS.md
.claude/                 sub-agents, skills, hooks used during development
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | `{ ok, database: "mongodb" \| "memory" }` |
| GET | `/api/listings/:slug` | Full listing document + flattened `photos` |
| GET | `/api/listings/:slug/photos` | Rooms and flattened photos |
| GET | `/api/listings/:slug/reviews` | Review summary and reviews |
| GET | `/api/listings/:slug/wishlist` | `{ saved }` for the `x-visitor-id` header |
| POST | `/api/listings/:slug/wishlist` | Toggles the saved state |
| PUT / DELETE | `/api/listings/:slug/wishlist` | Sets / clears the saved state (idempotent) |
| GET | `/api/listings/:slug/quote?checkIn&checkOut&promo` | Server-side price breakdown |
| GET / POST | `/api/listings/:slug/reservations` | Visitor's reservations + blocked dates / create (validates dates, guests, overlaps) |
| DELETE | `/api/listings/:slug/reservations/:id` | Cancel a reservation |
| POST | `/api/listings/:slug/messages` | Message the host |
| POST | `/api/listings/:slug/reports` | Report the listing |

## AI workflow

Built with Claude Code and the Claude-in-Chrome extension. The reference was
inspected live in the browser (it is bot-protected), design tokens and content
were measured and transcribed, and every section was verified with a landmark
diff between the two tabs. Project sub-agents (`ui-fidelity-reviewer`,
`a11y-auditor`, `code-quality-reviewer`), skills (`pixel-parity`,
`react-component`, `a11y-audit`) and a lint hook live in `.claude/`. The
prompt sequence is in `docs/PROMPTS.md`.

## Deploy (Render)

`render.yaml` is a Render Blueprint that creates the API web service and the
frontend static site and links them (CORS origin and API base are injected
automatically). Push to a private repo, then **New > Blueprint** in Render.
A single-service variant (API serving the built frontend) is described in
`docs/DEPLOY.md`. Set `MONGODB_URI` (MongoDB Atlas) for persistence; without
it the API runs on the bundled dataset.

## Architecture

`docs/architecture.png` (also `.svg` / `.pdf`) shows the production-scale
marketplace design and how this repository maps onto it.
