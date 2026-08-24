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

document.querySelector('.slides').innerHTML = Object.keys(sections)
  .sort()
  .map((path) => sections[path])
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
