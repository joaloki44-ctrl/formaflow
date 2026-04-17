import { BookOpen, Users, Euro, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalCourses, totalStudents, totalRevenue }: DashboardStatsProps) {
  const stats = [
    { label: "Formations", value: totalCourses, icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { label: "Apprenants", value: totalStudents, icon: Users, color: "from-green-500 to-green-600" },
    { label: "Revenus (€)", value: totalRevenue.toFixed(2), icon: Euro, color: "from-amber-500 to-amber-600" },
    { label: "Taux conversion", value: "12%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}