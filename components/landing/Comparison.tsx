"use client";

import { X, Check, ShieldAlert, Sparkles, AlertCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Comparison() {
  return (
    <section id="comparison" className="py-32 bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-secondary text-xs font-black uppercase tracking-[0.4em] mb-6">Benchmark Industriel</div>
              <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">Une rupture technologique.</h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* The Legacy - Low Contrast, Faded */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 0.4, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ opacity: 0.6 }}
              className="p-12 rounded-[3rem] border border-white/5 bg-white/[0.01] grayscale transition-all duration-700"
            >
              <div className="flex items-center gap-4 mb-12 opacity-50">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">L'Ancien Monde</h3>
              </div>
              <ul className="space-y-8">
                {[
                  "Maintenance serveur fastidieuse",
                  "UX rigide et non-intuitive",
                  "Latences de chargement critiques",
                  "Frais de transaction cachés",
                  "Support lent et automatisé"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-5 text-slate-500 font-medium">
                    <X className="w-6 h-6 text-red-900/50 shrink-0 mt-0.5" />
                    <span className="text-lg leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The Elite - High Contrast, Vibrant */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Dynamic light streak */}
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(37,99,235,0.1),transparent)] animate-spin-slow opacity-20 pointer-events-none" />

              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-neon">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white">L'Ère FormaFlow</h3>
                </div>
                <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Elite Standard</span>
                </div>
              </div>

              <ul className="space-y-8 relative z-10">
                {[
                  "Auto-Scaling Serverless mondial",
                  "Interface 'Liquid Glass' Adaptative",
                  "Performance Edge sub-seconde",
                  "Souveraineté totale des données",
                  "Conciergerie Tech Dédiée 24/7"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-5 text-white font-semibold">
                    <Check className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                    <span className="text-lg leading-tight">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-16 pt-12 border-t border-white/5 relative z-10 flex items-center justify-between">
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Architecturé pour 2026</p>
                <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </section>
  );
}
