"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, Award, ChevronRight, CheckCircle2 } from "lucide-react";

interface Enrollment {
  id: string;
  totalProgress: number;
  status: string;
  course: {
    id: string;
    title: string;
    imageUrl: string | null;
    instructor: {
      firstName: string | null;
      lastName: string | null;
    };
    _count: {
      modules: number;
    };
  };
}

interface MyCoursesGridProps {
  enrollments: Enrollment[];
}

export default function MyCoursesGrid({ enrollments }: MyCoursesGridProps) {
  return (
    <div className="space-y-4">
      {enrollments.map((enrollment, index) => (
        <motion.div
          key={enrollment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/courses/${enrollment.course.id}/learn`}>
            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#ff6b4a]/30 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 overflow-hidden relative"
                >
                  {enrollment.course.imageUrl ? (
                    <img
                      src={enrollment.course.imageUrl}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/50" />
                    </div>
                  )}

                  {/* Completed badge */}
                  {enrollment.status === "COMPLETED" && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Terminé
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-[#ff6b4a] transition-colors">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-sm text-muted">
                        par {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff6b4a] transition-colors flex-shrink-0" />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted">Progression</span>
                      <span className="font-medium">{Math.round(enrollment.totalProgress)}%</span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          enrollment.status === "COMPLETED"
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-[#ff6b4a] to-[#f09340]"
                        }`}
                        style={{ width: `${enrollment.totalProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Clock className="w-4 h-4" />
                      {enrollment.course._count.modules} modules
                    </div>

                    {enrollment.status === "COMPLETED" ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Award className="w-4 h-4" />
                        Certificat disponible
                      </div>
                    ) : (
                      <button className="text-sm text-[#ff6b4a] font-medium hover:underline">
                        Continuer →
                      </button>
                    )}
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
