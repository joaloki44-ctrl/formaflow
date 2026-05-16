"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditModulePage({ params }: { params: { courseId: string; moduleId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      const response = await fetch(`/api/courses/${params.courseId}/modules`);
      const modules = await response.json();
      const module = modules.find((m: any) => m.id === params.moduleId);
      if (module) setTitle(module.title);
    };
    fetchModule();
  }, [params.courseId, params.moduleId]);

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.courseId}/modules/${params.moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error("Erreur");
      toast.success("Module mis à jour");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Supprimer ce module ?")) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.courseId}/modules/${params.moduleId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur");
      toast.success("Module supprimé");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <Link href={`/dashboard/courses/${params.courseId}`} className="flex items-center gap-2 text-muted hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Modifier le module</h1>
        <button onClick={onDelete} disabled={isLoading} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Titre du module</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
          />
        </div>
        <button
          onClick={onUpdate}
          disabled={isLoading || !title}
          className="w-full btn-primary py-4"
        >
          {isLoading ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
