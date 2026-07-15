CREATE DATABASE IF NOT EXISTS jouve_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jouve_ecommerce;

-- Admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catégories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- Produits
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  nom VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT DEFAULT 0,
  image VARCHAR(500),
  is_personnalisable TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Variantes (ex: 25mm / 30mm)
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prix_supplement DECIMAL(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Commandes
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) NOT NULL UNIQUE,
  client_nom VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_tel VARCHAR(30),
  client_adresse TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente','payee','en_preparation','expediee','livree','annulee') DEFAULT 'en_attente',
  payment_method ENUM('stripe','paypal','virement') NOT NULL,
  payment_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT,
  nom_produit VARCHAR(255) NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Commandes personnalisées (configurateur)
CREATE TABLE IF NOT EXISTS custom_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  diametre ENUM('25','30') NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  texte_haut VARCHAR(100),
  texte_bas VARCHAR(100),
  logo_path VARCHAR(500),
  statut_bat ENUM('en_attente','envoye','valide','refuse') DEFAULT 'en_attente',
  notes_client TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Catégories
INSERT IGNORE INTO categories (nom, slug) VALUES
  ('Sceaux & Cachets', 'sceaux-cachets'),
  ('Scellés Flash', 'scelles-flash'),
  ('Briquets & Gaz', 'briquets-gaz'),
  ('Malettes', 'malettes'),
  ('Cire', 'cire');

