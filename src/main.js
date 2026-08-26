import Reveal from 'reveal.js';
import RevealMath from 'reveal.js/plugin/math';
import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealNotes from 'reveal.js/plugin/notes';
import RevealZoom from 'reveal.js/plugin/zoom';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/white.css';
// No light syntax theme ships with reveal (only monokai and zenburn, both
// dark), and highlight.js isn't a separate dependency here — so talk.css
// defines the `.hljs-*` colours itself.
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

    // MathJax 4 defaults to `linebreaks: { inline: true }`, so inline math
    // breaks itself across lines when its container is narrow — inside the SVG
    // output, where CSS `white-space: nowrap` has no say. On slides a formula
    // should overflow visibly rather than silently rewrap, so it's off.
    svg: { linebreaks: { inline: false } },
    tex: {
      // NB: only the TeX extensions compiled into the bundle are usable. The
      // `html` and `color` packages (\htmlClass, \textcolor, \class, \style)
      // are autoload stubs that fetch from a CDN at runtime, which cannot work
      // in an offline deck — they render as literal text. To colour part of a
      // formula, split it into inline math and colour the wrapping element:
      // MathJax's SVG output fills with `currentColor`, so CSS wins.
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
        // Semantic brackets. The K-index is deliberately *not* part of this
        // macro: on the soundness slide the K is coloured to mark it as the
        // one object the solver supplies, and MathJax can't colour part of a
        // formula (see above), so the slide sets it as a separate HTML <sup>.
        sem: ['[\\![ #1 ]\\!]', 1],
      },
    },
  },
});

// --- Laser pointer ---------------------------------------------------------
// Reveal ships no laser, and the plugins that have one bring a whole
// chalkboard with them — which would also have to survive the single-file
// build. This is the whole feature: a dot with a comet tail that follows the
// mouse, toggled with `l`. Pure DOM, no dependency, so `build:single` keeps
// working offline.
//
// Both pieces are `position: fixed` in *viewport* pixels, deliberately outside
// `.slides`: reveal scales that subtree with a transform, and a child of it
// would be scaled too — the dot would change size with the projector's
// resolution and the clientX/clientY coordinates would need un-transforming.

// The tail is drawn on a canvas rather than built from a row of divs: a chain
// of discrete dots stays visibly discrete however many you add, and hiding the
// gaps means enough overlapping elements to matter on a laptop driving a
// projector. One tapered stroke is both continuous and cheaper.
const laserCanvas = document.createElement('canvas');
laserCanvas.className = 'laser-canvas';
document.body.appendChild(laserCanvas);
const laserCtx = laserCanvas.getContext('2d');

// The head keeps its own element: the hot core and its halo are a radial
// gradient plus a box-shadow, which CSS does better than canvas does.
const laserHead = document.createElement('div');
laserHead.className = 'laser-head';
document.body.appendChild(laserHead);

// Sample points along the tail. Each eases toward the one ahead of it, so the
// stroke stretches when the hand moves fast and collapses into the head when
// it stops — which is what makes it read as motion rather than as a smear.
const LASER_TAIL = 16;
// Per-point catch-up per frame. Lower is a longer, lazier tail; at 1 the whole
// chain would sit on the cursor.
const LASER_EASE = 0.32;
// Stroke width at the head, in px, tapering to nothing at the tip.
const LASER_WIDTH = 9;

let laserOn = false;
let laserFrame = null;
// Remembered so the dot appears under the cursor the moment it is switched on,
// rather than at the origin until the mouse next moves.
let laserX = window.innerWidth / 2;
let laserY = window.innerHeight / 2;
const trail = Array.from({ length: LASER_TAIL }, () => ({ x: laserX, y: laserY }));

