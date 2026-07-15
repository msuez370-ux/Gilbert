const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT p.*, c.nom as categorie FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1 ORDER BY c.id, p.id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getBySlug = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT p.*, c.nom as categorie FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.is_active = 1', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  const { category_id, nom, slug, description, prix, stock, image, is_personnalisable } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (category_id, nom, slug, description, prix, stock, image, is_personnalisable) VALUES (?,?,?,?,?,?,?,?)',
      [category_id, nom, slug, description, prix, stock, image, is_personnalisable ? 1 : 0]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  const { nom, description, prix, stock, image, is_active } = req.body;
  try {
    await db.query('UPDATE products SET nom=?, description=?, prix=?, stock=?, image=?, is_active=? WHERE id=?',
      [nom, description, prix, stock, image, is_active, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
