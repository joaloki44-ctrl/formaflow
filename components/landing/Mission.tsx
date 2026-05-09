import { Target, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Vitesse",
    description: "Lancez votre formation en quelques minutes grâce à notre éditeur de blocs intuitif."
  },
  {
    icon: Target,
    title: "Focus",
    description: "Concentrez-vous sur votre contenu, nous gérons toute la complexité technique."
  },
  {
    icon: Heart,
    title: "Expérience",
    description: "Une interface fluide conçue pour maximiser l'engagement de vos apprenants."
  }
];

export default function Mission() {
  return (
    <section id="mission" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">Notre Vision</h2>
          <p className="text-4xl font-bold text-primary tracking-tight">
            L'excellence pédagogique au service de votre expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {values.map((value, i) => (
            <div key={i} className="group">
              <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
                <value.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
              <p className="text-muted leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
