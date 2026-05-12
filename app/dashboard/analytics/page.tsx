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

export default async function AnalyticsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId: user.id }
    },
    include: {
      course: { select: { price: true } }
    }
  });

  const totalRevenue = enrollments.reduce((sum, e) => sum + e.course.price, 0);
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.totalProgress, 0) / enrollments.length)
    : 0;

  const topCourses = [...courses]
    .sort((a, b) => b._count.enrollments - a._count.enrollments)
    .slice(0, 3);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Statistiques</h1>
        <p className="text-muted mt-1 font-medium text-sm">Analysez vos performances et la croissance de votre académie.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Revenus Totaux", value: `${totalRevenue.toFixed(2)}€`, icon: DollarSign, trend: "+12.5%", color: "bg-emerald-50 text-emerald-600" },
          { label: "Inscriptions", value: totalEnrollments, icon: Users, trend: "+8.2%", color: "bg-blue-50 text-blue-600" },
          { label: "Progression Moy.", value: `${avgProgress}%`, icon: TrendingUp, trend: "+5.1%", color: "bg-amber-50 text-amber-600" },
          { label: "Taux de Réussite", value: "94%", icon: Award, trend: "+2.4%", color: "bg-purple-50 text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.trend}
              </div>
            </div>
            <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold text-primary tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-primary rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/10">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Courbe de Croissance</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Évolution des inscriptions sur les 30 derniers jours</p>
              </div>
              <select className="bg-white/10 border border-white/10 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-secondary/50 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all">
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
              </select>
            </div>

            <div className="h-72 w-full flex items-end gap-3 px-4 flex-1">
              {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                  <div
                    className="w-full bg-secondary/30 rounded-t-2xl transition-all group-hover:bg-secondary relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl scale-90 group-hover:scale-100">
                      {h*2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-8 tracking-tight">Top Formations</h3>
            <div className="space-y-8">
              {topCourses.map((course, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-secondary font-black text-sm border border-gray-100 shadow-inner">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate mb-0.5">{course.title}</p>
                    <p className="text-xs text-muted font-bold tracking-tight">{course._count.enrollments} apprenants</p>
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
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Passez au niveau Élite</h3>
              <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">
                Débloquez les analyses prédictives et les certificats blockchain infalsifiables pour vos élèves.
              </p>
              <button className="w-full py-5 bg-white text-secondary font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.03] transition-all shadow-xl border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
                Voir l'offre premium
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
