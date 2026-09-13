# Parity report

Method: both pages opened in Chrome at a 1440x900 window (1536px layout
viewport), landmark elements located by their text, bounding boxes measured
with `getBoundingClientRect()` and compared. Values are
`[left, top, width, height]` in CSS pixels; top is document-relative.

Result (2026-09-13): every landmark below is identical on the reference and
the local build. Total document height is 6256px on both.

| Landmark | Reference = Local |
| --- | --- |
| Title h1 | 200, 121, 602, 30 |
| Share / Save labels | 1196, 129, 37, 18 / 1279, 129, 31, 18 |
| Show all photos | 1154, 612, 143, 32 |
| Summary heading | 200, 715, 652, 26 |
| Hosted by | 262, 909, 204, 23 |
| First highlight | 248, 1014, 358, 20 |
| Description "Show more" | 200, 1420, 104, 21 |
| Where you'll sleep | 200, 1505, 652, 26 |
| What this place offers | 200, 1890, 652, 26 |
| Show all 50 amenities | 200, 2188, 208, 48 |
| Calendar title | 200, 2301, 652, 31 |
| October 2026 | 200, 2380, 298, 23 |
| Keyboard glyph / Clear dates | 200, 2675, 30, 22 / 765, 2676, 87, 20 |
| CHECK-IN label | 987, 893, 135, 14 |
| Guests value | 986, 967, 54, 20 |
| Reserve button | 973, 1067, 322, 48 |
| Report this listing | 1090, 1201, 113, 20 |
| Big rating 4.95 | 671, 822, 58, 29 |
| Guest favourite | 200, 2937, 1120, 31 |
| Overall rating | 224, 3099, 163, 20 |
| First topic chip | 200, 3273, 135, 48 |
| First reviewer | 254, 3352, 118, 21 |
| Show all 19 reviews | 200, 3982, 190, 48 |
| Where you'll be | 200, 4128, 1120, 26 |
| Neighbourhood highlights | 200, 4783, 1120, 26 |
| Meet your host | 200, 4978, 1120, 26 |
| Host name | 225, 5160, 190, 74 |
| Co-Hosts | 588, 5028, 732, 26 |
| Things to know | 200, 5541, 1120, 26 |
| More stays nearby | 200, 5876, 188, 26 |

Photo tour (open): header 0,0,1536,88; back 24,24,40,40; title 728,33,80,23;
category grid 272,88,976,294; first thumbnail 272,88,112,132; room 0 title
272,438,458,35; first photo 790,438,458,305; first pair photo
790,755,223,149; room 1 272,908,976,1281 - all identical.

Lightbox (open): header 0,0,W,72; grid button 16,16,40,40; title
719,25,98,23; counter 1418,26,42,20; close 1472,16,40,40; prev 20,y,40,40;
next W-60,y,40,40; stage padding 88/96 with the image capped at 1100px -
all identical.

## Behaviour

| Interaction | Reference | Local |
| --- | --- | --- |
| Sticky nav | appears when hero bottom <= ~20px | same (`useScrollSpy`) |
| Active section | switches when section top <= ~100px | same |
| Share | toast "Share options" | same (+ copies the link) |
| Save | "Saved to wishlist" / "Removed from wishlist", filled heart, "Saved" | same, persisted via API |
| Reserve | toast "You won't be charged yet" | same |
| Show all photos / hero tile | tour opens, URL `?modal=PHOTO_TOUR_SCROLLABLE`, hero tile scrolls to its room | same |
| Tour photo | lightbox, `modalItem=1000+index`, counter `n of 43` | same |
| Lightbox keys | ArrowLeft/ArrowRight step, Escape returns to tour | same |
| Escape in tour | closes, focus returns to opener | same |
| Amenities modal | Escape / backdrop closes, focus returns to trigger | same |
| Description / review "Show more" | expands in place | same |
| Claim | no-op | applies a 10% promo; price updates in the card, sticky nav and checkout (enhancement) |
| Guests field | static | popover with counters, 3-guest limit (enhancement) |
| Reserve | toast only | confirm dialog with server-priced breakdown, stored reservation, dates blocked, cancel (enhancement) |
| Show all reviews / topic chips / How reviews work | no-op | reviews browser with search and topic filter; chips filter the page; info dialog (enhancement) |
| Message host / Report | no-op | forms stored through the API (enhancement) |
| Learn more (things to know) | no-op | policy dialogs (enhancement) |
| Calendar | static | interactive: range selection, month paging, blocked by host dates and reservations (enhancement) |

Every enhancement lives inside a dialog or popover, or changes text only,
so the measured layout of the page itself is unchanged (re-measured after
the feature work: identical to the table above).
