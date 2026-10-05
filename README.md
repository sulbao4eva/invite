# Bao & Sul — Wedding Invitation

A small static invitation for 17 April 2027, with an automatic envelope opening and RSVP links to Google Forms. No build step, database, analytics, or external fonts. The venue preview uses a Google-hosted map embed; the invitation and directions links remain ordinary HTML.

## Update the photographs

The five photographs from `wedding_website/photo_collage/` are stored in `assets/`, each in 640px and 1280px WebP versions. Their desktop order follows the source filenames: `MostLeft` → `second_from_left` → `Center` → `second_from_right` → `MostRight`. The corresponding asset names are `most-left`, `second-from-left`, `center`, `second-from-right`, and `most-right`.

On phones, the center image sits in the middle of the collage, the inner left and right photographs sit above it, and the outer left and right photographs sit below it. Their horizontal positions preserve the named left-to-right order while leaving every full photo visible at a comfortable size.

Replace these files using the same names and dimensions, or update the `src`, `srcset`, `sizes`, dimensions, and descriptive `alt` text in `index.html`. Export the complete image without cropping faces; the layout preserves its 3:2 proportions. Strip camera metadata when exporting and use approximately 88% WebP quality.

## Update RSVP

Replace **both** Google Forms URLs in `index.html` with the same public responder URL ending in `/viewform`. Never use the form editor URL. Replace `assets/rsvp-qr.png` with a QR code pointing to the new responder URL; retain a square shape and a white quiet zone of at least four QR modules. Scan it and verify the resulting Google Form before publishing.

The QR code and both RSVP links point directly to the same public Google Form. The image has a white quiet zone of at least four modules, integer-sized modules, and no redirect-service dependency. It was decoded at its native 1600px size and the 164px / 180px display sizes on 5 October 2026.

The source form, `RSVP_test`, is available anonymously. Its current public title is “Bao & Sul’s Wedding RSVP | Bao & Sul 婚礼出席回复”; it requires the main contact’s name, email, and attendance choice before continuing. Optional Google sign-in saves progress; it is not required to access the form. Website RSVP responses are collected by Google Forms.

## Venue and calendar

Hilton Singapore Orchard's official website confirms **333 Orchard Road, Singapore 238867**. The venue section displays the user-confirmed Imperial Ballroom, Level 35, noon start on Saturday, 17 April 2027, the official hotel link, and a Google Maps preview.

Google's place record resolves to the Hilton pin with place ID `ChIJU2DzfLcZ2jER4WGAnEnqNFw` (also matching the CID `6644192952157495777` linked by Hilton). Both the entire map preview and **Get Directions** use the standard `https://www.google.com/maps/dir/?api=1` URL with the verified destination and place ID. Google Maps handles its app/browser fallback. The embed URL was copied directly from Google Maps → Share → Embed a map on 5 October 2026. The Google-hosted embed retains Google's own map labels and attribution, uses lazy loading, and requires no project API key. It is presented as a clickable preview, so touch/keyboard navigation opens directions instead of trapping scroll in the embedded map. The explicit directions button remains available if a visitor blocks the third-party map.

**Add to calendar** opens choices for Google Calendar and a downloadable iCalendar file for Apple, Outlook, and other calendars. Both use the exact title `Sul & Bao Wedding @Hilton Singapore Orchard L35` and **17 April 2027, 12:00 PM–3:00 PM Asia/Singapore (UTC+8)**, the full venue/address, a warm invitation, and the invitation, hotel, and directions URLs.

The Google URL encodes UTC start/end times `20270417T040000Z/20270417T070000Z` and `ctz=Asia/Singapore`. The `.ics` uses `DTSTART;TZID=Asia/Singapore:20270417T120000` / `DTEND;TZID=Asia/Singapore:20270417T150000`, a matching fixed UTC+8 `VTIMEZONE`, RFC-compliant text escaping, CRLF endings, and folded lines. The existing event UID is preserved. Guests confirm saving in their calendar application.

Update the Google Calendar URL and `.ics` together if details change. Do not revert to all-day dates. The responsive reading order is invitation, venue/map, calendar, RSVP/QR, and the B & S closing signature. Desktop uses paired venue/map and RSVP/QR layouts; narrow screens stack them.

