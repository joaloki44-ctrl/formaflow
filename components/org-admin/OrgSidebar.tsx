"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, BookOpen, Route,
  BarChart3, Settings, ChevronLeft,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

interface Props {
  orgId: string;
  orgName: string;
  orgLogoUrl?: string | null;
}

export default function OrgSidebar({ orgId, orgName, orgLogoUrl }: Props) {
  const pathname = usePathname();
  const { user } = useUser();

  const base = `/org-admin/${orgId}`;

  const navItems = [
    { href: base, label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
    { href: `${base}/members`, label: "Employés", icon: Users },
    { href: `${base}/departments`, label: "Départements", icon: Building2 },
    { href: `${base}/assignments`, label: "Assignations", icon: BookOpen },
    { href: `${base}/learning-paths`, label: "Parcours", icon: Route },
    { href: `${base}/analytics`, label: "Analytiques", icon: BarChart3 },
    { href: `${base}/settings`, label: "Paramètres", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky left-0 top-0 z-30">
      {/* Org Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-xs">
            FF
          </div>
          <span className="font-serif text-lg text-primary">FormaFlow</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 bg-orange-50 rounded-xl border border-orange-100">
          {orgLogoUrl ? (
            <img src={orgLogoUrl} alt={orgName} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {orgName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{orgName}</p>
            <p className="text-[10px] text-orange-600 font-medium">Espace Entreprise</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 mb-2 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Retour au tableau de bord
        </Link>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                isActive
                  ? "bg-gradient-to-r from-[#ff6b4a]/10 to-[#f09340]/10 text-[#ff6b4a] font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{user?.firstName}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
