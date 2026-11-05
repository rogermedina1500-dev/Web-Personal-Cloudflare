/* ════════════════════════════════════════════
   ROGER MEDINA — Personal Portfolio
   script.js
════════════════════════════════════════════ */

'use strict';

/* ─── 1. NAVBAR — scroll effect + active link ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // active link highlighting
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 90;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── 2. HAMBURGER MENU ─── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ─── 3. TYPED TEXT EFFECT ─── */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Técnico Superior en Electrónica',
    'Especialista en Mantenimiento Industrial',
    'Desarrollador Full Stack en formación',
    'Comprometido con la excelencia profesional',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED  = 55;
  const DELETE_SPEED  = 30;
  const PAUSE_AFTER   = 2000;
  const PAUSE_BEFORE  = 400;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
    }

    let delay = isDeleting ? DELETE_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing → pause then delete
      if (!isPaused) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(type, DELETE_SPEED);
        }, PAUSE_AFTER);
        return;
      }
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting → next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  }

  // Small initial delay so it feels natural
  setTimeout(type, 800);
})();

/* ─── 4. SCROLL REVEAL ─── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = entry.target.closest('.cards-grid, .skills-grid, .sobre-mi-stats, .timeline, .education-grid, .filosofia-layout');
          if (siblings) {
            const all = Array.from(siblings.querySelectorAll('.reveal'));
            const idx = all.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 80}ms`;
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('visible'));
  }
})();

/* ─── 5. LANGUAGE BARS ANIMATION ─── */
(function initLangBars() {
  const bars = document.querySelectorAll('.lang-fill');
  if (!bars.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
  } else {
    bars.forEach(bar => bar.classList.add('animated'));
  }
})();

/* ─── 6. BACK TO TOP ─── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── 7. SMOOTH ANCHOR SCROLL (offset for fixed navbar) ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── 8. SUBTLE PARALLAX on hero shapes ─── */
(function initParallax() {
  const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
  if (!shapes.length) return;

  // Only run on non-touch devices for performance
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      shapes.forEach((shape, i) => {
        const factor = (i + 1) * 10;
        shape.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    }, { passive: true });
  }
})();
