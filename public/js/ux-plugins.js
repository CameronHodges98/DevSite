/* =============================================
   Cam.Dev — Built-in UX plugins
   Each plugin is a self-contained behavior registered on the UX engine.
   ============================================= */

(function (UX) {
  'use strict';

  /* ------------------------------------------
     navbar — scrolled state + mobile toggle
     ------------------------------------------ */
  UX.use({
    name: 'navbar',
    defaults: { threshold: 20 },
    init(ctx) {
      const navbar = document.getElementById('navbar');
      const toggle = document.getElementById('navToggle');
      const mobile = document.getElementById('navMobile');

      if (navbar) {
        const onScroll = () => {
          const y = window.scrollY;
          navbar.classList.toggle('scrolled', y > ctx.options.threshold);
          ctx.emit('scroll', { y });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        ctx.onCleanup(() => window.removeEventListener('scroll', onScroll));
        onScroll();
      }

      if (toggle && mobile) {
        const setOpen = (open) => {
          toggle.classList.toggle('open', open);
          mobile.classList.toggle('open', open);
          toggle.setAttribute('aria-expanded', String(open));
        };
        toggle.addEventListener('click', () => setOpen(!toggle.classList.contains('open')));
        ctx.$$('.nav-link', mobile).forEach((link) =>
          link.addEventListener('click', () => setOpen(false))
        );
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && toggle.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
          }
        });
      }
    },
  });

  /* ------------------------------------------
     active-link — highlight current page
     ------------------------------------------ */
  UX.use({
    name: 'active-link',
    init(ctx) {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      ctx.$$('.nav-link').forEach((link) => {
        const file = (link.getAttribute('href') || '').split('/').pop();
        if (file === path) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    },
  });

  /* ------------------------------------------
     reveal — scroll-in animation (.reveal)
     ------------------------------------------ */
  UX.use({
    name: 'reveal',
    defaults: { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    init(ctx) {
      const els = ctx.$$('.reveal');
      if (!els.length) return;

      // No observer or reduced motion: show everything immediately.
      if (!ctx.env.hasObserver || ctx.env.reducedMotion) {
        els.forEach((el) => el.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          ctx.emit('reveal', entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: ctx.options.threshold, rootMargin: ctx.options.rootMargin });

      els.forEach((el) => observer.observe(el));
      ctx.onCleanup(() => observer.disconnect());
    },
  });

  /* ------------------------------------------
     typing — hero subtitle typewriter
     ------------------------------------------ */
  UX.use({
    name: 'typing',
    defaults: {
      target: '#typingText',
      phrases: ['Full-Stack Developer', 'JavaScript Enthusiast', 'Problem Solver', 'Lifelong Learner'],
      typeMs: 80, deleteMs: 50, holdMs: 1800, startMs: 800,
    },
    init(ctx) {
      const el = ctx.$(ctx.options.target);
      if (!el) return;
      // Reduced motion: leave the static text from the HTML in place.
      if (ctx.env.reducedMotion) return;

      const { phrases, typeMs, deleteMs, holdMs, startMs } = ctx.options;
      let phrase = 0, chars = 0, deleting = false, timer;

      const tick = () => {
        const current = phrases[phrase];
        if (!deleting) {
          el.textContent = current.slice(0, ++chars);
          if (chars === current.length) {
            deleting = true;
            timer = setTimeout(tick, holdMs);
            return;
          }
        } else {
          el.textContent = current.slice(0, --chars);
          if (chars === 0) {
            deleting = false;
            phrase = (phrase + 1) % phrases.length;
          }
        }
        timer = setTimeout(tick, deleting ? deleteMs : typeMs);
      };

      timer = setTimeout(tick, startMs);
      ctx.onCleanup(() => clearTimeout(timer));
    },
  });

  /* ------------------------------------------
     scroll-progress — thin reading-progress bar
     ------------------------------------------ */
  UX.use({
    name: 'scroll-progress',
    requires: ['navbar'],
    init(ctx) {
      const bar = document.createElement('div');
      bar.className = 'ux-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
      ctx.onCleanup(() => bar.remove());

      let ticking = false;
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = 'scaleX(' + pct + ')';
        ticking = false;
      };
      ctx.on('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      });
      window.addEventListener('resize', update, { passive: true });
      ctx.onCleanup(() => window.removeEventListener('resize', update));
      update();
    },
  });

  /* ------------------------------------------
     quote-display — sync .has-quote class for the quote app
     ------------------------------------------ */
  UX.use({
    name: 'quote-display',
    init(ctx) {
      const display = ctx.$('.quote-display');
      if (!display) return;
      const wrap = (fnName, add) => {
        const original = window[fnName];
        if (typeof original !== 'function') return;
        window[fnName] = function () {
          const result = original.apply(this, arguments);
          display.classList.toggle('has-quote', add);
          return result;
        };
      };
      wrap('showMessage', true);
      wrap('clearMessage', false);
    },
  });
})(window.UX);
