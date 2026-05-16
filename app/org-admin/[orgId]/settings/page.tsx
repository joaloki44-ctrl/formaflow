"use client";

import { useState, useEffect } from "react";
import { Settings, Building2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function OrgSettingsPage() {
  const params = useParams<{ orgId: string }>();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/organizations/${params.orgId}`)
      .then((r) => r.json())
      .then((org) => {
        setName(org.name ?? "");
        setLogoUrl(org.logoUrl ?? "");
        setDomain(org.domain ?? "");
      })
      .finally(() => setFetching(false));
  }, [params.orgId]);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${params.orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl, domain }),
      });
      if (!res.ok) { toast.error("Erreur lors de la sauvegarde"); return; }
      toast.success("Paramètres mis à jour");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-500" />
          Paramètres de l&apos;organisation
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b4a] to-[#f09340] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">Espace Entreprise</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nom de l&apos;organisation</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">URL du logo (optionnel)</label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Domaine email (optionnel)</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="entreprise.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <p className="text-xs text-gray-400 mt-1">Utilisé pour vérifier les invitations par domaine email</p>
        </div>

        <button
          onClick={save}
          disabled={loading || !name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Save className="w-4 h-4" />
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
