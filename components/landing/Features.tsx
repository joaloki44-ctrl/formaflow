"use client";

import { 
  Layout,
  BarChart3,
  ShieldCheck,
  Video,
  Globe,
  Users2,
  Sparkles,
  Zap,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="py-32 relative bg-dark overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-secondary text-xs font-black uppercase tracking-[0.4em] mb-6">Écosystème Digital</div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
              L'architecture au service <br /> de l'expérience.
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Une infrastructure robuste et minimaliste conçue pour la performance absolue.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid 2026 */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[900px]">

          {/* Main Feature - 6 columns / 2 rows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-6 md:row-span-2 bento-card relative group flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform border border-white/10 shadow-2xl">
                <Layout className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">Éditeur No-Code <br /> Haute Fidélité</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-[35ch]">
                Une expérience de création fluide, sans latence. Glissez, déposez, et voyez vos idées prendre vie instantanément.
              </p>
            </div>
            <div className="mt-12 relative z-10 flex items-center gap-4 text-white font-bold group-hover:text-secondary transition-colors cursor-pointer">
              <span className="text-sm uppercase tracking-widest">Explorer l'interface</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/20 transition-colors" />
          </motion.div>

          {/* Stats Feature - 6 columns / 1 row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-6 md:row-span-1 bento-card flex flex-col justify-between group overflow-hidden bg-white/[0.02]"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Analytiques Temps Réel</h3>
                <p className="text-slate-500 font-medium max-w-[30ch]">Chaque interaction est mesurée pour maximiser votre conversion.</p>
              </div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-neon">
                <BarChart3 className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
            <div className="mt-8 flex gap-12 relative z-10">
              <div>
                <p className="text-4xl font-black text-white tracking-tighter">+124%</p>
                <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mt-1">ROI Moyen</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white tracking-tighter">0.8s</p>
                <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mt-1">Temps de chargement</p>
              </div>
            </div>
          </motion.div>

          {/* Small Feature 1 - 3 columns / 1 row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 md:row-span-1 bento-card flex flex-col justify-center items-center group text-center"
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sécurité Edge</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Protocoles 2026</p>
          </motion.div>

          {/* Small Feature 2 - 3 columns / 1 row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 md:row-span-1 bento-card flex flex-col justify-center items-center group text-center"
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Global Scale</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Multi-Cloud</p>
          </motion.div>

        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-secondary/5 blur-[120px] rounded-full" />
    </section>
  );
}
