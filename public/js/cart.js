const Cart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  save() { localStorage.setItem('cart', JSON.stringify(this.items)); },
  add(product, qty = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) existing.quantite += qty;
    else this.items.push({ ...product, quantite: qty });
    this.save(); this.updateBadge();
  },
  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save(); this.updateBadge();
  },
  total() { return this.items.reduce((sum, i) => sum + i.prix * i.quantite, 0); },
  count() { return this.items.reduce((sum, i) => sum + i.quantite, 0); },
  clear() { this.items = []; this.save(); this.updateBadge(); },
  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = this.count();
  }
};
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());

// ===== Menu mobile : injecte le bouton burger sur toutes les pages =====
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const menu = nav.querySelector('ul');
  if (!menu) return;
  if (nav.querySelector('.burger')) return;

  const burger = document.createElement('button');
  burger.className = 'burger';
  burger.setAttribute('aria-label', 'Ouvrir le menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span><span></span><span></span>';

  const panier = nav.querySelector('.cart-icon');
  if (panier) nav.insertBefore(burger, panier);
  else nav.appendChild(burger);

  burger.addEventListener('click', function () {
    const ouvert = menu.classList.toggle('open');
    burger.classList.toggle('active', ouvert);
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function (lien) {
    lien.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
});
