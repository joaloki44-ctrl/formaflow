"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

      if (!response.ok) throw new Error("Erreur lors de la création");

      toast.success("Module créé avec succès !");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-10">
      <Link 
        href={`/dashboard/courses/${params.courseId}`}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la formation
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-secondary/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Nouveau Chapitre</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-10">Création d'un Module</h1>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
              Titre du module
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 text-lg"
              placeholder="ex: Introduction & Fondamentaux"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
            <Link 
              href={`/dashboard/courses/${params.courseId}`}
              className="flex-1 py-5 bg-gray-50 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 text-center flex items-center justify-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isLoading || !title}
              className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Créer le module opérationnel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
