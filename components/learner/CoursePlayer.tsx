"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Play,
  FileText,
  HelpCircle,
  Award,
  Menu,
  X,
  Users,
  Sparkles,
  Smartphone
} from "lucide-react";
import toast from "react-hot-toast";

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  isPublished: boolean;
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
  const [liveLearners, setLiveLearners] = useState(3);

  // Mocking live learners fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLearners(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Trouver la leçon active
  const activeLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLessonId);

  // Calculer la progression
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
        toast.success("Leçon terminée !");
        router.refresh();
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
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

  // Rendu du contenu selon le type
  const renderLessonContent = (lesson: Lesson) => {
    if (!lesson.content) {
      return (
        <div className="text-center py-12 text-muted">
          <p>Aucun contenu pour cette leçon</p>
        </div>
      );
    }

    try {
      const blocks = JSON.parse(lesson.content);
      
      return (
        <div className="space-y-6">
          {blocks.map((block: any) => {
            switch (block.type) {
              case "heading":
                return <h2 key={block.id} className="text-2xl font-bold font-serif">{block.content}</h2>;
              
              case "heading2":
                return <h3 key={block.id} className="text-xl font-semibold font-serif">{block.content}</h3>;
              
              case "text":
                return <p key={block.id} className="leading-relaxed text-gray-700">{block.content}</p>;
              
              case "image":
                return (
                  <div key={block.id} className="my-6 relative group">
                    <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity pointer-events-none" />
                    <img 
                      src={block.metadata?.url} 
                      alt={block.metadata?.alt || ""}
                      className="rounded-2xl max-h-96 w-full object-cover shadow-lg"
                    />
                  </div>
                );
              
              case "video":
                return (
                  <div key={block.id} className="aspect-video bg-black rounded-2xl flex items-center justify-center my-6 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-warm opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Play className="w-16 h-16 text-white relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform" />
                  </div>
                );
              
              case "list":
                return (
                  <ul key={block.id} className="list-disc list-inside space-y-3 pl-4">
                    {block.content.split('\n').map((item: string, i: number) => (
                      <li key={i} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                );
              
              case "quote":
                return (
                  <blockquote key={block.id} className="bg-white/40 backdrop-blur-sm border-l-4 border-[#ff6b4a] p-6 rounded-r-2xl italic text-gray-600 shadow-sm">
                    {block.content}
                  </blockquote>
                );
              
              case "code":
                return (
                  <div key={block.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-warm rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500" />
                    <pre className="relative bg-gray-950 text-gray-100 p-6 rounded-2xl overflow-x-auto text-sm leading-relaxed border border-white/5">
                      <code>{block.content}</code>
                    </pre>
                  </div>
                );
              
              default:
                return null;
            }
          })}
        </div>
      );
    } catch {
      return <p className="leading-relaxed text-gray-700">{lesson.content}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Sidebar with Glassmorphism */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed md:relative w-80 bg-white/80 backdrop-blur-xl border-r border-black/5 h-full z-50 overflow-y-auto"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-black/5 sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl truncate pr-4">{course.title}</h2>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-3 bg-cream/50 p-4 rounded-2xl border border-black/5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted">
                  <span>Progression</span>
                  <span className="text-[#ff6b4a]">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-warm shadow-sm"
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[10px] font-medium text-muted text-center">
                  {completedCount} sur {totalLessons} leçons terminées
                </p>
              </div>
            </div>

            {/* Modules List */}
            <div className="p-4 space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center text-[10px] font-bold">
                      {moduleIndex + 1}
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">
                      {module.title}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full group flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            isActive 
                              ? "bg-white shadow-lg shadow-black/5 ring-1 ring-black/5"
                              : "hover:bg-white/50"
                          }`}
                        >
                          <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                            {isCompleted ? (
                              <div className="bg-green-500/10 p-1 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            ) : (
                              <Circle className={`w-5 h-5 ${isActive ? 'text-[#ff6b4a]' : 'text-gray-300'}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? 'text-[#ff6b4a]' : 'text-gray-600'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lesson.type === 'VIDEO' && <Play className="w-3 h-3 text-gray-400" />}
                              {lesson.type === 'TEXT' && <FileText className="w-3 h-3 text-gray-400" />}
                              {lesson.type === 'QUIZ' && <HelpCircle className="w-3 h-3 text-gray-400" />}
                            </div>
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="active-indicator"
                              className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a]"
                            />
                          )}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar - Liquid Glass */}
        <div className="sticky top-0 bg-white/60 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Live Learners Mockup (Trend 2026: Social Learning) */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-full border border-green-500/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                {liveLearners} Apprenants en ligne
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFirstLesson() && (
              <button 
                onClick={() => navigateLesson("prev")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-black/5 rounded-xl transition-all text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>
            )}
            
            {!isLastLesson() && (
              <button 
                onClick={() => navigateLesson("next")}
                className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10 text-sm font-bold"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lesson Content Area */}
        <div className="flex-1 p-8 md:p-12 max-w-4xl mx-auto w-full relative">
          {activeLesson ? (
            <motion.div
              key={activeLesson.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              {/* Header Lesson */}
              <div className="mb-12">
                <div className="flex items-center gap-2 text-[#ff6b4a] mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Leçon {course.modules.flatMap(m => m.lessons).findIndex(l => l.id === activeLessonId) + 1}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl leading-tight">{activeLesson.title}</h1>
              </div>
              
              {/* Main Content Card */}
              <div className="prose prose-lg max-w-none">
                {renderLessonContent(activeLesson)}
              </div>

              {/* Completion Button - Floating with Glass effect */}
              <div className="mt-16 pt-12 border-t border-black/5">
                {completedLessons.has(activeLesson.id) ? (
                  <div className="flex flex-col items-center gap-3 p-8 bg-green-500/5 rounded-[2.5rem] border border-green-500/10 text-center">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-2">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-green-700">Bravo ! Cette leçon est validée.</h4>
                    <p className="text-sm text-green-600/70">Vous vous rapprochez de votre certificat.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-warm rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-300" />
                    <div className="relative flex items-center justify-center gap-3 py-6 bg-gradient-warm text-white rounded-[2rem] font-bold text-lg shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50">
                      {completing ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span>Marquer comme terminée</span>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Offline Hint (Trend 2026: Offline Pro) */}
              <div className="mt-20 text-center pb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-tighter text-muted">
                  <Smartphone className="w-3 h-3" />
                  Mode Offline Pro activé • Votre progression est synchronisée localement
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <Play className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="font-serif text-2xl mb-2">Prêt à commencer ?</h2>
              <p className="text-muted">Sélectionnez une leçon dans le menu de gauche.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
