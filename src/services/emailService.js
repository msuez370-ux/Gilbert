const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 15000
});

const EXPEDITEUR = process.env.MAIL_FROM || "Les Scelles Jouve <contact@stejouve.fr>";

// Envoie via Resend si une cle API est presente, sinon via SMTP.
// Railway bloque les ports SMTP : en production, Resend est indispensable.
async function envoyer({ to, subject, html, replyTo }) {
  const destinataires = (Array.isArray(to) ? to : [to]).map(e => ({ email: e }));

  // Brevo en priorite : Railway bloque les ports SMTP sortants
  if (process.env.BREVO_API_KEY) {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Les Scelles Jouve", email: process.env.MAIL_FROM || "contact@stejouve.fr" },
        to: destinataires,
        subject,
        htmlContent: html,
        replyTo: replyTo ? { email: replyTo } : undefined
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      throw new Error("Brevo " + r.status + " : " + detail.slice(0, 200));
    }
    return;
  }

  // Repli SMTP pour le developpement local
  await transporter.sendMail({ from: EXPEDITEUR, to, subject, html, replyTo });
}

exports.sendOrderConfirmation = async ({ reference, email, nom, items, total }) => {
  const lignes = items.map(i =>
    `<tr><td>${i.nom_produit}</td><td>${i.quantite}</td><td>${(i.prix_unitaire * i.quantite).toFixed(2)} €</td></tr>`
  ).join('');
  await envoyer({
    to: email,
    subject: 'Confirmation commande ' + reference,
    html: '<h2>Merci ' + nom + ' !</h2><p>Votre commande <strong>' + reference + '</strong> a bien été reçue.</p><table border="1" cellpadding="6"><tr><th>Produit</th><th>Qté</th><th>Total</th></tr>' + lignes + '</table><p><strong>Total : ' + total.toFixed(2) + ' €</strong></p>'
  });
};

exports.sendBatNotification = async ({ email, nom, reference }) => {
  await envoyer({
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

  await envoyer({
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

// Formulaire de contact du site
exports.envoyerContact = async ({ nom, email, telephone, organisme, sujet, message }) => {
  const destinataire = process.env.CONTACT_EMAIL || 'contact@stejouve.fr';
  await envoyer({
    to: destinataire,
    replyTo: email,
    subject: 'Nouveau message du site — ' + (sujet || 'Contact'),
    html:
      '<h2>Nouveau message depuis le site</h2>' +
      '<p><strong>Nom :</strong> ' + nom + '</p>' +
      '<p><strong>Email :</strong> ' + email + '</p>' +
      '<p><strong>Telephone :</strong> ' + (telephone || 'non renseigne') + '</p>' +
      '<p><strong>Organisme :</strong> ' + (organisme || 'non renseigne') + '</p>' +
      '<p><strong>Sujet :</strong> ' + (sujet || 'non renseigne') + '</p>' +
      '<hr><p><strong>Message :</strong></p><p>' + String(message).replace(/\n/g, '<br>') + '</p>'
  });
};
