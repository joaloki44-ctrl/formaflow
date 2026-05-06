"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-primary">FormaFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Produit</Link>
          <Link href="#mission" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Vision</Link>
          <Link href="#comparison" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Pourquoi nous ?</Link>
          <Link href="/courses" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Marketplace</Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-primary hover:text-secondary transition-colors">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-bold text-primary hover:text-secondary transition-colors">Connexion</Link>
              <Link href="/sign-up" className="px-5 py-2.5 bg-secondary text-white text-sm font-bold rounded-lg hover:bg-secondary/90 transition-all shadow-md shadow-secondary/10">
                Démarrer
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 py-8 px-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-6">
            <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Produit</Link>
            <Link href="#mission" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Vision</Link>
            <Link href="#comparison" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Pourquoi nous ?</Link>
            <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Marketplace</Link>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-4">
              <Link href="/sign-in" className="text-center py-3 font-bold text-primary">Connexion</Link>
              <Link href="/sign-up" className="text-center py-4 bg-secondary text-white font-bold rounded-xl">Démarrer gratuitement</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
