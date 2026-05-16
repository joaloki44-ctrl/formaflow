"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Award, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface Props {
  user: { firstName: string | null; lastName: string | null; imageUrl: string | null };
}

const navItems = [
  { href: "/learn", label: "Accueil", icon: Home, exact: true },
  { href: "/my-courses", label: "Mes formations", icon: BookOpen },
  { href: "/courses", label: "Catalogue", icon: Search },
];

export default function LearnerNav({ user }: Props) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-16">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/learn" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            FF
          </div>
          <span className="font-serif text-lg text-gray-900">FormaFlow</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-[#ff6b4a]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.firstName}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Particulier</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                isActive ? "text-[#ff6b4a]" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
