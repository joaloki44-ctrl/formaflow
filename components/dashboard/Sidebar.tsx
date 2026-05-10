"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings, BarChart3, LogOut, Rocket, Zap, ShieldCheck } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Formations", icon: BookOpen },
  { href: "/dashboard/students", label: "Apprenants", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Système", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  // On the client side, we check if the user has specific public metadata or we can fetch a local /api/me
  // For now, let's assume Elite is based on a condition or just visual for the demo
  const isElite = true;

  return (
    <aside className="hidden md:flex w-80 bg-dark border-r border-white/5 flex-col h-screen fixed left-0 top-0 z-50 p-8">
      {/* Logo Section */}
      <div className="mb-16 px-4">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-xl group-hover:rotate-6 transition-all duration-500">
            <Rocket className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tighter text-white">FormaFlow</span>
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mt-1">Console Pro</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden ${
                isActive
                  ? "bg-secondary text-white shadow-neon"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-500 ${isActive ? "scale-110" : "group-hover:text-secondary"}`} />
              <span className="text-sm font-bold tracking-tight uppercase tracking-[0.1em]">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="sidebar-glow"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section - Floating Style */}
      <div className="mt-auto">
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:bg-white/[0.04] transition-all duration-500">
          <div className="p-0.5 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-widest">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {isElite ? <ShieldCheck className="w-2.5 h-2.5 text-secondary fill-secondary" /> : <Zap className="w-2.5 h-2.5 text-slate-500" />}
              <p className="text-[10px] font-black text-secondary truncate uppercase tracking-tighter">
                {isElite ? "Elite Status" : "Standard Node"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
