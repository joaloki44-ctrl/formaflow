"use client";

import { useState } from "react";
import { 
  Plus,
  Trash2,
  GripVertical,
  Type, 
  Heading1, 
  Heading2, 
  Image as ImageIcon,
  Video,
  List,
  Quote,
  Code,
  Upload,
  FileText,
  X,
  Paperclip,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

type BlockType = "text" | "heading" | "heading2" | "image" | "video" | "list" | "quote" | "code" | "file";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    url?: string;
    alt?: string;
    language?: string;
    fileName?: string;
    fileSize?: string;
    duration?: string;
    status?: "idle" | "uploading" | "processing" | "ready" | "error";
  };
}

interface LessonEditorProps {
  type: "TEXT" | "VIDEO" | "QUIZ";
  content: string;
  onChange: (content: string) => void;
}

const blockIcons: Record<BlockType, any> = {
  heading: Heading1,
  heading2: Heading2,
  text: Type,
  image: ImageIcon,
  video: Video,
  list: List,
  quote: Quote,
  code: Code,
  file: Paperclip,
};

const blockLabels: Record<BlockType, string> = {
  heading: "Titre 1",
  heading2: "Titre 2",
  text: "Paragraphe",
  image: "Image",
  video: "Vidéo Pro",
  list: "Liste",
  quote: "Citation",
  code: "Code",
  file: "Fichier joint",
};

export default function LessonEditor({ type, content, onChange }: LessonEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(
    content ? JSON.parse(content) : [{ id: "1", type: "text", content: "" }]
  );
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (blockType: BlockType) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type: blockType,
      content: "",
      metadata: blockType === "video" ? { status: "idle" } : {}
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    onChange(JSON.stringify(updated));
    setShowAddMenu(false);
  };

  const updateBlock = (id: string, newContent: string) => {
    const updated = blocks.map((b) =>
      b.id === id ? { ...b, content: newContent } : b
    );
    setBlocks(updated);
    onChange(JSON.stringify(updated));
  };
  
  const updateBlockMetadata = (id: string, metadata: Block['metadata']) => {
    const updated = blocks.map((b) =>
      b.id === id ? { ...b, metadata: { ...b.metadata, ...metadata } } : b
    );
    setBlocks(updated);
    onChange(JSON.stringify(updated));
  };

  const handleVideoUpload = async (id: string, file: File) => {
    updateBlockMetadata(id, { status: "uploading", fileName: file.name });

    // Simulate real upload & processing
    setTimeout(() => {
      updateBlockMetadata(id, { status: "processing" });
      setTimeout(() => {
        const fakeUrl = "https://example.com/video.mp4"; // Should be real S3/Mux URL
        updateBlockMetadata(id, { status: "ready", url: fakeUrl, duration: "04:20" });
        updateBlock(id, fakeUrl);
        toast.success("Vidéo traitée et prête !");
      }, 2000);
    }, 2000);
  };

  const removeBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    onChange(JSON.stringify(updated));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  const renderBlockInput = (block: Block) => {
    switch (block.type) {
      case "text":
        return <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Écrivez ici..." rows={4} className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-300 leading-relaxed" />;
      case "heading":
        return <input type="text" value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Titre 1" className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-200" />;
      case "video":
        return (
          <div className="space-y-4">
            {block.metadata?.status === "ready" ? (
              <div className="aspect-video bg-gray-900 rounded-2xl relative overflow-hidden group/vid shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                   <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                 </div>
                 <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-white/60 bg-black/20 px-2 py-1 rounded-md backdrop-blur-md">{block.metadata.fileName}</span>
                    <span className="text-[10px] font-black uppercase text-white/60 bg-black/20 px-2 py-1 rounded-md backdrop-blur-md">{block.metadata.duration}</span>
                 </div>
                 <button onClick={() => updateBlockMetadata(block.id, { status: "idle" })} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-rose-500 text-white rounded-lg backdrop-blur-md transition-all">
                    <X className="w-4 h-4" />
                 </button>
              </div>
            ) : block.metadata?.status === "uploading" || block.metadata?.status === "processing" ? (
              <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{block.metadata.status === "uploading" ? "Téléchargement..." : "Traitement HD en cours..."}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{block.metadata.fileName}</p>
                </div>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-secondary/20 transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-secondary" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Télécharger votre contenu vidéo</p>
                <p className="text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest">MP4, MOV ou WebM (max 1Go)</p>
                <input type="file" className="hidden" id={\`video-upload-\${block.id}\`} accept="video/*" onChange={(e) => e.target.files?.[0] && handleVideoUpload(block.id, e.target.files[0])} />
                <label htmlFor={\`video-upload-\${block.id}\`} className="px-8 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl cursor-pointer hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20">Parcourir les fichiers</label>
              </div>
            )}
          </div>
        );
      case "file":
        return (
          <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:bg-white transition-all hover:shadow-xl hover:shadow-gray-500/5">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-secondary transition-colors">
                <Paperclip className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{block.metadata?.fileName || "Aucun fichier sélectionné"}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{block.metadata?.fileSize || "PDF, ZIP, DOCX..."}</p>
              </div>
            </div>
            <input type="file" className="hidden" id={\`file-upload-\${block.id}\`} onChange={(e) => e.target.files?.[0] && updateBlockMetadata(block.id, { fileName: e.target.files[0].name, fileSize: (e.target.files[0].size / 1024 / 1024).toFixed(2) + " MB" })} />
            <label htmlFor={\`file-upload-\${block.id}\`} className="px-6 py-3 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:border-secondary/20 transition-all">Ajouter une ressource</label>
          </div>
        );
      default:
        return <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Écrivez ici..." rows={3} className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800" />;
    }
  };

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const Icon = blockIcons[block.type];
        return (
          <div key={block.id} className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-secondary/20 hover:shadow-2xl hover:shadow-secondary/5 transition-all relative">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                <button onClick={() => moveBlock(block.id, "up")} disabled={index === 0} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">↑</button>
                <GripVertical className="w-4 h-4 text-gray-300" />
                <button onClick={() => moveBlock(block.id, "down")} disabled={index === blocks.length - 1} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">↓</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-secondary transition-colors"><Icon className="w-4 h-4" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{blockLabels[block.type]}</span>
                </div>
                {renderBlockInput(block)}
              </div>
              <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 p-3 text-gray-300 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        );
      })}
      <div className="relative">
        {showAddMenu ? (
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl animate-fade-in ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Bibliothèque de Blocs</h4>
               <button onClick={() => setShowAddMenu(false)} className="p-2 hover:bg-gray-50 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {(Object.keys(blockIcons) as BlockType[]).map((type) => {
                const Icon = blockIcons[type];
                return (
                  <button key={type} onClick={() => addBlock(type)} className="flex flex-col items-center gap-4 p-6 hover:bg-secondary/5 rounded-[2rem] transition-all group/btn border border-transparent hover:border-secondary/10">
                    <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-gray-400 group-hover/btn:bg-white group-hover/btn:text-secondary group-hover/btn:shadow-lg transition-all"><Icon className="w-7 h-7" /></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/btn:text-secondary">{blockLabels[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddMenu(true)} className="w-full py-12 border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-400 hover:border-secondary/30 hover:text-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center gap-4 group">
            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all border border-transparent group-hover:border-secondary/10"><Plus className="w-8 h-8" /></div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Enrichir le contenu de la leçon</span>
          </button>
        )}
      </div>
    </div>
  );
}
