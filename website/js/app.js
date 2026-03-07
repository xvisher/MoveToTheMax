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
 */

/* global GymRollerViewer */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for Three.js to be loaded (scripts use defer — should be ready by now)
  if (typeof THREE === 'undefined' || typeof THREE.OrbitControls === 'undefined') {
    // If CDN is slow, poll until available (max 5s)
    let attempts = 0;
    const wait = setInterval(() => {
      attempts++;
      if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined') {
        clearInterval(wait);
        boot();
      } else if (attempts > 50) {
        clearInterval(wait);
        console.warn('Three.js failed to load — 3D viewers disabled');
      }
    }, 100);
  } else {
    boot();
  }
});

function boot() {
  initViewers();
  initNavbar();
  initScrollAnimations();
  initSmoothScroll();
  initPreOrderForm();
}

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
