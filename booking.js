// ZiezGeek Aldevinc – Booking Form
// =============================================

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