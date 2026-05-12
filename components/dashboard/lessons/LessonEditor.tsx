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
  Paperclip
} from "lucide-react";

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
  video: "Vidéo",
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
            <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 group-hover:bg-white transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">Télécharger une vidéo</p>
              <p className="text-xs text-gray-500 mb-4">MP4, WebM ou Ogg (max 500Mo)</p>
              <input type="file" className="hidden" id={`video-upload-${block.id}`} accept="video/*" />
              <label htmlFor={`video-upload-${block.id}`} className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer hover:bg-gray-800 transition-all">Sélectionner un fichier</label>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">ou via lien</span></div>
            </div>
            <input type="text" value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Lien YouTube, Vimeo, S3..." className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-secondary/20 focus:outline-none" />
          </div>
        );
      case "file":
        return (
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{block.metadata?.fileName || "Aucun fichier sélectionné"}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{block.metadata?.fileSize || "PDF, ZIP, DOCX..."}</p>
              </div>
            </div>
            <input type="file" className="hidden" id={`file-upload-${block.id}`} />
            <label htmlFor={`file-upload-${block.id}`} className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer hover:bg-gray-50 transition-all">Ajouter</label>
          </div>
        );
      default:
        return <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="Écrivez ici..." rows={3} className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800" />;
    }
  };

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const Icon = blockIcons[block.type];
        return (
          <div key={block.id} className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all relative">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveBlock(block.id, "up")} disabled={index === 0} className="p-1 hover:bg-gray-50 rounded">↑</button>
                <GripVertical className="w-4 h-4 text-gray-300" />
                <button onClick={() => moveBlock(block.id, "down")} disabled={index === blocks.length - 1} className="p-1 hover:bg-gray-50 rounded">↓</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icon className="w-3.5 h-3.5" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{blockLabels[block.type]}</span>
                </div>
                {renderBlockInput(block)}
              </div>
              <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        );
      })}
      <div className="relative">
        {showAddMenu ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-2xl animate-fade-in">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {(Object.keys(blockIcons) as BlockType[]).map((type) => {
                const Icon = blockIcons[type];
                return (
                  <button key={type} onClick={() => addBlock(type)} className="flex flex-col items-center gap-3 p-4 hover:bg-secondary/5 rounded-2xl transition-all group">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-secondary group-hover:shadow-md transition-all"><Icon className="w-6 h-6" /></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{blockLabels[type]}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowAddMenu(false)} className="w-full mt-6 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Fermer</button>
          </div>
        ) : (
          <button onClick={() => setShowAddMenu(true)} className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-gray-400 hover:border-secondary/30 hover:text-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all"><Plus className="w-6 h-6" /></div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Ajouter un élément au cours</span>
          </button>
        )}
      </div>
    </div>
  );
}
