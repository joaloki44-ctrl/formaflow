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

  // Fetch metrics
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

  // Mock data for top courses (real data from Prisma)
  const topCourses = [...courses]
    .sort((a, b) => b._count.enrollments - a._count.enrollments)
    .slice(0, 3);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Statistiques</h1>
        <p className="text-muted mt-1 font-medium">Analysez vos performances et la croissance de votre académie.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Revenus Totaux", value: `${totalRevenue.toFixed(2)}€`, icon: DollarSign, trend: "+12.5%", color: "bg-emerald-50 text-emerald-600" },
          { label: "Inscriptions", value: totalEnrollments, icon: Users, trend: "+8.2%", color: "bg-blue-50 text-blue-600" },
          { label: "Progression Moy.", value: `${avgProgress}%`, icon: TrendingUp, trend: "+5.1%", color: "bg-amber-50 text-amber-600" },
          { label: "Taux de Réussite", value: "94%", icon: Award, trend: "+2.4%", color: "bg-purple-50 text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart Placeholder */}
        <div className="lg:col-span-2 bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Courbe de Croissance</h3>
                <p className="text-gray-400 text-sm">Évolution des inscriptions sur les 30 derniers jours</p>
              </div>
              <select className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-secondary/50">
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
              </select>
            </div>

            {/* Elegant SVG Chart Mockup */}
            <div className="h-64 w-full flex items-end gap-2 px-2">
              {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div
                    className="w-full bg-secondary/40 rounded-t-lg transition-all group-hover:bg-secondary relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h*2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative Mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6">Top Formations</h3>
            <div className="space-y-6">
              {topCourses.map((course, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary font-bold border border-gray-100">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">{course.title}</p>
                    <p className="text-xs text-muted font-medium">{course._count.enrollments} apprenants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-secondary uppercase tracking-tighter">
                      {Math.round((course._count.enrollments / (totalEnrollments || 1)) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-[2.5rem] text-white shadow-xl shadow-secondary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passez au niveau Élite</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Débloquez les analyses prédictives et les certificats blockchain infalsifiables.
              </p>
              <button className="w-full py-4 bg-white text-secondary font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-lg">
                Voir l'offre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
