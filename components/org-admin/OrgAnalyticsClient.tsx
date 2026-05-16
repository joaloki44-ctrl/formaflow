"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, BookOpen, CheckCircle2, TrendingUp, AlertTriangle,
  Award, BarChart3, Download,
} from "lucide-react";

interface Overview { totalMembers: number; totalEnrollments: number; totalCompleted: number; orgAvgProgress: number }
interface MemberStat {
  memberId: string;
  user: { id: string; firstName: string | null; lastName: string | null; email: string; imageUrl: string | null };
  role: string;
  totalEnrolled: number;
  totalCompleted: number;
  avgProgress: number;
  mandatoryCompleted: number;
  mandatoryTotal: number;
}
interface CourseStat {
  courseId: string;
  title: string;
  imageUrl: string | null;
  isMandatory: boolean;
  enrolled: number;
  completed: number;
  completionRate: number;
  avgProgress: number;
}

interface Props {
  orgId: string;
  orgName: string;
  departments: { id: string; name: string }[];
}

export default function OrgAnalyticsClient({ orgId, orgName, departments }: Props) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStat[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState("");
  const [tab, setTab] = useState<"members" | "courses">("members");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/organizations/${orgId}/analytics${deptFilter ? `?departmentId=${deptFilter}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setOverview(data.overview);
      setMemberStats(data.memberStats);
      setCourseStats(data.courseStats);
    } finally {
      setLoading(false);
    }
  }, [orgId, deptFilter]);

  useEffect(() => { load(); }, [load]);

  function exportCSV() {
    const rows = [
      ["Nom", "Email", "Rôle", "Inscriptions", "Complétions", "Progression moy.", "Obligatoires complétées"],
      ...memberStats.map((m) => [
        `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.trim(),
        m.user.email,
        m.role,
        m.totalEnrolled,
        m.totalCompleted,
        `${m.avgProgress}%`,
        `${m.mandatoryCompleted}/${m.mandatoryTotal}`,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orgName}-analytics.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statCards = overview
    ? [
        { label: "Membres actifs", value: overview.totalMembers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Inscriptions totales", value: overview.totalEnrollments, icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Complétions", value: overview.totalCompleted, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "Progression moyenne", value: `${overview.orgAvgProgress}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
      ]
    : [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-500" />
            Analytiques
          </h1>
          <p className="text-gray-500 text-sm mt-1">{orgName}</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Toute l&apos;organisation</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
            {(["members", "courses"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t === "members" ? "Par employé" : "Par formation"}
              </button>
            ))}
          </div>

          {tab === "members" ? (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {memberStats.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune donnée disponible</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Employé</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Inscriptions</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 hidden md:table-cell">Complétions</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Progression</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 hidden lg:table-cell">Obligatoires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberStats.map((m) => (
                      <tr key={m.memberId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
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
                              <p className="text-sm font-medium text-gray-900">{m.user.firstName} {m.user.lastName}</p>
                              <p className="text-xs text-gray-500">{m.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-700">{m.totalEnrolled}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-700">{m.totalCompleted}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-24">
                              <div
                                className="h-full bg-gradient-to-r from-[#ff6b4a] to-[#f09340] rounded-full"
                                style={{ width: `${m.avgProgress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{m.avgProgress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {m.mandatoryTotal > 0 ? (
                            <div className="flex items-center gap-1.5">
                              {m.mandatoryCompleted === m.mandatoryTotal ? (
                                <Award className="w-4 h-4 text-green-500" />
                              ) : m.mandatoryCompleted < m.mandatoryTotal ? (
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                              ) : null}
                              <span className={`text-xs font-medium ${m.mandatoryCompleted === m.mandatoryTotal ? "text-green-700" : "text-orange-700"}`}>
                                {m.mandatoryCompleted}/{m.mandatoryTotal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {courseStats.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune formation assignée</p>
                </div>
              ) : (
                courseStats.map((c) => (
                  <div key={c.courseId} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start gap-4 mb-3">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-orange-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{c.title}</p>
                          {c.isMandatory && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">Obligatoire</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{c.enrolled} inscrit{c.enrolled !== 1 ? "s" : ""}</span>
                          <span>{c.completed} terminé{c.completed !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-gray-900">{c.completionRate}%</p>
                        <p className="text-xs text-gray-400">taux de complétion</p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff6b4a] to-[#f09340] rounded-full transition-all"
                        style={{ width: `${c.avgProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Progression moyenne : {c.avgProgress}%</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
