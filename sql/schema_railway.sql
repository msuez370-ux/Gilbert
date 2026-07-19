-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: tokaido.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin@jouve-scelles.fr','$2a$10$S/L50/AcXmVQ5exQBa7mXuBa0IwLbDkWnNGFXIk8Df7OK6yoFbU/.','2026-07-15 13:25:09');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Sceaux & Cachets','sceaux-cachets'),(2,'Scellés Flash','scelles-flash'),(3,'Briquets & Gaz','briquets-gaz'),(4,'Malettes','malettes'),(5,'Cire','cire');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_orders`
--

DROP TABLE IF EXISTS `custom_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `diametre` enum('25','30') NOT NULL,
  `quantite` int NOT NULL DEFAULT '1',
  `texte_haut` varchar(100) DEFAULT NULL,
  `texte_bas` varchar(100) DEFAULT NULL,
  `logo_path` varchar(500) DEFAULT NULL,
  `statut_bat` enum('en_attente','envoye','valide','refuse') DEFAULT 'en_attente',
  `notes_client` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `custom_orders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_orders`
--

LOCK TABLES `custom_orders` WRITE;
/*!40000 ALTER TABLE `custom_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `nom_produit` varchar(255) NOT NULL,
  `quantite` int NOT NULL DEFAULT '1',
  `prix_unitaire` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `client_nom` varchar(255) NOT NULL,
  `client_email` varchar(255) NOT NULL,
  `client_tel` varchar(30) DEFAULT NULL,
  `client_adresse` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `statut` enum('en_attente','payee','en_preparation','expediee','livree','annulee') DEFAULT 'en_attente',
  `payment_method` enum('stripe','paypal','virement') NOT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prix_supplement` decimal(10,2) DEFAULT '0.00',
  `stock` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `prix` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stock` int DEFAULT '0',
  `image` varchar(500) DEFAULT NULL,
  `is_personnalisable` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,3,'BELFLAM — Gaz 120 ml','belflam-gaz-120ml','Recharge de gaz 120 ml pour briquets chalumeau, qualité pro pour la pose de scellés.',8.70,100,'https://societejouve.fr/wp-content/uploads/2025/12/IMG_1773-1-557x1024.jpeg',0,1,'2026-07-15 13:25:09'),(2,1,'SCEAU LAITON personnalisable — Ø 30 mm','sceau-laiton-30mm','Sceau en laiton personnalisable. Tête laiton + manche bouleau. Longueur totale ≈ 87 mm. Tampon amovible. Un BAT est envoyé avant gravure définitive.',90.00,50,'https://societejouve.fr/wp-content/uploads/2025/11/image-1-e1765898511728-582x1024.jpg',1,1,'2026-07-15 13:25:09'),(3,1,'SCEAU LAITON personnalisable — Ø 25 mm','sceau-laiton-25mm','Sceau en laiton personnalisable. Tête laiton + manche bouleau. Longueur totale ≈ 87 mm. Tampon amovible. Un BAT est envoyé avant gravure définitive.',80.00,50,'https://societejouve.fr/wp-content/uploads/2025/11/image-1-e1765898511728-582x1024.jpg',1,1,'2026-07-15 13:25:09'),(4,1,'SCEAU MARIANNE OFFICIEL — Ø 30 mm','sceau-marianne-30mm','Modèle officiel avec effigie Marianne, laiton, manche bois vernis — usage administratif et officiel.',90.00,30,'https://societejouve.fr/wp-content/uploads/2025/11/ChatGPT-Image-20-nov.-2025-11_39_12.png',0,1,'2026-07-15 13:25:09'),(5,1,'SCEAU MARIANNE OFFICIEL — Ø 25 mm','sceau-marianne-25mm','Modèle officiel avec effigie Marianne, laiton, manche bois vernis — usage administratif et officiel.',80.00,30,'https://societejouve.fr/wp-content/uploads/2025/11/ChatGPT-Image-20-nov.-2025-11_39_12.png',0,1,'2026-07-15 13:25:09'),(6,1,'SCEAU FUNÉRAIRE — Ø 30 mm','sceau-funeraire-30mm','Modèle dédié aux pompes funèbres, laiton, manche bois vernis.',90.00,30,'https://societejouve.fr/wp-content/uploads/2025/11/Cachet-de-cire-et-document-antique.png',0,1,'2026-07-15 13:25:09'),(7,1,'SCEAU FUNÉRAIRE — Ø 25 mm','sceau-funeraire-25mm','Modèle dédié aux pompes funèbres, laiton, manche bois vernis.',80.00,30,'https://societejouve.fr/wp-content/uploads/2025/11/Cachet-de-cire-et-document-antique.png',0,1,'2026-07-15 13:25:09'),(8,2,'SCELLÉS FLASH — tube de 30 pastilles','scelles-flash-tube','Pose instantanée du scellé, cire officielle cassante — pas besoin de faire fondre de la cire classique.',30.00,200,'/img/produits/scelles-flash-tube.jpg',0,1,'2026-07-15 13:25:09'),(9,2,'Pack SCELLÉS FLASH — 3 tubes + briquet + gaz','pack-scelles-flash-complet','Pack complet prêt à l\'emploi : 3 tubes de 30 pastilles + briquet chalumeau + recharge gaz 120 ml.',80.00,50,'/img/produits/pack-scelles-flash-complet.jpg',0,1,'2026-07-15 13:25:09'),(10,2,'SCELLÉS FLASH — les 5 tubes','scelles-flash-5-tubes','5 tubes de 30 pastilles Scellés Flash. Pose instantanée.',125.00,80,'/img/produits/scelles-flash-5-tubes.jpg',0,1,'2026-07-15 13:25:09'),(11,3,'CHALUMEAU JET','chalumeau-jet','Métal et PVC, flamme réglable, cran de sécurité.',19.90,60,'https://societejouve.fr/wp-content/uploads/2025/12/Mechero-y-marmol-negro-detalles-2-683x1024.png',0,1,'2026-07-15 13:25:09'),(12,3,'BRIQUET CHALUMEAU ECO','briquet-chalumeau-eco','Flamme réglable très puissante.',14.50,80,'https://societejouve.fr/wp-content/uploads/2025/12/Encendedores-y-llama-azul-sobre-marmol.png',0,1,'2026-07-15 13:25:09'),(13,3,'BRIQUET CHALUMEAU METAL LUX','briquet-chalumeau-metal-lux','Livré dans un élégant coffret cadeau. Flamme réglable ultra puissante, précise et rapide. Témoin de niveau de charge de gaz.',35.00,40,'https://societejouve.fr/wp-content/uploads/2025/12/IMG_0509-686x1024.jpeg',0,1,'2026-07-15 13:25:09'),(14,4,'MALETTE D\'INTERVENTION LUX','malette-intervention-lux','Coffret complet : 1 tube scellés Flash + 1 sceau laiton personnalisé + 1 recharge gaz 120 ml + 1 briquet chalumeau Métal LUX.',180.00,20,'https://societejouve.fr/wp-content/uploads/2025/12/file_0000000046c071f4876253b97e65efab-1-683x1024.png',1,1,'2026-07-15 13:25:09'),(15,4,'MALETTE D\'INTERVENTION ECO','malette-intervention-eco','Coffret complet : 1 tube scellés Flash + 1 sceau laiton personnalisé + 1 recharge gaz 120 ml + 1 briquet chalumeau ECO.',149.00,20,'/img/produits/malette-intervention-eco.jpg',1,1,'2026-07-15 13:25:09'),(16,5,'BOÎTE DE 10 BÂTONS DE CIRE ADMINISTRATIVE','batons-cire-cacheter','Bâtons de cire classiques pour la pose de sceaux.',39.00,100,'https://societejouve.fr/wp-content/uploads/2025/12/IMG_0510.jpeg',0,1,'2026-07-15 13:25:09');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 13:37:36
