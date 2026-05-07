"use client";

import { Target, Zap, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Zap,
    title: "Vitesse Critique",
    description: "Nous avons éliminé chaque milliseconde de friction. Votre savoir est déployé à la vitesse de la pensée."
  },
  {
    icon: Target,
    title: "Précision SaaS",
    description: "Une interface chirurgicale qui ne garde que l'essentiel. Moins de bruit, plus de résultats pédagogiques."
  },
  {
    icon: Heart,
    title: "L'Humain Augmenté",
    description: "La technologie n'est qu'un vecteur. Notre mission est de magnifier la connexion entre l'expert et l'apprenant."
  }
];

export default function Mission() {
  return (
    <section id="mission" className="py-32 bg-dark relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-8">
              <Sparkles className="w-4 h-4 fill-secondary" />
              <span>Manifeste Elite</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter mb-10 leading-[0.95]">
              Redéfinir les frontières <br /> de l'apprentissage.
            </h2>
            <p className="text-xl lg:text-2xl text-slate-400 font-medium max-w-[65ch] leading-relaxed">
              FormaFlow n'est pas un outil. C'est une déclaration d'intention pour ceux qui croient que le futur de l'éducation appartient aux créateurs audacieux.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-500 shadow-2xl"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-secondary/20">
                <value.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{value.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-[35ch]">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background radial accent */}
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
}
