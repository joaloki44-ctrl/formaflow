"use client";

import { motion } from "framer-motion";
import { 
  FileEdit, Bot, Gamepad2, Users, Puzzle, Award, 
  CreditCard, Package, Shield, Target, Mail, Globe 
} from "lucide-react";

const features = [
  { icon: FileEdit, title: "Éditeur de leçons par blocs", description: "Créez facilement des contenus riches avec notre éditeur drag & drop intuitif" },
  { icon: Bot, title: "Outils d'IA intégrés", description: "Générez automatiquement des quiz, résumés et suggestions pédagogiques" },
  { icon: Gamepad2, title: "Gamification", description: "Badges, points, classements pour maximiser l'engagement de vos apprenants" },
  { icon: Users, title: "CRM intégré", description: "Suivez chaque apprenant, leurs progressions et interactions détaillées" },
  { icon: Puzzle, title: "Zapier & Intégrations", description: "Connectez FormaFlow à vos outils favoris : Brevo, Hubspot, Notion..." },
  { icon: Award, title: "Certificats personnalisables", description: "Générez des attestations conformes avec votre branding automatiquement" },
  { icon: CreditCard, title: "Paiements sécurisés", description: "Stripe intégré, paiement en plusieurs fois, gestion des codes promo" },
  { icon: Package, title: "Import/Export SCORM", description: "Compatible avec les standards e-learning, importez vos contenus existants" },
  { icon: Shield, title: "Conformité RGPD", description: "Vos données en France, conformité totale avec la réglementation européenne" },
  { icon: Target, title: "Compatible Qualiopi", description: "Outils dédiés pour répondre aux critères de certification Qualiopi" },
  { icon: Mail, title: "Emails anti-décrochages", description: "Ré-engagez automatiquement les apprenants inactifs avec des sequences email" },
  { icon: Globe, title: "Interface multilingue", description: "Proposez vos formations dans plusieurs langues pour toucher plus d'apprenants" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="section-title">
          <h2>Toutes les fonctionnalités</h2>
          <p>Une plateforme complète avec plus de 30 fonctionnalités pensées pour votre réussite</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-200 rounded-2xl hover:border-[#6366f1] hover:shadow-lg transition-all group"
            >
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <feature.icon className="w-5 h-5 text-[#6366f1]" />
              </div>
              <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}