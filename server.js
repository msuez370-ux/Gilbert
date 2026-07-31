require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Sécurité
// Railway place l app derriere un proxy : indispensable pour les cookies secure
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
// Origines autorisees : configurables sans toucher au code
const originsAutorisees = (process.env.CORS_ORIGINS || "https://gilbert-production-a768.up.railway.app")
  .split(",").map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? originsAutorisees : true,
  credentials: true
}));
// Protection contre la force brute sur la connexion admin (actif en dev ET en prod)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Reessayez dans 15 minutes." }
});
app.use("/api/admin/login", loginLimiter);

if (process.env.NODE_ENV === "production") {
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
}

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fichiers statiques
// Sitemap genere dynamiquement depuis la base
app.get("/sitemap.xml", async (req, res) => {
  try {
    const db = require("./src/config/db");
    const base = process.env.SITE_URL || (req.protocol + "://" + req.get("host"));
    const [produits] = await db.query("SELECT slug FROM products WHERE is_active = 1");
    const statiques = ["", "configurateur.html", "contact.html", "cgv.html", "mentions-legales.html"];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    statiques.forEach(p => {
      xml += "<url><loc>" + base + "/" + p + "</loc><changefreq>monthly</changefreq><priority>" + (p === "" ? "1.0" : "0.7") + "</priority></url>";
    });
    produits.forEach(p => {
      xml += "<url><loc>" + base + "/produit.html?slug=" + p.slug + "</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>";
    });
    xml += "</urlset>";
    res.set("Content-Type", "application/xml").send(xml);
  } catch (e) {
    res.status(500).send("Erreur sitemap");
  }
});

// Sert les fichiers stockes en base (persistants aux redeploiements)
app.get("/uploads/:nom", async (req, res, next) => {
  try {
    const db = require("./src/config/db");
    const [rows] = await db.query("SELECT contenu, type_mime FROM fichiers WHERE nom = ?", [req.params.nom]);
    if (!rows.length) return next();
    res.set("Content-Type", rows[0].type_mime);
    res.set("Cache-Control", "public, max-age=31536000");
    return res.send(rows[0].contenu);
  } catch (e) {
    return next();
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/payment', require('./src/routes/payment'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/configurateur', require('./src/routes/configurateur'));

// Webhook Stripe (raw body)
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const { constructWebhookEvent } = require('./src/services/stripeService');
  const sig = req.headers['stripe-signature'];
  try {
    const event = constructWebhookEvent(req.body, sig);
    if (event.type === 'payment_intent.succeeded') {
      console.log('Paiement Stripe confirmé :', event.data.object.id);
    }
    res.json({ received: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// SPA fallback — toutes les routes vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Les Scellés Jouve démarré sur http://localhost:${PORT}`);
});
