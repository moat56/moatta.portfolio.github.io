(function () {
  "use strict";

  /* ---------- Nav scroll style + scrollspy ---------- */
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('#navLinks a[data-nav]');
  var sectionIds = ['home', 'photography', 'video', 'research', 'about'];
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
        links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:' + nav.offsetHeight + 'px;left:0;right:0;background:#0a0a0a;padding:28px 40px;gap:26px;border-top:1px solid rgba(244,243,238,0.1);align-items:flex-start;';
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

  /* ---------- Video carousel arrows ---------- */
  var track = document.getElementById('videoTrack');
  var leftArrow = document.getElementById('arrowLeft');
  var rightArrow = document.getElementById('arrowRight');
  if (track && leftArrow && rightArrow) {
    var scrollByCard = function (dir) {
      var card = track.querySelector('.video-card');
      var gap = 26;
      var amount = (card ? card.offsetWidth : 260) + gap;
      track.scrollBy({ left: dir * amount * 2, behavior: 'smooth' });
    };
    leftArrow.addEventListener('click', function () { scrollByCard(-1); });
    rightArrow.addEventListener('click', function () { scrollByCard(1); });
  }

})();
