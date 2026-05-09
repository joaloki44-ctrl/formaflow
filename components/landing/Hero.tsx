"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-cream">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              LMS Nouvelle Génération
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-primary mb-8">
              Créez vos formations <br />
              <span className="text-secondary">sans compromis.</span>
            </h1>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              La plateforme LMS la plus intuitive pour les créateurs exigeants.
              Gérez vos contenus, engagez vos apprenants et développez votre activité.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group"
              >
                Démarrer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-primary rounded-lg font-bold hover:bg-gray-50 transition-all"
              >
                Voir les fonctionnalités
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                Installation en 2 min
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                Sans carte bancaire
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                Support prioritaire
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
