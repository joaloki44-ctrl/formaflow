"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  function autoSlug(v: string) {
    return v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), domain: domain.trim() || null }),
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg);
        return;
      }
      const org = await res.json();
      toast.success("Organisation créée avec succès !");
      router.push(`/org-admin/${org.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f6] to-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-xl flex items-center justify-center text-white font-bold">
              FF
            </div>
            <span className="font-serif text-2xl text-gray-900">FormaFlow</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700">Espace Entreprise</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Créer votre organisation
          </h1>
          <p className="text-gray-500">
            Gérez les formations de vos équipes en quelques minutes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={create} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Nom de l&apos;entreprise <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === autoSlug(name)) setSlug(autoSlug(e.target.value));
              }}
              placeholder="Acme Corporation"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Identifiant unique <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">formaflow.com/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(autoSlug(e.target.value))}
                placeholder="acme-corporation"
                required
                className="w-full border border-gray-200 rounded-xl pl-36 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Lettres minuscules, chiffres et tirets uniquement</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Domaine email <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="acme.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
            />
            <p className="text-xs text-gray-400 mt-1">Permet de vérifier l&apos;appartenance des employés à l&apos;entreprise</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim() || !slug.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Créer l&apos;organisation
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Vous serez automatiquement défini comme administrateur
          </p>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: "👥", label: "Gestion des équipes" },
            { icon: "📊", label: "Analytics détaillées" },
            { icon: "🎓", label: "Parcours sur mesure" },
          ].map((f) => (
            <div key={f.label} className="text-center p-3 bg-white rounded-xl border border-gray-100">
              <p className="text-2xl mb-1">{f.icon}</p>
              <p className="text-xs text-gray-600 font-medium">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
