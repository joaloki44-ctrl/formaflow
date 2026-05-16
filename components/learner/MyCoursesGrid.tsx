"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, Award, ChevronRight, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface Assignment {
  isMandatory: boolean;
  dueDate: string | null;
  organization: { id: string; name: string };
}

interface Enrollment {
  id: string;
  totalProgress: number;
  status: string;
  assignment?: Assignment | null;
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
  function getDueDateStatus(dueDate: string) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: `En retard de ${Math.abs(diffDays)}j`, color: "text-red-600 bg-red-50 border-red-200" };
    if (diffDays <= 3) return { label: `${diffDays}j restant${diffDays !== 1 ? "s" : ""}`, color: "text-orange-600 bg-orange-50 border-orange-200" };
    if (diffDays <= 7) return { label: `${diffDays}j restants`, color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    return { label: new Date(dueDate).toLocaleDateString("fr-FR"), color: "text-gray-500 bg-gray-50 border-gray-200" };
  }

  const mandatory = enrollments.filter((e) => e.assignment?.isMandatory && e.status !== "COMPLETED");
  const others = enrollments.filter((e) => !e.assignment?.isMandatory || e.status === "COMPLETED");

  function renderCard(enrollment: Enrollment, index: number) {
    const a = enrollment.assignment;
    const isOverdue = a?.dueDate && new Date(a.dueDate) < new Date() && enrollment.status !== "COMPLETED";
    const dueDateStatus = a?.dueDate && enrollment.status !== "COMPLETED" ? getDueDateStatus(a.dueDate) : null;

    return (
      <motion.div
        key={enrollment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
      >
        <Link href={`/courses/${enrollment.course.id}/learn`}>
          <div
            className={`group bg-white rounded-2xl border p-6 hover:shadow-lg transition-all ${
              isOverdue ? "border-red-200 hover:border-red-300" : "border-gray-200 hover:border-[#ff6b4a]/30"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 overflow-hidden relative">
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

                {enrollment.status === "COMPLETED" && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terminé
                  </div>
                )}
                {a?.isMandatory && enrollment.status !== "COMPLETED" && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-md flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Obligatoire
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-semibold text-lg group-hover:text-[#ff6b4a] transition-colors truncate">
                        {enrollment.course.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted">
                      par {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                    </p>
                    {a?.organization && (
                      <p className="text-xs text-orange-600 mt-0.5">📂 {a.organization.name}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff6b4a] transition-colors flex-shrink-0" />
                </div>

                {/* Due date */}
                {dueDateStatus && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mt-2 ${dueDateStatus.color}`}>
                    <Calendar className="w-3 h-3" />
                    Échéance : {dueDateStatus.label}
                  </div>
                )}

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
                          : isOverdue
                          ? "bg-red-400"
                          : "bg-gradient-to-r from-[#ff6b4a] to-[#f09340]"
                      }`}
                      style={{ width: `${enrollment.totalProgress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Mandatory section */}
      {mandatory.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Formations obligatoires ({mandatory.length})
          </h2>
          <div className="space-y-4">
            {mandatory.map((e, i) => renderCard(e, i))}
          </div>
        </div>
      )}

      {/* Other courses */}
      {others.length > 0 && (
        <div>
          {mandatory.length > 0 && (
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Autres formations ({others.length})
            </h2>
          )}
          <div className="space-y-4">
            {others.map((e, i) => renderCard(e, mandatory.length + i))}
          </div>
        </div>
      )}
    </div>
  );
}
