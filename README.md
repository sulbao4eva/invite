# Bao & Sul — Wedding Invitation

A small static invitation for 17 April 2027, with an automatic envelope opening and RSVP links to Google Forms. No build step, database, analytics, external fonts, or runtime dependencies.

## Update the photographs

The three selected photographs are stored in `assets/` as `portrait`, `together`, and `joy`, each in 640px and 1280px WebP versions. Replace those files using the same names and dimensions, or update the `src`, `srcset`, `sizes`, dimensions, and descriptive `alt` text in `index.html`. Export the complete image without cropping faces; the layout preserves its 3:2 proportions. Strip camera metadata when exporting and use approximately 88% WebP quality.

## Update RSVP

Replace **both** Google Forms URLs in `index.html` with the same public responder URL ending in `/viewform`. Never use the form editor URL. Replace `assets/rsvp-qr.png` with a QR code pointing to the new responder URL; retain a square shape and a white quiet zone of at least four QR modules. Scan it and verify the resulting Google Form before publishing.

The supplied QR image is preserved. It encodes `https://qrco.de/bh2kby`, which was verified on 4 October 2026 to redirect to the same Google Form as both website links. The buttons link directly to Google Forms. Keep this redirect active while using the supplied QR image.

The current source form, `RSVP_test`, is available anonymously and asks only whether the guest can attend. Add a required name question in Google Forms if you need to identify guests. Optional Google sign-in saves progress; it is not required to access the form. Website RSVP responses are collected by Google Forms.

## Preview and publish

Serve the repository using any static HTTP server. To check the GitHub Pages repository path locally, serve its parent directory and visit `/bao-sul-wedding/`. Every local asset uses a relative path.

GitHub Pages should publish from **main / (root)**. `.nojekyll` disables unnecessary Jekyll processing. Commit and push changes to `main` to update the website. There are no secrets or deployment credentials in this repository.

## Accessibility and opening

The invitation is ordinary readable HTML and remains visible without JavaScript. With JavaScript, essential image and font readiness starts a 5.1-second envelope sequence. Guests can skip using the visible control or Escape. Reduced-motion visitors see the invitation immediately. A bounded readiness wait and an independent 10-second fallback protect against slow assets or a failed script. Links have visible keyboard focus and open the public Google Form in a new tab.

Cormorant Garamond is bundled locally under the SIL Open Font License; see `assets/FONT-LICENSE.txt`. Floral artwork, the monogram, and the paper texture are lightweight local SVG files.
