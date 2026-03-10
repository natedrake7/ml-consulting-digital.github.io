/* ============================================================
   M & L Consulting — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar scroll behaviour ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Fade-up scroll animations ---------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start);
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10), 1800);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) statsObserver.observe(statsContainer);

  /* ---------- Contact form ---------- */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        }
      });

      // Email format check
      const emailField = form.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          emailField.style.borderColor = '#ef4444';
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate submission
      const btnText    = form.querySelector('.btn-text');
      const btnLoading = form.querySelector('.btn-loading');
      const submitBtn  = form.querySelector('[type="submit"]');

      submitBtn.disabled = true;
      btnText.hidden     = true;
      btnLoading.hidden  = false;

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        btnText.hidden     = false;
        btnLoading.hidden  = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }, 1400);
    });

    // Clear error highlight on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ---------- Smooth anchor scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
