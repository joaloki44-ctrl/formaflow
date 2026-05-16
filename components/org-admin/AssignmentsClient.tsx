"use client";

import { useState } from "react";
import { BookOpen, Plus, Trash2, AlertCircle, Clock, X, Search } from "lucide-react";
import toast from "react-hot-toast";

interface Course { id: string; title: string; imageUrl: string | null; level: string; category: string | null }
interface Dept { id: string; name: string }
interface Assignment {
  id: string;
  isMandatory: boolean;
  dueDate: string | null;
  assignedAt: string;
  course: Course;
  department: Dept | null;
  userId: string | null;
}

interface Props {
  orgId: string;
  initialAssignments: Assignment[];
  departments: Dept[];
  availableCourses: Course[];
}

const LEVEL_LABELS: Record<string, string> = { BEGINNER: "Débutant", INTERMEDIATE: "Intermédiaire", ADVANCED: "Avancé" };
const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-green-50 text-green-700",
  INTERMEDIATE: "bg-blue-50 text-blue-700",
  ADVANCED: "bg-purple-50 text-purple-700",
};

export default function AssignmentsClient({ orgId, initialAssignments, departments, availableCourses }: Props) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showForm, setShowForm] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const filteredAssignments = assignments.filter((a) => {
    const q = search.toLowerCase();
    return a.course.title.toLowerCase().includes(q) || (a.department?.name ?? "").toLowerCase().includes(q);
  });

  const filteredCourses = availableCourses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  async function assign() {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          departmentId: deptId || null,
          isMandatory,
          dueDate: dueDate || null,
        }),
      });
      if (!res.ok) { toast.error(await res.text()); return; }
      const data = await res.json();
      setAssignments((prev) => [data, ...prev]);
      setCourseId("");
      setDeptId("");
      setIsMandatory(false);
      setDueDate("");
      setShowForm(false);
      toast.success("Formation assignée avec succès ! Les employés ont été automatiquement inscrits.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Retirer cette assignation ?")) return;
    const res = await fetch(`/api/organizations/${orgId}/assignments/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erreur lors de la suppression"); return; }
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    toast.success("Assignation retirée");
  }

  const isOverdue = (a: Assignment) => a.dueDate && new Date(a.dueDate) < new Date();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-500" />
            Assignations de formations
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {assignments.length} formation{assignments.length !== 1 ? "s" : ""} assignée{assignments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Assigner une formation
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Assigner une formation</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Course picker */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Formation</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Rechercher une formation..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {filteredCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCourseId(c.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${courseId === c.id ? "bg-orange-50" : ""}`}
                    >
                      {c.imageUrl && <img src={c.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${courseId === c.id ? "text-[#ff6b4a]" : "text-gray-900"}`}>{c.title}</p>
                        <p className="text-xs text-gray-400">{c.category ?? "Sans catégorie"}</p>
                      </div>
                      {courseId === c.id && <div className="w-2 h-2 rounded-full bg-[#ff6b4a] flex-shrink-0" />}
                    </button>
                  ))}
                  {filteredCourses.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aucune formation trouvée</p>
                  )}
                </div>
              </div>

              {departments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Département cible</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">Toute l&apos;organisation</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="mandatory" className="text-sm font-medium text-gray-700">
                  Formation obligatoire
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date limite (optionnel)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={assign}
                disabled={loading || !courseId}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Assignation..." : "Assigner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une assignation..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Assignments */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold mb-1">Aucune assignation</h3>
          <p className="text-gray-400 text-sm mb-4">Assignez des formations à vos équipes pour suivre leur progression</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90">
            Assigner la première formation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((a) => (
            <div
              key={a.id}
              className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all group ${isOverdue(a) ? "border-red-200" : "border-gray-100"}`}
            >
              <div className="flex items-start gap-3 mb-3">
                {a.course.imageUrl ? (
                  <img src={a.course.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-orange-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{a.course.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[a.course.level]}`}>
                      {LEVEL_LABELS[a.course.level]}
                    </span>
                    {a.isMandatory && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Obligatoire
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => remove(a.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                <span>{a.department ? `📂 ${a.department.name}` : "🏢 Toute l'organisation"}</span>
                {a.dueDate && (
                  <span className={`flex items-center gap-1 font-medium ${isOverdue(a) ? "text-red-600" : "text-gray-500"}`}>
                    <Clock className="w-3 h-3" />
                    {isOverdue(a) ? "En retard · " : ""}
                    {new Date(a.dueDate).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
