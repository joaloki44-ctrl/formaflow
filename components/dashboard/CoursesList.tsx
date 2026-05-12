"use client";

import Link from "next/link";
import { Eye, Edit, MoreVertical, Globe, Users, BookOpen } from "lucide-react";

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
      <div className="text-center py-24 bg-gray-50/30 rounded-[2.5rem] border-2 border-dashed border-gray-100">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
          <Globe className="w-10 h-10 text-gray-200" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">Prêt à commencer ?</h3>
        <p className="text-muted font-medium text-sm mb-8 max-w-xs mx-auto">
          Vous n'avez pas encore créé de formation. Lancez-vous dès aujourd'hui !
        </p>
        <Link href="/dashboard/courses/new" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 hover:scale-[1.03]">
          Créer ma première formation
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50 overflow-hidden rounded-[2.5rem]">
      {courses.map((course) => (
        <div key={course.id} className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-gray-50/50 transition-all group">
          {/* Thumbnail */}
          <div className="w-full sm:w-32 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 shadow-inner group-hover:border-secondary/20 transition-colors">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <BookOpen className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-primary truncate group-hover:text-secondary transition-colors">{course.title}</h3>
              {course.isPublished ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 tracking-widest shadow-sm">Publié</span>
              ) : (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase rounded-lg border border-gray-100 tracking-widest">Brouillon</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted" />
                <span className="text-xs font-bold text-muted uppercase tracking-tighter">{course._count.enrollments} élèves</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-muted" />
                <span className="text-xs font-bold text-muted uppercase tracking-tighter">{course._count.modules} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 bg-secondary/5 rounded-md">
                  <span className="text-xs font-black text-secondary">{course.price === 0 ? 'GRATUIT' : `${course.price}€`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="flex-1 sm:flex-none p-3 text-muted hover:text-primary hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm flex items-center justify-center"
              title="Consulter"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="flex-1 sm:flex-none p-3 text-muted hover:text-secondary hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm flex items-center justify-center"
              title="Modifier"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button className="flex-1 sm:flex-none p-3 text-muted hover:text-primary hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm flex items-center justify-center">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
