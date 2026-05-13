"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ChevronRight, BookOpen, Video, FileText, Paperclip, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  type: string;
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
  description: string;
  price: number;
  isPublished: boolean;
  category: string | null;
  level: string;
  modules: Module[];
}

export default function CourseDetail({ course }: { course: Course }) {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map(m => m.id)
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isReadyToPublish = course.description && course.modules.length > 0 && course.modules.some(m => m.lessons.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        {!course.isPublished && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Formation en mode brouillon</p>
              <p className="text-xs text-amber-700 font-medium mt-1">
                {isReadyToPublish
                  ? "Votre contenu est prêt ! Rendez-vous dans les paramètres pour publier la formation."
                  : "Ajoutez au moins un module et une leçon pour pouvoir publier cette formation."}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Programme de la formation</h2>
            <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">{course.modules.length} Modules</span>
          </div>

          <div className="divide-y divide-gray-100">
            {course.modules.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-500 font-bold mb-8">Votre formation est vide.</p>
                <Link 
                  href={`/dashboard/courses/${course.id}/modules/new`}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20"
                >
                  Ajouter le premier module
                </Link>
              </div>
            ) : (
              course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="bg-white group/mod">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-sm font-black shadow-sm group-hover/mod:scale-110 transition-transform">
                        {moduleIndex + 1}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-gray-900 block">{module.title}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.lessons.length} Leçons</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link 
                        href={`/dashboard/courses/${course.id}/modules/${module.id}/edit`}
                        className="p-2.5 bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-xl transition-all"
                        onClick={e => e.stopPropagation()}
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </Link>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedModules.includes(module.id) ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedModules.includes(module.id) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="bg-gray-50/50 p-4 pt-0 space-y-2">
                      {module.lessons.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                          <p className="text-xs font-bold text-gray-400 mb-4">Aucune leçon dans ce module</p>
                          <Link 
                            href={`/dashboard/courses/${course.id}/modules/${module.id}/lessons/new`}
                            className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
                          >
                            + Ajouter une leçon
                          </Link>
                        </div>
                      ) : (
                        module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id}
                            className="bg-white p-4 px-6 rounded-2xl flex items-center justify-between border border-transparent hover:border-secondary/20 hover:shadow-lg hover:shadow-secondary/5 transition-all group/les"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover/les:bg-secondary/5 transition-colors">
                                {lesson.type === 'VIDEO' && <Video className="w-4 h-4 text-blue-500" />}
                                {lesson.type === 'TEXT' && <FileText className="w-4 h-4 text-emerald-500" />}
                                {lesson.type === 'FILE' && <Paperclip className="w-4 h-4 text-amber-500" />}
                                {lesson.type === 'QUIZ' && <BookOpen className="w-4 h-4 text-purple-500" />}
                              </div>
                              <span className="text-sm font-bold text-gray-700">{lesson.title}</span>
                              {!lesson.isPublished && <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-400 font-black uppercase rounded-md tracking-tighter">Brouillon</span>}
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover/les:opacity-100 transition-opacity">
                              <Link 
                                href={`/dashboard/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-gray-400 hover:text-secondary" />
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                      
                      <div className="px-6 py-4">
                        <Link 
                          href={`/dashboard/courses/${course.id}/modules/${module.id}/lessons/new`}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter une leçon au module
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 tracking-tight text-lg">Checklist de Lancement</h3>
          <div className="space-y-4">
             {[
               { label: "Description du cours", done: !!course.description },
               { label: "Au moins un module", done: course.modules.length > 0 },
               { label: "Au moins une leçon", done: course.modules.some(m => m.lessons.length > 0) },
               { label: "Prix configuré", done: course.price >= 0 },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-3">
                 {item.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-200" />}
                 <span className={`text-xs font-bold ${item.done ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-gray-900/20">
          <div className="relative z-10">
            <h4 className="font-bold mb-3 tracking-tight text-secondary">Elite Ops 2026</h4>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              Votre structure de cours est optimisée pour une expérience d'apprentissage cinématographique.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl rounded-full" />
        </div>
      </div>
    </div>
  );
}
