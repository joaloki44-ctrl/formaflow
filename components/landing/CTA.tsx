"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[4rem] p-12 lg:p-32 relative overflow-hidden text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
        >
          {/* Elite Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-12 text-secondary bg-secondary/10 px-6 py-2 rounded-full border border-secondary/20"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span className="text-xs font-black uppercase tracking-[0.5em]">Le Futur de l'EdTech</span>
            </motion.div>

            <h2 className="text-6xl lg:text-8xl font-black text-white mb-12 tracking-tighter leading-[0.85]">
              Prenez les commandes <br /> de votre succès.
            </h2>

            <p className="text-xl lg:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto leading-tight font-medium">
              Ne vous contentez pas de former. Dominez votre marché avec l'infrastructure la plus avancée du moment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                href="/sign-up"
                className="btn-saas-primary w-full sm:w-auto text-xl py-7 px-14 flex items-center justify-center gap-4 group"
              >
                Déployer maintenant
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto text-xl py-7 px-14 text-white border border-white/10 rounded-3xl font-black hover:bg-white/5 transition-all"
              >
                Accès Console
              </Link>
            </div>

            <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap justify-center items-center gap-12 text-slate-500">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                <Rocket className="w-5 h-5 text-secondary" />
                Déploiement Edge
              </div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                Souveraineté Totale
              </div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-5 h-5 text-secondary" />
                Standard 2026
              </div>
            </div>
          </div>

          {/* Extreme Orbs */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-float" />
        </motion.div>
      </div>
    </section>
  );
}
