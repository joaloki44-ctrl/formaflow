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
  Moon
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
  });

  const onSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur de mise à jour");

      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Public', icon: UserIcon },
    { id: 'billing', label: 'Facturation & Paiements', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Informations Personnelles</h3>
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center gap-10 pb-10 border-b border-gray-50">
                <div className="w-32 h-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center text-secondary font-black text-4xl overflow-hidden relative group shadow-inner border-2 border-white">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
                  )}
                  <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <span className="text-[10px] text-white uppercase font-black tracking-widest border border-white/40 px-3 py-1 rounded-full">Changer</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-1">Avatar de l'instructeur</p>
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
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-sm shadow-inner"
                  />
                </div>
              </div>
              <button
                onClick={onSave}
                disabled={isLoading}
                className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer le profil
              </button>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Facturation & Revenus</h3>
              <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden group mb-8">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-bold text-emerald-900">Versements Stripe Connect</h3>
                    </div>
                    <p className="text-emerald-700 text-sm font-medium leading-relaxed max-w-lg">
                      Liez votre compte Stripe pour recevoir vos paiements en temps réel.
                    </p>
                  </div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                    Lancer la connexion
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-8">
                <h4 className="font-bold text-gray-900 mb-6">Derniers Apprenants Payants</h4>
                <div className="space-y-4">
                  {user.enrollments && user.enrollments.length > 0 ? (
                    user.enrollments.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-[10px]">
                            {e.user.firstName?.[0]}{e.user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{e.user.firstName} {e.user.lastName}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{e.course.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-gray-900">{e.course.price}€</p>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(e.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      Aucune transaction pour le moment.
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
            <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Préférences de Notifications</h3>
            <div className="space-y-6">
              {[
                { label: "Nouvelle inscription", desc: "Recevoir un email lorsqu'un élève s'inscrit." },
                { label: "Nouveau commentaire", desc: "Être alerté lors d'un nouveau retour élève." },
                { label: "Rapports hebdomadaires", desc: "Un résumé de vos performances chaque lundi." },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-gray-100 transition-all group">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button className="w-12 h-6 bg-secondary rounded-full relative transition-all active:scale-95 shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "security":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Sécurité du Compte</h3>
            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4 mb-8">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Gestion externe</p>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Votre sécurité est assurée par Clerk. Pour changer votre mot de passe ou activer la double authentification (2FA), rendez-vous dans les paramètres de votre compte Clerk.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl">
              Gérer mon compte Clerk
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        );
      case "appearance":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Apparence</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { id: 'light', label: 'Clair', icon: Sun, active: true },
                { id: 'dark', label: 'Sombre', icon: Moon },
              ].map((theme) => (
                <button
                  key={theme.id}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                    theme.active
                      ? "border-secondary bg-secondary/5 text-secondary"
                      : "border-gray-50 bg-gray-50/50 text-gray-400 grayscale hover:grayscale-0 hover:border-gray-200"
                  }`}
                >
                  <theme.icon className="w-8 h-8" />
                  <span className="text-xs font-black uppercase tracking-widest">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
              activeTab === tab.id
                ? "bg-white text-secondary font-black shadow-md border border-gray-100 scale-[1.02]"
                : "text-gray-500 hover:bg-gray-50/80 font-bold hover:translate-x-1"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? "bg-secondary/10 text-secondary" : "bg-gray-50 text-gray-400"}`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-sm">{tab.label}</span>
            </div>
            {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
          </button>
        ))}
      </div>
      <div className="lg:col-span-8">
        {renderContent()}
      </div>
    </div>
  );
}
