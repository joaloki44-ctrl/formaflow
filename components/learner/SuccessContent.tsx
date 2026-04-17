"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Play, Gift, ArrowRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: {
    firstName: string | null;
    lastName: string | null;
  };
}

export default function SuccessContent({ course }: { course: Course }) {
  useEffect(() => {
    // Confetti effect could be added here
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl mb-2">Félicitations ! 🎉</h1>

        <p className="text-muted mb-6">
          Vous êtes maintenant inscrit à <span className="font-semibold text-[#1a1a1a]">{course.title}</span>
        </p>

        {/* Instructor */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm">
          <span className="text-muted">Formateur : </span>
          <span className="font-medium">{course.instructor.firstName} {course.instructor.lastName}</span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href={`/courses/${course.id}/learn`}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            <Play className="w-5 h-5" />
            Commencer la formation
          </Link>

          <Link
            href="/my-courses"
            className="btn-outline w-full py-3 flex items-center justify-center gap-2"
          >
            Voir mes formations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bonus */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-muted">
            <Gift className="w-5 h-5 text-[#ff6b4a]" />
            <span>Accès à vie • Certificat inclus</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
