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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Paramètres</h1>
        <p className="text-muted mt-1 font-medium">Gérez votre profil, vos préférences et votre facturation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profil Public', icon: UserIcon, active: true },
            { id: 'billing', label: 'Facturation & Paiements', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Sécurité', icon: Shield },
            { id: 'appearance', label: 'Apparence', icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                tab.active
                  ? "bg-white text-secondary font-bold shadow-sm border border-gray-100"
                  : "text-muted hover:bg-gray-50 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              {tab.active && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-8">Informations Personnelles</h3>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-gray-50">
                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl overflow-hidden relative group">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span className="text-[10px] text-white uppercase font-bold tracking-widest">Modifier</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary mb-1">Photo de profil</p>
                  <p className="text-xs text-muted font-medium mb-4">PNG ou JPG recommandé. Max 2Mo.</p>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary/90 transition-all">Télécharger</button>
                    <button className="px-4 py-2 bg-gray-50 text-muted text-xs font-bold rounded-lg hover:bg-gray-100 transition-all">Supprimer</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Prénom</label>
                  <input
                    type="text"
                    defaultValue={user.firstName || ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Nom</label>
                  <input
                    type="text"
                    defaultValue={user.lastName || ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-muted cursor-not-allowed font-medium"
                />
                <p className="text-[10px] text-muted mt-2 font-medium">L'adresse email est gérée via votre compte Clerk.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>

          {/* Stripe Connect / Payout Section */}
          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-emerald-900">Versements Stripe</h3>
                </div>
                <p className="text-emerald-700 text-sm font-medium leading-relaxed max-w-md">
                  Connectez votre compte Stripe pour recevoir automatiquement vos revenus lors de chaque vente de formation.
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap">
                Configurer Stripe
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
