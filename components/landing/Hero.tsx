"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[10%] right-[10%] w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-[100px] opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, reverse: true }}
          className="absolute top-[40%] right-[25%] w-72 h-72 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-[80px] opacity-25"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Nouveau : IA générative intégrée
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
            Créez votre première formation en{" "}
            <span className="italic text-[#ff6b4a]">1 heure</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted max-w-xl mb-8">
            Simple, flexible et 100% Français, FormaFlow est l'outil LMS qui transforme votre expertise en formation digitale de qualité.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2">
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="btn-outline">
              Voir la démo
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">1,500+</span>
              <span className="text-muted">clients satisfaits</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-green-500">✓</span> Sans engagement
            </div>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-green-500">✓</span> Compatible Qualiopi
            </div>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-green-500">✓</span> Serveurs en France
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}