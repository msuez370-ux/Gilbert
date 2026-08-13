const router = require('express').Router();
const { envoyerContact } = require('../services/emailService');



router.post('/', async (req, res) => {
  const { nom, email, telephone, organisme, sujet, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont obligatoires' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide' });
  }

  try {
    await envoyerContact({ nom, email, telephone, organisme, sujet, message });
    res.json({ success: true });
  } catch (e) {
    console.log('Erreur envoi contact :', e.message);
    res.status(500).json({ error: 'Impossible d envoyer le message. Reessayez ou contactez-nous directement.' });
  }
});

module.exports = router;
