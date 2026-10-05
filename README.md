# Baokun & Su Lyn — Wedding Invitation

Published at https://sulbao4eva.github.io/invite/.

A small static invitation for 17 April 2027, with a guest-activated envelope opening and RSVP links to Google Forms. No build step, database, analytics, or external fonts. The venue preview uses a Google-hosted map embed; the invitation and directions links remain ordinary HTML.

## Update the photographs

Six images from the current `wedding_website/photo_collage/` folder are used in the collage. The five distinct landscape photographs are stored in `assets/` in 640px and 1280px WebP versions: `most-left`, `second-from-left`, `center`, `second-from-right`, and `most-right`. The portrait photobooth image, sourced from `Copy of image_2.jpg.png`, adds four moments in one frame and is stored as `photobooth-640.webp` and `photobooth-960.webp`.

The horizontal `Copy of image_1.jpg.png` repeats the portrait image's four poses and is intentionally omitted. On desktop, the larger center photograph and portrait photobooth frame lead the composition, followed by four gently angled landscape photographs. On phones, the center photograph spans the top, the portrait frame sits beside two landscapes, and the final pair closes the collage. Every complete photo and the photobooth artwork remain visible without cropping faces.

Replace these files using the same names and dimensions, or update the `src`, `srcset`, `sizes`, dimensions, and descriptive `alt` text in `index.html`. Preserve each source's aspect ratio, strip camera metadata, and use responsive WebP versions. The featured pair loads eagerly; supporting images load lazily. Fine ivory frames, gold borders, modest rotations, and soft shadows match the invitation stationery. The opening animation, section order, calendar, RSVP/QR, venue, petals, and signature remain in place.

## Update RSVP

Replace **both** Google Forms URLs in `index.html` with the same public responder URL ending in `/viewform`. Never use the form editor URL. Replace `assets/rsvp-qr.png` with a QR code pointing to the new responder URL; retain a square shape and a white quiet zone of at least four QR modules. Scan it and verify the resulting Google Form before publishing.

The QR code and both RSVP links point directly to the same public Google Form. The image has a white quiet zone of at least four modules, integer-sized modules, and no redirect-service dependency. It was decoded at its native 1600px size and the 164px / 180px display sizes on 5 October 2026.

The source form, `RSVP_test`, is available anonymously. Its current public title is “Bao & Sul’s Wedding RSVP | Bao & Sul 婚礼出席回复”; it requires the main contact’s name, email, and attendance choice before continuing. Optional Google sign-in saves progress; it is not required to access the form. Website RSVP responses are collected by Google Forms.

## Venue and calendar

Hilton Singapore Orchard's official website confirms **333 Orchard Road, Singapore 238867**. The venue section displays the user-confirmed Imperial Ballroom, Level 35, noon start on Saturday, 17 April 2027, the official hotel link, and a Google Maps preview.

Google's place record resolves to the Hilton pin with place ID `ChIJU2DzfLcZ2jER4WGAnEnqNFw` (also matching the CID `6644192952157495777` linked by Hilton). Both the entire map preview and **Get Directions** use the standard `https://www.google.com/maps/dir/?api=1` URL with the verified destination and place ID. Google Maps handles its app/browser fallback. The embed URL was copied directly from Google Maps → Share → Embed a map on 5 October 2026. The Google-hosted embed retains Google's own map labels and attribution, uses lazy loading, and requires no project API key. It is presented as a clickable preview, so touch/keyboard navigation opens directions instead of trapping scroll in the embedded map. The explicit directions button remains available if a visitor blocks the third-party map.

**Save to calendar** opens choices for Google Calendar and a downloadable iCalendar file for Apple, Outlook, and other calendars. Both use the exact title `Sul & Bao Wedding @Hilton Singapore Orchard L35` and **17 April 2027, 12:00 PM–3:00 PM Asia/Singapore (UTC+8)**, the full venue/address, a warm invitation, and the invitation, hotel, and directions URLs.

The Google URL encodes UTC start/end times `20270417T040000Z/20270417T070000Z` and `ctz=Asia/Singapore`. The `.ics` uses `DTSTART;TZID=Asia/Singapore:20270417T120000` / `DTEND;TZID=Asia/Singapore:20270417T150000`, a matching fixed UTC+8 `VTIMEZONE`, RFC-compliant text escaping, CRLF endings, and folded lines. The existing event UID is preserved. Guests confirm saving in their calendar application.

Update the Google Calendar URL and `.ics` together if details change. Do not revert to all-day dates. The invitation message uses larger type than the venue details. The responsive reading order is the full invitation message, photo collage, calendar options, RSVP/QR, venue/map, and the cursive S & B closing signature. The old separate wedding heading is removed so the invitation appears once, prominently at the top. Desktop uses paired venue/map and RSVP/QR layouts; narrow screens stack them.

## Preview and publish

