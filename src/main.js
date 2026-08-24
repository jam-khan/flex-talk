import Reveal from 'reveal.js';
import RevealMath from 'reveal.js/plugin/math';
import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealNotes from 'reveal.js/plugin/notes';
import RevealZoom from 'reveal.js/plugin/zoom';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/white.css';
import 'reveal.js/plugin/highlight/monokai.css';
import './css/talk.css';

// MathJax with the newcm font bundled in, imported as source text. Reveal's math
// plugin loads MathJax by URL at runtime rather than via a <script> tag, so it
// can't be inlined by vite-plugin-singlefile; handing it a blob URL built from
// this string keeps the single-file build working with no network at all.
import mathjaxSource from '@mathjax/mathjax-newcm-font/tex-mml-svg-mathjax-newcm.js?raw';

const mathjaxUrl = URL.createObjectURL(
  new Blob([mathjaxSource], { type: 'text/javascript' })
);

// One file per section of the talk, ordered by filename.
const sections = import.meta.glob('./sections/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Images used by the slides. Sections are imported ?raw — as opaque strings —
// so Vite never sees their `src` attributes and cannot rewrite them to built
// asset URLs. Instead the slides write `@assets/<file>` and we substitute the
// real (hashed, or base64 in the single-file build) URL here.
const assets = import.meta.glob('./assets/*', { import: 'default', eager: true });
const assetUrls = Object.fromEntries(
  Object.entries(assets).map(([path, url]) => [path.split('/').pop(), url])
);

const resolveAssets = (html) =>
  // Replacement *function*: asset URLs are data: URIs in the single-file build
  // and can contain `$&`, which a replacement string would expand.
  html.replace(/@assets\/([\w.-]+)/g, (match, name) => assetUrls[name] ?? match);

document.querySelector('.slides').innerHTML = Object.keys(sections)
  .sort()
  .map((path) => resolveAssets(sections[path]))
  .join('\n');

Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,

  hash: true,
  slideNumber: 'c/t',
  transition: 'none',
  controls: true,
  progress: true,

  plugins: [RevealMath.MathJax4, RevealHighlight, RevealNotes, RevealZoom],

  mathjax4: {
    mathjax: mathjaxUrl,
    tex: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]'],
      ],
      macros: {
        // Notation from the paper; extend as slides need it.
        kv: '\\kappa',
        Prop: '\\mathsf{Prop}',
        Int: '\\mathsf{Int}',
        Bool: '\\mathsf{Bool}',
        True: '\\top',
        False: '\\bot',
        rt: ['\\{\\, #1 : #2 \\mid #3 \\,\\}', 3],
      },
    },
  },
});
