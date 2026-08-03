# Mo Atta — Portfolio

A static portfolio site: photography, short-form video and applied research/writing.

## Project structure

```
.
├── index.html                          Home page (hero, photography, video, timeline, research, about, contact)
├── research-library-of-things.html     Research article
├── research-modeshows.html             Research article
├── research-corteiz.html               Research article
├── research-luxury-and-football.html   Research article
├── assets/
│   ├── css/
│   │   ├── base.css      Design tokens, reset, buttons, nav & footer (shared by every page)
│   │   ├── home.css      Home-page-only sections (hero, marquee, video carousel, timeline, about, contact)
│   │   └── article.css   Research-article-only sections (shared by the 4 article pages)
│   ├── js/
│   │   └── main.js       Nav toggle, scrollspy, reveal-on-scroll, video carousel (defensive: safe on every page)
│   ├── images/            Optimized WebP images
│   │   └── og/            1200×630 JPG social-share cards (og:image)
│   └── icons/              Favicon + PWA icon set
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── vercel.json
└── .nojekyll
```

## Running locally

No build step — it's plain HTML/CSS/JS. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Deployment

The site is a pure static bundle, so all three targets work with zero build configuration:

- **GitHub Pages**: enable Pages on this repo (Settings → Pages → Deploy from branch), serving from the root of this branch. `.nojekyll` is included so GitHub doesn't run the Jekyll processor over the `assets/` folder.
- **Netlify**: point it at this repo; `netlify.toml` already sets the publish directory to `.` and adds sane cache headers.
- **Vercel**: import the repo as-is; `vercel.json` sets the same cache headers. No framework preset needed ("Other").

### Canonical domain

`index.html`, the 4 research pages, `sitemap.xml` and `robots.txt` all point at the live custom domain,
`https://moattaportfolio.com/` (see `CNAME`). If you ever move the site to a different domain, find-and-replace that
base URL across those files so link previews (OG/Twitter cards), the canonical tags and the sitemap resolve
correctly.

## Known content gaps

A few links intentionally point at files that weren't part of the source content handed off, and so aren't in this
repo yet. They use their correct final relative path, so dropping the real file in place is all that's needed:

- `articles/corteiz-source.pdf`, `articles/modeshows-source.pdf`, `articles/luxury-and-football-source.pdf` — the
  original PDF write-ups linked from the "Download Original PDF" button on 3 of the research pages.

The Video section's "Watch Video" buttons and thumbnails link out to the real TikTok posts (opening in a new tab),
so that section has no outstanding gaps.

The **Social** section's 7 cards are custom Instagram-inspired cards (cover image, like count, caption, "View on
Instagram" button) with real cover photos, captions, and "View on Instagram" links (account: AndAgencyAmsterdam).
One gap remains: 2 cards (linking to `C2xbdQsIU-m` and `C40hU5gNl6X`) show "— likes" because their like counts
weren't available; replace that text in the matching `.social-likes` element once you have the real numbers.

## Notes on this pass

- All 35 embedded base64 images were extracted, deduplicated, and re-encoded as WebP (~59% of original size), plus
  5 dedicated 1200×630 JPG cards for social-share previews.
- The ~100 lines of CSS duplicated across all 4 research pages now live once in `assets/css/article.css`.
- Dead CSS/JS that had no matching markup (a leftover contact form, LinkedIn/info cards, a placeholder article-click
  handler) was removed.
- `--text-faint` was nudged from `#59584f` to `#7d7b6f` — the original shade failed WCAG AA contrast (2.77:1) against
  the near-black background where it's used for real content (citation lists, footer), the new value passes at 4.65:1.
  No other colors changed.
- Every page now shares one nav component and one footer; research pages gained the full site nav (previously just a
  logo + "Back to Research" link) plus a contextual back-link breadcrumb above the article title.
