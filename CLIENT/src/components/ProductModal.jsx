import { useState } from "react";
import { X } from "lucide-react";

const CHAMPS_VIDES = {
  nom: "",
  description: "",
  prix: "",
  categorie: "",
  statut: "disponible",
};

const ProductModal = ({ initialData, onClose, onSave }) => {
  const [form, setForm] = useState(initialData ?? CHAMPS_VIDES);
  const estModification = Boolean(initialData);

  const handleChange = (champ) => (e) =>
    setForm((prev) => ({ ...prev, [champ]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, prix: Number(form.prix) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-[#181B21] border border-[#2A2D34] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#E8E9EC]">
            {estModification ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8A8F98] hover:text-[#E8E9EC] transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#B4B8C0] mb-1.5">Nom</label>
            <input
              value={form.nom}
              onChange={handleChange("nom")}
              required
              className="w-full bg-[#0F1115] border border-[#2A2D34] rounded-lg py-2.5 px-3 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B4B8C0] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              required
              rows={3}
              className="w-full bg-[#0F1115] border border-[#2A2D34] rounded-lg py-2.5 px-3 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#B4B8C0] mb-1.5">Prix (FCFA)</label>
              <input
                type="number"
                min="0"
                value={form.prix}
                onChange={handleChange("prix")}
                required
                className="w-full bg-[#0F1115] border border-[#2A2D34] rounded-lg py-2.5 px-3 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#B4B8C0] mb-1.5">Catégorie</label>
              <input
                value={form.categorie}
                onChange={handleChange("categorie")}
                required
                className="w-full bg-[#0F1115] border border-[#2A2D34] rounded-lg py-2.5 px-3 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#B4B8C0] mb-1.5">Statut</label>
            <select
              value={form.statut}
              onChange={handleChange("statut")}
              className="w-full bg-[#0F1115] border border-[#2A2D34] rounded-lg py-2.5 px-3 text-sm text-[#E8E9EC] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
            >
              <option value="disponible">Disponible</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5B8DEF] hover:bg-[#7BA3F5] text-[#0F1115] font-medium text-sm rounded-lg py-2.5 transition-colors mt-2"
          >
            {estModification ? "Enregistrer les modifications" : "Ajouter le produit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;