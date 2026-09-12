const pool = require("../config/db");

const listerProduits = async (req, res) => {
    const { categorie } = req.query;

    try {
        const [rows] = categorie
            ? await pool.query("SELECT * FROM produits WHERE categorie = ? ORDER BY created_at DESC", [categorie])
            : await pool.query("SELECT * FROM produits ORDER BY created_at DESC");

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

const obtenirProduit = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM produits WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Produit introuvable." });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

const creerProduit = async (req, res) => {
    const { nom, description, prix, categorie, statut } = req.body;

    if (!nom || !prix || !categorie) {
        return res
            .status(400)
            .json({ message: "Nom, prix et catégorie sont requis." });
    }

    try {
        const [resultat] = await pool.query(
            `INSERT INTO produits (nom, description, prix, categorie, vendeuse_id, statut)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nom,
                description || null,
                prix,
                categorie,
                req.vendeuse.id, 
                statut || "disponible",
            ]
        );

        const [nouveauProduit] = await pool.query(
            "SELECT * FROM produits WHERE id = ?",
            [resultat.insertId]
        );

        res.status(201).json(nouveauProduit[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la création." });
    }
};

// pour verifier que le produit existe et appartient à la vendeuse connectée
const verifierPropriete = async (produitId, vendeuseId) => {
    const [rows] = await pool.query("SELECT * FROM produits WHERE id = ?", [
        produitId,
    ]);
    if (rows.length === 0) return { erreur: 404, message: "Produit introuvable." };
    if (rows[0].vendeuse_id !== vendeuseId) {
        return { erreur: 403, message: "Vous n'êtes pas propriétaire de ce produit." };
    }
    return { produit: rows[0] };
};

const modifierProduit = async (req, res) => {
    const { id } = req.params;
    const { nom, description, prix, categorie, statut } = req.body;

    try {
        const verification = await verifierPropriete(id, req.vendeuse.id);
        if (verification.erreur) {
            return res.status(verification.erreur).json({ message: verification.message });
        }

        await pool.query(
            `UPDATE produits
       SET nom = ?, description = ?, prix = ?, categorie = ?, statut = ?
       WHERE id = ?`,
            [
                nom ?? verification.produit.nom,
                description ?? verification.produit.description,
                prix ?? verification.produit.prix,
                categorie ?? verification.produit.categorie,
                statut ?? verification.produit.statut,
                id,
            ]
        );

        const [produitMisAJour] = await pool.query(
            "SELECT * FROM produits WHERE id = ?",
            [id]
        );
        res.json(produitMisAJour[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la modification." });
    }
};

const supprimerProduit = async (req, res) => {
    const { id } = req.params;

    try {
        const verification = await verifierPropriete(id, req.vendeuse.id);
        if (verification.erreur) {
            return res.status(verification.erreur).json({ message: verification.message });
        }

        await pool.query("DELETE FROM produits WHERE id = ?", [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la suppression." });
    }
};

module.exports = {
    listerProduits,
    obtenirProduit,
    creerProduit,
    modifierProduit,
    supprimerProduit,
};