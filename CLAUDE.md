# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Site Overview

This is a Jekyll static site (personal blog "Playground" by Shivam Rana) deployed to GitHub Pages at `shivamrana.me`. The default branch is `master`.

## Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build for production
JEKYLL_ENV=production bundle exec jekyll build
```

## Architecture

Standard Jekyll structure:

- **`_posts/`** — Published posts. File naming convention: `YYYY-MM-DD-slug.md` (required by Jekyll for date parsing). Front matter must include `layout`, `title`, and `date`.
- **`_drafts/`** — Unpublished posts, excluded from build. No date prefix required.
- **`_layouts/`** — Three layouts: `default`, `page`, `post`. The 404 page uses `default` with `is_404: true` in front matter.
- **`_includes/`** — Reusable partials (`head`, `header`, `footer`) plus `figure` and `gallery` include tags for image display.
- **`_sass/`** — SCSS partials; entry points are in `css/`.
- **`assets/YYYY-MM/`** — Post media assets, organized by year-month.
- **`pages/`** — Standalone pages (About, Annotations, Resources, Travelogue).
- **`_site/`** — Build output, git-ignored.

## Deployment

CI is defined in `.github/workflows/build-playground.yml`. Pushes to `master` trigger an automatic GitHub Pages deployment using `actions/deploy-pages`.

## Known Quirks

- `_config.yml` has `syntax_highlighter: rogue` (line ~15) which is a typo for `rouge`; the top-level `highlighter: rouge` is correct and takes precedence.
- `_site.zip` at the repo root is a large (~100MB) manual snapshot — not part of the build.
- `js/jquery.magnific-popup.js` is explicitly excluded from the Jekyll build in `_config.yml`.
