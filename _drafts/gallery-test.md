---
layout: post
title: "Gallery Test Fixture"
date: "2026-04-23"
categories: Test
gallery_half:
  - image_path: "/assets/2023-01/biryani.jpg"
    title: "Belagavi biryani — 3.5/5"
    alt: "A plate of Belagavi biryani"
  - image_path: "/assets/2023-01/kunda.jpg"
    title: "Belagavi kunda"
    alt: "Belagavi kunda dessert"
gallery_third:
  - image_path: "/assets/2023-12/ooty_tour_pine.jpg"
    title: "Pine forest"
    alt: "Ooty pine forest"
  - image_path: "/assets/2023-12/ooty_tour_pykara_lake.jpg"
    title: "Pykara lake"
    alt: "Pykara lake boating"
  - image_path: "/assets/2023-12/ooty_tour_pykara_waterfall.jpg"
    title: "Pykara waterfall"
    alt: "Pykara waterfalls"
gallery_many:
  - image_path: "/assets/2023-12/ooty_artist1.jpg"
    title: "Artist 1"
    alt: "First artist at work"
  - image_path: "/assets/2023-12/ooty_artists2.jpg"
    title: "Artist 2"
    alt: "Second artist at work"
  - image_path: "/assets/2023-12/ooty_colors.jpg"
    title: "Colours used in the painting"
    alt: "Paint colours on palette"
  - image_path: "/assets/2023-12/ooty_painting_group1.jpg"
    title: "Group photo 1"
    alt: "Group photo at Gautam's goodbye"
  - image_path: "/assets/2023-12/ooty_painting_group2.jpg"
    title: "Group photo 2"
    alt: "Group photo at Shivam's goodbye"
  - image_path: "/assets/2023-12/ooty_theatre.jpg"
    title: "Assembly Rooms theatre"
    alt: "Inside Assembly Rooms theatre during intermission"
---

**Gallery test fixture** — not a real post. Verifies the gallery overhaul (PhotoSwipe, lazy loading, hover, count badge, aria labels, dark mode overlay, keyboard hint).

Run with: `bundle exec jekyll serve --drafts`

---

## Single image (`{% raw %}{% include figure %}{% endraw %}`)

Expect: lightbox opens on click, no count badge, hover effect.

{% include figure image_path="/assets/2023-01/belagavi.jpg" caption="Single image. Lightbox should open, no count badge." %}

---

## Two-image gallery (half layout)

Expect: count badge showing **2** on first thumbnail, auto `half` layout.

{% include gallery id="gallery_half" caption="Two images — half layout." %}

---

## Three-image gallery (third layout)

Expect: count badge showing **3** on first thumbnail, auto `third` layout.

{% include gallery id="gallery_third" caption="Three images — third layout." %}

---

## Six-image gallery

Expect: count badge showing **6**, arrow keys cycle all six, Esc closes, keyboard hint visible, captions per image.

{% include gallery id="gallery_many" caption="Six images — arrow-key navigation and captions." %}
