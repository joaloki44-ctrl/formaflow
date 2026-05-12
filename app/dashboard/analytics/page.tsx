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
  Star,
  Award,
  Zap
} from "lucide-react";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AnalyticsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Fetch all courses to get total stats
  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

  // Fetch current month enrollments
  const currentMonthEnrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id },
      createdAt: { gte: currentMonthStart }
    },
    include: { course: { select: { price: true } } }
  });

  // Fetch last month enrollments for trend calculation
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
    where: { course: { instructorId: user.id } }
  });

  const totalRevenue = allEnrollments.reduce((sum, e) => sum + 0, 0); // Need to fetch course price for all
  // Let's optimize
  const enrollmentsWithPrice = await prisma.enrollment.findMany({
    where: { course: { instructorId: user.id } },
    include: { course: { select: { price: true } } }
  });
  const grandTotalRevenue = enrollmentsWithPrice.reduce((sum, e) => sum + e.course.price, 0);

  const avgProgress = allEnrollments.length > 0
    ? Math.round(allEnrollments.reduce((sum, e) => sum + e.totalProgress, 0) / allEnrollments.length)
    : 0;

  const completedEnrollments = allEnrollments.filter(e => e.status === "COMPLETED").length;
  const successRate = allEnrollments.length > 0 ? Math.round((completedEnrollments / allEnrollments.length) * 100) : 0;

  // Real data for growth chart (last 12 days)
  const chartData = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (11 - i));
    const count = allEnrollments.filter(e =>
      e.createdAt.getDate() === date.getDate() &&
      e.createdAt.getMonth() === date.getMonth()
    ).length;
    return { day: format(date, 'dd', { locale: fr }), count };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  const topCourses = [...courses]
    .sort((a, b) => b._count.enrollments - a._count.enrollments)
    .slice(0, 3);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Statistiques Détaillées</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Données en temps réel basées sur l'activité de vos élèves.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Revenus Totaux", value: `${grandTotalRevenue.toFixed(2)}€`, icon: DollarSign, trend: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}%`, color: "bg-emerald-50 text-emerald-600", positive: revenueTrend >= 0 },
          { label: "Inscriptions", value: totalEnrollments, icon: Users, trend: `${enrollmentTrend >= 0 ? '+' : ''}${enrollmentTrend}%`, color: "bg-blue-50 text-blue-600", positive: enrollmentTrend >= 0 },
          { label: "Progression Moy.", value: `${avgProgress}%`, icon: TrendingUp, trend: "Stable", color: "bg-amber-50 text-amber-600", positive: true },
          { label: "Taux de Réussite", value: `${successRate}%`, icon: Award, trend: "Top 5%", color: "bg-purple-50 text-purple-600", positive: true },
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
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Activité Récente</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Nombre d'inscriptions par jour</p>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest backdrop-blur-md">
                12 derniers jours
              </div>
            </div>

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
                        {d.count} inscription{d.count > 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Classement Formations</h3>
            <div className="space-y-8">
              {topCourses.map((course, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-secondary font-black text-sm border border-gray-100 shadow-inner">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{course.title}</p>
                    <p className="text-xs text-gray-400 font-bold tracking-tight">{course._count.enrollments} apprenant{course._count.enrollments > 1 ? 's' : ''}</p>
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

          <div className="bg-secondary p-10 rounded-[3rem] text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-[1.25rem] flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Optimisation IA</h3>
              <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">
                Découvrez quelles leçons bloquent vos élèves et boostez votre taux de complétion.
              </p>
              <button className="w-full py-5 bg-white text-secondary font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.03] transition-all shadow-xl">
                Activer les insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
