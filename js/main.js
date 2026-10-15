(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919954562820';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: scrolled state ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');
  var toggleLabel = toggle.querySelector('.sr-only');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Light hero parallax (desktop, motion allowed) ---------- */
  var floaters = document.querySelectorAll('.floater[data-depth]');
  var hero = document.querySelector('.hero');
  var finePointer = window.matchMedia('(min-width: 961px) and (pointer: fine)');
  var ticking = false;

  function updateParallax() {
    ticking = false;
    if (reduceMotion.matches || !finePointer.matches) return;
    var y = window.scrollY;
    if (y > hero.offsetHeight) return;
    floaters.forEach(function (el) {
      var depth = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.transform = 'translate3d(0,' + (y * depth * -0.25).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  /* ---------- Mobile bar: hide while the form or footer is on screen ---------- */
  var mobileBar = document.querySelector('.mobile-bar');
  var hideTargets = [document.getElementById('enquire'), document.querySelector('.site-footer')];
  if ('IntersectionObserver' in window) {
    var visible = new Set();
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      mobileBar.classList.toggle('is-hidden', visible.size > 0);
    }, { threshold: 0.05 });
    hideTargets.forEach(function (t) { if (t) barObserver.observe(t); });
  }

  /* ---------- Syllabus level tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.level-tab'));
  function selectTab(tab, focus, animate) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !selected;
      if (selected && animate) {
        panel.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
        if (!reduceMotion.matches) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      }
    });
    if (focus) tab.focus();
  }
  if (tabs.length) {
    selectTab(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0], false, false);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab, false, true); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true, true); }
      });
    });
  }

  /* ---------- Team carousel (phones only) ---------- */
  var teamTrack = document.querySelector('.team-track');
  if (teamTrack) {
    var teamCards = Array.prototype.slice.call(teamTrack.children);
    var teamDots = Array.prototype.slice.call(document.querySelectorAll('.team-dot'));
    var phone = window.matchMedia('(max-width: 720px)');
    var teamTimer = null;
    var teamResume = null;
    var teamInView = false;
    var teamIndex = 0;

    function cardOffset(i) {
      var card = teamCards[i];
      return card.offsetLeft - (teamTrack.clientWidth - card.offsetWidth) / 2;
    }
    function goTo(i) {
      teamIndex = (i + teamCards.length) % teamCards.length;
      teamTrack.scrollTo({ left: cardOffset(teamIndex), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
    function syncDots() {
      var center = teamTrack.scrollLeft + teamTrack.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      teamCards.forEach(function (card, i) {
        var d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      teamIndex = best;
      teamDots.forEach(function (dot, i) {
        if (i === best) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    function stopAuto() { clearInterval(teamTimer); teamTimer = null; }
    function startAuto() {
      stopAuto();
      if (!phone.matches || reduceMotion.matches || !teamInView || document.hidden) return;
      teamTimer = setInterval(function () { goTo(teamIndex + 1); }, 3500);
    }
    function pauseThenResume() {
      stopAuto();
      clearTimeout(teamResume);
      teamResume = setTimeout(startAuto, 6000);
    }

    var syncTicking = false;
    teamTrack.addEventListener('scroll', function () {
      if (syncTicking) return;
      syncTicking = true;
      requestAnimationFrame(function () { syncTicking = false; syncDots(); });
    }, { passive: true });
    ['pointerdown', 'touchstart', 'wheel'].forEach(function (evt) {
      teamTrack.addEventListener(evt, pauseThenResume, { passive: true });
    });
    teamTrack.addEventListener('focusin', stopAuto);
    teamTrack.addEventListener('focusout', startAuto);
    teamDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); pauseThenResume(); });
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopAuto(); else startAuto(); });
    phone.addEventListener('change', startAuto);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        teamInView = entries[0].isIntersecting;
        if (teamInView) startAuto(); else stopAuto();
      }, { threshold: 0.4 }).observe(teamTrack);
    } else {
      teamInView = true;
      startAuto();
    }
  }

  /* ---------- Important dates: mark past / next ---------- */
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.date-item[data-date]'));
    if (!items.length) return;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    function parse(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    var nextFound = false;
    items.forEach(function (item) {
      var date = parse(item.getAttribute('data-date'));
      var status = item.querySelector('.date-status');
      var until = item.getAttribute('data-open-until');
      var days = Math.round((date - today) / 86400000);
      if (days < 0) {
        if (until && parse(until) >= today) {
          status.textContent = 'Registration open';
          item.classList.add('is-next');
          nextFound = true;
        } else {
          item.classList.add('is-past');
          status.textContent = 'Done';
        }
      } else if (!nextFound) {
        nextFound = true;
        item.classList.add('is-next');
        status.textContent = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days';
      }
    });
  })();

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById('enquiry-form');
  var summary = document.getElementById('form-summary');
  var fallback = document.getElementById('form-fallback');
  var fallbackLink = document.getElementById('form-fallback-link');

  var rules = {
    parentName: function (v) {
      if (!v) return 'Please enter the parent or guardian’s name.';
      if (v.length < 2) return 'Name looks too short.';
      return '';
    },
    studentName: function (v) {
      if (!v) return 'Please enter the student’s name.';
      if (v.length < 2) return 'Name looks too short.';
      return '';
    },
    studentClass: function (v) {
      return v ? '' : 'Please enter the student’s class or grade.';
    },
    schoolName: function (v) {
      if (!v) return 'Please enter the school name.';
      if (v.length < 2) return 'School name looks too short.';
      return '';
    },
    contactNumber: function (v) {
      if (!v) return 'Please enter a contact number.';
      return normalisePhone(v) ? '' : 'Please enter a valid 10-digit mobile number.';
    },
    city: function (v) {
      if (!v) return 'Please enter your city or town.';
      if (v.length < 2) return 'City/Town looks too short.';
      return '';
    },
    consent: function (_, el) {
      return el.checked ? '' : 'Please agree to share these details through WhatsApp.';
    }
  };

  // Accepts 10 digits starting 6–9, optionally prefixed with +91 / 91 / 0.
  function normalisePhone(value) {
    var digits = value.replace(/[\s\-().]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(digits)) return null;
    if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
    else if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  }

  function clean(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function validateField(name) {
    var el = form.elements[name];
    var value = el.type === 'checkbox' ? '' : clean(el.value);
    var msg = rules[name](value, el);
    var errorEl = document.getElementById(name + '-error');
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    var evt = el.type === 'checkbox' ? 'change' : 'blur';
    el.addEventListener(evt, function () {
      if (el.type !== 'checkbox' && !el.value && !el.hasAttribute('aria-invalid')) return;
      validateField(name);
    });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') validateField(name);
    });
  });

  // Keep the phone field to digits and common separators.
  form.elements.contactNumber.addEventListener('input', function (e) {
    var el = e.target;
    var cleaned = el.value.replace(/[^\d+\-\s()]/g, '');
    if (cleaned !== el.value) el.value = cleaned;
  });

  function buildMessage() {
    var f = form.elements;
    var lines = [
      'Hello Student Guide! I’m interested in SGTH 2026.',
      'Parent/Guardian Name: ' + clean(f.parentName.value),
      'Student Name: ' + clean(f.studentName.value),
      'Class/Grade: ' + clean(f.studentClass.value),
      'School Name: ' + clean(f.schoolName.value),
      'Contact Number: +91 ' + normalisePhone(f.contactNumber.value),
      'City/Town: ' + clean(f.city.value),
      'Message: ' + (f.message.value.trim() || 'Not provided'),
      'Please share the eligibility, event schedule, participation process, and other details.'
    ];
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var invalid = Object.keys(rules).filter(function (name) { return !validateField(name); });
    if (invalid.length) {
      summary.textContent = invalid.length === 1
        ? 'Please fix the highlighted field before continuing.'
        : 'Please fix the ' + invalid.length + ' highlighted fields before continuing.';
      summary.hidden = false;
      form.elements[invalid[0]].focus();
      return;
    }
    summary.hidden = true;

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage());
    fallbackLink.href = url;
    fallback.hidden = false;

    // 'noopener' in the features string makes window.open return null, so detach manually.
    var win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
  });
})();
