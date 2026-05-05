import { BookOpen, Users, Euro, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalCourses, totalStudents, totalRevenue }: DashboardStatsProps) {
  const stats = [
    { label: "Formations", value: totalCourses, icon: BookOpen },
    { label: "Apprenants", value: totalStudents, icon: Users },
    { label: "Revenus", value: `${totalRevenue.toFixed(2)}€`, icon: Euro },
    { label: "Conversion", value: "12%", icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 bg-gray-50 rounded-lg text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
