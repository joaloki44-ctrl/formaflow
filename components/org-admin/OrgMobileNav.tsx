"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, LayoutDashboard, Users, Building2, BookOpen, Route,
  BarChart3, Settings,
} from "lucide-react";

interface Props {
  orgId: string;
  orgName: string;
}

export default function OrgMobileNav({ orgId, orgName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-xs">
            {orgName.charAt(0)}
          </div>
          <span className="font-semibold text-gray-900 text-sm">{orgName}</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <nav className="px-4 pb-4 space-y-1 bg-white border-t border-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                  isActive ? "bg-orange-50 text-[#ff6b4a] font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