## Preview and publish

Serve the repository using any static HTTP server. To check the GitHub Pages repository path locally, serve its parent directory and visit `/bao-sul-wedding/`. Every local asset uses a relative path.

GitHub Pages should publish from **main / (root)**. `.nojekyll` disables unnecessary Jekyll processing. Commit and push changes to `main` to update the website. There are no secrets or deployment credentials in this repository.

## Accessibility and opening

The invitation is ordinary readable HTML and remains visible without JavaScript. With JavaScript, a font-readiness wait capped at 500ms starts a 5.1-second envelope sequence. Guests can skip using the visible control or Escape. Reduced-motion visitors see the invitation immediately. Photos load during the sequence; slow assets never skip the opening. An independent 10-second fallback protects against a failed script. Reduced-motion visitors have a visible **Play animations** option below the heading, with a short explanation, as well as the footer control. Both explicitly opt in to the opening and petals without automatically overriding their device preference. An opening loaded in a hidden tab waits until it is visible; leaving during the sequence safely reveals the invitation. Links have visible keyboard focus and open the public Google Form in a new tab.

Cormorant Garamond is bundled locally under the SIL Open Font License; see `assets/FONT-LICENSE.txt`. Floral artwork, the monogram, and the paper texture are lightweight local SVG files.

## Falling cherry blossoms

A single canvas renders **11 larger petals** across the viewport, including the center. This applies the latest 20% reduction to the preceding 14-petal setting (rounded from 11.2); the average arrival rate is reduced by exactly 20% to approximately **0.67 petals per second**. Lifetimes account for rounding while preserving varied, gentle movement. Pre-rendered sprites and a capped pixel density keep the effect lightweight. Each petal varies in size, flutter, rotation, opacity, and sideways drift; its starting position changes on subsequent loops.

The canvas is attached directly to the body, outside the opening's hidden/transformed container, for reliable Safari rendering. Transparent cutouts protect photographs, invitation text, venue details, map attribution, calendar options, RSVP controls, the QR code, and footer controls. Rectangles are refreshed on scrolling, resizing, orientation changes, and layout changes. The layer ignores pointer events. Versioned stylesheet/script URLs prevent stale mobile caches from combining different versions.

The keyboard-accessible **Pause petals** checkbox freezes the canvas and the CSS fallback. Animation stops while the tab is hidden and is disabled by default for reduced-motion visitors. **Play animations** provides an explicit opt-in on those devices. Page hiding cancels the frame loop. Page restoration always clears the retained frame ID before resizing and starting a single new loop. Context creation/rendering failures and canvas context loss select the existing CSS fallback without uncaught errors; a restored context can resume the canvas. Viewport changes refresh its size. If JavaScript or canvas is unavailable, 11 CSS fallback petals retain the larger size and the invitation remains fully usable.

## Validation on 5 October 2026

- Independent iCalendar parsing confirms the exact event title, 12:00 PM–3:00 PM Singapore start/end, three-hour duration, venue address, linked descriptions, CRLF endings, and RFC line folding.
- The direct RSVP QR decoded at native size and the 164px / 180px display sizes.
- Chromium browser checks passed at 320, 375, 390, 393, 430, 600, 768, 1024, and 1440px without horizontal overflow or controls outside the viewport.
- Calendar disclosure/download, RSVP popup destinations (network navigation intercepted for the click test), keyboard focus, envelope replay/completion, petal movement/pause, and reduced-motion opt-in passed with no invitation JavaScript errors.
- Normal-size text contrast checks exceed WCAG AA's 4.5:1 threshold.
- Hilton's address was verified from its official location page. The Google Maps place record and share-generated embed were verified through the Google Maps interface; the map label/pin render in the local test environment still requires visual confirmation.
- These are Chromium viewport checks, not physical iPhone/Android tests. WebKit could not run because required system libraries were unavailable. Actual Safari/iOS behaviour and app handoff require device verification.
- After publishing, confirm the Pages deployment succeeded and verify the deployed invitation and map preview in a browser.
