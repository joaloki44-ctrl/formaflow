import Link from "next/link";
import { Building2, Users, BarChart3, Route, Shield, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des équipes",
    desc: "Invitez vos employés, créez des départements et attribuez des rôles en quelques clics.",
  },
  {
    icon: Route,
    title: "Parcours sur mesure",
    desc: "Construisez des parcours d'apprentissage adaptés à chaque métier ou niveau d'expérience.",
  },
  {
    icon: Shield,
    title: "Formations obligatoires",
    desc: "Marquez les formations comme obligatoires et définissez des délais pour garantir la conformité.",
  },
  {
    icon: BarChart3,
    title: "Analytics avancées",
    desc: "Suivez la progression de chaque employé, identifiez les lacunes et exportez vos rapports.",
  },
  {
    icon: Building2,
    title: "Multi-départements",
    desc: "Organisez vos équipes par département et assignez des formations ciblées par groupe.",
  },
  {
    icon: CheckCircle2,
    title: "Certificats intégrés",
    desc: "Chaque employé reçoit automatiquement son certificat à la complétion d'une formation.",
  },
];

const plans = [
  {
    name: "Basique",
    desc: "Pour les petites équipes",
    price: "Gratuit",
    features: ["Jusqu'à 10 employés", "Formations illimitées", "Parcours basiques", "Analytiques simples"],
    cta: "Commencer gratuitement",
    href: "/org/new",
    highlighted: false,
  },
  {
    name: "Professionnel",
    desc: "Pour les entreprises en croissance",
    price: "Sur devis",
    features: ["Employés illimités", "Formations obligatoires & deadlines", "Parcours avancés", "Analytics détaillées", "Export CSV", "Support prioritaire"],
    cta: "Nous contacter",
    href: "mailto:contact@formaflow.com",
    highlighted: true,
  },
  {
    name: "Enterprise",
    desc: "Pour les grandes organisations",
    price: "Sur devis",
    features: ["Tout le plan Pro", "SSO / SAML", "Marque blanche", "Intégrations RH", "Manager dédié", "SLA garanti"],
    cta: "Nous contacter",
    href: "mailto:contact@formaflow.com",
    highlighted: false,
  },
];

export default function Enterprise() {
  return (
    <section className="py-24 bg-white" id="enterprise">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm font-semibold text-orange-700 mb-6">
            <Building2 className="w-4 h-4" />
            FormaFlow Enterprise
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">
            La formation professionnelle<br />
            <span className="text-[#ff6b4a]">à l&apos;échelle de votre entreprise</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Offrez à vos équipes une expérience d&apos;apprentissage structurée, suivez leur progression et garantissez la conformité réglementaire.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <Icon className="w-5 h-5 text-[#ff6b4a]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlighted
                  ? "border-[#ff6b4a] bg-gradient-to-b from-orange-50/50 to-white shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="text-xs font-bold text-white bg-gradient-to-r from-[#ff6b4a] to-[#f09340] px-3 py-1 rounded-full w-fit mb-4">
                  Recommandé
                </div>
              )}
              <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
              <p className="text-sm text-gray-500 mb-3">{plan.desc}</p>
              <p className="text-3xl font-bold text-gray-900 mb-5">{plan.price}</p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white hover:opacity-90"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#ff6b4a] to-[#f09340] rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="font-serif text-3xl md:text-4xl mb-3">
            Prêt à transformer la formation de vos équipes ?
          </h3>
          <p className="text-white/80 mb-8 text-lg">
            Créez votre espace entreprise en 2 minutes — aucune carte bancaire requise.
          </p>
          <Link
            href="/org/new"
            className="inline-flex items-center gap-2 bg-white text-[#ff6b4a] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-colors"
          >
            Créer mon espace entreprise
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
