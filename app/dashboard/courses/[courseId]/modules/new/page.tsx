"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface NewModulePageProps {
  params: { courseId: string };
}

export default function NewModulePage({ params }: NewModulePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/courses/${params.courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

      const module = await response.json();
      toast.success("Module créé avec succès !");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <Link 
        href={`/dashboard/courses/${params.courseId}`}
        className="flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au cours
      </Link>

      <h1 className="font-serif text-3xl mb-2">Nouveau module</h1>
      <p className="text-muted mb-8">Ajoutez un nouveau module à votre formation</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du module *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a]"
              placeholder="ex: Chapitre 1 - Les bases"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              href={`/dashboard/courses/${params.courseId}`}
              className="btn-outline"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Création..." : "Créer le module"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
