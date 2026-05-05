"use client";

import Link from "next/link";
import { Eye, Edit, Users, Sparkles } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  isPublished: boolean;
  category: string | null;
  _count: {
    enrollments: number;
    modules: number;
  };
}

interface CoursesListProps {
  courses: Course[];
}

export default function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/40">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-muted mb-6">Vous n'avez pas encore de formation</p>
        <Link href="/dashboard/courses/new" className="btn-primary">
          Créer ma première formation
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="group p-4 bg-white/40 hover:bg-white/80 backdrop-blur-xs border border-white/40 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:translate-x-1"
        >
          {/* Thumbnail with Glass effect */}
          <div className="w-20 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 overflow-hidden relative shadow-inner">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                {course.title[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate group-hover:text-[#ff6b4a] transition-colors">{course.title}</h3>
              {course.isPublished ? (
                <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-md">Publié</span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md">Brouillon</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course._count.enrollments}
              </span>
              <span>•</span>
              <span>{course._count.modules} modules</span>
              <span>•</span>
              <span className="font-bold text-gray-700">{course.price === 0 ? 'Gratuit' : `${course.price}€`}</span>
            </div>
          </div>

          {/* Actions - Floating style */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              title="Voir"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </Link>
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
              title="Modifier"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
