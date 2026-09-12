# Marketplace

Application de vente pour mettre en pratique le principe de CRUD

## Prérequis

- Node.js
- MySQL

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Renseigne dans `.env` : `JWT_SECRET`.

```bash
mysql -u root -p < src/db/schema.sql
npm run dev
```

L'API tourne sur `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Utilisation

1. **Créer un compte** sur `/register` (nom, email, mot de passe).
2. **Se connecter** sur `/login`, vous êtes redirigée vers `/products`.
3. Sur `/products` :
   - Tout le monde peut consulter la liste et filtrer par catégorie.
   - Une fois connectée, "Ajouter un produit" ouvre un formulaire (nom, description, prix, catégorie, statut).
   - Les boutons modifier/supprimer n'apparaissent que sur vos propres produits.
4. **Se déconnecter** via le bouton en haut de `/products`.