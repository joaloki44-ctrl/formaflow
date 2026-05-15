import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Zap
} from "lucide-react";
import { startOfMonth, endOfMonth, subMonths, format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import AnalyticsFilter from "@/components/dashboard/analytics/AnalyticsFilter";

export default async function AnalyticsPage({
  searchParams
}: {
  searchParams: { days?: string }
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const days = parseInt(searchParams.days || "30");
  const now = new Date();
  const startDate = subDays(now, days);

  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: { _count: { select: { enrollments: true } } }
  });

  const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

  const currentMonthEnrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
      createdAt: { gte: currentMonthStart }
    },
    include: { course: { select: { price: true } } }
  });

  const lastMonthEnrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
    },
    include: { course: { select: { price: true } } }
  });

  const currentRevenue = currentMonthEnrollments.reduce((sum, e) => sum + e.course.price, 0);
  const lastRevenue = lastMonthEnrollments.reduce((sum, e) => sum + e.course.price, 0);

  const revenueTrend = lastRevenue === 0 ? 100 : Math.round(((currentRevenue - lastRevenue) / lastRevenue) * 100);
  const enrollmentTrend = lastMonthEnrollments.length === 0 ? 100 : Math.round(((currentMonthEnrollments.length - lastMonthEnrollments.length) / lastMonthEnrollments.length) * 100);

  const allEnrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
      createdAt: { gte: startDate }
    },
    include: { course: { select: { price: true } } }
  });

  const grandTotalRevenue = allEnrollments.reduce((sum, e) => sum + e.course.price, 0);
  const avgProgress = allEnrollments.length > 0
    ? Math.round(allEnrollments.reduce((sum, e) => sum + e.totalProgress, 0) / allEnrollments.length)
    : 0;

  const completedEnrollments = allEnrollments.filter(e => e.status === "COMPLETED").length;
  const successRate = allEnrollments.length > 0 ? Math.round((completedEnrollments / allEnrollments.length) * 100) : 0;

  // Chart aggregation
  const chartSteps = 12;
  const chartData = Array.from({ length: chartSteps }).map((_, i) => {
    const d = subDays(now, (chartSteps - 1 - i) * (days / chartSteps));
    const count = allEnrollments.filter(e => e.createdAt <= d).length; // Cumulative for growth
    return { day: format(d, 'dd MMM', { locale: fr }), count };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const topCourses = [...courses].sort((a, b) => b._count.enrollments - a._count.enrollments).slice(0, 3);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Statistiques Détaillées</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Analysez la croissance de votre académie sur les {days} derniers jours.</p>
        </div>
        <AnalyticsFilter defaultValue={days.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Revenus (Période)", value: `${grandTotalRevenue.toFixed(2)}€`, icon: DollarSign, trend: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}%`, color: "bg-emerald-50 text-emerald-600", positive: revenueTrend >= 0 },
          { label: "Inscriptions", value: allEnrollments.length, icon: Users, trend: `${enrollmentTrend >= 0 ? '+' : ''}${enrollmentTrend}%`, color: "bg-blue-50 text-blue-600", positive: enrollmentTrend >= 0 },
          { label: "Progression Moy.", value: `${avgProgress}%`, icon: TrendingUp, trend: "Stable", color: "bg-amber-50 text-amber-600", positive: true },
          { label: "Taux de Réussite", value: `${successRate}%`, icon: Award, trend: "Elite", color: "bg-purple-50 text-purple-600", positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.positive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'} px-3 py-1.5 rounded-full uppercase tracking-widest border`}>
                {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/10">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-2xl font-bold tracking-tight mb-12 text-center sm:text-left">Courbe de croissance cumulative</h3>
            <div className="h-72 w-full flex items-end gap-3 px-4 flex-1">
              {chartData.map((d, i) => {
                const height = Math.max((d.count / maxCount) * 100, 5);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                    <div
                      className="w-full bg-secondary/30 rounded-t-2xl transition-all group-hover:bg-secondary relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl scale-90 group-hover:scale-100 whitespace-nowrap">
                        {d.count} inscrits
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase rotate-45 sm:rotate-0">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Top Formations</h3>
            <div className="space-y-8">
              {topCourses.map((course, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-secondary font-black text-sm border border-gray-100 shadow-inner">#{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{course.title}</p>
                    <p className="text-xs text-gray-400 font-bold tracking-tight">{course._count.enrollments} apprenants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-secondary uppercase tracking-tighter bg-secondary/5 px-2 py-1 rounded-lg border border-secondary/10">
                      {Math.round((course._count.enrollments / (totalEnrollments || 1)) * 100)}%
                    </p>
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
