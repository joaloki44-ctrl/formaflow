"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ChevronRight, BookOpen, Video, FileText } from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Modules List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-serif text-xl">Contenu de la formation</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {course.modules.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted mb-4">Aucun module pour le moment</p>
                <Link 
                  href={`/dashboard/courses/${course.id}/modules/new`}
                  className="btn-primary"
                >
                  Créer mon premier module
                </Link>
              </div>
            ) : (
              course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="bg-white">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {moduleIndex + 1}
                      </span>
                      <span className="font-semibold">{module.title}</span>
                      <span className="text-sm text-muted">({module.lessons.length} leçons)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/dashboard/courses/${course.id}/modules/${module.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg"
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

                  {/* Lessons List */}
                  <div className={`overflow-hidden transition-all ${
                    expandedModules.includes(module.id) ? 'max-h-fit' : 'max-h-0'
                  }`}>
                    <div className="bg-gray-50 divide-y divide-gray-100">
                      {module.lessons.length === 0 ? (
                        <div className="p-4 px-12 text-center">
                          <p className="text-sm text-muted">Aucune leçon</p>
                          <Link 
                            href={`/dashboard/courses/${course.id}/modules/${module.id}/lessons/new`}
                            className="text-sm text-[#ff6b4a] hover:underline mt-2 inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Ajouter leçon
                          </Link>
                        </div>
                      ) : (
                        module.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lesson.id}
                            className="p-4 px-12 flex items-center justify-between hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.type === 'VIDEO' && <Video className="w-4 h-4 text-blue-500" />}
                              {lesson.type === 'TEXT' && <FileText className="w-4 h-4 text-green-500" />}
                              {lesson.type === 'QUIZ' && <BookOpen className="w-4 h-4 text-purple-500" />}
                              <span className="text-sm">{lesson.title}</span>
                              {!lesson.isPublished && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Brouillon</span>}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Link 
                                href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/edit`}
                                className="p-1.5 hover:bg-gray-200 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* Add lesson button */}
                      <div className="p-3 px-12">
                        <Link 
                          href={`/dashboard/courses/${course.id}/modules/${module.id}/lessons/new`}
                          className="text-sm text-[#ff6b4a] hover:underline inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Ajouter une leçon
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

      {/* Sidebar Info */}
      <div className="space-y-6">
        {/* Course Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="font-semibold mb-4">Informations</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted">Prix</p>
              <p className="font-semibold">{course.price} €</p>
            </div>
            
            <div>
              <p className="text-sm text-muted">Niveau</p>
              <p className="font-semibold">{course.level === 'BEGINNER' ? 'Débutant' : course.level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted">Status</p>
              <span className={`inline-block px-2 py-0.5 rounded text-sm ${
                course.isPublished 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {course.isPublished ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            
            {course.category && (
              <div>
                <p className="text-sm text-muted">Catégorie</p>
                <p className="font-semibold">{course.category}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="font-semibold mb-4">Description</h3>
          <p className="text-sm text-muted">{course.description || "Aucune description"}</p>
        </div>
      </div>
    </div>
  );
}
