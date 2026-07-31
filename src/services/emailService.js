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

// Alerte Gilbert qu'une commande de cachet personnalise est arrivee
exports.sendNouvelleCommandeCachet = async ({ reference, client_nom, client_email, cachets }) => {
  const destinataire = process.env.CONTACT_EMAIL || 'societejouve13@gmail.com';

  const lignes = cachets.map(c =>
    '<li style="margin-bottom:10px">' +
    '<strong>Cachet &Oslash; ' + c.diametre + ' mm</strong> &mdash; quantit&eacute; : ' + c.quantite + '<br>' +
    'Ligne du haut : ' + (c.texte_haut || '&mdash;') + '<br>' +
    'Ligne du bas : ' + (c.texte_bas || '&mdash;') + '<br>' +
    'Logo : ' + (c.logo_path ? 'fourni par le client' : 'aucun') +
    (c.notes_client ? '<br>Notes : ' + c.notes_client : '') +
    '</li>'
  ).join('');

  await transporter.sendMail({
    from: '"Site Les Scelles Jouve" <' + process.env.SMTP_USER + '>',
    to: destinataire,
    subject: 'Nouvelle commande de cachet a graver — ' + reference,
    html:
      '<h2>Nouvelle commande de cachet personnalis&eacute;</h2>' +
      '<p><strong>R&eacute;f&eacute;rence :</strong> ' + reference + '</p>' +
      '<p><strong>Client :</strong> ' + client_nom + ' (' + client_email + ')</p>' +
      '<h3>Cachet(s) &agrave; graver</h3>' +
      '<ul>' + lignes + '</ul>' +
      '<p>Connectez-vous &agrave; votre espace de gestion pour consulter le logo et pr&eacute;parer le BAT.</p>' +
      '<p style="color:#888;font-size:13px">D&eacute;lai annonc&eacute; au client : 6 jours ouvr&eacute;s.</p>'
  });
};
