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

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Drive diagram colors from the site's own CSS custom properties, same
// pattern as js/heatmap.js's draw(), so diagrams share the page's palette
// and typography instead of Mermaid's generic default/dark themes.
function themeVariables() {
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

const SEMANTIC_CLASS_RE = /\bclass\s+\S+\s+(good|bad)\b/;

// A few diagrams tag nodes with `class X good` / `class X bad` for allowed/denied
// outcomes. That's this blog's own authoring convention, not a Mermaid theme
// variable, so it's kept separate from themeVariables() and only appended to
// diagrams that actually reference it.
function semanticClassDefs() {
  return `\nclassDef good stroke:${cssVar('--brand-color')},stroke-width:2px;\nclassDef bad stroke:${cssVar('--grey-color-dark')},stroke-width:1px,stroke-dasharray: 4 2;`;
}

async function render(blocks) {
  mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: themeVariables() });
  blocks.forEach((div) => {
    div.removeAttribute('data-processed');
    const src = div.dataset.mermaidSrc;
    div.textContent = SEMANTIC_CLASS_RE.test(src) ? src + semanticClassDefs() : src;
  });
  await mermaid.run({ nodes: blocks });
}

const blocks = collectBlocks();
if (blocks.length) {
  render(blocks);
  window.addEventListener('themechange', () => render(blocks));
}
