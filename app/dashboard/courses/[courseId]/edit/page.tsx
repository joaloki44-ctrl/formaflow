"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await fetch(`/api/courses/${params.courseId}`);
      const data = await response.json();
      setCourse(data);
    };
    fetchCourse();
  }, [params.courseId]);

  const onUpdate = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast.success("Formation mise à jour !");
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Supprimer définitivement cette formation ?")) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${params.courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur");
      toast.success("Formation supprimée");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  if (!course) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Link href={`/dashboard/courses/${params.courseId}`} className="flex items-center gap-2 text-muted hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres de la formation</h1>
        <button onClick={onDelete} disabled={isLoading} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold mb-4">Informations de base</h2>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Titre</label>
            <input
              defaultValue={course.title}
              onBlur={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
            <textarea
              defaultValue={course.description}
              onBlur={(e) => onUpdate({ description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary h-32"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Visibilité</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                {course.isPublished ? <Globe className="text-emerald-500" /> : <Lock className="text-amber-500" />}
                <span className="font-bold">{course.isPublished ? "Publique" : "Privée"}</span>
              </div>
              <button
                onClick={() => onUpdate({ isPublished: !course.isPublished })}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  course.isPublished ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                }`}
              >
                {course.isPublished ? "Dépublier" : "Publier"}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Tarification</h2>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Prix (€)</label>
              <input
                type="number"
                defaultValue={course.price}
                onBlur={(e) => onUpdate({ price: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
