import { BookOpen, Users, Euro, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalCourses, totalStudents, totalRevenue }: DashboardStatsProps) {
  const stats = [
    { label: "Formations", value: totalCourses, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
    { label: "Apprenants", value: totalStudents, icon: Users, color: "text-secondary bg-secondary/5" },
    { label: "Revenus", value: `${totalRevenue.toFixed(2)}€`, icon: Euro, color: "text-emerald-600 bg-emerald-50" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
            {/* Using text-gray-900 to ensure visibility against white background */}
            <p className="text-3xl font-black text-gray-900 tracking-tight relative z-10">{stat.value}</p>

            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50/50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-secondary/5 transition-colors" />
          </div>
        );
      })}
    </div>
  );
}
