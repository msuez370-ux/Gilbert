const db = require('../config/db');

exports.submitOrder = async (req, res) => {
  const { diametre, quantite, texte_haut, texte_bas, notes_client, order_id } = req.body;
  const logo_path = req.file ? '/uploads/' + req.file.filename : null;
  try {
    const [result] = await db.query(
      'INSERT INTO custom_orders (order_id, diametre, quantite, texte_haut, texte_bas, logo_path, notes_client) VALUES (?,?,?,?,?,?,?)',
      [order_id || null, diametre, quantite, texte_haut, texte_bas, logo_path, notes_client]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT co.*, o.reference, o.client_nom, o.client_email FROM custom_orders co LEFT JOIN orders o ON co.order_id = o.id ORDER BY co.id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateBat = async (req, res) => {
  try {
    await db.query('UPDATE custom_orders SET statut_bat = ? WHERE id = ?', [req.body.statut_bat, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
