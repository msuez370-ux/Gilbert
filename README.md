# Les Scellés Jouve — Site e-commerce

Stack : Node.js / Express / MySQL / Stripe / PayPal

## Démarrage rapide (GitHub Codespace)

1. Ouvrir le repo dans un Codespace → l'environnement se configure automatiquement
2. Copier `.env.example` en `.env` et renseigner les clés API
3. `npm run dev` → le site est accessible sur le port 3000

## Structure

```
src/
  config/db.js          — Pool MySQL
  controllers/          — Logique métier
  middleware/           — Auth JWT + upload Multer
  routes/               — API REST
  services/             — Stripe, PayPal, emails
public/
  index.html            — Accueil + catalogue
  configurateur.html    — Module configurateur cachet
  js/configurateur.js   — Canvas preview temps réel
  js/cart.js            — Panier localStorage
sql/schema.sql          — BDD + 16 produits pré-chargés
```

## API

| Méthode | Route | Description |
|---|---|---|
| GET | /api/products | Liste tous les produits |
| GET | /api/products/:slug | Détail produit |
| POST | /api/orders | Créer une commande |
| POST | /api/configurateur/order | Commande personnalisée + upload logo |
| POST | /api/admin/login | Auth admin |
| GET | /api/admin/orders | Commandes (admin) |
| PATCH | /api/admin/orders/:id/bat | Statut BAT (admin) |

## Déploiement Railway

1. Connecter le repo GitHub à Railway
2. Ajouter les variables d'env dans Railway
3. Railway détecte automatiquement Node.js et lance `npm start`
