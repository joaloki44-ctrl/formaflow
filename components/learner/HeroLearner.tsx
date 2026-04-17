"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function HeroLearner() {
  return (
    <section className="relative bg-dark pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#ff6b4a]/20 to-[#6366f1]/20 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
            <Sparkles className="w-4 h-4 text-[#ff6b4a]" />
            Plus de 1,500 formations disponibles
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
            Découvrez votre prochaine <span className="text-[#ff6b4a]">formation</span>
          </h1>

          <p className="text-xl text-white/60 mb-8">
            Apprenez auprès des meilleurs experts. Formations certifiantes, en ligne et à votre rythme.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ff6b4a]/50"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Tous", "Technologie", "Business", "Design", "Marketing"].map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  i === 0 ? "bg-white text-dark font-medium" : "bg-white/5 text-white/70 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}