const express = require("express");
const { inscription, connexion } = require("../controllers/authController");

const router = express.Router();

router.post("/register", inscription);
router.post("/login", connexion);

module.exports = router;