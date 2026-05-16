import Link from "next/link";
import { GraduationCap, BookOpen, Building2, ArrowRight } from "lucide-react";

const types = [
  {
    icon: GraduationCap,
    label: "Particulier",
    tagline: "Apprenez à votre rythme",
    description:
      "Accédez à un catalogue de formations de qualité, suivez votre progression et obtenez des certificats reconnus — en toute autonomie.",
    perks: ["Catalogue complet", "Progression personnalisée", "Certificats inclus", "Accès multi-appareils"],
    cta: "Commencer gratuitement",
    href: "/sign-up",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    pill: "bg-blue-100 text-blue-700",
  },
  {
    icon: BookOpen,
    label: "Formateur",
    tagline: "Partagez votre expertise",
    description:
      "Créez et vendez vos formations en ligne, gérez vos apprenants et développez votre activité avec des outils professionnels.",
    perks: ["Créateur de cours avancé", "Monétisation intégrée", "Analytics & revenus", "Gestion des apprenants"],
    cta: "Créer mes formations",
    href: "/sign-up",
    gradient: "from-[#ff6b4a] to-[#f09340]",
    bg: "bg-orange-50",
    border: "border-orange-100",
    pill: "bg-orange-100 text-orange-700",
  },
  {
    icon: Building2,
    label: "Entreprise",
    tagline: "Formez vos équipes",
    description:
      "Gérez les formations de vos employés, assignez des parcours, suivez la conformité réglementaire et générez des rapports détaillés.",
    perks: ["Multi-équipes & départements", "Formations obligatoires", "Analytics RH avancées", "Parcours sur mesure"],
    cta: "Créer mon espace",
    href: "/sign-up",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    pill: "bg-emerald-100 text-emerald-700",
  },
];

export default function AccountTypes() {
  return (
    <section className="py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">
            Une plateforme pour <span className="text-[#ff6b4a]">chaque besoin</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Que vous soyez apprenant, formateur ou responsable RH, FormaFlow s&apos;adapte à votre profil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {types.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className={`${t.bg} border ${t.border} rounded-3xl p-7 flex flex-col hover:shadow-lg transition-all group`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Label */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.pill} mb-3 w-fit`}>
                  {t.label}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.tagline}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.description}</p>

                {/* Perks */}
                <ul className="space-y-2 mb-6 flex-1">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={t.href}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r ${t.gradient} text-white hover:opacity-90 transition-opacity shadow-sm`}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