-- Produits
INSERT IGNORE INTO products (category_id, nom, slug, description, prix, stock, image, is_personnalisable, is_active) VALUES
(3, 'BELFLAM — Gaz 120 ml', 'belflam-gaz-120ml', 'Recharge de gaz 120 ml pour briquets chalumeau, qualité pro pour la pose de scellés.', 8.70, 100, 'https://societejouve.fr/wp-content/uploads/2025/12/IMG_1773-1-557x1024.jpeg', 0, 1),
(1, 'SCEAU LAITON personnalisable — Ø 30 mm', 'sceau-laiton-30mm', 'Sceau en laiton personnalisable. Tête laiton + manche bouleau. Longueur totale ≈ 87 mm. Tampon amovible. Un BAT est envoyé avant gravure définitive.', 90.00, 50, 'https://societejouve.fr/wp-content/uploads/2025/11/image-1-e1765898511728-582x1024.jpg', 1, 1),
(1, 'SCEAU LAITON personnalisable — Ø 25 mm', 'sceau-laiton-25mm', 'Sceau en laiton personnalisable. Tête laiton + manche bouleau. Longueur totale ≈ 87 mm. Tampon amovible. Un BAT est envoyé avant gravure définitive.', 80.00, 50, 'https://societejouve.fr/wp-content/uploads/2025/11/image-1-e1765898511728-582x1024.jpg', 1, 1),
(1, 'SCEAU MARIANNE OFFICIEL — Ø 30 mm', 'sceau-marianne-30mm', 'Modèle officiel avec effigie Marianne, laiton, manche bois vernis — usage administratif et officiel.', 90.00, 30, 'https://societejouve.fr/wp-content/uploads/2025/11/ChatGPT-Image-20-nov.-2025-11_39_12.png', 0, 1),
(1, 'SCEAU MARIANNE OFFICIEL — Ø 25 mm', 'sceau-marianne-25mm', 'Modèle officiel avec effigie Marianne, laiton, manche bois vernis — usage administratif et officiel.', 80.00, 30, 'https://societejouve.fr/wp-content/uploads/2025/11/ChatGPT-Image-20-nov.-2025-11_39_12.png', 0, 1),
(1, 'SCEAU FUNÉRAIRE — Ø 30 mm', 'sceau-funeraire-30mm', 'Modèle dédié aux pompes funèbres, laiton, manche bois vernis.', 90.00, 30, 'https://societejouve.fr/wp-content/uploads/2025/11/Cachet-de-cire-et-document-antique.png', 0, 1),
(1, 'SCEAU FUNÉRAIRE — Ø 25 mm', 'sceau-funeraire-25mm', 'Modèle dédié aux pompes funèbres, laiton, manche bois vernis.', 80.00, 30, 'https://societejouve.fr/wp-content/uploads/2025/11/Cachet-de-cire-et-document-antique.png', 0, 1),
(2, 'SCELLÉS FLASH — tube de 30 pastilles', 'scelles-flash-tube', 'Pose instantanée du scellé, cire officielle cassante — pas besoin de faire fondre de la cire classique.', 30.00, 200, NULL, 0, 1),
(2, 'Pack SCELLÉS FLASH — 3 tubes + briquet + gaz', 'pack-scelles-flash-complet', 'Pack complet prêt à l\'emploi : 3 tubes de 30 pastilles + briquet chalumeau + recharge gaz 120 ml.', 80.00, 50, NULL, 0, 1),
(2, 'SCELLÉS FLASH — les 5 tubes', 'scelles-flash-5-tubes', '5 tubes de 30 pastilles Scellés Flash. Pose instantanée.', 125.00, 80, 'https://societejouve.fr/wp-content/uploads/2025/12/Tubes-ALES-FLASH-en-pleine-lumiere.png', 0, 1),
(3, 'CHALUMEAU JET', 'chalumeau-jet', 'Métal et PVC, flamme réglable, cran de sécurité.', 19.90, 60, 'https://societejouve.fr/wp-content/uploads/2025/12/Mechero-y-marmol-negro-detalles-2-683x1024.png', 0, 1),
(3, 'BRIQUET CHALUMEAU ECO', 'briquet-chalumeau-eco', 'Flamme réglable très puissante.', 14.50, 80, 'https://societejouve.fr/wp-content/uploads/2025/12/Encendedores-y-llama-azul-sobre-marmol.png', 0, 1),
(3, 'BRIQUET CHALUMEAU METAL LUX', 'briquet-chalumeau-metal-lux', 'Livré dans un élégant coffret cadeau. Flamme réglable ultra puissante, précise et rapide. Témoin de niveau de charge de gaz.', 35.00, 40, 'https://societejouve.fr/wp-content/uploads/2025/12/IMG_0509-686x1024.jpeg', 0, 1),
(4, 'MALETTE D\'INTERVENTION LUX', 'malette-intervention-lux', 'Coffret complet : 1 tube scellés Flash + 1 sceau laiton personnalisé + 1 recharge gaz 120 ml + 1 briquet chalumeau Métal LUX.', 0.00, 20, 'https://societejouve.fr/wp-content/uploads/2025/12/file_0000000046c071f4876253b97e65efab-1-683x1024.png', 1, 1),
(4, 'MALETTE D\'INTERVENTION ECO', 'malette-intervention-eco', 'Coffret complet : 1 tube scellés Flash + 1 sceau laiton personnalisé + 1 recharge gaz 120 ml + 1 briquet chalumeau ECO.', 0.00, 20, NULL, 1, 1),
(5, 'BÂTONS DE CIRE À CACHETER', 'batons-cire-cacheter', 'Bâtons de cire classiques pour la pose de sceaux.', 0.00, 100, 'https://societejouve.fr/wp-content/uploads/2025/12/IMG_0510.jpeg', 0, 1);

-- Admin par défaut (password: Admin1234! — à changer)
INSERT IGNORE INTO admins (email, password) VALUES
  ('admin@jouve-scelles.fr', '$2a$10$S/L50/AcXmVQ5exQBa7mXuBa0IwLbDkWnNGFXIk8Df7OK6yoFbU/.');

-- Corrections images et prix (ajoutées après déploiement initial)
UPDATE products SET image='/img/produits/scelles-flash-tube.jpg' WHERE slug='scelles-flash-tube';
UPDATE products SET image='/img/produits/pack-scelles-flash-complet.jpg' WHERE slug='pack-scelles-flash-complet';
UPDATE products SET image='/img/produits/malette-intervention-eco.jpg' WHERE slug='malette-intervention-eco';
UPDATE products SET image='/img/produits/scelles-flash-5-tubes.jpg' WHERE slug='scelles-flash-5-tubes';
UPDATE products SET prix=39.00, nom='BOÎTE DE 10 BÂTONS DE CIRE ADMINISTRATIVE' WHERE slug='batons-cire-cacheter';
UPDATE products SET prix=180.00 WHERE slug='malette-intervention-lux';
UPDATE products SET prix=149.00 WHERE slug='malette-intervention-eco';
