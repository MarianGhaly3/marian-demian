# Marian Demian — Portfolio

A single-page portfolio site built with plain HTML, CSS and JavaScript (plus a
touch of Google Fonts). No build step, no framework — ready to publish as-is.

## Structure

```
index.html          the whole site (one page, anchor-linked sections)
css/styles.css       all styles (design tokens at the top)
js/main.js           mobile nav, hero typing animation, work filters,
                      directory search, copy-email button
assets/               logo files + favicons, cropped from your uploaded logo
```

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
- **Adding a project card** — copy one `<article class="project-card">...
  </article>` block in the Work section and edit the title, tags, gradient
  colours (`--grad-a` / `--grad-b`), description and link.
- **Adding a directory link** — copy one `<a class="dir-row">...</a>` line
  and update the `href`, `data-name`, `data-cat` and visible text.

## Notes

- The "28 more live builds" directory pulls each site's favicon live from
  Google's favicon service at view-time — no extra assets needed, and it
  fails silently (just hides the icon) if a favicon isn't available.
- All animation respects `prefers-reduced-motion`.
