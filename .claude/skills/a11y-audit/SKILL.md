---
name: a11y-audit
description: Keyboard and screen-reader audit script for the listing page overlays (tour, lightbox, amenities modal). Use after touching any overlay, focus, or keyboard handling code.
---

# Keyboard flow to verify

Run with the local tab focused (key events go to the active tab).

1. Tab from the top: Skip link -> logo -> search -> nav -> Share -> Save ->
   hero tiles -> Show all photos.
2. Enter on "Show all photos": tour opens, focus lands on Back, body scroll is
   locked, URL has `?modal=PHOTO_TOUR_SCROLLABLE`.
3. Tab through categories to a photo, Enter: lightbox opens, focus on Close,
   URL gains `&modalItem=100x`, counter reads `n of 43`.
4. ArrowRight / ArrowLeft step photos; at index 0 Prev is disabled.
5. Escape: lightbox closes, focus returns to that photo in the tour.
6. Escape: tour closes, focus returns to "Show all photos", URL is clean.
7. Open amenities modal with Enter; Tab cycles inside; Escape closes and
   focus returns to "Show all 50 amenities".

Log focus with:

```js
window.__log = [];
document.addEventListener('focusin', (e) => window.__log.push(
  e.target.getAttribute('aria-label') || e.target.textContent.trim().slice(0, 20)), true);
```

Any step where focus lands on `body` or an element behind an overlay is a bug.
