// ZiezGeek Aldevinc – Security Layer
// =============================================
'use strict';

// ===== INPUT SANITISATION =====
function sanitise(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;').replace(/`/g, '&#x60;').replace(/=/g, '&#x3D;')
    .trim();
}

function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+27|0)[6-8][0-9]{8}$/.test(cleaned);
}

function validateAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 50000;
}

// ===== RATE LIMITING =====
const _rateLimits = {};
function checkRateLimit(action, maxRequests = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (!_rateLimits[action]) _rateLimits[action] = [];
  _rateLimits[action] = _rateLimits[action].filter(t => now - t < windowMs);
  if (_rateLimits[action].length >= maxRequests) {
    showToast('⚠️ Too many attempts. Please wait a few minutes.');
    logSuspicious(`Rate limit hit: ${action}`);
    return false;
  }
  _rateLimits[action].push(now);
  return true;
}

// ===== SUSPICIOUS ACTIVITY LOGGER =====
const _securityLog = [];
function logSuspicious(event) {
  _securityLog.push({ event, time: new Date().toISOString() });
  console.warn('[ZiezGeek Security]', event);
  if (_securityLog.length >= 3) lockdownMode();
}

let _lockedDown = false;
function lockdownMode() {
  if (_lockedDown) return;
  _lockedDown = true;
  showToast('🔒 Suspicious activity detected. Please refresh.');
  document.querySelectorAll('button').forEach(btn => {
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 60000);
  });
  setTimeout(() => { _lockedDown = false; _securityLog.length = 0; }, 60000);
}

// ===== XSS PROTECTION =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type="text"], input[type="tel"], textarea')
    .forEach(input => {
      input.addEventListener('blur', () => {
        if (/<script|javascript:|on\w+=/i.test(input.value)) {
          input.value = '';
          showToast('⚠️ Invalid input detected and cleared.');
          logSuspicious(`XSS attempt in field: ${input.id}`);
        }
      });
    });

  // Set PayFast credentials at runtime
  const mid  = atob('MzIyMTg5NDM=');
  const mkey = atob('cm1tcG9qaHRwZHB2dg==');
  const midEl  = document.getElementById('pfMid');
  const mkeyEl = document.getElementById('pfMkey');
  if (midEl)  midEl.value  = mid;
  if (mkeyEl) mkeyEl.value = mkey;
});

// ===== SECURE BOOKING =====
const _originalSubmitBooking = window.submitBooking;
window.submitBooking = function() {
  if (!checkRateLimit('booking', 3)) return;
  const name    = sanitise(document.getElementById('bookName').value);
  const phone   = document.getElementById('bookPhone').value.trim();
  const device  = sanitise(document.getElementById('bookDevice').value);
  const service = sanitise(document.getElementById('bookService').value);
  const date    = document.getElementById('bookDate').value;
  const notes   = sanitise(document.getElementById('bookNotes').value);

  if (!name || name.length < 2) { showToast('⚠️ Enter a valid name.'); return; }
  if (!validatePhone(phone))    { showToast('⚠️ Enter a valid SA number.'); return; }
  if (!device)  { showToast('⚠️ Select a device.'); return; }
  if (!service) { showToast('⚠️ Select a service.'); return; }
  if (!date)    { showToast('⚠️ Select a date.'); return; }

  const selectedDate = new Date(date);
  const today = new Date(); today.setHours(0,0,0,0);
  if (selectedDate < today) { showToast('⚠️ Select a future date.'); return; }

  const formatted = selectedDate.toLocaleDateString('en-ZA', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  const msg =
    `🔧 *REPAIR BOOKING — ZiezGeek Aldevinc*\n\n` +
    `👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n` +
    `📲 *Device:* ${device}\n🛠️ *Service:* ${service}\n` +
    `📅 *Date:* ${formatted}\n` +
    (notes ? `📝 *Notes:* ${notes}\n` : '') +
    `\nPlease confirm my booking. Thank you!`;
  window.open(`https://wa.me/+27719549523?text=${encodeURIComponent(msg)}`, '_blank');
};

console.log('%c🔒 ZiezGeek Security Active', 'color:#00ff9d;font-weight:bold;');
