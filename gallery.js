// ZiezGeek Aldevinc – Gallery Filter & Before/After Slider
// =============================================

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

