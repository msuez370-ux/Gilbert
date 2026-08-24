const db = require('../config/db');
const { sendOrderConfirmation, sendNouvelleCommandeCachet } = require('../services/emailService');
const { tracer, adresseIp } = require('../services/journalService');

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

    // Prix verifies en base : on ignore ce que le client annonce
    let sousTotal = 0;
    for (const item of items) {
      const q = parseInt(item.quantite, 10);
      if (!Number.isInteger(q) || q < 1 || q > 999) throw new Error("Quantite invalide");
      if (item.custom) {
        const prixCachet = String(item.custom.diametre) === "25" ? 80 : 90;
        item.prix_unitaire = prixCachet;
        sousTotal += prixCachet * q;
      } else {
        const [p] = await conn.query("SELECT prix FROM products WHERE id = ? AND is_active = 1", [item.product_id]);
        if (!p.length) throw new Error("Produit indisponible");
        item.prix_unitaire = Number(p[0].prix);
        sousTotal += item.prix_unitaire * q;
      }
    }
    const total = sousTotal + 15;
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
    await tracer({ type: 'commande', message: total.toFixed(2) + ' EUR - ' + items.length + ' article(s)', email: client.email, ip: adresseIp(req), reference: ref });
    conn.release();

    try {
      // Genere la facture et la joint a la confirmation
      let facturePdf = null, factureNumero = null;
      try {
        const { genererFacture } = require("../services/documentService");
        const doc = await genererFacture(orderId);
        facturePdf = doc.buffer;
        factureNumero = doc.numero;
      } catch (docErr) {
        console.log("Facture non generee :", docErr.message);
      }

      await sendOrderConfirmation({ reference: ref, email: client.email, nom: client.nom, items, total, facturePdf, factureNumero });
      if (cachets.length) {
        await sendNouvelleCommandeCachet({
          reference: ref,
          client_nom: client.nom,
          client_email: client.email,
          cachets: cachets.map(c => ({
            diametre: c.custom.diametre,
            quantite: c.quantite,
            texte_haut: c.custom.texte_haut,
            texte_bas: c.custom.texte_bas,
            logo_path: c.custom.logo_path,
            notes_client: c.custom.notes
          }))
        });
      }
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
