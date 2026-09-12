import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

const PRODUITS_INITIAUX = [
  {
    id: 1,
    nom: "Robe wax imprimée",
    description: "Robe longue en tissu wax, coupe ajustée, idéale pour les occasions.",
    prix: 25000,
    categorie: "Vêtements",
    vendeuseId: "1",
    statut: "disponible",
  },
  {
    id: 2,
    nom: "Sac à main en cuir",
    description: "Sac artisanal en cuir véritable, fermeture zip, doublure intérieure.",
    prix: 18000,
    categorie: "Accessoires",
    vendeuseId: "2",
    statut: "vendu",
  },
  {
    id: 3,
    nom: "Bijoux en perles",
    description: "Collier et boucles d'oreilles assortis, perles faites main.",
    prix: 7500,
    categorie: "Bijoux",
    vendeuseId: "3",
    statut: "disponible",
  },
  {
    id: 4,
    nom: "Chaussures brodées",
    description: "Babouches brodées à la main, semelle confortable, plusieurs tailles.",
    prix: 15000,
    categorie: "Chaussures",
    vendeuseId: "4",
    statut: "disponible",
  },
  {
    id: 5,
    nom: "Foulard en soie",
    description: "Foulard léger imprimé, idéal pour compléter une tenue.",
    prix: 5000,
    categorie: "Accessoires",
    vendeuseId: "5",
    statut: "vendu",
  },
  {
    id: 6,
    nom: "Ensemble deux pièces",
    description: "Haut et jupe assortis en tissu bazin, broderie sur le col.",
    prix: 32000,
    categorie: "Vêtements",
    vendeuseId: "6",
    statut: "disponible",
  },
];


const Products = () => {
  const [produits, setProduits] = useState(PRODUITS_INITIAUX);
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);

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

  const supprimerProduit = (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      setProduits((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const sauvegarderProduit = (donnees) => {
    if (produitEnEdition) {
      setProduits((prev) =>
        prev.map((p) => (p.id === produitEnEdition.id ? { ...p, ...donnees } : p))
      );
    } else {
      setProduits((prev) => [...prev, { ...donnees, id: Date.now() }]);
    }
    setModalOuvert(false);
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
          <button
            onClick={ouvrirAjout}
            className="flex items-center gap-1.5 bg-[#5B8DEF] hover:bg-[#7BA3F5] text-[#0F1115] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
          >
            Ajouter un produit
          </button>
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

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {produitsAffiches.map((produit) => (
            <ProductCard
              key={produit.id}
              produit={produit}
              onEdit={ouvrirEdition}
              onDelete={supprimerProduit}
            />
          ))}
        </div>

        {produitsAffiches.length === 0 && (
          <p className="text-sm text-[#5C616B] text-center mt-16">
            Aucun produit dans cette catégorie.
          </p>
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

export default Products