"use client";

import Link from "next/link";
import { Eye, Edit, MoreVertical, Globe } from "lucide-react";

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
      <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Globe className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-muted font-medium mb-6">Vous n'avez pas encore créé de formation.</p>
        <Link href="/dashboard/courses/new" className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-all">
          Créer ma première formation
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {courses.map((course) => (
          <div key={course.id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
            {/* Thumbnail */}
            <div className="w-20 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                  NO IMG
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-primary truncate">{course.title}</h3>
                {course.isPublished ? (
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100 tracking-wider">Publié</span>
                ) : (
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded border border-gray-100 tracking-wider">Brouillon</span>
                )}
              </div>
              <p className="text-xs font-medium text-muted flex items-center gap-2">
                <span className="text-primary">{course._count.enrollments} apprenants</span>
                <span>•</span>
                <span>{course._count.modules} modules</span>
                <span>•</span>
                <span className="text-primary font-bold">{course.price === 0 ? 'Gratuit' : `${course.price}€`}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/courses/${course.id}`}
                className="p-2 text-muted hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                title="Consulter"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <Link
                href={`/dashboard/courses/${course.id}/edit`}
                className="p-2 text-muted hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
