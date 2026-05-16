"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Video, HelpCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import LessonEditor from "@/components/dashboard/lessons/LessonEditor";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
    { id: "TEXT", label: "Texte & Blocs", desc: "Articles riches, images et code.", icon: FileText, color: "text-emerald-500 bg-emerald-50" },
    { id: "VIDEO", label: "Vidéo Pro", desc: "Hébergement ou intégration.", icon: Video, color: "text-blue-500 bg-blue-50" },
    { id: "QUIZ", label: "Quiz Interactif", desc: "Validez les connaissances.", icon: HelpCircle, color: "text-purple-500 bg-purple-50" },
  ];

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${params.courseId}/modules/${params.moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) throw new Error("Erreur");

      toast.success("Leçon créée avec succès !");
      router.push(`/dashboard/courses/${params.courseId}`);
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <Link 
        href={`/dashboard/courses/${params.courseId}`}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la structure
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-secondary/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Nouveau Contenu</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Création d'une Leçon</h1>
        </div>
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? "bg-secondary shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-gray-100"}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Titre de la leçon</label>
            <input
              type="text"
              autoFocus
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 text-lg"
              placeholder="ex: Fondamentaux du Cloud Computing"
            />
          </div>

          <div className="space-y-6">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Format pédagogique</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lessonTypes.map((type) => {
                const Icon = type.icon;
                const active = lessonData.type === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setLessonData({ ...lessonData, type: type.id })}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col items-start gap-4 group ${
                      active ? "border-secondary bg-secondary/5 shadow-xl shadow-secondary/5" : "border-gray-50 bg-white hover:border-gray-100"
                    }`}
                  >
                    <div className={`p-4 rounded-2xl ${type.color} transition-transform group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${active ? 'text-secondary' : 'text-gray-900'}`}>{type.label}</h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!lessonData.title}
            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 disabled:opacity-50"
          >
            Passer à la rédaction →
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1 rounded-lg italic">Éditeur 2026 opérationnel</span>
               <p className="text-sm font-bold text-gray-900">{lessonData.title}</p>
            </div>
            <LessonEditor
              type={lessonData.type as any}
              content={lessonData.content}
              onChange={(content) => setLessonData({ ...lessonData, content })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-5 bg-gray-50 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              ← Revenir au format
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !lessonData.content}
              className="flex-[2] py-5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              Finaliser et créer la leçon
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
