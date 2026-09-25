# Marian Demian — Portfolio

A single-page portfolio site built with plain HTML, CSS and JavaScript (plus
Google Fonts). No build step, no framework — ready to publish as-is.

## Structure

```
index.html                        the whole site (one page, anchor-linked sections)
css/styles.css                    all styles (design tokens at the top)
js/main.js                        nav, hero animation, filters, search, lightbox, slider
assets/logo-*.png                 logo + favicons, cropped from your uploaded logo
assets/projects/*.jpg             the 6 "Selected work" case-study images
assets/projects/branding/*.jpg    the 4 branding-gallery slide images
assets/projects/directory/*.jpg   mockup images for the "More live builds" cards
```

Every image under `assets/projects/` is currently a **labelled placeholder** —
each one prints its own filename on the image itself, so it's obvious what to
replace. Swap a file for your real screenshot/mockup **using the exact same
filename and folder**, and it updates everywhere automatically — no HTML or
CSS edits needed.

## Publishing to GitHub Pages

1. Create a new repository on GitHub (e.g. `marian-portfolio`).
2. Upload the contents of this folder to the repository root — `index.html`
   should sit directly in the repo root, not inside a subfolder.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick the `main` branch and `/ (root)` folder, then **Save**.
6. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

If you'd rather use a custom domain, add it under **Settings → Pages →
Custom domain** once the site is live, and follow GitHub's DNS instructions.

## Editing content later

- **Text & links** — everything lives directly in `index.html`, organised by
  section (`<!-- ============ WORK ============ -->` etc.) — search for the
  text you want to change.
- **Colours** — all defined once as CSS variables at the top of
  `css/styles.css` (`:root { ... }`), pulled from your logo file.
- **Selected work cards** — each `<article class="project-card">` has a
  `.project-media` div with a `data-images` (comma-separated if you want a
  multi-image gallery for that project) and `data-caption` attribute that
  feed the zoom lightbox. Swap the `<img src>` to match.
- **Directory cards** — each `<article class="dir-card">` has a `.dir-media`
  button with the same `data-images` / `data-caption` pattern. To give a card
  more than one image (e.g. a homepage + a product page), just list several
  paths: `data-images="a.jpg, b.jpg, c.jpg"` — the lightbox will automatically
  show prev/next arrows for that card. Copy a whole `<article>` block to add
  a new site, or delete one to remove it — there's no hardcoded count
  anywhere on the page.
- **Branding gallery** — each `<figure class="gallery-slide">` in the
  `#brandingTrack` is one slide; copy/remove/reorder freely, the JS rebuilds
  the dots automatically.

## Still to finish

- **6th "Selected work" project** — one slot is still a placeholder card.
  Send me the project name, platform, country and a one-line description of
  the custom work and I'll fill it in.
- **Real screenshots** for the 6 case-study cards, the 4 branding-gallery
  slides, and the "More live builds" mockups — drop them into the matching
  `assets/projects/...` filename (see Structure above).

## Notes

- Clicking any project or directory image opens a lightbox to zoom; it
  supports left/right arrow keys, Escape to close, and multi-image galleries
  per card (see "Directory cards" above).
- All animation (hero typing, stat count-up, gallery autoplay) respects
  `prefers-reduced-motion`.
