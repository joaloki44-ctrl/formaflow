import { BookOpen, Users, Euro, TrendingUp, Sparkles } from "lucide-react";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalCourses, totalStudents, totalRevenue }: DashboardStatsProps) {
  const stats = [
    { label: "Formations", value: totalCourses, icon: BookOpen, color: "from-orange-400 to-[#ff6b4a]" },
    { label: "Apprenants", value: totalStudents, icon: Users, color: "from-indigo-400 to-indigo-600" },
    { label: "Revenus (€)", value: totalRevenue.toFixed(2), icon: Euro, color: "from-emerald-400 to-emerald-600" },
    { label: "Taux conversion", value: "12%", icon: TrendingUp, color: "from-violet-400 to-violet-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] shadow-lg shadow-black/5 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-muted">{stat.label}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:rotate-6 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            {/* Decorative Sparkle */}
            {stat.label === "Revenus (€)" && (
              <Sparkles className="absolute bottom-4 right-4 w-12 h-12 text-emerald-500/10 -rotate-12 group-hover:scale-110 transition-transform" />
            )}
          </div>
        );
      })}
    </div>
  );
}
