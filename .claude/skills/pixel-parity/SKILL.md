---
name: pixel-parity
description: Measure and diff layout landmarks between the reference listing page and the local build so every change is verified to the pixel. Use before committing any frontend change.
---

# Pixel parity workflow

The reference is bot-protected; open it in the real browser (Claude in Chrome),
not with curl. Use a 1440x900 window for both tabs.

## 1. Measure landmarks

Run this in both tabs and compare the JSON. `byText` finds leaf elements by
their exact text so the snippet is markup-agnostic.

```js
document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0);
const byText = (t, tag = '*') => [...document.querySelectorAll(tag)]
  .find((e) => e.children.length === 0 && e.textContent.trim() === t);
const R = (el) => el && (({ left, top, width, height }) =>
  [Math.round(left), Math.round(top + scrollY), Math.round(width), Math.round(height)])(el.getBoundingClientRect());
({
  h1: R(document.querySelector('h1')),
  summary: R(byText('Entire serviced apartment in Candolim, India')),
  hosted: R(byText('Hosted by Mirashya Homes')),
  offers: R(byText('What this place offers', 'h2')),
  nights: R(byText('5 nights in Candolim')),
  bigRating: R(byText('4.95', 'div')),
  where: R(byText('Where you’ll be')),
  meet: R(byText('Meet your host')),
  things: R(byText('Things to know')),
  more: R(byText('More stays nearby')),
  docH: document.documentElement.scrollHeight,
})
```

For the tour and lightbox, open them first (`Show all photos`, then click a
photo) and measure: header bar, back/grid/close buttons, title, category grid,
first room title, first photo, prev/next buttons, stage image.

## 2. Compare pixels

Use `computer.zoom` on the same region in both tabs. Check font size/weight,
colour, spacing, border radius, shadows, icon size and stroke.

## 3. Behaviour checklist

- Hero tile hover: 10% black overlay, 0.2s; `:active` scale(0.997).
- Show all photos / hero tile opens the tour; hero tile scrolls to its room.
- Sticky nav appears when hero bottom <= 20px; underline follows the section
  whose top is <= 100px.
- Share -> toast; Save toggles filled red heart + "Saved" + toast.
- Tour: Escape or Back closes and restores focus to the opener; category
  thumbnails smooth-scroll to their room; photo hover scales 1.04 with an 8%
  overlay.
- Lightbox: ArrowLeft/ArrowRight step, Escape returns to tour with focus on
  the photo, counter "n of 43", prev/next disabled at the ends, URL carries
  `modalItem=1000+index`.
- Amenities modal: Escape and backdrop click close, focus returns to trigger.

Report deviations as `view | element | reference | local | fix`.
