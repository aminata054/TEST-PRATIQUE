import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api";

const formatPrix = (valeur) =>
    new Intl.NumberFormat("fr-SN", { maximumFractionDigits: 0 }).format(valeur) + " FCFA";

const StatutBadge = ({ statut }) => {
    const estDisponible = statut === "disponible";
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${estDisponible
                ? "bg-[#1E3A2E] text-[#6BCB9A]"
                : "bg-[#3A2226] text-[#E08A8A]"
                }`}
        >
            {estDisponible ? "Disponible" : "Vendu"}
        </span>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produit, setProduit] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        const chargerProduit = async () => {
            try {
                const reponse = await fetch(`${API_URL}/products/${id}`);
                const donnees = await reponse.json();
                if (!reponse.ok) throw new Error(donnees.message || "Produit introuvable.");
                setProduit(donnees);
            } catch (err) {
                setErreur(err.message);
            } finally {
                setChargement(false);
            }
        };
        chargerProduit();
    }, [id]);

    return (
        <div className="min-h-screen w-full bg-[#0F1115] px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-[#8A8F98] hover:text-[#E8E9EC] transition-colors mb-6"
                >
                    Retour
                </button>

                {chargement && (
                    <p className="text-sm text-[#5C616B] text-center mt-16">Chargement...</p>
                )}

                {erreur && (
                    <p className="text-sm text-[#E08A8A] text-center mt-16">{erreur}</p>
                )}

                {produit && !chargement && (
                    <div className="bg-[#181B21] border border-[#2A2D34] rounded-xl p-8">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl font-semibold text-[#E8E9EC] tracking-tight">
                                {produit.nom}
                            </h1>
                            <StatutBadge statut={produit.statut} />
                        </div>

                        <p className="text-[#8A8F98] leading-relaxed mb-6">
                            {produit.description}
                        </p>

                        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#2A2D34]">
                            <span className="text-[#5B8DEF] font-semibold text-2xl">
                                {formatPrix(produit.prix)}
                            </span>
                            <span className="text-sm text-[#B4B8C0] border border-[#2A2D34] rounded-full px-3 py-1.5">
                                {produit.categorie}
                            </span>
                        </div>

                        <p className="text-sm text-[#5C616B]">
                            Vendeuse : <span className="text-[#8A8F98]">{produit.vendeuse_id}</span>
                        </p>

                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;