"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, PlayCircle, MousePointer2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-64 pb-32 lg:pt-80 lg:pb-48 overflow-hidden min-h-screen flex items-center bg-dark">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Elite Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-secondary text-xs font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md animate-glow">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              L'Elite du LMS • 2026
            </div>

            {/* Massive Typography */}
            <h1 className="text-7xl lg:text-9xl font-extrabold tracking-tighter text-white mb-12 leading-[0.85] filter drop-shadow-2xl">
              CONSTRUISEZ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-secondary to-blue-600 inline-block relative">
                L'EXCEPTION.
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-4 left-0 h-2 bg-secondary/20 -z-10 rounded-full blur-sm"
                />
              </span>
            </h1>

            <p className="text-2xl lg:text-3xl text-slate-400 mb-16 max-w-3xl mx-auto leading-tight font-medium tracking-tight">
              Oubliez les outils génériques. FormaFlow est l'infrastructure d'élite pour les créateurs qui redéfinissent les standards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                href="/sign-up"
                className="btn-saas-primary text-xl py-6 px-12 flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-4">
                  Démarrer Maintenant
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button
                className="btn-saas-outline text-xl py-6 px-12 flex items-center justify-center gap-4 group"
              >
                <PlayCircle className="w-7 h-7 text-secondary" />
                <span>Voir la démo</span>
              </button>
            </div>

            {/* Premium Social Proof */}
            <div className="mt-32 flex flex-col items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, zIndex: 10 }}
                    className="w-14 h-14 rounded-2xl bg-dark border-2 border-white/10 shadow-2xl overflow-hidden cursor-pointer p-0.5"
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover rounded-xl" />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">
                  Plébiscité par +1,500 Leaders de l'industrie
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Extreme Visual Depth - Aceternity Inspired */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-secondary/10 blur-[150px] rounded-full opacity-50"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-500/5 blur-[120px] rounded-full opacity-40"
        />

        {/* Elite Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Icon Decorations */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[30%] right-[15%] text-secondary/20"
        >
          <MousePointer2 className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[20%] left-[10%] text-blue-400/10"
        >
          <Sparkles className="w-20 h-20" />
        </motion.div>
      </div>
    </section>
  );
}
