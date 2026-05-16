"use client";

import { useState } from "react";
import {
  User as UserIcon,
  CreditCard,
  Bell,
  Shield,
  Palette,
  ExternalLink,
  ChevronRight,
  Save,
  CheckCircle2,
  Loader2,
  Lock,
  Sun,
  Moon,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface SettingsClientProps {
  user: any;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    notificationsEnabled: user.notificationsEnabled ?? true,
    weeklyReportsEnabled: user.weeklyReportsEnabled ?? true,
    marketingEmails: user.marketingEmails ?? false,
    theme: user.theme || "light"
  });

  const onSave = async (specificData?: Partial<typeof formData>) => {
    setIsLoading(true);
    const dataToSend = specificData || formData;
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Erreur de mise à jour");

      toast.success("Paramètres synchronisés avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde Cloud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeConnect = () => {
    toast.loading("Ouverture du portail Stripe Connect...");
    setTimeout(() => {
      window.open("https://dashboard.stripe.com/test/onboarding", "_blank");
    }, 1200);
  };

  const tabs = [
    { id: 'profile', label: 'Profil Public', icon: UserIcon },
    { id: 'billing', label: 'Facturation & Revenus', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Identité de l'Instructeur</h3>
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center gap-10 pb-10 border-b border-gray-50">
                <div className="w-32 h-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center text-secondary font-black text-4xl overflow-hidden relative group shadow-inner border-2 border-white">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
                  )}
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <span className="text-[10px] text-white uppercase font-black tracking-widest border border-white/40 px-3 py-1 rounded-full">Changer</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-1">Avatar Professionnel</p>
                  <p className="text-xs text-gray-500 font-bold mb-6 tracking-tight">Utilisez une image de haute qualité (PNG ou JPG). Max 2Mo.</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-6 py-2.5 bg-secondary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">Télécharger</button>
                    <button className="px-6 py-2.5 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">Supprimer</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Prénom</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Nom</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner" />
                </div>
              </div>
              <button onClick={() => onSave()} disabled={isLoading} className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder le profil
              </button>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Finances & Stripe Connect</h3>
              <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group mb-10 shadow-2xl shadow-emerald-600/20">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Votre Compte Marchand</h3>
                    </div>
                    <p className="text-emerald-100 text-sm font-medium leading-relaxed max-w-lg">
                      Recevez vos virements en 24h. Gérez vos remboursements et vos factures élèves directement via l'infrastructure sécurisée Stripe.
                    </p>
                  </div>
                  <button onClick={handleStripeConnect} className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl whitespace-nowrap">
                    Accéder au Dashboard Stripe
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-50 pt-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Transactions Récentes</h4>
                <div className="space-y-4">
                  {user.enrollments && user.enrollments.length > 0 ? (
                    user.enrollments.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs">€</div>
                          <div><p className="text-sm font-bold text-gray-900">{e.user.firstName} {e.user.lastName}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{e.course.title}</p></div>
                        </div>
                        <div className="text-right"><p className="text-sm font-black text-gray-900">+{e.course.price}€</p><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{new Date(e.createdAt).toLocaleDateString()}</p></div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold italic">En attente de votre première vente.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Préférences de Communication</h3>
            <div className="space-y-6">
              {[
                { id: 'notificationsEnabled', label: "Inscriptions Elèves", desc: "Soyez notifié instantanément à chaque nouvel inscrit." },
                { id: 'weeklyReportsEnabled', label: "Rapports Hebdomadaires", desc: "Recevez un bilan SEO et financier tous les lundis matin." },
                { id: 'marketingEmails', label: "Actualités FormaFlow", desc: "Découvrez les nouvelles fonctionnalités 'Elite 2026' en avant-première." },
              ].map((item, i) => {
                const key = item.id as keyof typeof formData;
                const active = formData[key];
                return (
                  <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border border-gray-50 hover:border-secondary/10 transition-all group">
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-gray-900 mb-1">{item.label}</p>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !active;
                        setFormData({ ...formData, [key]: newVal });
                        onSave({ [key]: newVal });
                      }}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${active ? 'bg-secondary' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'left-8' : 'left-1'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "security":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Sûreté du Compte</h3>
            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-6 mb-10">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-600 border border-amber-100"><Shield className="w-6 h-6" /></div>
              <div><p className="text-base font-bold text-amber-900 mb-2">Gestion Centralisée (Clerk Identity)</p><p className="text-sm text-amber-700 font-medium leading-relaxed">Votre sécurité est gérée par Clerk pour une protection maximale.</p></div>
            </div>
            <button onClick={() => window.open('https://clerk.com/user', '_blank')} className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20">
              Gérer mon profil Clerk
              <ExternalLink className="w-4 h-4 text-secondary" />
            </button>
          </div>
        );
      case "appearance":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Expérience Visuelle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { id: 'light', label: 'FormaFlow Clair', desc: 'Minimalisme & Sérénité', icon: Sun },
                { id: 'dark', label: 'Mode Cinématique', desc: 'Elite Dark Interface', icon: Moon },
              ].map((theme) => {
                const active = formData.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setFormData({ ...formData, theme: theme.id });
                      onSave({ theme: theme.id });
                    }}
                    className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center text-center gap-6 group/th ${
                      active ? "border-secondary bg-secondary/5 text-secondary shadow-xl shadow-secondary/5" : "border-gray-50 bg-gray-50/30 text-gray-400 grayscale hover:grayscale-0 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-5 rounded-[2rem] transition-all shadow-sm ${active ? 'bg-white text-secondary' : 'bg-white text-gray-300'}`}><theme.icon className="w-10 h-10" /></div>
                    <div><span className="text-sm font-black uppercase tracking-widest block mb-2">{theme.label}</span><p className={`text-[10px] font-bold ${active ? 'text-secondary/60' : 'text-gray-400'}`}>{theme.desc}</p></div>
                    {active && <CheckCircle2 className="w-6 h-6 text-secondary" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all ${
              activeTab === tab.id ? "bg-white text-secondary font-black shadow-2xl border border-gray-100 scale-[1.05]" : "text-gray-400 hover:bg-gray-50/80 font-bold hover:translate-x-2"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-all ${activeTab === tab.id ? "bg-secondary text-white shadow-lg shadow-secondary/30" : "bg-gray-100 text-gray-300"}`}><tab.icon className="w-5 h-5" /></div>
              <span className="text-sm tracking-tight">{tab.label}</span>
            </div>
            {activeTab === tab.id && <ChevronRight className="w-4 h-4 animate-pulse" />}
          </button>
        ))}
      </div>
      <div className="lg:col-span-8">
        {renderContent()}
      </div>
    </div>
  );
}
