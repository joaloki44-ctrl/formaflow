import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CoursesList from "@/components/dashboard/CoursesList";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { getOrCreateUser } from "@/lib/user-utils";
import { startOfMonth, subMonths } from "date-fns";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { course: { instructorId: user.id } },
    include: { course: { select: { price: true } } },
  });

  const totalCourses = await prisma.course.count({ where: { instructorId: user.id } });
  const totalStudents = enrollments.length;
  const totalRevenue = enrollments.reduce((sum, e) => sum + e.course.price, 0);

  // Growth calculation (enrollments this month vs last month)
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = currentMonthStart;

  const currentMonthCount = enrollments.filter(e => e.createdAt >= currentMonthStart).length;
  const lastMonthCount = enrollments.filter(e => e.createdAt >= lastMonthStart && e.createdAt < lastMonthEnd).length;

  const growthRate = lastMonthCount === 0 ? (currentMonthCount > 0 ? "+100%" : "0%") : `${Math.round(((currentMonthCount - lastMonthCount) / lastMonthCount) * 100)}%`;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-10 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Bienvenue, {user.firstName}. Votre académie en un coup d'œil.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/courses/new"
            className="flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle formation
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <DashboardStats
          totalCourses={totalCourses}
          totalStudents={totalStudents}
          totalRevenue={totalRevenue}
          growth={growthRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Formations récentes</h2>
              <Link href="/dashboard/courses" className="text-xs font-black uppercase tracking-widest text-secondary hover:underline underline-offset-8 transition-all">
                Voir tout le catalogue
              </Link>
            </div>
            <CoursesList courses={courses} />
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-gray-900/10">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4 text-white tracking-tight">Centre d'aide Elite</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                  Optimisez vos conversions avec nos guides experts en pédagogie numérique.
                </p>
                <Link href="#" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-secondary hover:text-white transition-colors gap-3 group">
                  Documentation Premium
                  <span className="transition-transform group-hover:translate-x-2">→</span>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="border border-gray-100 p-10 rounded-[3rem] bg-white shadow-sm">
              <h3 className="font-bold text-gray-900 mb-8 tracking-tight">Checklist Succès</h3>
              <ul className="space-y-6">
                {[
                  { step: "Publier votre premier cours", done: totalCourses > 0 },
                  { step: "Configurer les paiements Stripe", done: false },
                  { step: "Compléter votre profil public", done: !!user.firstName },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-500">
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-100 text-gray-300'}`}>
                      {item.done ? "✓" : i+1}
                    </div>
                    <span className={item.done ? 'line-through opacity-50' : ''}>{item.step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
