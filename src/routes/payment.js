const router = require('express').Router();
const db = require('../config/db');
const { createPaymentIntent } = require('../services/stripeService');

const FRAIS_PORT = 15;

// Le serveur recalcule TOUJOURS le montant depuis la base.
// Le client n'envoie que des identifiants et des quantites.
router.post('/stripe/intent', async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }
  if (items.length > 50) {
    return res.status(400).json({ error: 'Trop d articles' });
  }

  try {
    let sousTotal = 0;

    for (const item of items) {
      const quantite = parseInt(item.quantite, 10);
      if (!Number.isInteger(quantite) || quantite < 1 || quantite > 999) {
        return res.status(400).json({ error: 'Quantite invalide' });
      }

      if (item.custom) {
        // Cachet personnalise : prix fixe selon le diametre, jamais envoye par le client
        const diametre = String(item.diametre) === '25' ? '25' : '30';
        const prixCachet = diametre === '30' ? 90 : 80;
        sousTotal += prixCachet * quantite;
      } else {
        const id = parseInt(item.product_id, 10);
        if (!Number.isInteger(id)) {
          return res.status(400).json({ error: 'Produit invalide' });
        }
        const [rows] = await db.query(
          'SELECT prix FROM products WHERE id = ? AND is_active = 1',
          [id]
        );
        if (!rows.length) {
          return res.status(400).json({ error: 'Produit indisponible' });
        }
        sousTotal += Number(rows[0].prix) * quantite;
      }
    }

    if (sousTotal <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    const total = sousTotal + FRAIS_PORT;

    const intent = await createPaymentIntent(total, { source: 'jouve-ecommerce' });
    res.json({ clientSecret: intent.client_secret, total: total });
  } catch (e) {
    console.error('Erreur creation paiement :', e.message);
    res.status(500).json({ error: 'Impossible de creer le paiement' });
  }
});

// Expose la cle publique Stripe : un seul endroit a modifier en production
router.get("/config", (req, res) => {
  const sk = process.env.STRIPE_SECRET_KEY || "";
  res.json({
    publicKey: process.env.STRIPE_PUBLIC_KEY || "",
    diag: { skDebut: sk.slice(0,8), skLongueur: sk.length, skTirets: (sk.match(/-/g)||[]).length }
  });
});

module.exports = router;
