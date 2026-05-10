"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Clock, BookOpen, Award, Play, ChevronRight, Star } from "lucide-react";
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
      {/* Avis et Social Proof */}
      {course.reviews && course.reviews.length > 0 && (
        <div className="container mx-auto px-6 py-12 border-t border-gray-100">
          <h2 className="font-serif text-2xl mb-8 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Avis des apprenants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.reviews.map((review: any) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold overflow-hidden">
                      {review.user.imageUrl ? <img src={review.user.imageUrl} className="w-full h-full object-cover" /> : review.user.firstName?.[0]}
                    </div>
                    <span className="font-bold">{review.user.firstName}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted text-sm italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}