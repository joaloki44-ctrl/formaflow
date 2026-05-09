import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, LayoutDashboard, Sparkles, PlusCircle, ArrowUpRight, Zap, Target, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Handle sync gap
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in");
    }

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || "",
        role: "INSTRUCTOR",
      },
    });
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

  const totalCourses = await prisma.course.count({
    where: { instructorId: user.id },
  });

  const totalStudents = await prisma.enrollment.count({
    where: {
      course: { instructorId: user.id },
    },
  });

  const enrollmentsWithPrice = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
    },
    include: { course: { select: { price: true } } },
  });
  const totalRevenue = enrollmentsWithPrice.reduce((sum, e) => sum + e.course.price, 0);

  return (
    <div className="md:ml-80 bg-dark min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.05),transparent_50%)] pointer-events-none" />

      <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10">

        {/* Elite Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <div className="flex items-center gap-3 text-secondary mb-4">
              <Sparkles className="w-5 h-5 fill-secondary shadow-neon" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Console de Commandement</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-6">
              Bonjour, {user.firstName}
            </h1>
            <p className="text-slate-500 font-medium text-xl max-w-xl leading-snug">
              Votre infrastructure pédagogique est opérationnelle. <br />
              Les systèmes sont à pleine capacité.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/courses/new"
              className="btn-saas-primary py-5 px-10 flex items-center gap-4 group shadow-neon"
            >
              <PlusCircle className="w-6 h-6 transition-transform group-hover:rotate-90" />
              <span className="text-sm font-black uppercase tracking-widest">Nouveau Contenu</span>
            </Link>
          </div>
        </div>

        {/* Bento Stats Orchestration */}
        <div className="mb-20">
          <DashboardStats
            totalCourses={totalCourses}
            totalStudents={totalStudents}
            totalRevenue={totalRevenue}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Main Content - Bento Box Large */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bento-card border border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 text-white font-bold">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                    <Target className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl tracking-tighter">Flux d'Activité</h2>
                </div>
                <Link href="/dashboard/courses" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 group">
                  Historique Complet <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              <CoursesList courses={courses} />
            </div>
          </div>

          {/* Sidebar Widgets - Bento Box Smaller */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bento-card bg-secondary/10 border-secondary/20 shadow-neon relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-secondary mb-6">
                  <ShieldCheck className="w-5 h-5 fill-secondary shadow-neon" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Sécurité Système</h3>
                </div>
                <p className="text-white text-lg font-bold mb-8 leading-tight">
                  Toutes vos données sont sécurisées sur l'Edge.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocoles Actifs</span>
                </div>
              </div>
              <Zap className="absolute bottom-[-10%] right-[-10%] w-40 h-40 text-secondary opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>

            <div className="bento-card bg-white/[0.02] border-white/5 p-10">
              <h3 className="text-xl font-bold mb-8 text-white tracking-tight uppercase tracking-widest text-xs">Analyse du Réseau</h3>
              <div className="space-y-8">
                {[
                  { label: "Nouveaux inscrits", val: "85%", color: "bg-secondary" },
                  { label: "Taux de complétion", val: "64%", color: "bg-blue-400" },
                  { label: "Engagement mobile", val: "92%", color: "bg-emerald-400" }
                ].map((stat, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                      <span className="text-xs font-black text-white">{stat.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} rounded-full transition-all duration-1000`} style={{ width: stat.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
