"use client";

import { BookOpen, Users, Euro, TrendingUp, Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function DashboardStats({ totalCourses, totalStudents, totalRevenue }: DashboardStatsProps) {
  const stats = [
    {
      label: "Formations",
      value: totalCourses,
      icon: BookOpen,
      trend: "+12%",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      label: "Apprenants",
      value: totalStudents,
      icon: Users,
      trend: "Peak",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      label: "Revenus",
      value: `${totalRevenue.toFixed(0)}€`,
      icon: Euro,
      trend: "+8.4%",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Performance",
      value: "98.2%",
      icon: Activity,
      trend: "Optimal",
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card p-8 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{stat.trend}</span>
                <div className="w-8 h-1 bg-secondary/20 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-secondary w-2/3" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter mb-2">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
