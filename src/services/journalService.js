const db = require('../config/db');

// Enregistre un evenement. N'echoue jamais : la journalisation ne doit
// jamais empecher une action metier de se terminer.
async function tracer({ type, message, email, ip, reference }) {
  try {
    await db.query(
      'INSERT INTO journal (type, message, email, ip, reference) VALUES (?,?,?,?,?)',
      [
        String(type).slice(0, 50),
        message ? String(message).slice(0, 500) : null,
        email ? String(email).slice(0, 255) : null,
        ip ? String(ip).slice(0, 45) : null,
        reference ? String(reference).slice(0, 50) : null
      ]
    );
  } catch (e) {
    console.log('Journal indisponible :', e.message);
  }
}

// Recupere l adresse reelle du visiteur derriere le proxy Railway
function adresseIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.ip
    || req.connection?.remoteAddress
    || null;
}

module.exports = { tracer, adresseIp };
