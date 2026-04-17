import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-[#f5f5f5] py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              FF
            </div>
            <span className="font-serif text-xl">FormaFlow</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm text-muted hover:text-white transition-colors">Accueil</Link>
            <Link href="#features" className="text-sm text-muted hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="/sign-up" className="text-sm text-muted hover:text-white transition-colors">Inscription</Link>
          </div>

          <p className="text-sm text-muted">© 2024 FormaFlow. Made in France 🇫🇷</p>
        </div>
      </div>

      {/* Deerflow signature */}
      <a 
        href="https://deerflow.tech" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-[#1a1a1a] border border-black/10 hover:bg-[#1a1a1a] hover:text-white transition-all z-50"
      >
        ✦ Created By Deerflow
      </a>
    </footer>
  );
}