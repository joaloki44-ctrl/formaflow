"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Clock, Star, Play } from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  level: string;
  category: string | null;
  instructor: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  _count: {
    enrollments: number;
    modules: number;
  };
}

interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Aucune formation disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/courses/${course.id}`}>
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#ff6b4a]/30 hover:shadow-xl transition-all duration-300">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/50" />
                  </div>
                )}
                
                {/* Badge level */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    course.level === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                    course.level === 'INTERMEDIATE' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.level === 'BEGINNER' && 'Débutant'}
                    {course.level === 'INTERMEDIATE' && 'Intermédiaire'}
                    {course.level === 'ADVANCED' && 'Avancé'}
                  </span>
                </div>
                
                {/* Price */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-white rounded-lg font-bold text-sm shadow-lg">
                    {course.price === 0 ? 'Gratuit' : `${course.price}€`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#ff6b4a] transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-muted text-sm line-clamp-2 mb-4">
                  {course.description || 'Aucune description'}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#f09340] flex items-center justify-center text-white text-xs font-bold">
                    {course.instructor.firstName?.[0]}{course.instructor.lastName?.[0]}
                  </div>
                  <span className="text-sm text-muted">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course._count.modules} modules
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}