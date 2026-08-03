const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tracer, adresseIp } = require('../services/journalService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) {
      await tracer({ type: 'login_echec', message: 'Compte inexistant', email, ip: adresseIp(req) });
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      await tracer({ type: 'login_echec', message: 'Mot de passe incorrect', email, ip: adresseIp(req) });
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ id: rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 28800000 });
    await tracer({ type: 'login_reussi', message: 'Connexion au back-office', email, ip: adresseIp(req) });
    res.json({ success: true, token });
  } catch (e) {
    console.error('Erreur login :', e.message);
    res.status(500).json({ error: 'Erreur de connexion' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
};
