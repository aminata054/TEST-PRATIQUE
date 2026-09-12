const express = require("express");
const verifierToken = require("../config/auth");
const {
    listerProduits,
    obtenirProduit,
    creerProduit,
    modifierProduit,
    supprimerProduit,
} = require("../controllers/productController");

const router = express.Router();

// routes publiques 
router.get("/", listerProduits);
router.get("/:id", obtenirProduit);

// routes protégées 
router.post("/", verifierToken, creerProduit);
router.put("/:id", verifierToken, modifierProduit);
router.delete("/:id", verifierToken, supprimerProduit);

module.exports = router;