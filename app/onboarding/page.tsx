"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Building2, GraduationCap, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const accountTypes = [
  {
    id: "STUDENT",
    icon: GraduationCap,
    label: "Particulier",
    subtitle: "Je veux me former",
    description:
      "Accédez à des milliers de formations, suivez votre progression et obtenez des certificats reconnus.",
    perks: [
      "Catalogue complet de formations",
      "Suivi de progression personnalisé",
      "Certificats à la complétion",
      "Accès depuis n'importe quel appareil",
    ],
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-200 hover:border-blue-400",
    bg: "bg-blue-50",
    pill: "bg-blue-100 text-blue-700",
    redirect: "/my-courses",
  },
  {
    id: "INSTRUCTOR",
    icon: BookOpen,
    label: "Formateur",
    subtitle: "Je veux créer des formations",
    description:
      "Créez et vendez vos formations, gérez vos apprenants et développez votre activité de formateur.",
    perks: [
      "Création de cours illimitée",
      "Éditeur de contenu avancé",
      "Analytiques & revenus",
      "Gestion des apprenants",
    ],
    color: "from-[#ff6b4a] to-[#f09340]",
    border: "border-orange-200 hover:border-orange-400",
    bg: "bg-orange-50",
    pill: "bg-orange-100 text-orange-700",
    redirect: "/dashboard",
  },
  {
    id: "COMPANY",
    icon: Building2,
    label: "Entreprise",
    subtitle: "Je veux former mes équipes",
    description:
      "Gérez la formation de vos employés, assignez des parcours, suivez la conformité et générez des rapports.",
    perks: [
      "Gestion multi-équipes & départements",
      "Formations obligatoires & deadlines",
      "Analytics par employé & département",
      "Parcours d'apprentissage sur mesure",
    ],
    color: "from-emerald-500 to-teal-600",
    border: "border-emerald-200 hover:border-emerald-400",
    bg: "bg-emerald-50",
    pill: "bg-emerald-100 text-emerald-700",
    redirect: "/org/new",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      if (!res.ok) { setLoading(false); return; }

      const choice = accountTypes.find((a) => a.id === selected)!;
      router.push(choice.redirect);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-white to-orange-50/20 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-xl flex items-center justify-center text-white font-bold">
            FF
          </div>
          <span className="font-serif text-2xl text-gray-900">FormaFlow</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Bienvenue ! Quel est votre profil ?
        </h1>
        <p className="text-gray-500 text-lg">
          Choisissez le type de compte adapté à vos besoins
        </p>
      </motion.div>

      {/* Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {accountTypes.map((type, i) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => setSelected(type.id)}
              className={`relative text-left p-6 rounded-3xl border-2 bg-white transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? `${type.border} shadow-xl ring-2 ring-offset-2 ${
                      type.id === "STUDENT"
                        ? "ring-blue-400"
                        : type.id === "INSTRUCTOR"
                        ? "ring-orange-400"
                        : "ring-emerald-400"
                    }`
                  : `${type.border} shadow-sm hover:shadow-lg`
              }`}
            >
              {/* Selected check */}
              {isSelected && (
                <div
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-md`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Text */}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${type.pill} mb-3 inline-block`}>
                {type.subtitle}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{type.label}</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{type.description}</p>

              {/* Perks */}
              <ul className="space-y-2">
                {type.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs text-gray-600">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <button
          onClick={confirm}
          disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Continuer
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        {!selected && (
          <p className="text-center text-xs text-gray-400 mt-3">Sélectionnez un profil pour continuer</p>
        )}
      </motion.div>
    </div>
  );
}
