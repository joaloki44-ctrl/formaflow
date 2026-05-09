import Link from "next/link";
import { Rocket, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tighter">FormaFlow</span>
            </Link>
            <p className="text-muted text-sm max-w-xs leading-relaxed">
              La plateforme LMS moderne pour les créateurs exigeants.
              Transformez votre expertise en revenus récurrents.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-widest">Produit</h4>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link href="#features" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-widest">Entreprise</h4>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link href="#mission" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-widest">Légal</h4>
            <ul className="space-y-4 text-sm text-muted font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">CGV</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted font-medium">
            © {currentYear} FormaFlow. Tous droits réservés. Fabriqué avec passion.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
