-- Base de données
CREATE DATABASE IF NOT EXISTS marketplace CHARACTER SET utf8mb4;
USE marketplace;

-- vendeuses 
CREATE TABLE IF NOT EXISTS vendeuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- produits
CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  description TEXT,
  prix DECIMAL(10, 2) NOT NULL,
  categorie VARCHAR(100) NOT NULL,
  vendeuse_id INT NOT NULL,
  statut ENUM('disponible', 'vendu') NOT NULL DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendeuse_id) REFERENCES vendeuses(id) ON DELETE CASCADE
);

CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'passer';
GRANT ALL PRIVILEGES ON marketplace.* TO 'marketplace_user'@'localhost';