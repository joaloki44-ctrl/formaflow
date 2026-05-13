"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Clock, BookOpen, Award, Play, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CourseDetailPublic({ course }: any) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      // If course is free, use enrollment API, otherwise checkout API
      const endpoint = course.price === 0 ? "/api/enrollments" : "/api/checkout";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          window.location.assign(data.url);
        } else {
          toast.success("Inscription réussie !");
          router.push(`/courses/${course.id}/learn`);
        }
      } else {
        toast.error(data || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur lors de la transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    course.level === 'BEGINNER' ? 'bg-emerald-500/20 text-emerald-400' :
                    course.level === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {course.level === 'BEGINNER' ? 'Débutant' : course.level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {course.category || 'Formation'}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-gray-400 text-xl mb-10 max-w-2xl leading-relaxed font-medium">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 flex-wrap border-t border-white/5 pt-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center font-black text-secondary border border-secondary/20 shadow-lg shadow-secondary/5">
                      {course.instructor.firstName?.[0]}{course.instructor.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Instructeur</p>
                      <p className="font-bold text-white">{course.instructor.firstName} {course.instructor.lastName}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Inscrits</p>
                      <p className="font-bold text-white">{course._count.enrollments} élèves</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 sticky top-32"
            >
              <div className="aspect-video bg-gray-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group">
                {course.imageUrl ? (
                   <img src={course.imageUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                ) : (
                   <Play className="w-16 h-16 text-white/10" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                   </div>
                </div>
              </div>

              <div className="flex items-end gap-2 mb-8">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">
                  {course.price === 0 ? 'Gratuit' : `${course.price}€`}
                </span>
                {course.price > 0 && <span className="text-gray-400 font-bold mb-2 line-through">149€</span>}
              </div>

              <button 
                onClick={handleEnroll}
                disabled={isLoading}
                className="w-full py-6 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignedIn ? 'S\'inscrire' : 'Rejoindre la formation')}
              </button>

              <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{course.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Certifié</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">Programme complet</h2>
          <div className="space-y-6">
            {course.modules.map((module: any, idx: number) => (
              <div key={module.id} className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-gray-500/5 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 font-black border border-gray-100 shadow-sm group-hover:text-secondary group-hover:border-secondary/20 transition-all">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{module.lessons?.length || 0} leçons opérationnelles</p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-white border border-gray-100 text-gray-300">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
