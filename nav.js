// ZiezGeek Aldevinc – Navigation & Mobile Menu
// =============================================

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

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}

