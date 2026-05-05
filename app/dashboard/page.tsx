import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { Plus, LayoutDashboard, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return <div>Chargement...</div>;
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: {
        select: { 
          enrollments: true,
          modules: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalStudents = await prisma.enrollment.count({
    where: {
      course: { instructorId: user.id },
    },
  });

  const totalRevenue = await prisma.enrollment.aggregate({
    where: {
      course: { instructorId: user.id },
    },
    _sum: { course: { select: { price: true } } },
  });

  return (
    <div className="p-8 space-y-8 bg-[#faf9f6] min-h-full">
      {/* Header with Liquid Glass style */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/40 p-8 rounded-[2rem] shadow-xl shadow-black/5">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#ff6b4a]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Instructeur Pro</span>
            </div>
            <h1 className="font-serif text-4xl">Bonjour, {user.firstName} !</h1>
            <p className="text-muted mt-2 max-w-md">Prêt à créer la prochaine expérience d'apprentissage mémorable ?</p>
          </div>
          <Link
            href="/dashboard/courses/new"
            className="group flex items-center gap-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-[#ff6b4a]/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Nouvelle formation
          </Link>
        </div>

        {/* Background shapes */}
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-[#ff6b4a]/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-20%] left-[-5%] w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full" />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardStats
            totalCourses={courses.length}
            totalStudents={totalStudents}
            totalRevenue={totalRevenue._sum?.price || 0}
          />

          <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-[2rem] p-8 shadow-lg shadow-black/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl">Dernières formations</h2>
              <Link href="/dashboard/courses" className="text-sm font-medium text-[#ff6b4a] hover:underline">
                Voir tout
              </Link>
            </div>
            <CoursesList courses={courses} />
          </div>
        </div>

        {/* Sidebar / Secondary Widgets */}
        <div className="space-y-8">
          {/* Quick Actions / Tips */}
          <div className="bg-primary text-white rounded-[2rem] p-8 shadow-xl shadow-black/20 overflow-hidden relative group">
            <h3 className="text-xl font-bold mb-4 relative z-10">Astuce du jour</h3>
            <p className="text-gray-300 text-sm leading-relaxed relative z-10">
              Les leçons de moins de 5 minutes augmentent le taux de complétion de 40%. Essayez de découper vos modules !
            </p>
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutDashboard className="w-24 h-24 rotate-12" />
            </div>
          </div>

          {/* Social Proof Placeholder */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/40 rounded-[2rem] p-8">
            <h3 className="font-semibold mb-4">Activité récente</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
