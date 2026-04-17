"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CourseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    level: "BEGINNER",
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

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

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
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-2xl border border-gray-200">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Titre de la formation *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a]"
            placeholder="ex: Maîtrisez React en 30 jours"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a] resize-none"
            placeholder="Décrivez le contenu et les objectifs de votre formation..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a] bg-white"
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
            <label className="block text-sm font-medium mb-2">Prix (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a]"
              placeholder="49.99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Niveau</label>
          <div className="flex gap-3">
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, level })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  formData.level === level
                    ? "bg-[#ff6b4a] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level === "BEGINNER" && "Débutant"}
                {level === "INTERMEDIATE" && "Intermédiaire"}
                {level === "ADVANCED" && "Avancé"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-outline"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>...Création</>
            ) : (
              <>
                Créer la formation
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}