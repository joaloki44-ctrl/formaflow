"use client";

import { useState, useEffect } from "react";
import { 
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Circle,
  ArrowLeft,
  Loader2,
  FileText,
  Download,
  Paperclip
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  type: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

interface CoursePlayerProps {
  course: Course;
  completedLessons: Set<string>;
  enrollmentId: string;
}

export default function CoursePlayer({ course, completedLessons: initialCompleted, enrollmentId }: CoursePlayerProps) {
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    course.modules[0]?.lessons[0]?.id || null
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(initialCompleted);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const flatLessons = course.modules.flatMap(m => m.lessons);
  const activeLesson = flatLessons.find(l => l.id === activeLessonId);

  const progressPercent = flatLessons.length > 0
    ? Math.round((completedLessons.size / flatLessons.length) * 100)
    : 0;

  const handleComplete = async () => {
    if (!activeLessonId || completing) return;
    setCompleting(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: activeLessonId,
          courseId: course.id,
        }),
      });

      if (response.ok) {
        setCompletedLessons(new Set([...Array.from(completedLessons), activeLessonId]));
        toast.success("Leçon terminée !");

        // Auto-navigate to next lesson
        const currentIndex = flatLessons.findIndex(l => l.id === activeLessonId);
        if (currentIndex < flatLessons.length - 1) {
          setActiveLessonId(flatLessons[currentIndex + 1].id);
        }
      }
    } catch (error) {
      toast.error("Erreur de sauvegarde");
    } finally {
      setCompleting(false);
    }
  };

  const navigateLesson = (direction: "next" | "prev") => {
    const currentIndex = flatLessons.findIndex(l => l.id === activeLessonId);
    if (direction === "next" && currentIndex < flatLessons.length - 1) {
      setActiveLessonId(flatLessons[currentIndex + 1].id);
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveLessonId(flatLessons[currentIndex - 1].id);
    }
  };

  const isFirstLesson = () => flatLessons.findIndex(l => l.id === activeLessonId) === 0;
  const isLastLesson = () => flatLessons.findIndex(l => l.id === activeLessonId) === flatLessons.length - 1;

  const renderLessonContent = (lesson: Lesson) => {
    if (!lesson.content) return <p className="text-muted">Aucun contenu pour cette leçon.</p>;

    try {
      const blocks = JSON.parse(lesson.content);
      return (
        <div className="space-y-10">
          {blocks.map((block: any) => {
            switch (block.type) {
              case "heading":
                return <h2 key={block.id} className="text-3xl font-bold text-gray-900 mt-12 mb-6">{block.content}</h2>;
              case "heading2":
                return <h3 key={block.id} className="text-xl font-bold text-gray-800 mt-8 mb-4">{block.content}</h3>;
              case "text":
                return <p key={block.id} className="text-lg text-gray-700 leading-relaxed">{block.content}</p>;
              case "image":
                return (
                  <div key={block.id} className="my-10">
                    <img src={block.metadata?.url} alt={block.metadata?.alt} className="w-full rounded-2xl shadow-lg border border-gray-100" />
                  </div>
                );
              case "video":
                return (
                  <div key={block.id} className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center my-10 shadow-2xl overflow-hidden relative group">
                    {block.content ? (
                      <iframe src={block.content} className="w-full h-full" allowFullScreen />
                    ) : (
                      <div className="text-center">
                        <Play className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Vidéo indisponible</p>
                      </div>
                    )}
                  </div>
                );
              case "file":
                return (
                  <div key={block.id} className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-between my-8 group hover:bg-white transition-all hover:shadow-xl hover:shadow-gray-500/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary">
                        <Paperclip className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{block.metadata?.fileName || "Ressource complémentaire"}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{block.metadata?.fileSize || "DOCUMENT"}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                );
              case "list":
                return (
                  <ul key={block.id} className="space-y-4 pl-2 my-6">
                    {block.content.split('\n').map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4 text-gray-700 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote key={block.id} className="bg-gray-50 border-l-4 border-secondary p-10 rounded-r-[2rem] italic text-gray-600 text-xl my-10 shadow-inner">
                    "{block.content}"
                  </blockquote>
                );
              case "code":
                return (
                  <pre key={block.id} className="bg-gray-900 text-blue-300 p-8 rounded-2xl overflow-x-auto text-sm leading-relaxed border border-white/10 shadow-2xl my-8 font-mono">
                    <code>{block.content}</code>
                  </pre>
                );
              default:
                return null;
            }
          })}
        </div>
      );
    } catch {
      return <p className="text-lg text-gray-700 leading-relaxed">{lesson.content}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed md:relative w-80 bg-gray-50 border-r border-gray-100 h-full z-50 overflow-y-auto flex flex-col shadow-2xl md:shadow-none"
          >
            <div className="p-8 border-b border-gray-100 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-lg text-gray-900 truncate pr-4">{course.title}</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <span>Progression</span>
                  <span className="text-secondary">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden border border-white shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-secondary shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-10">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-6 px-2 flex items-center gap-3">
                    <span className="w-5 h-5 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-bold">{moduleIndex + 1}</span>
                    {module.title}
                  </h3>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isActive = lesson.id === activeLessonId;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full group flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                            isActive 
                              ? "bg-white text-gray-900 shadow-xl shadow-gray-200/50 border border-gray-100 font-bold scale-[1.02]"
                              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                          }`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-gray-300'}`} />
                            )}
                          </div>
                          <p className="text-sm truncate flex-1">{lesson.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full bg-white relative">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-50 px-8 py-5 flex items-center justify-between z-40">
          <div className="flex items-center gap-6">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                <Menu className="w-5 h-5 text-gray-900" />
              </button>
            )}
            <Link href="/courses" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> Quitter
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigateLesson("prev")} disabled={isFirstLesson()} className="p-3 text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="h-8 w-px bg-gray-100" />
            <button onClick={() => navigateLesson("next")} disabled={isLastLesson()} className="p-3 text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 py-16">
          <div className="max-w-4xl mx-auto w-full">
            {activeLesson ? (
              <motion.div key={activeLesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-20">
                  <span className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">Opérationnel • 2026</span>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">{activeLesson.title}</h1>
                </div>

                <article className="prose prose-xl prose-slate max-w-none">
                  {renderLessonContent(activeLesson)}
                </article>

                <div className="mt-24 pt-12 border-t border-gray-50">
                  {completedLessons.has(activeLesson.id) ? (
                    <div className="flex items-center gap-6 p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 shadow-sm">
                      <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900 text-xl">Module validé avec succès</p>
                        <p className="text-emerald-700 font-medium">Votre progression a été synchronisée en temps réel.</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 disabled:opacity-50 flex items-center justify-center gap-4 group"
                    >
                      {completing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                      {completing ? "Synchronisation..." : "Marquer comme terminée"}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 animate-bounce">
                  <Play className="w-10 h-10 text-gray-200" />
                </div>
                <p className="text-xl font-bold text-gray-400">Sélectionnez une leçon pour débuter votre apprentissage.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
