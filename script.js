/* =============================================================
   CG-Agro-Farm  |  script.js
   -------------------------------------------------------------
   Plain JavaScript — no libraries, no frameworks.
   Everything is wrapped in one function so nothing leaks into the
   global scope. Each feature is a separate small function below.

   Features
   01  Mobile hamburger menu
   02  Smooth scrolling
   03  Sticky navbar background
   04  Active navigation item
   05  Scroll reveal animation
   06  Gallery filtering
   07  Contact form validation (+ daily operations form)
   08  Back-to-top button
   09  Toast notifications
   10  Current year in the footer
   Extra: management-module tabs, number counters, auto closing stock
   ============================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */

  // Selectors used across the file (change them here, not everywhere else)
  var HEADER   = '#siteHeader';
  var NAV_MENU = '#navMenu';
  var NAV_TOGGLE = '#navToggle';
  var OVERLAY  = '#navOverlay';

  /**
   * Shortcut for document.querySelector
   * @param {string} selector
   * @param {ParentNode} [scope]
   * @returns {Element|null}
   */
  function q(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Shortcut for document.querySelectorAll → returns a real array
   * @param {string} selector
   * @param {ParentNode} [scope]
   * @returns {Element[]}
   */
  function qa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /**
   * Find one element by its id attribute.
   * Use this whenever you have a plain id such as "panel-sales".
   * (querySelector needs the "#" symbol — querySelector("panel-sales") finds nothing.)
   * @param {string} id
   * @returns {Element|null}
   */
  function byId(id) {
    return id ? document.getElementById(id) : null;
  }

  /**
   * True when the visitor asked the operating system to reduce motion.
   * Used to skip smooth scrolling and counting animations.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Height of the sticky navbar in pixels (needed for anchor offsets). */
  function headerHeight() {
    var header = q(HEADER);
    return header ? header.offsetHeight : 70;
  }

  /* ============================================================
     09. TOAST NOTIFICATIONS  (defined early — other features use it)
     ============================================================ */
  var toastTimer = null;

  /**
   * Show a small message at the bottom of the screen.
   * @param {string} message
   * @param {string} [type] 'success' or 'error'
   */
  function showToast(message, type) {
    var toast = q('#toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast is-visible' + (type ? ' toast--' + type : '');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.className = 'toast';
    }, 3200);
  }

  /* ============================================================
     01. MOBILE HAMBURGER MENU
     ============================================================ */
  function initMobileMenu() {
    var toggle  = q(NAV_TOGGLE);
    var menu    = q(NAV_MENU);
    var overlay = q(OVERLAY);
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close main menu');
      if (overlay) {
        overlay.hidden = false;
        // Next frame → CSS transition can run
        window.requestAnimationFrame(function () {
          overlay.classList.add('is-visible');
        });
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open main menu');
      if (overlay) {
        overlay.classList.remove('is-visible');
        // Wait for the fade-out, then hide it from screen readers
        window.setTimeout(function () { overlay.hidden = true; }, 300);
      }
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Escape key closes the menu
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Clicking any link inside the menu closes it
    qa('.nav-link', menu).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Going back to desktop width resets everything
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ============================================================
     02. SMOOTH SCROLLING
     Sections are scrolled to manually so the sticky navbar does not
     cover the heading.
     ============================================================ */
  function initSmoothScroll() {
    // Every in-page link:  href="#some-id"
    qa('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var target = q(targetId);
        if (!target) return;                       // e.g. a placeholder social link

        event.preventDefault();

        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 8;

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        // Move keyboard focus to the section for screen-reader users
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        window.setTimeout(function () { target.focus({ preventScroll: true }); }, 420);
      });
    });
  }

  /* ============================================================
     03. STICKY NAVBAR BACKGROUND + 08. BACK TO TOP
     Both only need to know how far the page is scrolled.
     ============================================================ */
  function initScrollUi() {
    var header = q(HEADER);
    var backTop = q('#backToTop');

    var ticking = false;

    function onScroll() {
      var y = window.pageYOffset;

      if (header) header.classList.toggle('is-scrolled', y > 40);
      if (backTop) {
        backTop.classList.toggle('is-visible', y > 420);
        backTop.hidden = y <= 420;
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();

    if (backTop) {
      backTop.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      });
    }
  }

  /* ============================================================
     04. ACTIVE NAVIGATION ITEM
     The link of the section currently in the middle of the screen
     gets the class .is-active.
     ============================================================ */
  function initActiveNav() {
    var links = qa('.nav-menu .nav-link');
    if (!links.length) return;

    // Only watch the sections that have a navigation link
    var sections = links
      .map(function (link) { return q(link.getAttribute('href')); })
      .filter(Boolean);

    var ticking = false;

    function setActive() {
      var position = window.pageYOffset + headerHeight() + window.innerHeight * 0.28;
      var current = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= position) current = section;
      });

      // Bottom of the page → always highlight the last link
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1];
      }

      links.forEach(function (link) {
        link.classList.toggle('is-active', current && link.getAttribute('href') === '#' + current.id);
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(setActive);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', setActive);
    setActive();
  }

  /* ============================================================
     05. SCROLL REVEAL
     Elements with class "reveal" fade + slide in the first time they
     appear. Without JavaScript they stay visible (see .js in CSS).
     ============================================================ */
  function initReveal() {
    var items = qa('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Optional stagger: data-reveal-delay="1" → 80ms, "2" → 160ms…
        var delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
        entry.target.style.transitionDelay = (delay * 80) + 'ms';

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);          // animate only once
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });

    // Safety net: never leave content invisible.
    // Once the page has loaded, anything currently on screen is revealed.
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        items.forEach(function (el) {
          if (el.classList.contains('is-visible')) return;
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
        });
      }, 1200);
    });
  }

  /* ============================================================
     NUMBER COUNTERS (only runs for real numeric values)
     Any placeholder such as "XX" is left exactly as written.
     ============================================================ */
  function initCounters() {
    var counters = qa('[data-counter]');
    if (!counters.length) return;

    function run(element) {
      var target = parseFloat(element.getAttribute('data-counter'));
      var suffix = element.getAttribute('data-suffix') || '';
      var text = element.textContent.trim();

      // Not a number (for example "XX") → nothing to animate
      if (isNaN(target)) return;

      if (prefersReducedMotion()) {
        element.textContent = target + suffix;
        return;
      }

      var duration = 1200;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);       // ease-out
        element.textContent = Math.round(target * eased) + suffix;

        if (progress < 1) window.requestAnimationFrame(step);
        else element.textContent = text;
      }

      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     06. GALLERY FILTERING
     ============================================================ */
  function initGalleryFilter() {
    var buttons = qa('.filter-btn');
    var items = qa('.gallery-item');
    var empty = q('#galleryEmpty');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');

        // Button styling + aria-pressed
        buttons.forEach(function (btn) {
          var active = btn === button;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        // Show / hide the images
        var visible = 0;
        items.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !match);
          if (match) visible++;
        });

        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  /* ============================================================
     PLACEHOLDER LINKS (social media, etc.)
     While a link still has href="#" + data-placeholder, clicking it
     explains what to do instead of jumping to the top of the page.
     ============================================================ */
  function initPlaceholderLinks() {
    qa('a[data-placeholder]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        showToast('Add your ' + link.getAttribute('data-placeholder') + ' in index.html to activate this link.');
      });
    });
  }

  /* ============================================================
     07. FORM VALIDATION
     One helper is used by both the contact form and the daily
     operations form.
     ============================================================ */

  /**
   * Show or clear the error message of one field.
   * @param {Element} input
   * @param {string} message  empty string = no error
   */
  function setFieldError(input, message) {
    var holder = q('[data-error-for="' + input.id + '"]');
    input.classList.toggle('is-invalid', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (holder) holder.textContent = message;
  }

  /**
   * Check one input and return an error message ('' means valid).
   * @param {Element} input
   * @returns {string}
   */
  function validateField(input) {
    var value = (input.value || '').trim();

    if (input.required && value === '') {
      return input.dataset.label ? input.dataset.label + ' is required.' : 'This field is required.';
    }
    if (value === '') return '';

    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Enter a valid email address (example: name@gmail.com).';
    }
    if (input.type === 'tel' && !/^[0-9+\-\s()]{7,20}$/.test(value)) {
      return 'Enter a valid phone number (digits only, 7–20 characters).';
    }
    if (input.minLength > 0 && value.length < input.minLength) {
      return 'Please write at least ' + input.minLength + ' characters.';
    }
    if (input.checkValidity && !input.checkValidity() && input.pattern) {
      return 'Please check this value.';
    }
    return '';
  }

  /** Attach validation to every field of a form. */
  function attachLiveValidation(form) {
    qa('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('blur', function () {
        setFieldError(input, validateField(input));
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) {
          setFieldError(input, validateField(input));
        }
      });
    });
  }

  function initContactForm() {
    var form = q('#contactForm');
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();                     // nothing is sent anywhere yet

      var inputs = qa('input, select, textarea', form);
      var firstInvalid = null;

      inputs.forEach(function (input) {
        var error = validateField(input);
        setFieldError(input, error);
        if (error && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        showToast('Please correct the highlighted fields.', 'error');
        return;
      }

      var division = q('#cDivision').value;
      showToast('Thank you! Your inquiry for "' + division + '" is ready to send.', 'success');
      form.reset();
      inputs.forEach(function (input) { setFieldError(input, ''); });
    });
  }

  /* ============================================================
     DAILY OPERATIONS FORM
     Closing stock is calculated automatically:
     opening + production + purchase − sales
     ============================================================ */
  function initOpsForm() {
    var form = q('#opsForm');
    if (!form) return;

    var date = q('#opsDate');
    var division = q('#opsDivision');
    var opening = q('#opsOpening');
    var production = q('#opsProduction');
    var sales = q('#opsSales');
    var purchase = q('#opsPurchase');
    var closing = q('#opsClosing');

    // Default the date to today, and remember it for after a reset
    var defaultDate = '';
    if (date) {
      var today = new Date();
      var month = String(today.getMonth() + 1).padStart(2, '0');
      var day = String(today.getDate()).padStart(2, '0');
      defaultDate = today.getFullYear() + '-' + month + '-' + day;
      date.value = defaultDate;
    }

    function num(el) { return parseFloat(el && el.value) || 0; }

    function recalc() {
      if (!closing) return;
      var total = num(opening) + num(production) + num(purchase) - num(sales);
      closing.value = total < 0 ? 0 : total;
    }

    [opening, production, sales, purchase].forEach(function (el) {
      if (el) el.addEventListener('input', recalc);
    });
    recalc();

    // The "Reset" button must clear the auto-calculated field too
    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        if (date) date.value = defaultDate;
        recalc();
      }, 0);
    });

    attachLiveValidation(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      qa('input, select, textarea', form).forEach(function (input) {
        var error = validateField(input);
        setFieldError(input, error);
        if (error && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        showToast('Please complete the required fields.', 'error');
        return;
      }

      showToast('Demo entry saved for ' + division.value + '. Connect a database to store real data.', 'success');
      form.reset();
      recalc();
      if (date) date.value = defaultDate;           // keep today's date
    });
  }

  /* ============================================================
     MANAGEMENT MODULE TABS
     ============================================================ */
  function initTabs() {
    var tabs = qa('[role="tab"]');
    if (!tabs.length) return;

    function selectTab(tab) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
        item.tabIndex = selected ? 0 : -1;
        var panel = byId(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { selectTab(tab); });

      // Keyboard support: ← → Home End
      tab.addEventListener('keydown', function (event) {
        var index = tabs.indexOf(tab);
        var next = null;

        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        if (event.key === 'ArrowLeft')  next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === 'Home')       next = tabs[0];
        if (event.key === 'End')        next = tabs[tabs.length - 1];

        if (next) {
          event.preventDefault();
          selectTab(next);
          next.focus();
        }
      });
    });
  }

  /* ============================================================
     10. CURRENT YEAR IN THE FOOTER
     ============================================================ */
  function initCurrentYear() {
    var year = q('#currentYear');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ============================================================
     START EVERYTHING
     ============================================================ */

  function init() {
    // Tells the CSS that JavaScript is running, so hidden elements can be animated
    document.documentElement.classList.add('js');

    initMobileMenu();
    initSmoothScroll();
    initScrollUi();
    initActiveNav();
    initReveal();
    initCounters();
    initGalleryFilter();
    initPlaceholderLinks();
    initContactForm();
    initOpsForm();
    initTabs();
    initCurrentYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();