"use client";

import Link from "next/link";
import { Eye, Edit, Users, Globe, BookOpen, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-white/5">
        <div className="w-24 h-24 bg-dark rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/5">
          <Layers className="w-10 h-10 text-slate-700" />
        </div>
        <p className="text-slate-500 font-bold text-xl mb-10 tracking-tight">Votre catalogue est vide.</p>
        <Link href="/dashboard/courses/new" className="btn-saas-primary">
          Déployer une Formation
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course, i) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group p-6 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 transition-all duration-500 shadow-2xl"
        >
          {/* Elite Thumbnail */}
          <div className="w-full md:w-32 h-24 bg-dark rounded-[1.5rem] flex-shrink-0 overflow-hidden relative border border-white/5 shadow-inner group-hover:scale-105 transition-transform duration-500">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-3xl">
                {course.title[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Detailed Info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h3 className="font-bold text-white truncate text-2xl tracking-tighter group-hover:text-secondary transition-colors">{course.title}</h3>
              <div className="flex justify-center gap-2">
                {course.isPublished ? (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">Actif</span>
                ) : (
                  <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/5">Brouillon</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-dark rounded-xl border border-white/5">
                <Users className="w-4 h-4 text-secondary" />
                <span className="text-white">{course._count.enrollments}</span> Apprenants
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{course._count.modules} Modules</span>
              </div>
              <div className="flex items-center gap-2 ml-auto text-secondary text-lg tracking-tighter normal-case font-black">
                {course.price === 0 ? 'Gratuit' : `${course.price}€`}
              </div>
            </div>
          </div>

          {/* Quick Actions - Pro UI */}
          <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-4 md:group-hover:translate-x-0">
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all"
              title="Aperçu"
            >
              <Eye className="w-6 h-6" />
            </Link>
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="p-4 bg-secondary/10 hover:bg-secondary text-white rounded-2xl border border-secondary/20 transition-all shadow-neon"
              title="Modifier"
            >
              <Edit className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
