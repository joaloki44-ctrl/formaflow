"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Clock, BookOpen, Award, Play, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function CourseDetailPublic({ course }: any) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleEnroll = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        toast.success("Inscription réussie !");
        router.push(`/courses/${course.id}/learn`);
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'BEGINNER' ? 'bg-green-500/20 text-green-300' :
                  course.level === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {course.level === 'BEGINNER' && 'Débutant'}
                  {course.level === 'INTERMEDIATE' && 'Intermédiaire'}
                  {course.level === 'ADVANCED' && 'Avancé'}
                </span>

                <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">{course.title}</h1>
                <p className="text-white/70 text-lg mb-6">{course.description}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#f09340] flex items-center justify-center font-bold">
                      {course.instructor.firstName?.[0]}{course.instructor.lastName?.[0]}
                    </div>
                    <span>{course.instructor.firstName} {course.instructor.lastName}</span>
                  </div>
                  <span className="text-white/40">•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments} inscrits
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-4">
                <Play className="w-16 h-16 text-white/30" />
              </div>

              <div className="text-3xl font-bold mb-2">
                {course.price === 0 ? 'Gratuit' : `${course.price}€`}
              </div>

              <button 
                onClick={handleEnroll}
                className="w-full py-3 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {isSignedIn ? 'S\'inscrire maintenant' : 'Connectez-vous pour vous inscrire'}
              </button>

              <div className="mt-4 space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.modules.length} modules
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificat de fin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programme */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl mb-6">Programme de la formation</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {course.modules.map((module: any, idx: number) => (
            <div key={module.id} className="border-b border-gray-100 last:border-0">
              <div className="p-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#ff6b4a] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="font-medium">{module.title}</span>
                <span className="text-muted text-sm">({module.lessons?.length || 0} leçons)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}