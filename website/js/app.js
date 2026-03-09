/**
 * GymRollerBag — Page Interactivity
 *
 * Responsibilities:
 *   1. Instantiate Two GymRollerViewer instances
 *   2. Navbar scroll-blur effect
 *   3. IntersectionObserver scroll animations (feature cards, spec rows, steps)
 *   4. Smooth scroll for anchor links
 *   5. Pre-order form inline confirmation
 *   6. Pause off-screen viewers (mobile battery/performance)
 *
 * Fix applied: Phase A (scroll animations, navbar, UI) now runs immediately on
 * DOMContentLoaded — independent of Three.js loading. This ensures feature cards,
 * spec rows, and all [data-animate] elements become visible even if Three.js fails.
 * Phase B (3D viewers) runs after Three.js resolves, or is skipped gracefully.
 */

import { GymRollerViewer } from './viewer3d.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mark body immediately so CSS progressive-enhancement rules activate.
  // All [data-animate] elements start at opacity:0 only when .js-ready is present.
  document.body.classList.add('js-ready');

  // ── Phase A: runs immediately — no Three.js dependency ──────────────────────
  initNavbar();
  initScrollAnimations();
  initSmoothScroll();
  initPreOrderForm();
  initColorSwatches();
  initFaq();

  // ── Phase B: 3D viewers — Three.js already resolved via ES module import ────
  // The dynamic import of viewer3d.js resolved Three.js at module parse time,
  // so GymRollerViewer is already available here. No polling needed.
  try {
    initViewers();
  } catch (err) {
    console.warn('GymRollerViewer: 3D init failed —', err.message);
    // Viewers will show their static SVG fallback; page still fully functional.
  }
});

// =============================================================================
// 1. 3D Viewers
// =============================================================================

function initViewers() {
  const heroViewer = new GymRollerViewer('viewer-container');
  const fullViewer = new GymRollerViewer('viewer-full');

  // Pause renderers when off-screen (saves battery on mobile)
  const pauseMap = {
    'viewer-container': heroViewer,
    'viewer-full':      fullViewer,
  };

  const viewportObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const viewer = pauseMap[target.id];
        if (!viewer) return;
        if (isIntersecting) {
          viewer.resume();
        } else {
          viewer.pause();
        }
      });
    },
    { threshold: 0.05 }
  );

  Object.keys(pauseMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) viewportObserver.observe(el);
  });
}

// =============================================================================
// 2. Navbar scroll-blur
// =============================================================================

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply on load in case page is pre-scrolled
}

// =============================================================================
// 3. Scroll animations (IntersectionObserver → .visible class)
// =============================================================================

function initScrollAnimations() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('visible');
          // Stop observing once animated in — no need to re-trigger
          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px', // trigger slightly before fully in view
    }
  );

  targets.forEach(el => observer.observe(el));
}

// =============================================================================
// 4. Smooth scroll
// =============================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// =============================================================================
// 5. Pre-order form — inline confirmation (no page reload)
// =============================================================================

function initPreOrderForm() {
  const form    = document.getElementById('preorder-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate
    const email = form.querySelector('[name="email"]');
    const color = form.querySelector('[name="color"]');

    if (!email.value || !email.value.includes('@')) {
      email.focus();
      return;
    }

    if (!color.value) {
      color.focus();
      return;
    }

    // Show success state
    form.style.display = 'none';
    success.classList.add('show');
    success.textContent = `You're on the list, ${form.querySelector('[name="name"]').value || 'friend'}! We'll email ${email.value} when your GymRollerBag ships.`;

    // In production: submit to Formspree or your backend here
    // Example: fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })
  });
}

// =============================================================================
// 6. Color swatches — sync click → hidden select + active class + label
// =============================================================================

function initColorSwatches() {
  const swatches   = document.querySelectorAll('.swatch');
  const colorSelect = document.querySelector('[name="color"]');
  const swatchLabel = document.getElementById('swatch-label');
  if (!swatches.length || !colorSelect) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      // Update active state
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Sync hidden select
      colorSelect.value = swatch.dataset.value;

      // Update label text
      if (swatchLabel) {
        swatchLabel.textContent = swatch.dataset.label || swatch.dataset.value;
      }
    });
  });

  // Activate first swatch on load
  if (swatches[0]) swatches[0].click();
}

// =============================================================================
// 7. FAQ accordion
// =============================================================================

function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}
