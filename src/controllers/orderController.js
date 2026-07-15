const db = require('../config/db');
const { sendOrderConfirmation } = require('../services/emailService');

function generateRef() {
  return 'JV-' + Date.now().toString(36).toUpperCase();
}

exports.create = async (req, res) => {
  const { client, items, payment_method, payment_id, frais_port } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const produits = items.filter(i => !i.custom);
    const cachets = items.filter(i => i.custom);

   const sousTotal = items.reduce((sum, i) => sum + Number(i.prix_unitaire) * i.quantite, 0);
    const total = sousTotal + (Number(frais_port) || 0);
    const ref = generateRef();

    const [order] = await conn.query(
      'INSERT INTO orders (reference, client_nom, client_email, client_tel, client_adresse, total, payment_method, payment_id, statut) VALUES (?,?,?,?,?,?,?,?,?)',
      [ref, client.nom, client.email, client.tel, client.adresse, total, payment_method, payment_id, 'payee']
    );
    const orderId = order.insertId;

    for (const item of produits) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, variant_id, nom_produit, quantite, prix_unitaire) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id, item.variant_id || null, item.nom_produit, item.quantite, item.prix_unitaire]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantite, item.product_id]);
    }

    for (const c of cachets) {
      await conn.query(
        'INSERT INTO custom_orders (order_id, diametre, quantite, texte_haut, texte_bas, logo_path, notes_client) VALUES (?,?,?,?,?,?,?)',
        [orderId, c.custom.diametre, c.quantite, c.custom.texte_haut, c.custom.texte_bas, c.custom.logo_path || null, c.custom.notes || null]
      );
    }

    await conn.commit();
    conn.release();

    try {
      await sendOrderConfirmation({ reference: ref, email: client.email, nom: client.nom, items, total });
    } catch (mailErr) {
      console.log('Email non envoye (SMTP non configure) :', mailErr.message);
    }

    res.json({ success: true, reference: ref, order_id: orderId });
  } catch (e) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order.length) return res.status(404).json({ error: 'Commande introuvable' });
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ ...order[0], items });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    await db.query('UPDATE orders SET statut = ? WHERE id = ?', [req.body.statut, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
