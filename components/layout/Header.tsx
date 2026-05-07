"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket, ChevronRight, Zap } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

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
    <header className="fixed top-8 left-0 right-0 z-50 px-6">
      <nav className={`container mx-auto max-w-6xl transition-all duration-500 rounded-[2rem] border overflow-hidden ${
        isScrolled
          ? "bg-black/60 backdrop-blur-3xl py-4 px-10 shadow-glass border-white/10"
          : "bg-white/5 backdrop-blur-xl py-6 px-8 border-white/5"
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo Elite */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Rocket className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tighter text-white leading-none">FormaFlow</span>
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mt-1">Elite LMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] p-2 rounded-2xl backdrop-blur-md">
            {[
              { name: "Plateforme", href: "#features" },
              { name: "Expérience", href: "#mission" },
              { name: "Marketplace", href: "/courses" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            {isSignedIn ? (
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-sm font-bold text-white hover:text-secondary transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-secondary text-secondary" />
                  Console
                </Link>
                <div className="p-1 bg-white/5 rounded-full border border-white/10">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Connexion</Link>
                <Link href="/sign-up" className="bg-white text-black px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl active:scale-95">
                  Lancer l'aventure
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 text-white bg-white/5 rounded-2xl border border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-full left-6 right-6 mt-6 p-10 bg-black/90 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl z-40"
          >
            <nav className="flex flex-col gap-10">
              <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white tracking-tighter">Plateforme</Link>
              <Link href="#mission" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white tracking-tighter">Expérience</Link>
              <Link href="/courses" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-white tracking-tighter">Marketplace</Link>
              <hr className="border-white/5" />
              <div className="flex flex-col gap-4">
                <Link href="/sign-in" className="text-center py-5 font-bold text-white border border-white/10 rounded-2xl bg-white/5">Connexion</Link>
                <Link href="/sign-up" className="bg-secondary text-white text-center py-6 rounded-3xl font-black text-xl shadow-neon">Démarrer</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
