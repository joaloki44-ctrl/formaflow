"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const withoutItems = [
  "Des contenus de formation plats qui dévalorisent votre compétence",
  "Interface complexe, vous passez des jours à créer votre première formation",
  "Difficile de suivre la progression de vos apprenants",
  "Pas de visibilité sur vos ventes, pas d'outils pour vendre plus",
  "Stress pour respecter les normes Qualiopi et RGPD",
  "Aucune assistance pour vos besoins pédagogiques",
];

const withItems = [
  "Des contenus pédagogiques dynamiques : vidéos, quiz, devoirs interactifs...",
  "Interface intuitive, accessible à tous. Votre formation en 1h !",
  "Statistiques avancées : suivez chaque apprenant en détail",
  "Codes promo, suivi abandons, paiement en plusieurs fois, affiliation...",
  "Conformité simplifiée avec outils intégrés (certificats, suivi, etc.)",
  "Support dédié, coaching, accès à notre Académie et communauté privée",
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="section-title">
          <h2>Pourquoi choisir FormaFlow ?</h2>
          <p>Découvrez la différence entre une plateforme générique et une solution pensée pour les formateurs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Sans FormaFlow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white border-2 border-gray-200 rounded-3xl"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-red-500">✕</span>
              Sans FormaFlow
            </h3>
            <ul className="space-y-4">
              {withoutItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-red-500 font-bold">✕</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Avec FormaFlow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] text-white rounded-3xl shadow-2xl"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span>✓</span>
              Avec FormaFlow
            </h3>
            <ul className="space-y-4">
              {withItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 py-2 border-b border-white/20 last:border-0">
                  <span className="font-bold">✓</span>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Link href="/sign-up" className="btn-primary">Créer mon compte</Link>
        </div>
      </div>
    </section>
  );
}