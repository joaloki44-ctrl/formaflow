import Link from "next/link";
import { Rocket, Twitter, Github, Linkedin, Mail, Globe, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-24">

          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-4 mb-10 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black transition-all group-hover:rotate-6 shadow-xl">
                <Rocket className="w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tighter text-white">FormaFlow</span>
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mt-1">Elite Global</span>
              </div>
            </Link>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">
              Nous construisons l'infrastructure pédagogique du futur. Souveraine, rapide, et d'une clarté absolue.
            </p>
            <div className="flex items-center gap-6">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-white border border-white/5 transition-all duration-500">
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-2">
            <h4 className="font-black text-white mb-10 text-[10px] uppercase tracking-[0.4em]">Plateforme</h4>
            <ul className="space-y-6 text-slate-500 font-bold text-sm">
              <li><Link href="#features" className="hover:text-secondary transition-colors">Infrastructure</Link></li>
              <li><Link href="/courses" className="hover:text-secondary transition-colors">Marketplace</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Roadmap 2026</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Conciergerie</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2">
            <h4 className="font-black text-white mb-10 text-[10px] uppercase tracking-[0.4em]">Système</h4>
            <ul className="space-y-6 text-slate-500 font-bold text-sm">
              <li><Link href="#" className="hover:text-secondary transition-colors">Sécurité Edge</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">API d'Élite</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Status Global</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Gouvernance</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="md:col-span-4">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
              <h4 className="font-bold text-white mb-4 text-xl">The Elite Dispatch</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                Recevez nos analyses stratégiques sur l'EdTech et l'UX 2026.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="votre@email.pro"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-secondary focus:bg-white/10 transition-all placeholder:text-slate-600"
                />
                <button className="bg-secondary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-neon transition-all">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <Link href="#" className="hover:text-white transition-colors">Legal Framework</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Shield</Link>
            <Link href="#" className="hover:text-white transition-colors">Infrastructure</Link>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              © {currentYear} FormaFlow. All Systems Operational.
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Orb */}
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
    </footer>
  );
}
