"use client";

import { useState } from "react";
import { Users, Plus, Search, Trash2, Edit3, Mail, Shield, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Department { id: string; name: string }
interface Member {
  id: string;
  role: string;
  inviteStatus: string;
  inviteEmail?: string | null;
  joinedAt: string;
  user: { id: string; firstName: string | null; lastName: string | null; email: string; imageUrl: string | null };
  department: { id: string; name: string } | null;
}

interface Props {
  orgId: string;
  orgName: string;
  initialMembers: Member[];
  departments: Department[];
}

const ROLE_LABELS: Record<string, string> = {
  ORG_ADMIN: "Administrateur",
  MANAGER: "Manager",
  EMPLOYEE: "Employé",
};
const ROLE_COLORS: Record<string, string> = {
  ORG_ADMIN: "bg-red-50 text-red-700",
  MANAGER: "bg-blue-50 text-blue-700",
  EMPLOYEE: "bg-gray-100 text-gray-700",
};

export default function MembersClient({ orgId, orgName, initialMembers, departments }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EMPLOYEE");
  const [inviteDeptId, setInviteDeptId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editDeptId, setEditDeptId] = useState("");

  const filtered = members.filter((m) => {
    const name = `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.toLowerCase();
    const email = m.user.email.toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  async function invite() {
    if (!inviteEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole, departmentId: inviteDeptId || null }),
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg);
        return;
      }
      const data = await res.json();
      if (data.invited) {
        toast.success(`Invitation envoyée à ${inviteEmail}`);
      } else {
        setMembers((prev) => [data, ...prev]);
        toast.success("Membre ajouté avec succès");
      }
      setInviteEmail("");
      setInviteRole("EMPLOYEE");
      setInviteDeptId("");
      setShowInvite(false);
    } finally {
      setLoading(false);
    }
  }

  async function updateMember(memberId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole, departmentId: editDeptId || null }),
      });
      if (!res.ok) { toast.error("Erreur lors de la mise à jour"); return; }
      const updated = await res.json();
      setMembers((prev) => prev.map((m) => (m.id === memberId ? updated : m)));
      setEditingId(null);
      toast.success("Membre mis à jour");
    } finally {
      setLoading(false);
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm("Retirer ce membre de l'organisation ?")) return;
    const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erreur lors de la suppression"); return; }
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Membre retiré");
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Employés
          </h1>
          <p className="text-gray-500 text-sm mt-1">{orgName} · {members.length} membre{members.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Inviter un employé
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Inviter un employé</h2>
              <button onClick={() => setShowInvite(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Adresse email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="employe@entreprise.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="EMPLOYEE">Employé</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ORG_ADMIN">Administrateur</option>
                </select>
              </div>
              {departments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Département (optionnel)</label>
                  <select
                    value={inviteDeptId}
                    onChange={(e) => setInviteDeptId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">Aucun département</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={invite}
                disabled={loading || !inviteEmail}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? "Envoi..." : "Inviter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un employé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">Aucun employé trouvé</p>
            <button onClick={() => setShowInvite(true)} className="text-[#ff6b4a] text-sm hover:underline mt-2 inline-block">
              Inviter le premier employé
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Département</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Rôle</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 hidden lg:table-cell">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {m.user.imageUrl ? (
                        <img src={m.user.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#f09340] flex items-center justify-center text-white text-sm font-bold">
                          {m.user.firstName?.charAt(0) ?? m.user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {m.user.firstName} {m.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {m.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{m.department?.name ?? "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === m.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                      >
                        <option value="EMPLOYEE">Employé</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ORG_ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[m.role] ?? "bg-gray-100 text-gray-700"}`}>
                        {ROLE_LABELS[m.role] ?? m.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.inviteStatus === "ACCEPTED" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                      {m.inviteStatus === "ACCEPTED" ? "Actif" : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {editingId === m.id ? (
                        <>
                          <button
                            onClick={() => updateMember(m.id)}
                            disabled={loading}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(m.id); setEditRole(m.role); setEditDeptId(m.department?.id ?? ""); }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeMember(m.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
