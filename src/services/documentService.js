const PDFDocument = require('pdfkit');
const db = require('../config/db');

const V = {
  nom: 'Sté JOUVE',
  activite: 'Cire · Gravure · Scellés Flash',
  adresse: '47 rue Vivienne',
  cp: '75002 Paris',
  siren: '327 659 223',
  siret: process.env.JOUVE_SIRET || null,
  email: 'contact@stejouve.fr',
  tel: '06 77 76 06 69',
  tva: 'TVA non applicable, article 293 B du CGI'
};

const MARINE = '#1B2A44', OR = '#C9A24B', ROUGE = '#C0392B', GRIS = '#6B7280', LIGNE = '#E5E7EB';

// Numerotation sequentielle sans rupture. Series WEB et BL distinctes.
async function attribuerNumero(orderId, type) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [dejaLa] = await conn.query(
      'SELECT numero FROM documents WHERE order_id = ? AND type = ? FOR UPDATE', [orderId, type]);
    if (dejaLa.length) { await conn.commit(); conn.release(); return dejaLa[0].numero; }

    const annee = new Date().getFullYear();
    const prefixe = type === 'facture' ? 'WEB' : 'BL';
    const [dernier] = await conn.query(
      'SELECT rang FROM documents WHERE type = ? AND annee = ? ORDER BY rang DESC LIMIT 1 FOR UPDATE',
      [type, annee]);
    const rang = dernier.length ? dernier[0].rang + 1 : 1;
    const numero = prefixe + '-' + annee + '-' + String(rang).padStart(4, '0');

    await conn.query('INSERT INTO documents (order_id, type, numero, annee, rang) VALUES (?,?,?,?,?)',
      [orderId, type, numero, annee, rang]);
    await conn.commit(); conn.release();
    return numero;
  } catch (e) { await conn.rollback(); conn.release(); throw e; }
}

async function chargerCommande(orderId) {
  const [cs] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!cs.length) throw new Error('Commande introuvable');
  const [arts] = await db.query(
    'SELECT nom_produit, quantite, prix_unitaire FROM order_items WHERE order_id = ?', [orderId]);
  const [cachets] = await db.query(
    'SELECT diametre, quantite, texte_haut, texte_bas FROM custom_orders WHERE order_id = ?', [orderId]);

  const lignes = arts.map(a => ({
    designation: a.nom_produit, detail: null,
    quantite: a.quantite, prix: Number(a.prix_unitaire)
  }));
  cachets.forEach(c => {
    const t = [c.texte_haut, c.texte_bas].filter(Boolean).join(' / ');
    lignes.push({
      designation: 'Cachet laiton personnalisé Ø ' + c.diametre + ' mm',
      detail: t ? 'Gravure : ' + t : null,
      quantite: c.quantite,
      prix: String(c.diametre) === '25' ? 80 : 90
    });
  });
  return { cmd: cs[0], lignes };
}

function logo(doc, cx, cy, r) {
  doc.save();
  doc.circle(cx, cy, r).lineWidth(r * 0.019).strokeColor(OR).stroke();
  doc.circle(cx, cy, r * 0.88).lineWidth(r * 0.01).strokeColor(OR).stroke();
  doc.fillColor(OR).font('Helvetica-Bold').fontSize(r * 0.42)
     .text('JOUVE', cx - r, cy - r * 0.36, { width: r * 2, align: 'center', characterSpacing: r * 0.028 });
  doc.moveTo(cx - r * 0.47, cy + r * 0.09).lineTo(cx + r * 0.47, cy + r * 0.09)
     .lineWidth(r * 0.008).strokeColor(OR).opacity(0.55).stroke();
  doc.opacity(1);
  doc.fillColor(ROUGE).font('Helvetica-Bold').fontSize(r * 0.135)
     .text('SCELLÉS FLASH', cx - r, cy + r * 0.17, { width: r * 2, align: 'center', characterSpacing: r * 0.012 });
  doc.fillColor(OR).font('Helvetica-Bold').fontSize(r * 0.10)
     .text('CIRE · GRAVURE', cx - r, cy + r * 0.37, { width: r * 2, align: 'center', characterSpacing: r * 0.02 });
  doc.restore();
}

