import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useAuth } from "../context/AuthContext"; 

const API_URL = "http://localhost:8000/api";

const normaliserProduit = (produit) => ({
  ...produit,
  vendeuseId: String(produit.vendeuse_id),
});

const Products = () => {
  const { token, vendeuse, estConnectee, logout } = useAuth();

  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);

  // liste publique de produits
  useEffect(() => {
    const chargerProduits = async () => {
      try {
        const reponse = await fetch(`${API_URL}/products`);
        const donnees = await reponse.json();
        if (!reponse.ok) throw new Error(donnees.message || "Erreur de chargement.");
        setProduits(donnees.map(normaliserProduit));
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };
    chargerProduits();
  }, []);

  const categories = ["Toutes", ...new Set(produits.map((p) => p.categorie))];

  const produitsAffiches =
    filtreCategorie === "Toutes"
      ? produits
      : produits.filter((p) => p.categorie === filtreCategorie);

  const ouvrirAjout = () => {
    setProduitEnEdition(null);
    setModalOuvert(true);
  };

  const ouvrirEdition = (produit) => {
    setProduitEnEdition(produit);
    setModalOuvert(true);
  };

  const supprimerProduit = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      const reponse = await fetch(`${API_URL}/produits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!reponse.ok) {
        const donnees = await reponse.json();
        throw new Error(donnees.message || "Suppression impossible.");
      }

      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const sauvegarderProduit = async (donnees) => {
    const estModification = Boolean(produitEnEdition);
    const url = estModification
      ? `${API_URL}/products/${produitEnEdition.id}`
      : `${API_URL}/products`;

    try {
      const reponse = await fetch(url, {
        method: estModification ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donnees), 
      });

      const produitRetourne = await reponse.json();
      if (!reponse.ok) throw new Error(produitRetourne.message || "Enregistrement impossible.");

      const produitNormalise = normaliserProduit(produitRetourne);

      setProduits((prev) =>
        estModification
          ? prev.map((p) => (p.id === produitNormalise.id ? produitNormalise : p))
          : [produitNormalise, ...prev]
      );

      setModalOuvert(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1115] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#E8E9EC] mb-1.5 tracking-tight">
              Marketplace
            </h1>
            <p className="text-sm text-[#8A8F98]">
              {produitsAffiches.length} article{produitsAffiches.length > 1 ? "s" : ""}
            </p>
          </div>

          {estConnectee && (
            <div className="flex items-center gap-3">
              <button
                onClick={ouvrirAjout}
                className="flex items-center gap-1.5 bg-[#5B8DEF] hover:bg-[#7BA3F5] text-[#0F1115] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                Ajouter un produit
              </button>
              <button
                onClick={logout}
                className="text-sm text-[#8A8F98] hover:text-[#E08A8A] border border-[#2A2D34] hover:border-[#3A2226] rounded-lg px-4 py-2.5 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltreCategorie(cat)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${filtreCategorie === cat
                ? "bg-[#5B8DEF] border-[#5B8DEF] text-[#0F1115] font-medium"
                : "border-[#2A2D34] text-[#B4B8C0] hover:border-[#3A3E47] hover:bg-[#181B21]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {chargement && (
          <p className="text-sm text-[#5C616B] text-center mt-16">Chargement des produits...</p>
        )}

        {erreur && (
          <p className="text-sm text-[#E08A8A] text-center mt-16">{erreur}</p>
        )}

        {/* Grille de produits */}
        {!chargement && !erreur && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produitsAffiches.map((produit) => (
              <ProductCard
                key={produit.id}
                produit={produit}
                onEdit={ouvrirEdition}
                onDelete={supprimerProduit}
                estProprietaire={estConnectee && vendeuse?.id === Number(produit.vendeuseId)}
              />
            ))}
          </div>
        )}

        {!chargement && !erreur && produitsAffiches.length === 0 && (
          <p className="text-sm text-[#5C616B] text-center mt-16">
            Aucun produit dans cette catégorie.
          </p>
        )}

        {!estConnectee && (
          <div className="mt-12 bg-[#181B21] border border-[#2A2D34] rounded-xl p-6 text-center">
            <p className="text-sm text-[#E8E9EC] font-medium mb-1">
              Vous êtes vendeuse ?
            </p>
            <p className="text-sm text-[#8A8F98] mb-4">
              Connectez-vous pour ajouter, modifier ou supprimer vos propres produits.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/login"
                className="bg-[#5B8DEF] hover:bg-[#7BA3F5] text-[#0F1115] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                Se connecter
              </a>
              <a
                href="/register"
                className="border border-[#2A2D34] hover:border-[#3A3E47] hover:bg-[#1E2128] text-[#E8E9EC] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                Créer un compte
              </a>
            </div>
          </div>
        )}
      </div>

      {modalOuvert && (
        <ProductModal
          initialData={produitEnEdition}
          onClose={() => setModalOuvert(false)}
          onSave={sauvegarderProduit}
        />
      )}
    </div>
  );
};

export default Products;