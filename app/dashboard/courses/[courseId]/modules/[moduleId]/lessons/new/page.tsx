"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Video, HelpCircle, CheckCircle } from "lucide-react";
import LessonEditor from "@/components/dashboard/lessons/LessonEditor";
import toast from "react-hot-toast";

interface NewLessonPageProps {
  params: {
    courseId: string;
    moduleId: string;
  };
}

export default function NewLessonPage({ params }: NewLessonPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [lessonData, setLessonData] = useState({
    title: "",
    type: "TEXT",
    content: "",
  });

  const lessonTypes = [
    { id: "TEXT", label: "Texte", icon: FileText, color: "from-green-400 to-green-600" },
    { id: "VIDEO", label: "Vidéo", icon: Video, color: "from-blue-400 to-blue-600" },
    { id: "QUIZ", label: "Quiz", icon: HelpCircle, color: "from-purple-400 to-purple-600" },
  ];

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/modules/${params.moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      toast.success("Leçon créée avec succès !");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <Link 
        href={`/dashboard/courses/${params.courseId}`}
        className="flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au cours
      </Link>

      <h1 className="font-serif text-3xl mb-2">Nouvelle leçon</h1>
      <p className="text-muted mb-8">Étape {step}/2 - {step === 1 ? "Choisissez le type" : "Créez le contenu"}</p>

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all ${
              s <= step ? "bg-gradient-to-r from-[#ff6b4a] to-[#f09340]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Type Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">Titre de la leçon</label>
            <input
              type="text"
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/20 focus:border-[#ff6b4a] mb-6"
              placeholder="ex: Introduction aux bases"
            />
          </div>

          <label className="block text-sm font-medium mb-4">Type de contenu</label>
          <div className="grid grid-cols-3 gap-4">
            {lessonTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setLessonData({ ...lessonData, type: type.id })}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    lessonData.type === type.id
                      ? "border-[#ff6b4a] bg-[#ff6b4a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold">{type.label}</h3>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!lessonData.title}
            className="btn-primary w-full py-4 mt-6 disabled:opacity-50"
          >
            Continuer
          </button>
        </div>
      )}

      {/* Step 2: Content Editor */}
      {step === 2 && (
        <div className="space-y-6">
          <LessonEditor 
            type={lessonData.type}
            content={lessonData.content}
            onChange={(content) => setLessonData({ ...lessonData, content })}
          />

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="btn-outline flex-1 py-4"
            >
              Retour
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !lessonData.content}
              className="btn-primary flex-1 py-4 disabled:opacity-50"
            >
              {isLoading ? "Création..." : "Créer la leçon"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}