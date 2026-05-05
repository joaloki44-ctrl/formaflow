import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
              Prêt à transformer votre savoir <br /> en une formation d'exception ?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Rejoignez les créateurs qui font confiance à FormaFlow pour <br className="hidden lg:block" />
              lancer et développer leur académie en ligne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-10 py-5 bg-secondary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 group"
              >
                Démarrer mon essai gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Se connecter
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Aucune carte bancaire requise • Annulez à tout moment
            </p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
