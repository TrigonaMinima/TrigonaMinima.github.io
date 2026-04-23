import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js';

const FALLBACK_W = 1600;
const FALLBACK_H = 1200;

function setup(selector) {
  if (!document.querySelector(selector)) return;

  const lb = new PhotoSwipeLightbox({
    gallery: selector,
    children: 'a',
    pswpModule: () => import('https://unpkg.com/photoswipe@5.4.4/dist/photoswipe.esm.js'),
  });

  lb.addFilter('itemData', (itemData) => {
    const a = itemData.element;
    const img = a && a.querySelector('img');
    const nw = img && img.naturalWidth;
    const nh = img && img.naturalHeight;
    itemData.src    = a.getAttribute('href');
    itemData.width  = nw > 0 ? nw : FALLBACK_W;
    itemData.height = nh > 0 ? nh : FALLBACK_H;
    itemData.alt    = img ? (img.getAttribute('alt') || '') : '';
    const t = a.getAttribute('title');
    if (t) itemData.title = t;
    return itemData;
  });

  // Correct dims if thumbnail was still lazy-loading at open time
  lb.on('contentLoad', (e) => {
    const { content } = e;
    if (!content.element) return;
    content.element.addEventListener('load', () => {
      const w = content.element.naturalWidth;
      const h = content.element.naturalHeight;
      if (w && h && (content.data.width !== w || content.data.height !== h)) {
        content.data.width = w;
        content.data.height = h;
        if (content.slide) content.slide.updateContentSize(true);
      }
    }, { once: true });
  });

  lb.on('uiRegister', () => {
    // Keyboard-navigation hint
    lb.pswp.ui.registerElement({
      name: 'kbd-hint',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '<span class="pswp__kbd-hint">&#x2190; &#x2192; &middot; Esc</span>',
    });

    // Per-image caption from anchor title attribute
    lb.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        pswp.on('change', () => {
          const d = pswp.currSlide && pswp.currSlide.data;
          el.textContent = (d && d.title) ? d.title : '';
        });
      },
    });
  });

  lb.init();
}

setup('.gallery-popup');
setup('.single-image-popup');
