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
