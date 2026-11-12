/* =============================================
   Cam.Dev — Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ------------------------------------------
     Navbar — scroll state + mobile toggle
     ------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMobile.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when a link is clicked
    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------
     Active nav link highlighting
     ------------------------------------------ */
  (function setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile === path || (path === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ------------------------------------------
     Scroll reveal — Intersection Observer
     ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
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

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything if Observer not supported
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ------------------------------------------
     Typing effect for hero subtitle
     ------------------------------------------ */
  const typingTarget = document.getElementById('typingText');
  if (typingTarget) {
    const phrases = [
      'Full-Stack Developer',
      'JavaScript Enthusiast',
      'Problem Solver',
      'Lifelong Learner',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        typingTarget.textContent = current.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            type();
          }, 1800);
          return;
        }
      } else {
        typingTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const delay = isDeleting ? 50 : 80;
      setTimeout(type, delay);
    }

    // Small initial delay before starting
    setTimeout(type, 800);
  }

  /* ------------------------------------------
     Quote app — enhanced display
     ------------------------------------------ */
  const quoteDisplay = document.querySelector('.quote-display');
  if (quoteDisplay) {
    // Patch showMessage / clearMessage to update CSS class
    const originalShow = window.showMessage;
    const originalClear = window.clearMessage;

    if (typeof originalShow === 'function') {
      window.showMessage = function () {
        originalShow();
        quoteDisplay.classList.add('has-quote');
      };
    }

    if (typeof originalClear === 'function') {
      window.clearMessage = function () {
        originalClear();
        quoteDisplay.classList.remove('has-quote');
      };
    }
  }
})();
