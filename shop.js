// ZiezGeek Aldevinc – Shop, Cart & Checkout
// =============================================

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

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

