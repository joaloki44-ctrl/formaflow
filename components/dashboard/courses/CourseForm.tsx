"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, ImageIcon, X, Loader2, Video, Film, CheckCircle2 } from "lucide-react";

export default function CourseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    level: "BEGINNER",
    imageUrl: "",
    videoUrl: "",
  });

  const handleVideoUpload = async (file: File) => {
    setIsVideoUploading(true);
    // Simulate real upload & processing
    setTimeout(() => {
      const fakeUrl = "https://example.com/promo-video.mp4";
      setFormData({ ...formData, videoUrl: fakeUrl });
      setIsVideoUploading(false);
      toast.success("Vidéo de présentation prête !");
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      const course = await response.json();
      toast.success("Formation créée avec succès !");
      router.push(`/dashboard/courses/${course.id}`);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Vignette (Couverture)</label>
            {formData.imageUrl ? (
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({ ...formData, imageUrl: "" })} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-rose-500 hover:scale-110 transition-all"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-secondary/20 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><ImageIcon className="w-6 h-6 text-secondary" /></div>
                <input type="text" placeholder="URL de l'image..." className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-center" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Vidéo de Présentation (Teaser)</label>
            {formData.videoUrl ? (
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-100 shadow-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                <button type="button" onClick={() => setFormData({ ...formData, videoUrl: "" })} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-rose-500 hover:scale-110 transition-all z-10"><X className="w-4 h-4" /></button>
              </div>
            ) : isVideoUploading ? (
              <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center space-y-4">
                 <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                 <p className="text-[10px] font-black uppercase text-gray-400">Traitement en cours...</p>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-secondary/20 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Video className="w-6 h-6 text-blue-500" /></div>
                <input type="file" className="hidden" id="promo-video-upload" accept="video/*" onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])} />
                <label htmlFor="promo-video-upload" className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-gray-800 transition-all shadow-lg text-center">Sélectionner Teaser</label>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Titre de la formation *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 text-lg shadow-inner" placeholder="ex: Masterclass Intelligence Artificielle 2026" />
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Description détaillée *</label>
          <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-medium text-gray-800 resize-none shadow-inner" placeholder="Décrivez les objectifs pédagogiques et les prérequis..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Catégorie</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 appearance-none shadow-sm cursor-pointer">
              <option value="">Sélectionner...</option>
              <option value="TECH">Technologie</option>
              <option value="BUSINESS">Business</option>
              <option value="DESIGN">Design</option>
              <option value="MARKETING">Marketing</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Prix de vente (€)</label>
            <input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all font-bold text-gray-900 shadow-sm" placeholder="0.00 (Gratuit)" />
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">Annuler</button>
          <button type="submit" disabled={isLoading || isVideoUploading} className="flex-[2] px-8 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Lancer la production
          </button>
        </div>
      </div>
    </form>
  );
}
