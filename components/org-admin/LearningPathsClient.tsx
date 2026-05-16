"use client";

import { useState } from "react";
import { Route, Plus, X, BookOpen, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface Course { id: string; title: string; imageUrl: string | null; level: string; category: string | null }
interface PathCourse { id: string; position: number; isRequired: boolean; course: Course }
interface LPath {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  courses: PathCourse[];
  _count: { courses: number };
}

interface Props {
  orgId: string;
  initialPaths: LPath[];
  availableCourses: Course[];
}

export default function LearningPathsClient({ orgId, initialPaths, availableCourses }: Props) {
  const [paths, setPaths] = useState(initialPaths);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingCourseToPath, setAddingCourseToPath] = useState<string | null>(null);

  async function createPath() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/learning-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null, organizationId: orgId }),
      });
      if (!res.ok) { toast.error(await res.text()); return; }
      const path = await res.json();
      setPaths((prev) => [{ ...path, courses: [], _count: { courses: 0 } }, ...prev]);
      setTitle("");
      setDescription("");
      setShowCreate(false);
      toast.success("Parcours créé");
    } finally {
      setLoading(false);
    }
  }

  async function deletePath(id: string) {
    if (!confirm("Supprimer ce parcours ?")) return;
    const res = await fetch(`/api/learning-paths/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erreur"); return; }
    setPaths((prev) => prev.filter((p) => p.id !== id));
    toast.success("Parcours supprimé");
  }

  async function addCourse(pathId: string, courseId: string) {
    const res = await fetch(`/api/learning-paths/${pathId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) { toast.error(await res.text()); return; }
    const entry = await res.json();
    setPaths((prev) =>
      prev.map((p) =>
        p.id === pathId ? { ...p, courses: [...p.courses, entry], _count: { courses: p._count.courses + 1 } } : p
      )
    );
    setAddingCourseToPath(null);
    toast.success("Formation ajoutée au parcours");
  }

  async function removeCourse(pathId: string, courseId: string) {
    const res = await fetch(`/api/learning-paths/${pathId}/courses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) { toast.error("Erreur"); return; }
    setPaths((prev) =>
      prev.map((p) =>
        p.id === pathId
          ? { ...p, courses: p.courses.filter((c) => c.course.id !== courseId), _count: { courses: p._count.courses - 1 } }
          : p
      )
    );
    toast.success("Formation retirée");
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Route className="w-6 h-6 text-purple-500" />
            Parcours d&apos;apprentissage
          </h1>
          <p className="text-gray-500 text-sm mt-1">{paths.length} parcours</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Nouveau parcours
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nouveau parcours</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Titre</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Onboarding Nouveaux Employés"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description (optionnel)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Description du parcours..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
              <button
                onClick={createPath}
                disabled={loading || !title.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {paths.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Route className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-semibold mb-1">Aucun parcours</h3>
          <p className="text-gray-400 text-sm mb-4">Créez des parcours pour structurer l&apos;apprentissage de vos équipes</p>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-gradient-to-r from-[#ff6b4a] to-[#f09340] text-white rounded-xl text-sm font-medium">
            Créer le premier parcours
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paths.map((path) => {
            const isExpanded = expandedId === path.id;
            const existingCourseIds = path.courses.map((c) => c.course.id);
            const remainingCourses = availableCourses.filter((c) => !existingCourseIds.includes(c.id));
            return (
              <div key={path.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Route className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{path.title}</h3>
                    {path.description && <p className="text-sm text-gray-400 truncate">{path.description}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{path._count.courses} formation{path._count.courses !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deletePath(path.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : path.id)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-5">
                    {/* Courses in path */}
                    {path.courses.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {path.courses.map((pc, idx) => (
                          <div key={pc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <span className="text-xs font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                            <GripVertical className="w-4 h-4 text-gray-300" />
                            {pc.course.imageUrl && <img src={pc.course.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                            <span className="flex-1 text-sm font-medium text-gray-800 truncate">{pc.course.title}</span>
                            <button
                              onClick={() => removeCourse(path.id, pc.course.id)}
                              className="p-1 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4 mb-4">Aucune formation dans ce parcours</p>
                    )}

                    {/* Add course */}
                    {remainingCourses.length > 0 && (
                      addingCourseToPath === path.id ? (
                        <div className="border border-dashed border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto divide-y divide-gray-100">
                          {remainingCourses.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => addCourse(path.id, c.id)}
                              className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 text-left transition-colors"
                            >
                              {c.imageUrl && <img src={c.imageUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />}
                              <span className="text-sm text-gray-700">{c.title}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingCourseToPath(path.id)}
                          className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter une formation
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
