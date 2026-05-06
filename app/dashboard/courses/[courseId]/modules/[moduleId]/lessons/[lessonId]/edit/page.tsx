"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LessonEditor from "@/components/dashboard/lessons/LessonEditor";

export default function EditLessonPage({
  params
}: {
  params: { courseId: string; moduleId: string; lessonId: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const response = await fetch(`/api/courses/${params.courseId}/modules/${params.moduleId}`);
      const moduleData = await response.json();
      // This is a bit inefficient but works for now given the current API structure
      // Ideally we'd have a direct GET /api/.../lessons/[lessonId]
      const responseCourse = await fetch(`/api/courses/${params.courseId}`);
      const course = await responseCourse.json();
      const foundModule = course.modules.find((m: any) => m.id === params.moduleId);
      const foundLesson = foundModule?.lessons.find((l: any) => l.id === params.lessonId);
      setLesson(foundLesson);
    };
    fetchLesson();
  }, [params.courseId, params.moduleId, params.lessonId]);

  const onUpdate = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Erreur");
      toast.success("Leçon mise à jour");
      router.refresh();
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Supprimer cette leçon ?")) return;
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
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  if (!lesson) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Link href={`/dashboard/courses/${params.courseId}`} className="flex items-center gap-2 text-muted hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Modifier la leçon</h1>
        <button onClick={onDelete} disabled={isLoading} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Titre</label>
            <input
              defaultValue={lesson.title}
              onBlur={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
            />
          </div>

          <LessonEditor
            type={lesson.type}
            content={lesson.content}
            onChange={(content) => onUpdate({ content })}
          />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Statut de publication</h3>
              <p className="text-sm text-muted">Rendre cette leçon visible pour les élèves</p>
            </div>
            <button
              onClick={() => onUpdate({ isPublished: !lesson.isPublished })}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                lesson.isPublished ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              {lesson.isPublished ? "Dépublier" : "Publier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
