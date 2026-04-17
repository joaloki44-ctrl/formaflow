"use client";

import Link from "next/link";
import { Eye, Edit, MoreVertical } from "lucide-react";

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
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <p className="text-muted mb-4">Vous n'avez pas encore de formation</p>
        <Link href="/dashboard/courses/new" className="btn-primary">
          Créer ma première formation
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {courses.map((course) => (
          <div key={course.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            {/* Thumbnail */}
            <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{course.title}</h3>
                {course.isPublished ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Publié</span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Brouillon</span>
                )}
              </div>
              <p className="text-sm text-muted truncate">
                {course._count.modules} modules • {course._count.enrollments} inscrits • {course.price}€
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link 
                href={`/dashboard/courses/${course.id}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Voir"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </Link>
              <Link 
                href={`/dashboard/courses/${course.id}/edit`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
