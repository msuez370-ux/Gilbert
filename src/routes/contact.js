const router = require('express').Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

router.post('/', async (req, res) => {
  const { nom, email, telephone, organisme, sujet, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont obligatoires' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide' });
  }

  try {
    await transporter.sendMail({
      from: '"Site Les Scelles Jouve" <' + process.env.SMTP_USER + '>',
      to: process.env.CONTACT_EMAIL || 'societejouve13@gmail.com',
      replyTo: email,
      subject: 'Nouveau message du site — ' + (sujet || 'Contact'),
      html: '<h2>Nouveau message depuis le site</h2>' +
        '<p><strong>Nom :</strong> ' + nom + '</p>' +
        '<p><strong>Email :</strong> ' + email + '</p>' +
        '<p><strong>Telephone :</strong> ' + (telephone || 'non renseigne') + '</p>' +
        '<p><strong>Organisme :</strong> ' + (organisme || 'non renseigne') + '</p>' +
        '<p><strong>Sujet :</strong> ' + (sujet || 'non renseigne') + '</p>' +
        '<hr>' +
        '<p><strong>Message :</strong></p>' +
        '<p>' + message.replace(/\n/g, '<br>') + '</p>'
    });
    res.json({ success: true });
  } catch (e) {
    console.log('Erreur envoi contact :', e.message);
    res.status(500).json({ error: 'Impossible d envoyer le message. Reessayez ou contactez-nous directement.' });
  }
});

module.exports = router;
