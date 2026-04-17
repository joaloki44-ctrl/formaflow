"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/80 backdrop-blur-xl border-b border-black/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            FF
          </div>
          <span className="font-serif text-2xl">FormaFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-[#ff6b4a] transition-colors">Fonctionnalités</Link>
          <Link href="#mission" className="text-sm font-medium hover:text-[#ff6b4a] transition-colors">Notre mission</Link>
          <Link href="#comparison" className="text-sm font-medium hover:text-[#ff6b4a] transition-colors">Avantages</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-[#ff6b4a] transition-colors">Tarifs</Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="btn-outline text-sm py-2 px-4">Connexion</Link>
          <Link href="/sign-up" className="btn-primary text-sm py-2 px-4">Essai gratuit</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <nav className="flex flex-col items-center gap-4">
            <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg">Fonctionnalités</Link>
            <Link href="#mission" onClick={() => setIsMenuOpen(false)} className="text-lg">Notre mission</Link>
            <Link href="#comparison" onClick={() => setIsMenuOpen(false)} className="text-lg">Avantages</Link>
            <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-lg">Tarifs</Link>
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/sign-in" className="btn-outline">Connexion</Link>
              <Link href="/sign-up" className="btn-primary">Essai gratuit</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}