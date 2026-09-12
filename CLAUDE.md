# Airbnb Listing Clone (MERN)

Pixel-perfect clone of a single Airbnb listing page with three views:
the listing page, the full-screen Photo Tour, and the Lightbox.

Reference (single source of truth): https://airbnb-clone-umber-two.vercel.app
Desktop only. Target viewport for parity checks: 1440 x 900.

## Layout

- `frontend/` Vite + React 18, CSS Modules, no UI framework. Entry `src/App.jsx`.
- `backend/`  Express + Mongoose REST API. Falls back to `src/data/listing.json`
  when `MONGODB_URI` is unset or unreachable, so the app runs without Mongo.
- `docs/`     architecture diagram, prompt log, parity notes.
- `.claude/`  sub-agents and skills used during development (keep in the zip).

## Commands

```
npm run dev            # runs API (4000) and Vite (5173) together
npm --prefix backend run seed
npm --prefix frontend run build
```

## Conventions

- Design tokens live in `frontend/src/styles/tokens.css`; never hard-code a
  colour or font that has a token.
- One component per folder: `Name.jsx` + `Name.module.css`. Data comes in via
  props; no component fetches on its own except `App`.
- Icons are React components in `frontend/src/components/icons/index.jsx`.
  Size them with a wrapper element, never with width/height props.
- Overlays (tour, lightbox, amenities modal) must: lock body scroll, trap
  focus, close on Escape, restore focus to the opener, mirror state in the URL
  (`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=100x`).
- Interactions must match the reference: hover overlays, scale transitions,
  sticky nav threshold (hero bottom <= 20px), active section offset (100px).
- Keep the seed JSON and the Mongoose schema in sync when adding fields.

## Verifying parity

Use the `pixel-parity` skill: open the reference and the local build in the
browser at the same viewport, measure landmark rects with the shared snippet,
and diff. Every value should match to the pixel before a change is committed.
