import { getOrCreateUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import {
  User as UserIcon,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Palette,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default async function SettingsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Paramètres</h1>
        <p className="text-muted mt-1 font-medium text-sm">Gérez votre profil, vos préférences et votre facturation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-3">
          {[
            { id: 'profile', label: 'Profil Public', icon: UserIcon, active: true },
            { id: 'billing', label: 'Facturation & Paiements', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Sécurité', icon: Shield },
            { id: 'appearance', label: 'Apparence', icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
                tab.active
                  ? "bg-white text-secondary font-black shadow-md border border-gray-50 scale-[1.02]"
                  : "text-muted hover:bg-gray-50/80 font-bold hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${tab.active ? "bg-secondary/10 text-secondary" : "bg-gray-50 text-gray-400"}`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{tab.label}</span>
              </div>
              {tab.active && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 space-y-10">
          {/* Profile Section */}
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-primary mb-10 tracking-tight">Informations Personnelles</h3>

            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center gap-10 pb-10 border-b border-gray-50">
                <div className="w-32 h-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center text-secondary font-black text-4xl overflow-hidden relative group shadow-inner border-2 border-white">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  )}
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <span className="text-[10px] text-white uppercase font-black tracking-widest border border-white/40 px-3 py-1 rounded-full">Changer</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary mb-1">Avatar de l'instructeur</p>
                  <p className="text-xs text-muted font-bold mb-6 tracking-tight">Utilisez une image de haute qualité (PNG ou JPG). Max 2Mo.</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-6 py-2.5 bg-secondary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">Télécharger</button>
                    <button className="px-6 py-2.5 bg-gray-50 text-muted text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">Supprimer</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-muted uppercase tracking-[0.2em] mb-3">Prénom</label>
                  <input
                    type="text"
                    defaultValue={user.firstName || ""}
                    className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted uppercase tracking-[0.2em] mb-3">Nom</label>
                  <input
                    type="text"
                    defaultValue={user.lastName || ""}
                    className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-muted uppercase tracking-[0.2em] mb-3">Adresse Email Professionnelle</label>
                <div className="relative">
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full px-6 py-4 border border-gray-50 rounded-2xl bg-gray-100/50 text-muted cursor-not-allowed font-bold text-sm shadow-inner italic"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Shield className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <p className="text-[10px] text-muted mt-3 font-bold tracking-tight">L'adresse email est synchronisée avec votre compte Clerk Security.</p>
              </div>

              <div className="pt-6">
                <button className="w-full md:w-auto px-10 py-4 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-100">
                  Enregistrer le profil
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Stripe Connect Section */}
          <div className="bg-emerald-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-600/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Versements Stripe Connect</h3>
                </div>
                <p className="text-emerald-100 text-sm font-medium leading-relaxed max-w-lg">
                  Liez votre compte Stripe pour recevoir vos paiements en temps réel. Gérez vos factures et vos remboursements depuis un seul endroit.
                </p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl whitespace-nowrap">
                Lancer la connexion
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
