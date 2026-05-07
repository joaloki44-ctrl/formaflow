import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@clerk/nextjs";
import { Shield, Key, Bell, CreditCard, Layout } from "lucide-react";

export default async function SettingsPage() {
  return (
    <div className="md:ml-80 bg-dark min-h-screen relative overflow-hidden">
      <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            Paramètres
          </h1>
          <p className="text-slate-500 font-medium text-xl leading-snug">
            Configurez votre environnement et gérez vos protocoles de sécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {[
              { label: "Profil", icon: Shield, active: true },
              { label: "Sécurité", icon: Key, active: false },
              { label: "Notifications", icon: Bell, active: false },
              { label: "Facturation", icon: CreditCard, active: false },
              { label: "Apparence", icon: Layout, active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                  item.active ? "bg-secondary text-white shadow-neon" : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bento-card border border-white/5 bg-white/[0.01] overflow-hidden p-0">
              {/* Note: In a real app, we'd style the Clerk UserProfile or use custom forms */}
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Shield className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Gestion du Compte Clerk</h3>
                <p className="text-slate-500 mb-10 max-w-md mx-auto">
                  Utilisez l'interface sécurisée de Clerk pour modifier vos informations personnelles, votre email et vos paramètres de sécurité MFA.
                </p>
                <div className="inline-block p-1 bg-white/5 rounded-full border border-white/10">
                  <UserProfile
                    appearance={{
                      elements: {
                        card: "bg-transparent shadow-none border-none",
                        navbar: "hidden",
                        pageScrollBox: "p-0",
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
