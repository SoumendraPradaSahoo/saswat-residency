/* ==========================================================================
   Saswat Residency — Main JS
   No external dependencies. Vanilla JS only.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initScrollSpy();
    initReveal();
    initPlanTabs();
    initGalleryLightbox();
    initFaq();
    initContactForm();
    initBackToTop();
    initYear();
  });

  /* ---------------- Mobile nav toggle ---------------- */
  function initMobileNav() {
    var toggle = $('.nav-toggle');
    var mobileNav = $('.nav-mobile');
    if (!toggle || !mobileNav) return;

    var closeNav = function () {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    $$('a', mobileNav).forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------------- Scroll-spy active nav link ---------------- */
  function initScrollSpy() {
    var sections = $$('main section[id]');
    var navLinks = $$('.nav-desktop a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    var map = {};
    navLinks.forEach(function (link) {
      map[link.getAttribute('href').slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- Reveal-on-scroll animation ---------------- */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Floor plan tabs ---------------- */
  function initPlanTabs() {
    var tabs = $$('.plan-tab');
    var panels = $$('.plan-panel');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-target');

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.id === target);
        });
      });
    });
  }

  /* ---------------- Gallery lightbox (also used by floor plan images) ---------------- */
  function initGalleryLightbox() {
    var triggers = $$('[data-lightbox]');
    if (!triggers.length) return;

    var images = triggers.map(function (t) {
      return { src: t.getAttribute('data-lightbox'), caption: t.getAttribute('data-caption') || '' };
    });

    var lightbox = $('#lightbox');
    if (!lightbox) return;
    var imgEl = $('#lightbox-img', lightbox);
    var capEl = $('#lightbox-caption', lightbox);
    var currentIndex = 0;

    function open(index) {
      currentIndex = index;
      render();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function render() {
      var item = images[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.caption || 'Saswat Residency image';
      capEl.textContent = item.caption;
    }
    function next() { currentIndex = (currentIndex + 1) % images.length; render(); }
    function prev() { currentIndex = (currentIndex - 1 + images.length) % images.length; render(); }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        open(index);
      });
    });

    var closeBtn = $('.lightbox-close', lightbox);
    var nextBtn = $('.lightbox-next', lightbox);
    var prevBtn = $('.lightbox-prev', lightbox);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFaq() {
    var items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = $('.faq-question', item);
      var answer = $('.faq-answer', item);
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          $('.faq-question', other).setAttribute('aria-expanded', 'false');
          $('.faq-answer', other).style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------- Contact form validation + submission ---------------- */
  function initContactForm() {
    var form = $('#contact-form');
    if (!form) return;

    var statusEl = $('#form-status');

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
      phone: function (v) { return /^[0-9+\-\s()]{7,15}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.'; },
      email: function (v) {
        if (!v.trim()) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
      },
      message: function (v) { return v.trim().length >= 5 ? '' : 'Tell us a little about what you need.'; }
    };

    function setFieldError(field, message) {
      var wrapper = field.closest('.field');
      if (!wrapper) return;
      var errorEl = $('.field-error', wrapper);
      if (message) {
        wrapper.classList.add('has-error');
        if (errorEl) errorEl.textContent = message;
      } else {
        wrapper.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
      }
    }

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () {
        setFieldError(field, validators[name](field.value));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot spam check
      var hp = form.elements['website'];
      if (hp && hp.value) { return; }

      var valid = true;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var error = validators[name](field.value);
        setFieldError(field, error);
        if (error) valid = false;
      });

      if (!valid) {
        showStatus('Please fix the highlighted fields and try again.', 'error');
        return;
      }

      var submitBtn = $('button[type="submit"]', form);
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var endpoint = form.getAttribute('action');
      var usesPlaceholder = !endpoint || endpoint.indexOf('your-form-id') !== -1;

      if (usesPlaceholder) {
        // No real backend configured yet — fall back to a pre-filled email draft
        // so the site is fully usable out of the box. See README for how to
        // wire this up to Formspree / Getform / a serverless function instead.
        setTimeout(function () {
          openMailFallback();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
          showStatus('Opening your email app to send this enquiry. You can also call or WhatsApp us directly.', 'success');
          form.reset();
        }, 400);
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (res.ok) {
            showStatus('Thank you! Your enquiry has been received. Our team will contact you shortly.', 'success');
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          openMailFallback();
          showStatus('We could not reach our server, so we opened an email draft for you instead.', 'error');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        });
    });

    function openMailFallback() {
      var name = form.elements['name'] ? form.elements['name'].value : '';
      var phone = form.elements['phone'] ? form.elements['phone'].value : '';
      var email = form.elements['email'] ? form.elements['email'].value : '';
      var unit = form.elements['unit'] ? form.elements['unit'].value : '';
      var message = form.elements['message'] ? form.elements['message'].value : '';

      var body = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + email,
        'Interested Unit: ' + unit,
        '',
        message
      ].join('%0D%0A');

      var mailto = 'mailto:gprasadsahoo@gmail.com?subject=' +
        encodeURIComponent('Enquiry - Saswat Residency') + '&body=' + body;
      window.location.href = mailto;
    }

    function showStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form-status is-' + type;
      statusEl.setAttribute('role', 'status');
    }
  }

  /* ---------------- Back to top button ---------------- */
  function initBackToTop() {
    var btn = $('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    var el = $('#current-year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
