import { X, Check } from "lucide-react";

export default function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary tracking-tight">Pourquoi choisir FormaFlow ?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-8 opacity-50">LMS Traditionnels</h3>
              <ul className="space-y-6">
                {[
                  "Complexité d'installation",
                  "Interface utilisateur datée",
                  "Processus de création lent",
                  "Frais cachés élevés",
                  "Support technique inexistant"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted">
                    <X className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FormaFlow Way */}
            <div className="bg-primary p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-secondary text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Recommandé</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-8">FormaFlow</h3>
              <ul className="space-y-6">
                {[
                  "Zéro configuration requise",
                  "Interface moderne et épurée",
                  "Éditeur de blocs ultra-rapide",
                  "Tarification transparente",
                  "Accompagnement personnalisé"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-secondary shrink-0" />
                    <span className="font-medium text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
