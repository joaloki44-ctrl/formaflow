"use client";

import { useState } from "react";
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
  X
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
                return <h2 key={block.id} className="text-2xl font-bold">{block.content}</h2>;
              
              case "heading2":
                return <h3 key={block.id} className="text-xl font-semibold">{block.content}</h3>;
              
              case "text":
                return <p key={block.id} className="leading-relaxed text-gray-700">{block.content}</p>;
              
              case "image":
                return (
                  <div key={block.id} className="my-6">
                    <img 
                      src={block.metadata?.url} 
                      alt={block.metadata?.alt || ""}
                      className="rounded-xl max-h-96 object-cover"
                    />
                  </div>
                );
              
              case "video":
                return (
                  <div key={block.id} className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center my-6">
                    <Play className="w-16 h-16 text-white/50" />
                  </div>
                );
              
              case "list":
                return (
                  <ul key={block.id} className="list-disc list-inside space-y-2 pl-4">
                    {block.content.split('\n').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              
              case "quote":
                return (
                  <blockquote key={block.id} className="border-l-4 border-[#ff6b4a] pl-4 italic text-gray-600">
                    {block.content}
                  </blockquote>
                );
              
              case "code":
                return (
                  <pre key={block.id} className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
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
      // Fallback si pas de JSON (contenu simple)
      return <p className="leading-relaxed">{lesson.content}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed md:relative w-80 bg-white border-r border-gray-200 h-full z-50 overflow-y-auto"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl truncate">{course.title}</h2>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Progression</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff6b4a] to-[#f09340] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted">
                  {completedCount} / {totalLessons} leçons terminées
                </p>
              </div>
            </div>

            {/* Modules List */}
            <div className="p-4 space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2 px-2">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            isActive 
                              ? "bg-[#ff6b4a]/10 text-[#ff6b4a]" 
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#ff6b4a]' : 'text-gray-300'}`} />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? 'text-[#ff6b4a]' : ''}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {lesson.type === 'VIDEO' && <Play className="w-3 h-3 text-gray-400" />}
                              {lesson.type === 'TEXT' && <FileText className="w-3 h-3 text-gray-400" />}
                              {lesson.type === 'QUIZ' && <HelpCircle className="w-3 h-3 text-gray-400" />}
                            </div>
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
        {/* Top Bar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm text-muted">
              {course.modules.find(m => m.lessons.some(l => l.id === activeLessonId))?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isFirstLesson() && (
              <button 
                onClick={() => navigateLesson("prev")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            
            {!isLastLesson() && (
              <button 
                onClick={() => navigateLesson("next")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          {activeLesson ? (
            <motion.div
              key={activeLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-3xl mb-8">{activeLesson.title}</h1>
              
              {renderLessonContent(activeLesson)}

              {/* Completion Button */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                {completedLessons.has(activeLesson.id) ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-4 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Leçon terminée !</span>
                  </div>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full py-4 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {completing ? (
                      "..."
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Marquer comme terminée
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted">Sélectionnez une leçon pour commencer</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
