/**
 * RollPack — Main JS
 * Handles: nav scroll, scroll animations, mobile menu, form submission, toast
 */

(function () {
  'use strict';

  // ── Nav scroll behaviour ────────────────────────────────────────────────
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile hamburger ─────────────────────────────────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── Scroll animations (IntersectionObserver) ─────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));

  // ── Smooth-scroll nav links ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Toast helper ──────────────────────────────────────────────────────────
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  // ── Order form ────────────────────────────────────────────────────────────
  const orderForm = document.getElementById('orderForm');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = orderForm.elements['name'].value.trim();
      const email = orderForm.elements['email'].value.trim();
      const color = orderForm.elements['color'].value;
      const qty   = orderForm.elements['qty'].value;

      if (!name || !email) {
        showToast('Please fill in your name and email.');
        return;
      }
      if (!color) {
        showToast('Please select a color.');
        return;
      }

      // Simulate async submission
      const btn = orderForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Reserving your spot…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ You\'re on the list!';
        btn.style.background = '#22c55e';
        showToast(`Thanks ${name}! We'll email ${email} when your RollPack ships.`);

        // Update social proof count
        const proofText = document.querySelector('.order-social-proof p');
        if (proofText) {
          proofText.innerHTML = 'Join <strong>1,201+ people</strong> already on the waitlist';
        }
      }, 1200);
    });
  }

  // ── Active nav link highlighting ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // ── Add active nav style dynamically ────────────────────────────────────
  const navStyle = document.createElement('style');
  navStyle.textContent = `.nav-links a.active { color: var(--text); }`;
  document.head.appendChild(navStyle);

  // ── Specs table row hover animation ──────────────────────────────────────
  document.querySelectorAll('.specs-table tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.paddingLeft = '4px';
    });
    row.addEventListener('mouseleave', () => {
      row.style.paddingLeft = '';
    });
  });

  // ── Count-up animation for hero stats ────────────────────────────────────
  function animateCount(el, target, suffix = '', duration = 1200) {
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = startVal + (target - startVal) * eased;

      // Format
      if (Number.isInteger(target)) {
        el.textContent = Math.round(current) + suffix;
      } else {
        el.textContent = current.toFixed(1) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger count-up when hero stats enter view
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    let counted = false;
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          const stats = statsEl.querySelectorAll('.stat strong');
          const values = [36, 8, 2.1];
          const suffixes = ['"', 'L', ' lbs'];
          stats.forEach((el, i) => animateCount(el, values[i], suffixes[i], 1000 + i * 200));
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsEl);
  }

})();
