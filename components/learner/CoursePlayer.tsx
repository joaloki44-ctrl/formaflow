"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2,
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Play,
  FileText,
  HelpCircle,
  Menu,
  X,
  Smartphone,
  ArrowLeft,
  Sparkles,
  Zap,
  DownloadCloud
} from "lucide-react";
import toast from "react-hot-toast";

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  isPublished: boolean;
  attachments?: any[];
}

interface Module {
  id: string;
  title: string;
  position: number;
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

export default function CoursePlayer({ course, completedLessons, enrollmentId }: CoursePlayerProps) {
  const router = useRouter();
  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.modules[0]?.lessons[0]?.id || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completing, setCompleting] = useState(false);

  const activeLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLessonId);

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleComplete = async () => {
    if (!activeLesson || completedLessons.has(activeLesson.id)) return;

    setCompleting(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: activeLesson.id,
          courseId: course.id,
        }),
      });

      if (response.ok) {
        toast.success("Leçon validée !");
        router.refresh();
      }
    } catch (error) {
      toast.error("Erreur de synchronisation");
    } finally {
      setCompleting(false);
    }
  };

  const navigateLesson = (direction: "prev" | "next") => {
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
    
    if (direction === "prev" && currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const isFirstLesson = () => {
    const allLessons = course.modules.flatMap((m) => m.lessons);
    return allLessons[0]?.id === activeLessonId;
  };

  const isLastLesson = () => {
    const allLessons = course.modules.flatMap((m) => m.lessons);
    return allLessons[allLessons.length - 1]?.id === activeLessonId;
  };

  const renderLessonContent = (lesson: Lesson) => {
    if (!lesson.content) {
      return (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Zap className="w-20 h-20 mb-8" />
          <p className="font-black uppercase tracking-[0.5em] text-xs">Infrastructure en attente de données</p>
        </div>
      );
    }

    try {
      const blocks = JSON.parse(lesson.content);
      
      return (
        <div className="space-y-16 lg:space-y-24">
          {blocks.map((block: any) => {
            switch (block.type) {
              case "heading":
                return <h2 key={block.id} className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95]">{block.content}</h2>;
              
              case "heading2":
                return <h3 key={block.id} className="text-3xl font-bold text-white tracking-tight">{block.content}</h3>;
              
              case "text":
                return <p key={block.id} className="text-xl leading-relaxed text-slate-400 max-w-[65ch] font-medium">{block.content}</p>;
              
              case "image":
                return (
                  <div key={block.id} className="my-16 group">
                    <img 
                      src={block.metadata?.url} 
                      alt={block.metadata?.alt || ""}
                      className="rounded-[3rem] w-full object-cover shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-1000 group-hover:scale-[1.02]"
                    />
                  </div>
                );
              
              case "video":
                return (
                  <div key={block.id} className="aspect-video bg-primary rounded-[3rem] flex items-center justify-center my-16 shadow-neon-blue relative overflow-hidden group">
                    <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-700" />
                    <Play className="w-24 h-24 text-white relative z-10 drop-shadow-2xl group-hover:scale-125 transition-transform duration-700" />
                  </div>
                );
              
              case "list":
                return (
                  <ul key={block.id} className="space-y-8 pl-4">
                    {block.content.split('\n').map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-6 text-slate-400 text-xl font-medium leading-relaxed max-w-[65ch]">
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary mt-3.5 shadow-neon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              
              case "quote":
                return (
                  <blockquote key={block.id} className="bg-white/[0.02] border-l-[12px] border-secondary p-16 rounded-r-[3rem] italic text-white text-3xl font-black tracking-tighter leading-tight shadow-2xl relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 w-12 h-12 text-secondary opacity-10" />
                    "{block.content}"
                  </blockquote>
                );
              
              case "code":
                return (
                  <div className="relative group overflow-hidden rounded-[2rem] border border-white/5">
                    <div className="absolute -inset-2 bg-gradient-to-r from-secondary/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                    <pre key={block.id} className="relative bg-black p-10 overflow-x-auto text-sm leading-relaxed border-none">
                      <code className="text-blue-400">{block.content}</code>
                    </pre>
                  </div>
                );
              
              default:
                return null;
            }
          })}

          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Ressources & Protocoles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.attachments.map((file: any) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-dark rounded-2xl border border-white/5 hover:border-secondary/30 transition-all group"
                  >
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <DownloadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white truncate">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } catch {
      return <p className="text-xl leading-relaxed text-slate-400 max-w-[65ch] font-medium">{lesson.content}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-dark">
      {/* Cinematic Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed md:relative w-96 bg-black/40 backdrop-blur-3xl border-r border-white/5 h-full z-50 overflow-y-auto flex flex-col"
          >
            <div className="p-10 border-b border-white/5 sticky top-0 bg-black/40 backdrop-blur-md z-10">
              <div className="flex items-center justify-between mb-12">
                <button
                  onClick={() => router.push('/courses')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-10">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] mb-4 block">Parcours d'Élite</span>
                <h2 className="font-black text-2xl text-white tracking-tighter leading-[0.9]">{course.title}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  <span>Progression Globale</span>
                  <span className="text-secondary">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-secondary shadow-neon"
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 space-y-12">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-600 mb-8 px-4 flex items-center gap-4">
                    <span className="w-6 h-px bg-white/10" />
                    M{moduleIndex + 1}
                  </h3>
                  <div className="space-y-3">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full group flex items-center gap-5 p-5 rounded-[1.5rem] text-left transition-all duration-500 ${
                            isActive 
                              ? "bg-white/[0.05] text-white border border-white/10 shadow-2xl font-bold"
                              : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-glow" />
                            ) : (
                              <Circle className={`w-6 h-6 ${isActive ? 'text-secondary shadow-neon' : 'text-slate-800'}`} />
                            )}
                          </div>
                          <span className="text-sm tracking-tight truncate uppercase tracking-widest text-[11px] font-black">{lesson.title}</span>
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

      {/* Main Cinematic Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-dark custom-scrollbar">
        <div className="sticky top-0 bg-dark/60 backdrop-blur-3xl border-b border-white/5 px-10 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-6">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white border border-white/10"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 rounded-full border border-emerald-500/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-neon" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node Edge Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isFirstLesson() && (
              <button 
                onClick={() => navigateLesson("prev")}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-[10px] font-black text-white uppercase tracking-[0.3em]"
              >
                <ChevronLeft className="w-5 h-5 text-secondary" />
                <span>Précédent</span>
              </button>
            )}
            
            {!isLastLesson() && (
              <button 
                onClick={() => navigateLesson("next")}
                className="flex items-center gap-3 px-8 py-4 bg-secondary text-white rounded-2xl hover:bg-secondary/90 transition-all shadow-neon text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <span>Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-12 md:p-24 lg:p-40 max-w-7xl mx-auto w-full relative">
          <AnimatePresence mode="wait">
            {activeLesson ? (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-32">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80px" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-1 bg-secondary mb-12 rounded-full shadow-neon"
                  />
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-12">{activeLesson.title}</h1>
                  <p className="text-secondary text-xs font-black uppercase tracking-[0.6em]">Module Intégral • Elite Experience</p>
                </div>

                <article className="prose prose-2xl prose-invert max-w-none">
                  {renderLessonContent(activeLesson)}
                </article>

                <div className="mt-48 pt-24 border-t border-white/5 text-center flex flex-col items-center">
                  {completedLessons.has(activeLesson.id) ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col items-center gap-6 p-20 bg-emerald-500/[0.02] rounded-[4rem] border border-emerald-500/10"
                    >
                      <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h4 className="text-4xl font-black text-white tracking-tighter uppercase">Validation Terminée</h4>
                      <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Données synchronisées avec succès</p>
                    </motion.div>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="w-full max-w-2xl relative group"
                    >
                      <div className="absolute -inset-4 bg-secondary rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                      <div className="relative flex items-center justify-center gap-6 py-10 bg-secondary text-white rounded-[3rem] font-black text-2xl uppercase tracking-[0.4em] shadow-neon transition-all group-hover:scale-[1.02] active:scale-95 disabled:opacity-50 overflow-hidden">
                        {completing ? (
                          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                            <span className="relative z-10 flex items-center gap-6">
                              <CheckCircle2 className="w-10 h-10" />
                              Valider la Leçon
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>

                <div className="mt-40 text-center pb-32 opacity-10 grayscale">
                  <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-white border border-white/10">
                    <Smartphone className="w-5 h-5" />
                    Elite Offline Pro • Protocol 2026
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-64">
                <p className="text-slate-700 font-black uppercase tracking-[1em] text-xs">Initialisation de la Session</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0c0c0c; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 10px; }
        .shadow-neon-blue { shadow: 0 0 50px rgba(37,99,235,0.3); }
      `}</style>
    </div>
  );
}
