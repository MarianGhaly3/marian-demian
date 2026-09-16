(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------
     Active nav link on scroll
  --------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          var link = byId[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero: single orchestrated typewriter + preview reveal
  --------------------------------------------------------- */
  var typeTarget = document.getElementById('typeTarget');
  var preview = document.getElementById('editorPreview');
  var caret = document.getElementById('caret');

  var snippet = '<div class="brand">\n  <h1>Marian Demian</h1>\n  <p>Full-Stack Developer</p>\n</div>';

  function revealPreview() {
    if (preview) preview.classList.add('is-visible');
  }

  if (typeTarget) {
    if (reduceMotion) {
      typeTarget.textContent = snippet;
      if (caret) caret.style.display = 'none';
      revealPreview();
    } else {
      var i = 0;
      var speed = 22;
      (function type() {
        if (i <= snippet.length) {
          typeTarget.textContent = snippet.slice(0, i);
          i++;
          setTimeout(type, speed);
        } else {
          setTimeout(revealPreview, 250);
        }
      })();
    }
  }

  /* ---------------------------------------------------------
     Work: category filter
  --------------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-filter');

      projectCards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        var show = filter === 'all' || tags.indexOf(filter) !== -1;
        card.hidden = !show;
      });
    });
  });

  /* ---------------------------------------------------------
     Directory: tabs + live search
  --------------------------------------------------------- */
  var dirTabs = document.querySelectorAll('.dir-tab');
  var dirRows = document.querySelectorAll('.dir-row');
  var dirSearch = document.getElementById('dirSearch');
  var dirEmpty = document.getElementById('dirEmpty');
  var activeCat = 'all';

  function applyDirectoryFilter() {
    var query = (dirSearch && dirSearch.value || '').trim().toLowerCase();
    var visibleCount = 0;

    dirRows.forEach(function (row) {
      var cat = row.getAttribute('data-cat');
      var name = (row.getAttribute('data-name') || '').toLowerCase();
      var matchesCat = activeCat === 'all' || cat === activeCat;
      var matchesQuery = !query || name.indexOf(query) !== -1;
      var show = matchesCat && matchesQuery;
      row.hidden = !show;
      if (show) visibleCount++;
    });

    if (dirEmpty) dirEmpty.hidden = visibleCount !== 0;
  }

  dirTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      dirTabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      activeCat = tab.getAttribute('data-cat');
      applyDirectoryFilter();
    });
  });

  if (dirSearch) {
    dirSearch.addEventListener('input', applyDirectoryFilter);
  }

  /* ---------------------------------------------------------
     Directory: hide any favicon that fails to load
  --------------------------------------------------------- */
  document.querySelectorAll('.dir-row img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });

  /* ---------------------------------------------------------
     Contact: copy email to clipboard
  --------------------------------------------------------- */
  var copyBtn = document.getElementById('copyEmail');
  var copyFeedback = document.getElementById('copyFeedback');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');

      function showFeedback() {
        if (!copyFeedback) return;
        copyFeedback.classList.add('is-visible');
        setTimeout(function () { copyFeedback.classList.remove('is-visible'); }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showFeedback).catch(function () {
          window.location.href = 'mailto:' + email;
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
