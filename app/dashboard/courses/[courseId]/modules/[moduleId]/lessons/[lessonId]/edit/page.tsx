"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import LessonEditor from "@/components/dashboard/lessons/LessonEditor";

export default function EditLessonPage({
  params
}: {
  params: { courseId: string; moduleId: string; lessonId: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}`);
        const course = await response.json();
        const foundModule = course.modules.find((m: any) => m.id === params.moduleId);
        const foundLesson = foundModule?.lessons.find((l: any) => l.id === params.lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          toast.error("Leçon non trouvée");
          router.push(`/dashboard/courses/${params.courseId}`);
        }
      } catch (err) {
        toast.error("Erreur de chargement");
      }
    };
    fetchLesson();
  }, [params.courseId, params.moduleId, params.lessonId, router]);

  const onUpdate = async (values: any) => {
    try {
      setIsSaving(true);
      const response = await fetch(
        `/api/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Erreur");

      // Update local state to avoid full reload if it was a publication toggle or title change
      setLesson((prev: any) => ({ ...prev, ...values }));

      toast.success("Leçon mise à jour");
      router.refresh();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Supprimer cette leçon ? Cette action est irréversible.")) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Erreur");
      toast.success("Leçon supprimée");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  if (!lesson) return <div className="p-20 text-center font-bold text-muted animate-pulse">Chargement de l'éditeur...</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <Link href={`/dashboard/courses/${params.courseId}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à la formation
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configuration de la Leçon</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">"{lesson.title}"</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdate({})} // Placeholder for explicit save if needed, though onChange handles it
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
          <button onClick={onDelete} disabled={isLoading} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Titre de la leçon</label>
              <input
                defaultValue={lesson.title}
                onBlur={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Contenu pédagogique</label>
              <LessonEditor
                type={lesson.type}
                content={lesson.content}
                onChange={(content) => onUpdate({ content })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 tracking-tight text-lg">Visibilité</h3>
            <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Statut</span>
                <span className={`text-sm font-bold ${lesson.isPublished ? "text-emerald-600" : "text-amber-600"}`}>
                  {lesson.isPublished ? "Publiée" : "Brouillon"}
                </span>
              </div>
              <button
                onClick={() => onUpdate({ isPublished: !lesson.isPublished })}
                disabled={isSaving}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                  lesson.isPublished
                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                    : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                }`}
              >
                {lesson.isPublished ? "Dépublier" : "Publier"}
              </button>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-medium leading-relaxed">
              Les leçons en brouillon ne sont pas visibles pour vos élèves inscrits.
            </p>
          </div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="relative z-10">
              <h4 className="font-bold mb-2">Support Prioritaire</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Une question sur la mise en page ? Nos experts Elite sont là pour vous aider.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
