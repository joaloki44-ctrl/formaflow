"use client";

import { motion } from "framer-motion";
import { Target, Zap, Heart } from "lucide-react";
import Link from "next/link";

const missions = [
  {
    icon: Target,
    title: "Centré sur la pédagogie",
    description: "Un outil centré sur la pédagogie qui met en valeur votre expertise et maintient vos apprenants engagés grâce à une politique d'innovation continue.",
  },
  {
    icon: Zap,
    title: "Simple d'utilisation",
    description: "Une plateforme simple et hautement personnalisable, que vous pouvez relier à tous vos outils existants ou presque !",
  },
  {
    icon: Heart,
    title: "Humain à toutes les étapes",
    description: "Rejoignez la communauté, participez à nos masterclass exclusives, échangez avec notre service client en quelques clics.",
  },
];

export default function Mission() {
  return (
    <section id="mission" className="py-24 bg-dark text-[#f5f5f5]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Notre mission</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            FormaFlow s'engage pour inventer la pédagogie de demain, au service de ceux qui veulent partager !
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-[#333] rounded-2xl hover:border-[#ff6b4a] transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-xl flex items-center justify-center mb-6">
                <mission.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-2xl mb-4">{mission.title}</h3>
              <p className="text-muted leading-relaxed">{mission.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/sign-up" className="btn-primary">Inscription gratuite</Link>
        </div>
      </div>
    </section>
  );
}