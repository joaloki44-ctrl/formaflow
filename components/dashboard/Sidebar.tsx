"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings, BarChart3 } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Formations", icon: BookOpen },
  { href: "/dashboard/students", label: "Apprenants", icon: Users },
  { href: "/dashboard/analytics", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            FF
          </div>
          <span className="font-serif text-xl text-primary">FormaFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-[#ff6b4a]/10 to-[#f09340]/10 text-[#ff6b4a] font-medium" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-2xl border border-gray-100">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary truncate">{user?.firstName}</p>
            <p className="text-[10px] text-muted truncate">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
