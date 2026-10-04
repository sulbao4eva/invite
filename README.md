# Bao & Sul — Wedding Invitation

A small static invitation for 17 April 2027, with an automatic envelope opening and RSVP links to Google Forms. No build step, database, analytics, external fonts, or runtime dependencies.

## Update the photographs

The five photographs from `wedding_website/photo_collage/` are stored in `assets/`, each in 640px and 1280px WebP versions. Their desktop order follows the source filenames: `MostLeft` → `second_from_left` → `Center` → `second_from_right` → `MostRight`. The corresponding asset names are `most-left`, `second-from-left`, `center`, `second-from-right`, and `most-right`.

On phones, the center image sits in the middle of the collage, the inner left and right photographs sit above it, and the outer left and right photographs sit below it. Their horizontal positions preserve the named left-to-right order while leaving every full photo visible at a comfortable size.

Replace these files using the same names and dimensions, or update the `src`, `srcset`, `sizes`, dimensions, and descriptive `alt` text in `index.html`. Export the complete image without cropping faces; the layout preserves its 3:2 proportions. Strip camera metadata when exporting and use approximately 88% WebP quality.

## Update RSVP

Replace **both** Google Forms URLs in `index.html` with the same public responder URL ending in `/viewform`. Never use the form editor URL. Replace `assets/rsvp-qr.png` with a QR code pointing to the new responder URL; retain a square shape and a white quiet zone of at least four QR modules. Scan it and verify the resulting Google Form before publishing.

The supplied QR image is preserved. It encodes `https://qrco.de/bh2kby`, which was verified on 4 October 2026 to redirect to the same Google Form as both website links. The buttons link directly to Google Forms. Keep this redirect active while using the supplied QR image.

The source form, `RSVP_test`, is available anonymously. Its current public title is “Bao & Sul’s Wedding RSVP | Bao & Sul 婚礼出席回复”; it requires the main contact’s name, email, and attendance choice before continuing. Optional Google sign-in saves progress; it is not required to access the form. Website RSVP responses are collected by Google Forms.

## Save to calendar

The link below the QR code opens a choice of Google Calendar or a downloadable iCalendar file for Apple, Outlook, and other calendars. Both prefill `Bao & Sul's Wedding` as an all-day event on **17 April 2027**, with the invitation text and website URL as the description. Google Calendar uses `Asia/Singapore`; the calendar file declares the same calendar timezone. All-day dates have no timezone-specific start or end time. The current RSVP form states a noon start in Singapore, but an end time and venue have not been confirmed. Keep calendar entries all-day until those details are confirmed before converting this to a timed event. Guests confirm saving in their chosen calendar application.

To change the calendar date, update the Google Calendar URL in `index.html` and `DTSTART` / `DTEND` in `assets/bao-sul-wedding.ics`. The end date for a one-day all-day event is the following day. Keep both options consistent.

## Preview and publish

Serve the repository using any static HTTP server. To check the GitHub Pages repository path locally, serve its parent directory and visit `/bao-sul-wedding/`. Every local asset uses a relative path.

GitHub Pages should publish from **main / (root)**. `.nojekyll` disables unnecessary Jekyll processing. Commit and push changes to `main` to update the website. There are no secrets or deployment credentials in this repository.

## Accessibility and opening

The invitation is ordinary readable HTML and remains visible without JavaScript. With JavaScript, a font-readiness wait capped at 500ms starts a 5.1-second envelope sequence. Guests can skip using the visible control or Escape. Reduced-motion visitors see the invitation immediately. Photos load during the sequence; slow assets never skip the opening. An independent 10-second fallback protects against a failed script. A visible replay button also lets reduced-motion visitors explicitly opt in to the opening and petals without overriding their device preference automatically. Links have visible keyboard focus and open the public Google Form in a new tab.

Cormorant Garamond is bundled locally under the SIL Open Font License; see `assets/FONT-LICENSE.txt`. Floral artwork, the monogram, and the paper texture are lightweight local SVG files.

## Falling cherry blossoms

A single canvas renders **11 larger petals** across the viewport, including the center. This applies the latest 20% reduction to the preceding 14-petal setting (rounded from 11.2); the average arrival rate is reduced by exactly 20% to approximately **0.67 petals per second**. Lifetimes account for rounding while preserving varied, gentle movement. Pre-rendered sprites and a capped pixel density keep the effect lightweight. Each petal varies in size, flutter, rotation, opacity, and sideways drift; its starting position changes on subsequent loops.

The canvas is attached directly to the body, outside the opening's hidden/transformed container, for reliable Safari rendering. Transparent cutouts protect photographs, invitation text, RSVP controls, the QR code, calendar options, and footer controls. Rectangles are refreshed on scrolling, resizing, orientation changes, and layout changes. The layer ignores pointer events. Versioned stylesheet/script URLs prevent stale mobile caches from combining different versions.

The keyboard-accessible **Pause petals** checkbox freezes the canvas and the CSS fallback. Animation stops while the tab is hidden and is disabled by default for reduced-motion visitors. **Play invitation & petals** provides an explicit opt-in on those devices. Safari page restoration and viewport changes refresh the canvas. If JavaScript or canvas is unavailable, 11 CSS fallback petals retain the larger size and the invitation remains fully usable.
