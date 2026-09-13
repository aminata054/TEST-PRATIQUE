import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatPrix = (valeur) =>
    new Intl.NumberFormat("fr-SN", { maximumFractionDigits: 0 }).format(valeur) + " FCFA";

const StatutBadge = ({ statut }) => {
    const estDisponible = statut === "disponible";
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${estDisponible
                ? "bg-[#1E3A2E] text-[#6BCB9A]"
                : "bg-[#3A2226] text-[#E08A8A]"
                }`}
        >
            {estDisponible ? "Disponible" : "Vendu"}
        </span>
    );
};

const ProductCard = ({ produit, onEdit, onDelete, estProprietaire }) => {
    const navigate = useNavigate();

    const arreterPropagation = (e, action) => {
        e.stopPropagation();
        action();
    };

    return (
        <div
            onClick={() => navigate(`/products/${produit.id}`)}
            className="bg-[#181B21] border border-[#2A2D34] p-5 flex flex-col gap-3 max-w-sm cursor-pointer hover:border-[#3A3E47] transition-colors"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-[#E8E9EC] font-medium leading-snug">{produit.nom}</h3>
                <StatutBadge statut={produit.statut} />
            </div>

            <p className="text-sm text-[#8A8F98] leading-relaxed">{produit.description}</p>

            <div className="flex items-center justify-between mt-1">
                <span className="text-[#5B8DEF] font-semibold text-base">
                    {formatPrix(produit.prix)}
                </span>
                <span className="text-xs text-[#B4B8C0] border border-[#2A2D34] rounded-full px-2.5 py-1">
                    {produit.categorie}
                </span>
            </div>

            <div className="pt-3 border-t border-[#2A2D34] flex items-center justify-between">
                <span className="text-xs text-[#5C616B]">
                    Vendeuse : <span className="text-[#8A8F98]">{produit.vendeuseId}</span>
                </span>

                {estProprietaire && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => arreterPropagation(e, () => onEdit(produit))}
                            className="text-[#8A8F98] hover:text-[#5B8DEF] transition-colors p-1.5 rounded-md hover:bg-[#1E2128]"
                            aria-label="Modifier"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={(e) => arreterPropagation(e, () => onDelete(produit.id))}
                            className="text-[#8A8F98] hover:text-[#E08A8A] transition-colors p-1.5 rounded-md hover:bg-[#1E2128]"
                            aria-label="Supprimer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;