function enTete(doc, titre, numero, date) {
  doc.rect(0, 0, doc.page.width, 4).fill(OR);
  logo(doc, 82, 92, 34);
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(14).text(V.nom, 130, 62);
  doc.fillColor(GRIS).font('Helvetica').fontSize(8)
     .text(V.activite, 130, 79)
     .text(V.adresse + ' · ' + V.cp, 130, 94)
     .text('SIREN ' + V.siren + (V.siret ? ' · SIRET ' + V.siret : ''), 130, 106)
     .text(V.email + ' · ' + V.tel, 130, 118);
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(21)
     .text(titre, 340, 60, { width: 205, align: 'right' });
  doc.fillColor(GRIS).font('Helvetica').fontSize(9.5)
     .text('N° ' + numero, 340, 88, { width: 205, align: 'right' })
     .text(date, 340, 102, { width: 205, align: 'right' });
  doc.moveTo(50, 148).lineTo(545, 148).lineWidth(0.8).strokeColor(LIGNE).stroke();
}

function blocs(doc, y, cmd) {
  doc.fillColor(GRIS).font('Helvetica-Bold').fontSize(7).text('COMMANDE', 50, y, { characterSpacing: 0.5 });
  doc.fillColor(MARINE).font('Helvetica').fontSize(9.5).text(cmd.reference, 50, y + 14);
  doc.fillColor(GRIS).font('Helvetica').fontSize(8.5)
     .text('Passée le ' + new Date(cmd.created_at).toLocaleDateString('fr-FR'), 50, y + 30);

  doc.roundedRect(320, y - 10, 225, 86, 3).fillAndStroke('#FAFBFC', LIGNE);
  doc.fillColor(GRIS).font('Helvetica-Bold').fontSize(7).text('DESTINATAIRE', 334, y + 2, { characterSpacing: 0.5 });
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(10).text(cmd.client_nom || '', 334, y + 16, { width: 197 });
  doc.fillColor(GRIS).font('Helvetica').fontSize(8.5).text(cmd.client_adresse || '', 334, y + 32, { width: 197 });
  if (cmd.client_email) doc.fontSize(8).text(cmd.client_email, 334, y + 56, { width: 197 });
  return y + 86;
}

function tableau(doc, lignes, y, avecPrix) {
  const cq = avecPrix ? 335 : 470;
  doc.rect(50, y, 495, 20).fill(MARINE);
  doc.fillColor('#FFF').font('Helvetica-Bold').fontSize(8)
     .text('DÉSIGNATION', 60, y + 6.5).text('QTÉ', cq, y + 6.5, { width: 40, align: 'center' });
  if (avecPrix) doc.text('P.U.', 400, y + 6.5, { width: 60, align: 'right' })
                   .text('TOTAL', 470, y + 6.5, { width: 65, align: 'right' });
  y += 20; let st = 0;
  lignes.forEach((l, i) => {
    const h = l.detail ? 32 : 23;
    if (i % 2 === 0) doc.rect(50, y, 495, h).fill('#FBFBFC');
    doc.fillColor(MARINE).font('Helvetica').fontSize(9).text(l.designation, 60, y + 6, { width: 265 });
    if (l.detail) doc.fillColor(GRIS).font('Helvetica-Oblique').fontSize(7.5).text(l.detail, 60, y + 19, { width: 265 });
    doc.fillColor(MARINE).font('Helvetica').fontSize(9).text(String(l.quantite), cq, y + 6, { width: 40, align: 'center' });
    if (avecPrix) {
      const t = l.prix * l.quantite; st += t;
      doc.text(l.prix.toFixed(2) + ' €', 400, y + 6, { width: 60, align: 'right' })
         .text(t.toFixed(2) + ' €', 470, y + 6, { width: 65, align: 'right' });
    }
    y += h;
  });
  doc.moveTo(50, y).lineTo(545, y).lineWidth(0.8).strokeColor(LIGNE).stroke();
  return { y: y + 1, st };
}

function pied(doc) {
  const y = doc.page.height - 58;
  doc.page.margins.bottom = 0;
  doc.moveTo(50, y).lineTo(545, y).lineWidth(0.8).strokeColor(LIGNE).stroke();
  doc.fillColor(GRIS).font('Helvetica').fontSize(7)
     .text(V.nom + ' · ' + V.adresse + ', ' + V.cp + ' · SIREN ' + V.siren + ' · ' + V.email,
           50, y + 10, { width: 495, align: 'center' })
     .text(V.tva, 50, y + 21, { width: 495, align: 'center' });
}

