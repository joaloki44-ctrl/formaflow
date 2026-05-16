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
  Sun,
  Moon,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  BadgePercent,
} from "lucide-react";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  instructorAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  student: { firstName: string | null; lastName: string | null };
  course: { title: string };
}

interface SettingsClientProps {
  user: any;
  payments: Payment[];
}

export default function SettingsClient({ user, payments }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    notificationsEnabled: user.notificationsEnabled ?? true,
    weeklyReportsEnabled: user.weeklyReportsEnabled ?? true,
    marketingEmails: user.marketingEmails ?? false,
    theme: user.theme || "light",
  });

  const stripeStatus = user.stripeAccountStatus as string | null;
  const stripeConnected = !!user.stripeAccountId;
  const stripeDone = !!user.stripeOnboardingDone;
  const isStripeActive = stripeConnected && stripeDone && stripeStatus === "active";

  const totalEarnings = payments.reduce((sum, p) => sum + p.instructorAmount, 0);
  const totalTransactions = payments.length;

  const onSave = async (specificData?: Partial<typeof formData>) => {
    setIsLoading(true);
    const dataToSend = specificData || formData;
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) throw new Error();
      toast.success("Paramètres synchronisés avec succès !");
    } catch {
      toast.error("Erreur lors de la sauvegarde Cloud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeOnboard = async () => {
    setConnectLoading(true);
    try {
      const res = await fetch("/api/stripe/connect/onboard", { method: "POST" });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error("Impossible de lancer la configuration Stripe");
      setConnectLoading(false);
    }
  };

  const handleStripeDashboard = async () => {
    setDashboardLoading(true);
    try {
      const res = await fetch("/api/stripe/connect/dashboard", { method: "POST" });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      toast.error("Impossible d'ouvrir le tableau de bord Stripe");
    } finally {
      setDashboardLoading(false);
    }
  };

  const formatAmount = (cents: number, currency = "eur") =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);

  const tabs = [
    { id: "profile", label: "Profil Public", icon: UserIcon },
    { id: "billing", label: "Facturation & Revenus", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Identité de l&apos;Instructeur</h3>
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center gap-10 pb-10 border-b border-gray-50">
                <div className="w-32 h-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center text-secondary font-black text-4xl overflow-hidden relative group shadow-inner border-2 border-white">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
                  )}
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
            {/* Commission badge */}
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-100 rounded-2xl w-fit">
              <BadgePercent className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
                Commission plateforme : 5% par vente — vous recevez 95%
              </span>
            </div>

            {/* Stripe Connect Card */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Compte Stripe Connect</h3>

              {/* === Not connected === */}
              {!stripeConnected && (
                <div className="rounded-[2.5rem] border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Connectez votre compte Stripe</h4>
                  <p className="text-sm text-gray-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                    Liez votre compte Stripe pour recevoir automatiquement 95% de chaque vente. Les virements sont effectués chaque lundi.
                  </p>
                  <button
                    onClick={handleStripeOnboard}
                    disabled={connectLoading}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#635BFF] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#5147ee] transition-all shadow-xl shadow-[#635BFF]/30 disabled:opacity-60"
                  >
                    {connectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Connecter Stripe
                  </button>
                </div>
              )}

              {/* === Connected but onboarding incomplete === */}
              {stripeConnected && !stripeDone && (
                <div className="rounded-[2.5rem] border-2 border-amber-200 bg-amber-50 p-10">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-amber-100 text-amber-600 shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-amber-900 mb-2">Configuration incomplète</h4>
                      <p className="text-sm text-amber-700 font-medium leading-relaxed mb-6">
                        Votre compte Stripe Express a été créé mais l&apos;onboarding n&apos;est pas finalisé. Complétez votre profil pour recevoir des paiements.
                      </p>
                      <button
                        onClick={handleStripeOnboard}
                        disabled={connectLoading}
                        className="inline-flex items-center gap-3 px-8 py-3.5 bg-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-60"
                      >
                        {connectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Continuer la configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === Active account === */}
              {isStripeActive && (
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20 mb-8">
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Compte actif</span>
                        </div>
                        <h4 className="text-2xl font-black mb-1">{formatAmount(totalEarnings)}</h4>
                        <p className="text-emerald-200 text-sm font-medium">Revenus nets totaux (95%)</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleStripeDashboard}
                          disabled={dashboardLoading}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl whitespace-nowrap disabled:opacity-60"
                        >
                          {dashboardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                          Dashboard Stripe
                        </button>
                      </div>
                    </div>
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                      <div>
                        <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1">Transactions</p>
                        <p className="text-2xl font-black">{totalTransactions}</p>
                      </div>
                      <div>
                        <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1">Commission</p>
                        <p className="text-2xl font-black">5%</p>
                      </div>
                      <div>
                        <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1">Votre part</p>
                        <p className="text-2xl font-black">95%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === Restricted account === */}
              {stripeConnected && stripeDone && stripeStatus === "restricted" && (
                <div className="rounded-[2.5rem] border-2 border-red-200 bg-red-50 p-10 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-red-100 text-red-600 shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-red-900 mb-2">Compte restreint</h4>
                      <p className="text-sm text-red-700 font-medium leading-relaxed mb-4">
                        Stripe a besoin d&apos;informations supplémentaires pour activer les paiements. Accédez au tableau de bord pour résoudre le problème.
                      </p>
                      <button
                        onClick={handleStripeDashboard}
                        disabled={dashboardLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all disabled:opacity-60"
                      >
                        {dashboardLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        Résoudre via Stripe
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent payments */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Transactions Récentes</h3>
                {totalTransactions > 0 && (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    {totalTransactions} ventes
                  </span>
                )}
              </div>

              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {payment.student.firstName} {payment.student.lastName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate max-w-[160px]">
                            {payment.course.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-emerald-600">
                          +{formatAmount(payment.instructorAmount, payment.currency)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          Total {formatAmount(payment.amount, payment.currency)} · frais {formatAmount(payment.platformFee, payment.currency)}
                        </p>
                        <p className="text-[10px] text-gray-300 font-bold">
                          {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
                  <TrendingUp className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold italic">En attente de votre première vente.</p>
                  {!isStripeActive && (
                    <p className="text-xs text-gray-300 font-medium mt-2">Connectez Stripe pour commencer à recevoir des paiements.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-10 tracking-tight">Préférences de Communication</h3>
            <div className="space-y-6">
              {[
                { id: "notificationsEnabled", label: "Inscriptions Elèves", desc: "Soyez notifié instantanément à chaque nouvel inscrit." },
                { id: "weeklyReportsEnabled", label: "Rapports Hebdomadaires", desc: "Recevez un bilan SEO et financier tous les lundis matin." },
                { id: "marketingEmails", label: "Actualités FormaFlow", desc: "Découvrez les nouvelles fonctionnalités 'Elite 2026' en avant-première." },
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
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${active ? "bg-secondary" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${active ? "left-8" : "left-1"}`} />
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
            <button onClick={() => window.open("https://clerk.com/user", "_blank")} className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20">
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
                { id: "light", label: "FormaFlow Clair", desc: "Minimalisme & Sérénité", icon: Sun },
                { id: "dark", label: "Mode Cinématique", desc: "Elite Dark Interface", icon: Moon },
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
                    <div className={`p-5 rounded-[2rem] transition-all shadow-sm ${active ? "bg-white text-secondary" : "bg-white text-gray-300"}`}><theme.icon className="w-10 h-10" /></div>
                    <div><span className="text-sm font-black uppercase tracking-widest block mb-2">{theme.label}</span><p className={`text-[10px] font-bold ${active ? "text-secondary/60" : "text-gray-400"}`}>{theme.desc}</p></div>
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
            <div className="flex items-center gap-2">
              {tab.id === "billing" && stripeConnected && !stripeDone && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 animate-pulse" />}
            </div>
          </button>
        ))}
      </div>
      <div className="lg:col-span-8">
        {renderContent()}
      </div>
    </div>
  );
}
