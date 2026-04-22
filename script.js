// ===== NAVIGATION =====
const pages = ['home','services','products','cart','reviews','founder','contact','payment'];
let currentPage = 'home';

function showPage(page) {
  document.getElementById('homePage').style.display = 'none';
  document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
  
  if (page === 'home') {
    goHome(); return;
  }
  const el = document.getElementById(page + 'Page');
  if (el) el.style.display = 'block';
  
  window.scrollTo({top:0,behavior:'smooth'});
  closeMobileMenu();
}

function goHome() {
  document.getElementById('homePage').style.display = 'block';
  document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
  window.scrollTo({top:0,behavior:'smooth'});
  closeMobileMenu();
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ===== CART =====
let cart = [];

function addToCart(name, price, btn) {
  cart.push({name: name, price: parseFloat(price)});
  updateCartUI();
  updateCartBadge();
  
  // Button feedback
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Added!';
  btn.style.background = 'linear-gradient(135deg,#00c853,#00e676)';
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
  }, 1500);
  
  showToast('✅ ' + name + ' added to cart!');
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (cart.length > 0) {
    badge.textContent = cart.length;
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }
}

function updateCartUI() {
  const cartDiv = document.getElementById('cartItems');
  const emptyDiv = document.getElementById('cartEmpty');
  const summaryDiv = document.getElementById('cartSummary');
  const countEl = document.getElementById('cartItemCount');
  
  cartDiv.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    emptyDiv.style.display = 'block';
    summaryDiv.classList.add('hidden');
    countEl.textContent = '0 items';
  } else {
    emptyDiv.style.display = 'none';
    summaryDiv.classList.remove('hidden');
    countEl.textContent = cart.length + ' item' + (cart.length !== 1 ? 's' : '');
    
    cart.forEach((item, index) => {
      total += item.price;
      cartDiv.innerHTML += `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${item.name}</div>
          </div>
          <div style="display:flex;align-items:center;gap:15px;">
            <span class="cart-item-price">R${item.price.toFixed(2)}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>`;
    });
  }

  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
  updateCartBadge();
  showToast('🗑️ Item removed from cart');
}

function checkoutCart() {
  if (cart.length === 0) { showToast('⚠️ Your cart is empty!'); return; }
  const items = cart.map(i => i.name).join(', ');
  const total = cart.reduce((s, i) => s + i.price, 0).toFixed(2);
  document.getElementById('payItem').value = items;
  document.getElementById('payAmount').value = total;
  document.getElementById('payDisplayAmount').textContent = total;
  document.getElementById('payItems').innerHTML = cart.map(i => `<div>• ${i.name} — R${i.price.toFixed(2)}</div>`).join('');
  showPage('payment');
}

// ===== FOUNDER TOGGLE =====
function toggleAbout(btn) {
  const content = document.getElementById('aboutContent');
  const isHidden = content.style.display !== 'block';
  content.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? 'Show Less' : 'Read Full Story';
}

// ===== FAQ =====
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const arrow = el.querySelector('.faq-arrow');
  const isOpen = answer.style.display === 'block';
  answer.style.display = isOpen ? 'none' : 'block';
  arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  el.style.color = isOpen ? '' : 'var(--neon)';
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

// ===== BOOKING =====
function submitBooking() {
  const name    = document.getElementById('bookName').value.trim();
  const phone   = document.getElementById('bookPhone').value.trim();
  const device  = document.getElementById('bookDevice').value;
  const service = document.getElementById('bookService').value;
  const date    = document.getElementById('bookDate').value;
  const notes   = document.getElementById('bookNotes').value.trim();

  if (!name || !phone || !device || !service || !date) {
    showToast('⚠️ Please fill in all required fields!');
    return;
  }

  const formatted = new Date(date).toLocaleDateString('en-ZA', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

  const msg = `🔧 *REPAIR BOOKING — ZiezGeek Aldevinc*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📱 *Phone:* ${phone}\n` +
    `📲 *Device:* ${device}\n` +
    `🛠️ *Service:* ${service}\n` +
    `📅 *Date:* ${formatted}\n` +
    (notes ? `📝 *Notes:* ${notes}\n` : '') +
    `\nPlease confirm my booking. Thank you!`;

  const url = `https://wa.me/+27719549523?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
// ===== GALLERY FILTER =====
function filterGallery(cat, btn) {
  document.querySelectorAll('.gfilter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ===== BEFORE/AFTER SLIDER =====
function startDrag(e, sliderId, beforeId, handleId) {
  e.preventDefault();
  const slider = document.getElementById(sliderId);
  const before = document.getElementById(beforeId);
  const handle = document.getElementById(handleId);

  function onMove(ev) {
    const rect = slider.getBoundingClientRect();
    const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
    let pct = (clientX - rect.left) / rect.width * 100;
    pct = Math.min(Math.max(pct, 5), 95);
    before.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  function onUp() {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);
}

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