function finaliser(doc) {
  const morceaux = [];
  doc.on('data', c => morceaux.push(c));
  return new Promise(res => doc.on('end', () => res(Buffer.concat(morceaux))));
}

async function genererFacture(orderId) {
  const { cmd, lignes } = await chargerCommande(orderId);
  const numero = await attribuerNumero(orderId, 'facture');
  const date = new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, autoFirstPage: true });
  const pret = finaliser(doc);

  enTete(doc, 'FACTURE', numero, date);
  let y = blocs(doc, 172, cmd) + 22;
  const r = tableau(doc, lignes, y, true);
  y = r.y + 14;
  const port = Math.max(0, Number(cmd.total) - r.st);

  doc.fillColor(GRIS).font('Helvetica').fontSize(9)
     .text('Sous-total', 320, y, { width: 140, align: 'right' })
     .text(r.st.toFixed(2) + ' €', 470, y, { width: 65, align: 'right' });
  y += 15;
  doc.text('Frais de port — Colissimo suivi', 300, y, { width: 160, align: 'right' })
     .text(port.toFixed(2) + ' €', 470, y, { width: 65, align: 'right' });
  y += 20;
  doc.rect(345, y, 200, 28).fill(MARINE);
  doc.fillColor('#FFF').font('Helvetica-Bold').fontSize(10.5)
     .text('TOTAL TTC', 355, y + 9, { width: 105, align: 'right' })
     .text(Number(cmd.total).toFixed(2) + ' €', 465, y + 9, { width: 70, align: 'right' });

  y += 46;
  const mode = cmd.payment_method === 'stripe' ? 'carte bancaire' : (cmd.payment_method || '');
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(8.5).text('Règlement', 50, y);
  doc.fillColor(GRIS).font('Helvetica').fontSize(8.5)
     .text('Facture réglée par ' + mode + ' le ' + date + '.', 50, y + 13);
  y += 36;
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(8.5).text('Mentions', 50, y);
  doc.fillColor(GRIS).font('Helvetica').fontSize(8).text(V.tva, 50, y + 13);
  doc.fillColor('#9CA3AF').font('Helvetica-Oblique').fontSize(7.5)
     .text('Les cachets gravés sur mesure ne font pas l\u2019objet du droit de rétractation (article L221-28 3° du Code de la consommation).',
           50, y + 26, { width: 400 });

  pied(doc); doc.end();
  return { buffer: await pret, numero };
}

async function genererBonLivraison(orderId) {
  const { cmd, lignes } = await chargerCommande(orderId);
  const numero = await attribuerNumero(orderId, 'livraison');
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, autoFirstPage: true });
  const pret = finaliser(doc);

  enTete(doc, 'BON DE LIVRAISON', numero, date);
  let y = blocs(doc, 172, cmd) + 22;
  const r = tableau(doc, lignes, y, false);
  y = r.y + 26;

  const nb = lignes.reduce((s, l) => s + l.quantite, 0);
  doc.roundedRect(50, y, 240, 44, 3).fillAndStroke('#FAFBFC', LIGNE);
  doc.fillColor(GRIS).font('Helvetica-Bold').fontSize(7).text('TOTAL COLIS', 62, y + 11, { characterSpacing: 0.5 });
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(13).text(nb + (nb > 1 ? ' articles' : ' article'), 62, y + 22);

  doc.roundedRect(305, y, 240, 44, 3).fillAndStroke('#FAFBFC', LIGNE);
  doc.fillColor(GRIS).font('Helvetica-Bold').fontSize(7).text('EXPÉDITION', 317, y + 11, { characterSpacing: 0.5 });
  doc.fillColor(MARINE).font('Helvetica-Bold').fontSize(13).text('Colissimo suivi', 317, y + 22);

  y += 72;
  doc.roundedRect(305, y, 240, 78, 3).strokeColor(LIGNE).lineWidth(0.8).stroke();
  doc.fillColor(GRIS).font('Helvetica-Bold').fontSize(7)
     .text('DATE ET SIGNATURE DU DESTINATAIRE', 317, y + 12, { width: 216, characterSpacing: 0.5 });

  pied(doc); doc.end();
  return { buffer: await pret, numero };
}

module.exports = { genererFacture, genererBonLivraison };
