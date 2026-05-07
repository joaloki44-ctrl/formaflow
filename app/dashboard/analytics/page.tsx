import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, DollarSign, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { course: { instructorId: user?.id } },
    include: { course: true },
  });

  const totalRevenue = enrollments.reduce((acc, curr) => acc + curr.course.price, 0);
  const totalStudents = enrollments.length;
  const avgProgress = enrollments.length > 0
    ? enrollments.reduce((acc, curr) => acc + curr.totalProgress, 0) / enrollments.length
    : 0;

  return (
    <div className="md:ml-80 bg-dark min-h-screen relative overflow-hidden">
      <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            Analytiques
          </h1>
          <p className="text-slate-500 font-medium text-xl leading-snug">
            Mesurez l'impact de votre contenu et optimisez vos revenus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Chiffre d'Affaires", val: `${totalRevenue}€`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Apprenants", val: totalStudents, icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
            { label: "Progression Moy.", val: `${Math.round(avgProgress)}%`, icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Certifications", val: enrollments.filter(e => e.status === "COMPLETED").length, icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" }
          ].map((stat, i) => (
            <div key={i} className="bento-card bg-white/[0.02] border border-white/5">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-4xl font-black text-white mb-1">{stat.val}</p>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bento-card border border-white/5 bg-white/[0.01]">
            <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Performance des Ventes</h3>
            <div className="h-64 flex items-end gap-2 px-4">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-secondary/20 hover:bg-secondary transition-all rounded-t-lg group relative" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    +{h * 10}€
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
            </div>
          </div>

          <div className="bento-card border border-white/5 bg-white/[0.01]">
            <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Engagement Mensuel</h3>
            <div className="space-y-8">
              {[
                { label: "Nouveaux Inscrits", delta: "+12%", up: true },
                { label: "Temps de Visionnage", delta: "+24%", up: true },
                { label: "Taux de Rebond", delta: "-5%", up: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-dark rounded-2xl border border-white/5">
                  <span className="text-sm font-bold text-white">{item.label}</span>
                  <div className={`flex items-center gap-2 font-black text-xs ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>
                    {item.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {item.delta}
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
