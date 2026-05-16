"use client";

import { useState } from "react";
import { Building2, Plus, Trash2, Users, BookOpen, X } from "lucide-react";
import toast from "react-hot-toast";

interface Dept {
  id: string;
  name: string;
  managerId: string | null;
  createdAt: string;
  _count: { members: number; assignments: number };
}
interface Member {
  id: string;
  user: { id: string; firstName: string | null; lastName: string | null };
}

interface Props {
  orgId: string;
  initialDepartments: Dept[];
  members: Member[];
}

export default function DepartmentsClient({ orgId, initialDepartments, members }: Props) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), managerId: managerId || null }),
      });
      if (!res.ok) { toast.error(await res.text()); return; }
      const dept = await res.json();
      setDepartments((prev) => [...prev, dept]);
      setName("");
      setManagerId("");
      setShowForm(false);
      toast.success("Département créé");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce département ?")) return;
    const res = await fetch(`/api/organizations/${orgId}/departments/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erreur lors de la suppression"); return; }
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    toast.success("Département supprimé");
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" />
            Départements
          </h1>
          <p className="text-gray-500 text-sm mt-1">{departments.length} département{departments.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Nouveau département
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nouveau département</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nom du département</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Marketing, RH, Technique..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              {members.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Manager (optionnel)</label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">Aucun manager</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.user.id}>
                        {m.user.firstName} {m.user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={create}
                disabled={loading || !name.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold mb-1">Aucun département</h3>
          <p className="text-gray-400 text-sm mb-4">Créez des départements pour organiser vos équipes</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90"
          >
            Créer le premier département
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const manager = members.find((m) => m.user.id === dept.managerId);
            return (
              <div key={dept.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <button
                    onClick={() => remove(dept.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
                {manager && (
                  <p className="text-xs text-gray-400 mb-3">
                    Manager : {manager.user.firstName} {manager.user.lastName}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    {dept._count.members} membre{dept._count.members !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <BookOpen className="w-3.5 h-3.5" />
                    {dept._count.assignments} formation{dept._count.assignments !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
