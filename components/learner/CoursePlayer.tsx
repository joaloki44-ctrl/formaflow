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
  Users,
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

  const renderLessonContent = (lesson: Lesson) => {
    if (!lesson.content) {
      return (
        <div className="text-center py-20 text-muted">
          <p className="font-medium">Aucun contenu disponible pour cette leçon.</p>
        </div>
      );
    }

    try {
      const blocks = JSON.parse(lesson.content);
      
      return (
        <div className="space-y-8">
          {blocks.map((block: any) => {
            switch (block.type) {
              case "heading":
                return <h2 key={block.id} className="text-3xl font-bold text-primary tracking-tight">{block.content}</h2>;
              
              case "heading2":
                return <h3 key={block.id} className="text-xl font-bold text-primary">{block.content}</h3>;
              
              case "text":
                return <p key={block.id} className="text-lg leading-relaxed text-gray-700">{block.content}</p>;
              
              case "image":
                return (
                  <div key={block.id} className="my-10">
                    <img 
                      src={block.metadata?.url} 
                      alt={block.metadata?.alt || ""}
                      className="rounded-xl w-full object-cover shadow-sm border border-gray-100"
                    />
                  </div>
                );
              
              case "video":
                return (
                  <div key={block.id} className="aspect-video bg-primary rounded-xl flex items-center justify-center my-10 shadow-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/20 transition-colors" />
                    <Play className="w-16 h-16 text-white relative z-10 drop-shadow-md group-hover:scale-110 transition-transform" />
                  </div>
                );
              
              case "list":
                return (
                  <ul key={block.id} className="space-y-4 pl-2">
                    {block.content.split('\n').map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              
              case "quote":
                return (
                  <blockquote key={block.id} className="bg-gray-50 border-l-4 border-secondary p-8 rounded-r-xl italic text-gray-600 text-lg shadow-sm">
                    {block.content}
                  </blockquote>
                );
              
              case "code":
                return (
                  <pre key={block.id} className="bg-primary text-gray-100 p-6 rounded-xl overflow-x-auto text-sm leading-relaxed border border-white/5 shadow-inner">
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
      return <p className="text-lg leading-relaxed text-gray-700">{lesson.content}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed md:relative w-80 bg-gray-50 border-r border-gray-100 h-full z-50 overflow-y-auto flex flex-col"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-gray-50 z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg text-primary truncate pr-4">{course.title}</h2>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                  <span>Progression</span>
                  <span className="text-secondary">{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-secondary"
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 p-4 space-y-8">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted mb-4 px-2">
                    Module {moduleIndex + 1} • {module.title}
                  </h3>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full group flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                            isActive 
                              ? "bg-white text-primary shadow-sm border border-gray-100 font-bold"
                              : "text-muted hover:text-primary hover:bg-gray-100"
                          }`}
                        >
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-gray-300'}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              {lesson.title}
                            </p>
                          </div>
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
        {/* Top Navigation */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Direct</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFirstLesson() && (
              <button 
                onClick={() => navigateLesson("prev")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-all text-xs font-bold text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            
            {!isLastLesson() && (
              <button 
                onClick={() => navigateLesson("next")}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-xs font-bold"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-16 lg:p-24 max-w-5xl mx-auto w-full">
          {activeLesson ? (
            <motion.div
              key={activeLesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-16">
                <span className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Leçon en cours</span>
                <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight leading-tight">{activeLesson.title}</h1>
              </div>
              
              <article className="prose prose-lg max-w-none">
                {renderLessonContent(activeLesson)}
              </article>

              {/* Completion Action */}
              <div className="mt-20 pt-12 border-t border-gray-100">
                {completedLessons.has(activeLesson.id) ? (
                  <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700">Leçon validée !</p>
                      <p className="text-sm text-green-600 font-medium">Continuez sur votre lancée.</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full py-5 bg-secondary text-white rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10 disabled:opacity-50"
                  >
                    {completing ? "Validation en cours..." : "Marquer comme terminée"}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted font-medium">Sélectionnez une leçon pour commencer.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
