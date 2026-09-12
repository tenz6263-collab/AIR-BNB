# AI-assisted development log

Tooling: Claude Code (Opus) in the terminal with the Claude-in-Chrome
extension for live inspection of the reference, plus the project-level
sub-agents and skills in `.claude/`. Author: Rishi Detroja.

The sequence below is the actual order of work. Each step lists the prompt
(or instruction) given to the agent and what came out of it.

## 1. Kick-off

> Read the assignment PDF. Build the Airbnb listing clone in the MERN stack
> with separate `frontend/` and `backend/` folders. The UI has to be
> pixel-perfect against the reference URL, with matching animations and
> keyboard/focus behaviour. Commit frequently. Use the reference site's own
> images. Keep going through improvements without stopping.

Output: plan of record - three views (listing, photo tour, lightbox),
deliverables (code zip, architecture diagram, sub-agent configs, prompt log).

## 2. Reverse-engineering the reference (no code copied)

> Open https://airbnb-clone-umber-two.vercel.app in Chrome. It is behind a
> Vercel bot checkpoint, so curl will not work. Extract: every asset URL, the
> font, the computed design tokens (colours, type scale, spacing, shadows,
> transitions), the section order and text content, and the exact behaviour
> of the sticky nav, share/save, photo tour and lightbox (URL params, focus,
> keyboard).

Output: asset manifest (73 files, 12.3 MB) bundled client-side into one zip
and downloaded; a compact DOM outline for content transcription; a list of
72 unique SVG icons; behaviour notes (sticky nav when hero bottom <= 20px,
section underline at 100px offset, `?modal=PHOTO_TOUR_SCROLLABLE`,
`modalItem=1000+index`, Escape/arrow handling, toasts).

## 3. Data model and API

> Transcribe all page content into `backend/src/data/listing.json`. Create an
> Express + Mongoose API: `GET /api/listings/:slug` (with a flattened `photos`
> array for the tour/lightbox), `/photos`, `/reviews`, and a wishlist toggle
> keyed by an anonymous visitor id. It must run without MongoDB by falling
> back to the JSON so reviewers can start it with one command.

Output: `backend/` with models, controllers, routes, middleware, seed script,
health endpoint reporting `mongodb` vs `memory`.

## 4. Icon system

> Convert the extracted SVG icons into React components that inherit
> `currentColor` and fill their wrapper, so sizing is controlled by CSS.

Output: generated `frontend/src/components/icons/index.jsx` (72 icons + 3
aliases), a script that rewrote SVG attributes to JSX.

## 5. Frontend build-out

> Scaffold Vite + React 18 with CSS Modules. Implement the listing page
> section by section using the measured tokens: header, sticky section nav,
> title bar with Share/Save, 35fr/17fr/17fr hero mosaic (1120x494), two
> column body (minmax(0,1fr) 372px, 96px gap), overview, guest-favourite
> card, highlights, clamped description, sleeping arrangements, amenities +
> modal, two-month calendar with range selection, sticky booking card,
> reviews (laurels, distribution bars, six categories, chips, cards), map,
> host, things to know, similar-stays carousel.

Output: 18 components, `App.jsx` composition, skeleton loader, toast.

## 6. Overlays

> Build the Photo Tour (full-screen, slides up 28px over 0.3s cubic-bezier
> (.2,0,0,1), 8-column category grid, sticky room titles, 1-2-1-2 photo
> rows) and the Lightbox (fade in, centered image max 1100px, 40px round
> prev/next, `n of 43` counter, ArrowLeft/ArrowRight, Escape back to tour).
> Mirror the state in the URL so back/forward and deep links work. Trap
> focus, lock body scroll, restore focus to the opener on close.

Output: `PhotoTour`, `Lightbox`, `useModalParams`, `useFocusTrap`,
`useBodyLock`, `useKeyboardMode` (focus rings only after Tab).

## 7. Verification loop (pixel parity)

> Run the landmark measurement snippet in both tabs and diff every rect.
> Compare zoomed regions. Then drive the whole flow with the keyboard only
> and log `document.activeElement` at each step.

Findings and fixes:
- Every measured landmark matched to the pixel; document height 6256px in
  both.
- Focus was being stolen by the tour's trap when the lightbox closed ->
  the trap now skips initial focus when focus is already inside the dialog.
- `requestAnimationFrame`-based focus did not run in a background tab ->
  switched to timers.
- The URL modal API object was re-created each render -> memoised.

## 8. Agent and skill configuration

> Add project sub-agents and skills so future changes are checked
> automatically: a UI fidelity reviewer, an accessibility auditor, a code
> quality reviewer; skills for the pixel-parity procedure, component
> scaffolding, and the keyboard audit. Add a PostToolUse hook that rejects
> raw colours that already have tokens and missing stylesheet imports.

Output: `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`,
`.claude/hooks/lint-changed.js`, `.claude/settings.json`, `CLAUDE.md`.

## 9. Architecture diagram

> Draw a production-scale vacation-rental marketplace architecture covering
> clients, edge, core services, event bus, storage, search, deployment and
> an explicit scaling strategy per layer, and note how this repo maps to it.

Output: `docs/architecture.svg` (+ PNG and PDF renders).

## 10. Packaging

> Add root scripts (`npm run dev` runs API and web together), a README with
> setup instructions, and a packaging script that produces the submission
> zip without `node_modules`.

Output: `package.json`, `README.md`, `scripts/package.js`.
