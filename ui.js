// ZiezGeek Aldevinc – UI Animations, Scroll Reveal & Counters
// =============================================

// ===== VISUAL UPGRADES =====

// ── Progress bar on scroll ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';

  // Scroll-to-top button
  const btn = document.getElementById('scrollTop');
  if (scrolled > 300) btn.classList.add('show');
  else btn.classList.remove('show');
});

// ── Page transition animation ──
const _origShowPage = showPage;
window.showPage = function(page) {
  _origShowPage(page);
  const el = document.getElementById(page + 'Page');
  if (el) {
    el.classList.remove('page-enter');
    void el.offsetWidth; // force reflow
    el.classList.add('page-enter');
  }
  setActiveNav(page);
  triggerReveal();
};

const _origGoHome = goHome;
window.goHome = function() {
  _origGoHome();
  const el = document.getElementById('homePage');
  if (el) {
    el.classList.remove('page-enter');
    void el.offsetWidth;
    el.classList.add('page-enter');
  }
  setActiveNav('home');
  triggerReveal();
};

// ── Active nav highlight ──
function setActiveNav(page) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    const fn = a.getAttribute('onclick') || '';
    if (
      (page === 'home' && fn.includes('goHome')) ||
      fn.includes(`'${page}'`)
    ) {
      a.classList.add('nav-active');
    }
  });
}

// ── Mobile menu with overlay & hamburger animation ──
const _origToggle = toggleMobileMenu;
window.toggleMobileMenu = function() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  const overlay = document.getElementById('navOverlay');
  nav.classList.toggle('open');
  ham.classList.toggle('active');
  overlay.style.display = nav.classList.contains('open') ? 'block' : 'none';
};

const _origClose = closeMobileMenu;
window.closeMobileMenu = function() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  const overlay = document.getElementById('navOverlay');
  nav.classList.remove('open');
  ham.classList.remove('active');
  overlay.style.display = 'none';
};

// ── Scroll-reveal via IntersectionObserver ──
function triggerReveal() {
  setTimeout(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
  }, 50);
}

// ── Animated stat counters ──
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    if (isNaN(num)) return;
    el.classList.add('counting');
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = num / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        start = num;
        clearInterval(timer);
        el.classList.remove('counting');
      }
      el.textContent = (Number.isInteger(num) ? Math.floor(start) : start.toFixed(1)) + suffix;
    }, step);
  });
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav('home');
  triggerReveal();

  // Animate counters when stats strip enters view
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsStrip);
  }
});