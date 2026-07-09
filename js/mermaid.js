import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';

// kramdown/GFM turns ```mermaid fences into <pre><code class="language-mermaid">.
// Mermaid expects a plain container (default: <div class="mermaid">) holding the
// raw diagram source, so bridge the two here. The original source is cached on
// each container (data-mermaid-src) because mermaid bakes resolved colors into
// the rendered SVG — a theme switch needs a fresh parse, not a DOM tweak.
function collectBlocks() {
  return Array.from(document.querySelectorAll('pre > code.language-mermaid')).map((code) => {
    const pre = code.parentElement;
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.dataset.mermaidSrc = code.textContent;
    pre.replaceWith(div);
    return div;
  });
}

// Drive diagram colors from the site's own CSS custom properties, same
// pattern as js/heatmap.js's draw(), so diagrams share the page's palette
// and typography instead of Mermaid's generic default/dark themes.
function themeVariables() {
  const style = getComputedStyle(document.documentElement);
  const cssVar = (name) => style.getPropertyValue(name).trim();
  return {
    background: cssVar('--background-color'),
    primaryColor: cssVar('--grey-color-light'),
    primaryTextColor: cssVar('--text-color'),
    primaryBorderColor: cssVar('--brand-color'),
    lineColor: cssVar('--brand-color'),
    textColor: cssVar('--text-color'),
    fontFamily: 'Alice, serif',
  };
}

async function render(blocks) {
  mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: themeVariables() });
  blocks.forEach((div) => {
    div.removeAttribute('data-processed');
    div.textContent = div.dataset.mermaidSrc;
  });
  await mermaid.run({ nodes: blocks });
}

const blocks = collectBlocks();
if (blocks.length) {
  render(blocks);
  window.addEventListener('themechange', () => render(blocks));
}
