(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

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

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          var link = byId[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero: match the code window's height to the copy column
  --------------------------------------------------------- */
  var heroCopy = document.querySelector('.hero-copy');
  var heroVisual = document.getElementById('heroVisual');

  function matchHeroHeight() {
    if (!heroCopy || !heroVisual) return;
    if (window.innerWidth > 900) {
      heroVisual.style.height = heroCopy.offsetHeight + 'px';
    } else {
      heroVisual.style.height = '';
    }
  }

  matchHeroHeight();
  window.addEventListener('resize', debounce(matchHeroHeight, 150));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(matchHeroHeight);
  }
  window.addEventListener('load', matchHeroHeight);

  /* ---------------------------------------------------------
     Hero: single orchestrated typewriter + preview reveal
  --------------------------------------------------------- */
  var typeTarget = document.getElementById('typeTarget');
  var preview = document.getElementById('editorPreview');
  var caret = document.getElementById('caret');

  var snippet = '<div class="brand">\n  <h1>Marian Demian</h1>\n  <p>Full-Stack Developer</p>\n  <p>turning briefs into\n     creative websites</p>\n</div>';

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
      var speed = 16;
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
     Hero stats: count-up animation
  --------------------------------------------------------- */
  var countEls = document.querySelectorAll('.count');

  function animateCounts() {
    countEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;

      if (reduceMotion) {
        el.textContent = target;
        return;
      }

      var duration = 1100;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
    });
  }

  if (countEls.length) animateCounts();

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
  var dirCards = document.querySelectorAll('.dir-card');
  var dirSearch = document.getElementById('dirSearch');
  var dirEmpty = document.getElementById('dirEmpty');
  var activeCat = 'all';

  function applyDirectoryFilter() {
    var query = (dirSearch && dirSearch.value || '').trim().toLowerCase();
    var visibleCount = 0;

    dirCards.forEach(function (card) {
      var cat = card.getAttribute('data-cat');
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var matchesCat = activeCat === 'all' || cat === activeCat;
      var matchesQuery = !query || name.indexOf(query) !== -1;
      var show = matchesCat && matchesQuery;
      card.hidden = !show;
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
     Images: fall back gracefully if a placeholder fails to load
  --------------------------------------------------------- */
  document.querySelectorAll('.dir-media img, .project-media img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.visibility = 'hidden';
    });
  });

  /* ---------------------------------------------------------
     Lightbox: click any project / directory image to zoom
  --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  var lbImages = [];
  var lbIndex = 0;
  var lbCaption = '';
  var lbLastFocused = null;

  function showLightboxImage() {
    if (!lightboxImg) return;
    lightboxImg.src = lbImages[lbIndex];
    lightboxImg.alt = lbCaption || '';
    if (lightboxCaption) lightboxCaption.textContent = lbCaption || '';
    var multi = lbImages.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !multi;
    if (lightboxNext) lightboxNext.hidden = !multi;
  }

  function openLightbox(images, startIndex, caption) {
    if (!lightbox || !images || !images.length) return;
    lbImages = images;
    lbIndex = startIndex || 0;
    lbCaption = caption || '';
    lbLastFocused = document.activeElement;
    showLightboxImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbLastFocused && lbLastFocused.focus) lbLastFocused.focus();
  }

  function stepLightbox(dir) {
    if (!lbImages.length) return;
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    showLightboxImage();
  }

  function bindLightboxTrigger(el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var raw = el.getAttribute('data-images') || '';
      var images = raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      var caption = el.getAttribute('data-caption') || '';
      openLightbox(images, 0, caption);
    });
  }

  document.querySelectorAll('.dir-media').forEach(bindLightboxTrigger);
  document.querySelectorAll('.project-media').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Zoom image: ' + (el.getAttribute('data-caption') || ''));
    bindLightboxTrigger(el);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { stepLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { stepLightbox(1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  /* ---------------------------------------------------------
     Branding gallery: simple slider
  --------------------------------------------------------- */
  var galleryTrack = document.getElementById('brandingTrack');
  var galleryDotsWrap = document.getElementById('galleryDots');
  var galleryPrevBtn = document.getElementById('galleryPrev');
  var galleryNextBtn = document.getElementById('galleryNext');

  if (galleryTrack) {
    var slides = Array.prototype.slice.call(galleryTrack.querySelectorAll('.gallery-slide'));
    var slideIndex = 0;
    var galleryTimer = null;

    slides.forEach(function (slide, idx) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show image ' + (idx + 1));
      dot.addEventListener('click', function () { goToSlide(idx, true); });
      if (galleryDotsWrap) galleryDotsWrap.appendChild(dot);
    });

    var dots = galleryDotsWrap ? Array.prototype.slice.call(galleryDotsWrap.children) : [];

    function goToSlide(idx, userInitiated) {
      slideIndex = (idx + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === slideIndex); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === slideIndex); });
      if (userInitiated) restartAutoplay();
    }

    function startAutoplay() {
      if (reduceMotion || slides.length < 2) return;
      galleryTimer = setInterval(function () { goToSlide(slideIndex + 1, false); }, 4500);
    }

    function restartAutoplay() {
      if (galleryTimer) clearInterval(galleryTimer);
      startAutoplay();
    }

    if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', function () { goToSlide(slideIndex - 1, true); });
    if (galleryNextBtn) galleryNextBtn.addEventListener('click', function () { goToSlide(slideIndex + 1, true); });

    goToSlide(0, false);
    startAutoplay();
  }

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
