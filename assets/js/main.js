(function () {
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll style + scrollspy ---------- */
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('#navLinks a[data-nav]');
  var sectionIds = ['home', 'photography', 'video', 'social', 'research', 'about', 'contact'];
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) { nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (sections.length && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.dataset.nav === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - (navH - 20);
        window.scrollTo({ top: top, behavior: 'smooth' });
        var mobileNav = document.getElementById('navLinks');
        var toggleBtn = document.getElementById('navToggle');
        if (mobileNav) mobileNav.classList.remove('open');
        if (toggleBtn) { toggleBtn.classList.remove('open'); toggleBtn.setAttribute('aria-expanded', 'false'); }
      }
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:' + nav.offsetHeight + 'px;left:0;right:0;background:var(--bg);padding:28px 40px;gap:26px;border-top:1px solid var(--line);align-items:flex-start;';
      } else {
        links.removeAttribute('style');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Photography gallery hover-dim ---------- */
  document.querySelectorAll('.marquee-wrap').forEach(function (wrap) {
    wrap.querySelectorAll('.photo-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () { wrap.classList.add('dimming'); });
      card.addEventListener('mouseleave', function () { wrap.classList.remove('dimming'); });
    });
  });

  /* ---------- Horizontal carousel arrows (Video + Social) ---------- */
  function initHorizontalCarousel(trackId, leftArrowId, rightArrowId, cardSelector) {
    var track = document.getElementById(trackId);
    var leftArrow = document.getElementById(leftArrowId);
    var rightArrow = document.getElementById(rightArrowId);
    if (!track || !leftArrow || !rightArrow) return;
    var gap = parseFloat(getComputedStyle(track).gap) || 26;
    function scrollByCard(dir) {
      var card = track.querySelector(cardSelector);
      var amount = (card ? card.offsetWidth : 260) + gap;
      track.scrollBy({ left: dir * amount * 2, behavior: 'smooth' });
    }
    leftArrow.addEventListener('click', function () { scrollByCard(-1); });
    rightArrow.addEventListener('click', function () { scrollByCard(1); });
  }
  initHorizontalCarousel('videoTrack', 'arrowLeft', 'arrowRight', '.video-card');
  initHorizontalCarousel('socialTrack', 'arrowLeftSocial', 'arrowRightSocial', '.social-card');

  /* ---------- Instagram-style multi-image cards ---------- */
  document.querySelectorAll('.social-card').forEach(function (card) {
    var slidesWrap = card.querySelector('.social-slides');
    var slides = card.querySelectorAll('.social-slide');
    var dots = card.querySelectorAll('.social-dot');
    var prevBtn = card.querySelector('.social-media-nav.prev');
    var nextBtn = card.querySelector('.social-media-nav.next');
    if (!slidesWrap || slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }
    var index = 0;
    function render() {
      slidesWrap.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }
    function go(delta) {
      index = (index + delta + slides.length) % slides.length;
      render();
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { index = i; render(); });
    });
  });

  /* ---------- Hero portrait scroll parallax ---------- */
  var heroImg = document.querySelector('.hero-portrait img');
  var heroSection = document.getElementById('home');
  if (heroImg && heroSection && !reduceMotion) {
    var ticking = false;
    var updateHeroParallax = function () {
      var rect = heroSection.getBoundingClientRect();
      var span = rect.height || window.innerHeight;
      var progress = Math.min(Math.max(-rect.top / span, 0), 1);
      var scale = 1.1 + progress * 0.12;
      var drift = progress * 26;
      heroImg.style.transform = 'scale(' + scale.toFixed(3) + ') translateY(' + drift.toFixed(1) + 'px)';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    }, { passive: true });
    updateHeroParallax();
  }

})();
