const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const SALT_ROUNDS = 10;

const inscription = async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const [existantes] = await pool.query(
            "SELECT id FROM vendeuses WHERE email = ?",
            [email]
        );
        if (existantes.length > 0) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        const motDePasseHache = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);

        const [resultat] = await pool.query(
            "INSERT INTO vendeuses (nom, email, mot_de_passe) VALUES (?, ?, ?)",
            [nom, email, motDePasseHache]
        );

        const token = jwt.sign(
            { id: resultat.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.status(201).json({
            vendeuse: { id: resultat.insertId, nom, email },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};

const connexion = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM vendeuses WHERE email = ?",
            [email]
        );
        const vendeuse = rows[0];

        if (!vendeuse) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        const motDePasseValide = await bcrypt.compare(
            mot_de_passe,
            vendeuse.mot_de_passe
        );
        if (!motDePasseValide) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        const token = jwt.sign(
            { id: vendeuse.id, email: vendeuse.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({
            vendeuse: { id: vendeuse.id, nom: vendeuse.nom, email: vendeuse.email },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
};

module.exports = { inscription, connexion };