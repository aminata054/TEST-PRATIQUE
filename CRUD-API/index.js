const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Création reussie",
    });
});

// Gestion des routes qui existent pas
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée." });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Serveur : http://localhost:${PORT}`);
});

