"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section id="pricing" className="py-24 bg-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-full blur-[150px] opacity-15" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[#f5f5f5] mb-6">
            Prêt à transformer votre expertise en formation ?
          </h2>
          <p className="text-muted text-lg mb-10">
            Rejoignez 1,500+ formateurs qui utilisent déjà FormaFlow pour digitaliser leurs formations. Essai gratuit, sans carte bancaire.
          </p>

          <Link 
            href="/sign-up" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white font-semibold text-lg rounded-full hover:scale-105 hover:shadow-xl transition-all"
          >
            Commencer gratuitement
          </Link>
        </motion.div>
      </div>
    </section>
  );
}