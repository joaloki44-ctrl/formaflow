import { 
  Layout,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Globe,
  Settings2,
  Video,
  FileJson,
  Users2
} from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Éditeur No-Code",
    description: "Glissez et déposez vos contenus pour créer des cours sans aucune compétence technique."
  },
  {
    icon: BarChart3,
    title: "Analytiques Pro",
    description: "Suivez la progression de vos apprenants et vos revenus avec des tableaux de bord précis."
  },
  {
    icon: ShieldCheck,
    title: "Sécurité Maximale",
    description: "Vos contenus sont protégés et vos paiements sécurisés via Stripe et Clerk."
  },
  {
    icon: Video,
    title: "Hébergement Vidéo",
    description: "Intégrez facilement vos vidéos YouTube, Vimeo ou hébergez-les directement."
  },
  {
    icon: Users2,
    title: "Gestion d'Équipe",
    description: "Ajoutez des co-instructeurs et gérez les rôles de vos collaborateurs facilement."
  },
  {
    icon: Globe,
    title: "Vendez Partout",
    description: "Une marketplace intégrée pour exposer vos cours au monde entier dès le premier jour."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">Fonctionnalités</h2>
          <p className="text-4xl font-bold text-primary tracking-tight">
            Tout ce dont vous avez besoin <br /> pour réussir votre projet EdTech.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl border border-gray-100 hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all group">
              <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <feature.icon className="w-6 h-6 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