Serve the repository using any static HTTP server. To check the GitHub Pages repository path locally, serve its parent directory and visit `/invite/`. Every local asset uses a relative path.

GitHub Pages should publish from **main / (root)**. `.nojekyll` disables unnecessary Jekyll processing. Commit and push changes to `main` to update the website. There are no secrets or deployment credentials in this repository.

## Accessibility and opening

The invitation is ordinary readable HTML and remains visible without JavaScript. With JavaScript, the first view is a closed envelope and a “Tap or click the envelope to open” prompt. It stays closed indefinitely until a guest activates the native button by click, tap, Enter, or Space. Tab focuses the envelope without starting the animation. No load, visibility, or page-restoration handler automatically starts the opening.

After activation, a font-readiness wait capped at 500ms starts the existing 5.1-second envelope sequence. Guests can skip the running sequence using the visible control or Escape. Photos can load during the sequence. A 10-second script-loading fallback reveals the usable invitation if the main script fails; after successful initialization it is cancelled and cannot automatically dismiss the closed envelope. The running animation has its own completion fallback.

Reduced-motion visitors also start with the closed envelope; activating it reveals the invitation immediately without motion. They retain a visible **Play animations** opt-in below the heading and in the footer, so the device preference is respected. Leaving during an active sequence safely reveals the invitation; leaving and returning while the envelope is still closed keeps it closed. Links and the envelope have visible keyboard focus, and RSVP links open the public Google Form in a new tab.

Cormorant Garamond and the small Great Vibes monogram font subset are bundled locally under the SIL Open Font License; see `assets/FONT-LICENSE.txt` and `assets/GREAT-VIBES-LICENSE.txt`. The script font is used only for the legible S & B closing signature. The ivory envelope uses fine gold borders, softly shaded paper folds, and an embossed S & B wax seal; its exterior has no names. The bordered letter uses Baokun & Su Lyn. Floral artwork, the monogram, and the paper texture are lightweight local SVG files.

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
- Hilton's address was verified from its official location page. The Google Maps place record and share-generated embed were verified through the Google Maps interface; the map label/pin and hotel directions were confirmed in the published invitation with the cloud browser.
- These are Chromium viewport checks, not physical iPhone/Android tests. WebKit could not run because required system libraries were unavailable. Actual Safari/iOS behaviour and app handoff require device verification.
- After publishing, confirm the Pages deployment succeeded and verify the deployed invitation and map preview in a browser.

### Guest-activated envelope revision

- The envelope remains closed after 11 seconds without input; Tab only focuses it. Enter, Space, and click activate the sequence, and the transition restores access and focus to the invitation.
- Closed-envelope restoration and reduced-motion preference changes do not start or dismiss it. Skip/Escape, immediate opening for reduced motion, explicit animation opt-in, and the script-failure fallback passed.
- The larger invitation type, smaller venue type, nested calendar disclosure/download, and touch-target bounds passed at 320, 375, 430, 600, 768, 1024, and 1440px in Chromium viewport emulation.
- Envelope names remain centered within the closed envelope at mobile and desktop widths. Petal resume/pause checks and the unchanged calendar details and RSVP destinations passed.

### Invitation URL migration

The primary repository is `sulbao4eva/invite`, publishing `main / (root)` at `https://sulbao4eva.github.io/invite/`. Google Calendar descriptions and the iCalendar description/URL use this address. The existing event UID is retained, with its revision sequence incremented. Local assets remain relative. The former `bao-sul-wedding` repository hosts a lightweight redirect for already-shared invitation links.

### Luxury invitation revision

The invitation now uses Baokun & Su Lyn throughout its visible content, metadata, and image descriptions, with S & B on the seal, favicon, and closing signature. The reading order is invitation message → photo collage → calendar → RSVP/QR → venue/map → signature. The Google and iCalendar descriptions use the full names; the previously specified exact calendar title and event UID remain unchanged, with sequence 2.

- The clean envelope remains closed without input. Keyboard activation, focus restoration, complete transition, skip, reduced-motion opening, and explicit animation opt-in passed. The letter fits mobile, desktop, and a short landscape viewport.
- Layout and touch targets passed at 320, 375, 390, 430, 600, 768, 1024, and 1440px with the requested order and no horizontal scrolling. A separate 390px touch-emulation check passed.
- The calendar download matches the tested file; UTC times resolve to 12:00–15:00 in Asia/Singapore. UTF-8, CRLF, text escaping, line folding, venue details, links, and preserved UID were checked.
- The existing RSVP QR decoded at 1600, 162, and 180px, and from the actual 163px browser-rendered image. It stays clickable and clear of petals. Text contrast exceeds 4.5:1; petal pause/resume works.
- These are Chromium browser and viewport/touch-emulation checks. Physical iPhone/Android devices and Safari/iOS app handoff were not tested. External destinations were intercepted in local click tests; the published page receives a separate live browser check.
