"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";

export default function CourseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    level: "BEGINNER",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      const course = await response.json();
      toast.success("Formation créée avec succès !");
      router.push(`/dashboard/courses/${course.id}`);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
      <div className="space-y-8">
        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Vignette de la formation</label>
          {formData.imageUrl ? (
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-gray-100">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-rose-500 hover:scale-110 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-secondary/20 transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-sm font-bold text-gray-900">Cliquez pour ajouter une image</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">Recommandé : 1280x720px (PNG, JPG)</p>
              <input
                type="text"
                placeholder="Ou collez une URL d'image ici..."
                className="mt-6 w-full max-w-sm px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Titre de la formation *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900"
            placeholder="ex: Masterclass Next.js 2026"
          />
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Description détaillée *</label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-medium text-gray-800 resize-none"
            placeholder="Décrivez les objectifs pédagogiques..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 appearance-none"
            >
              <option value="">Sélectionner...</option>
              <option value="TECH">Technologie</option>
              <option value="BUSINESS">Business</option>
              <option value="DESIGN">Design</option>
              <option value="MARKETING">Marketing</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Prix de vente (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900"
              placeholder="0.00 (Gratuit)"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Niveau de difficulté</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "BEGINNER", label: "Débutant" },
              { id: "INTERMEDIATE", label: "Intermédiaire" },
              { id: "ADVANCED", label: "Avancé" }
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setFormData({ ...formData, level: lvl.id })}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.level === lvl.id
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-105"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-gray-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] px-8 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer la formation"}
          </button>
        </div>
      </div>
    </form>
  );
}