const sizeLaserCanvas = () => {
  // Backing store in device pixels, CSS box in layout pixels: on a HiDPI screen
  // the default 1:1 canvas would draw the tail visibly soft.
  const dpr = window.devicePixelRatio || 1;
  laserCanvas.width = Math.round(window.innerWidth * dpr);
  laserCanvas.height = Math.round(window.innerHeight * dpr);
  laserCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
sizeLaserCanvas();
window.addEventListener('resize', sizeLaserCanvas);

const drawLaser = () => {
  laserCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  laserCtx.lineCap = 'round';
  laserCtx.lineJoin = 'round';

  // Segment by segment, because a single stroke cannot taper. Round caps on
  // overlapping segments close the joins, so the width and alpha ramps read as
  // one continuous stroke rather than as a row of dashes.
  for (let i = 1; i < trail.length; i += 1) {
    const t = i / (trail.length - 1);
    laserCtx.beginPath();
    laserCtx.moveTo(trail[i - 1].x, trail[i - 1].y);
    laserCtx.lineTo(trail[i].x, trail[i].y);
    laserCtx.lineWidth = LASER_WIDTH * (1 - t) ** 0.85;
    laserCtx.strokeStyle = `rgba(224, 32, 32, ${(0.5 * (1 - t) ** 1.4).toFixed(3)})`;
    laserCtx.stroke();
  }

  laserHead.style.transform = `translate(${laserX}px, ${laserY}px)`;
};

const stepLaser = () => {
  trail[0].x = laserX;
  trail[0].y = laserY;

  for (let i = 1; i < trail.length; i += 1) {
    trail[i].x += (trail[i - 1].x - trail[i].x) * LASER_EASE;
    trail[i].y += (trail[i - 1].y - trail[i].y) * LASER_EASE;
  }

  drawLaser();
  laserFrame = requestAnimationFrame(stepLaser);
};

document.addEventListener('mousemove', (event) => {
  laserX = event.clientX;
  laserY = event.clientY;
});

// The dot replaces the cursor rather than joining it: two pointers on screen
// read as a bug. `.laser-on` sets `cursor: none` on the deck.
const setLaser = (on) => {
  laserOn = on;

  if (on) {
    // Collapse the tail onto the cursor first, so switching on does not fling
    // a comet in from wherever the pointer was last time.
    trail.forEach((point) => {
      point.x = laserX;
      point.y = laserY;
    });
    drawLaser();
    // The loop only runs while the laser is on — no idle rAF burning battery
    // through the other forty slides.
    if (laserFrame === null) laserFrame = requestAnimationFrame(stepLaser);
  } else if (laserFrame !== null) {
    cancelAnimationFrame(laserFrame);
    laserFrame = null;
    laserCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  laserCanvas.classList.toggle('laser-visible', on);
  laserHead.classList.toggle('laser-visible', on);
  document.body.classList.toggle('laser-on', on);
};

Reveal.addKeyBinding(
  { keyCode: 76, key: 'L', description: 'Toggle laser pointer' },
  () => setLaser(!laserOn)
);

// Escape is the reflex for "get this off my screen", and reveal only uses it
// for the overview, which the laser has no business being on top of.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && laserOn) setLaser(false);
});

// --- Click to advance ------------------------------------------------------
// Reveal binds swipe on touch and the arrow keys, but never the mouse. With a
// clicker in hand that is fine; driving from the laptop — which is what the
// laser above is for — it means reaching for the keyboard to move on.
//
// `next()` and not `right()`: it steps through the fragments on a slide before
// moving to the next one, which is the same thing the space bar does.
let downX = 0;
let downY = 0;

document.addEventListener('mousedown', (event) => {
  downX = event.clientX;
  downY = event.clientY;
});

document.addEventListener('click', (event) => {
  // Left button only. Reveal has nothing on the others, and stealing a
  // right-click would take the context menu with it.
  if (event.button !== 0) return;

  // A drag is not a click: without this, selecting a line of code or dragging
  // across a formula would advance the slide on release.
  if (Math.abs(event.clientX - downX) > 5 || Math.abs(event.clientY - downY) > 5) return;

  // In overview a click picks the slide you clicked on; advancing as well
  // would land the deck somewhere nobody asked for.
  if (Reveal.isOverview()) return;

  // Reveal's own chrome already does something on click, and links, buttons
  // and the hover anchors in the code blocks are all things you might want to
  // hit without moving on.
  if (event.target.closest('a, button, .controls, .progress, .slide-number, .hint-anchor')) {
    return;
  }

  Reveal.next();
});
