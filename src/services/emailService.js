const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.sendOrderConfirmation = async ({ reference, email, nom, items, total }) => {
  const lignes = items.map(i =>
    `<tr><td>${i.nom_produit}</td><td>${i.quantite}</td><td>${(i.prix_unitaire * i.quantite).toFixed(2)} €</td></tr>`
  ).join('');
  await transporter.sendMail({
    from: '"Les Scellés Jouve" <' + process.env.SMTP_USER + '>',
    to: email,
    subject: 'Confirmation commande ' + reference,
    html: '<h2>Merci ' + nom + ' !</h2><p>Votre commande <strong>' + reference + '</strong> a bien été reçue.</p><table border="1" cellpadding="6"><tr><th>Produit</th><th>Qté</th><th>Total</th></tr>' + lignes + '</table><p><strong>Total : ' + total.toFixed(2) + ' €</strong></p>'
  });
};

exports.sendBatNotification = async ({ email, nom, reference }) => {
  await transporter.sendMail({
    from: '"Les Scellés Jouve" <' + process.env.SMTP_USER + '>',
    to: email,
    subject: 'Bon à Tirer disponible — Commande ' + reference,
    html: '<h2>Votre BAT est prêt, ' + nom + '</h2><p>Votre Bon à Tirer pour la commande <strong>' + reference + '</strong> est disponible. Merci de le valider pour lancer la fabrication.</p>'
  });
};
