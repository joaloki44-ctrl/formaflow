"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  Heading1, 
  Heading2, 
  List,
  Quote,
  Code,
  Plus,
  GripVertical,
  Trash2
} from "lucide-react";

// Types de blocs supportés
type BlockType = "text" | "heading" | "heading2" | "image" | "video" | "list" | "quote" | "code";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    url?: string;
    alt?: string;
    language?: string;
  };
}

interface LessonEditorProps {
  type: string;
  content: string;
  onChange: (content: string) => void;
}

const blockIcons: Record<BlockType, typeof Type> = {
  text: Type,
  heading: Heading1,
  heading2: Heading2,
  image: ImageIcon,
  video: Video,
  list: List,
  quote: Quote,
  code: Code,
};

const blockLabels: Record<BlockType, string> = {
  text: "Texte",
  heading: "Titre",
  heading2: "Sous-titre",
  image: "Image",
  video: "Vidéo",
  list: "Liste",
  quote: "Citation",
  code: "Code",
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
    setBlocks([...blocks, newBlock]);
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
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  // Rendu spécifique selon le type de bloc
  const renderBlockInput = (block: Block) => {
    switch (block.type) {
      case "heading":
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Titre principal..."
            className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
          />
        );

      case "heading2":
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Sous-titre..."
            className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
          />
        );

      case "text":
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Écrivez votre contenu ici..."
            rows={4}
            className="w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300 leading-relaxed"
          />
        );

      case "image":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={block.metadata?.url || ""}
              onChange={(e) => updateBlockMetadata(block.id, { url: e.target.value })}
              placeholder="URL de l'image..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
            {block.metadata?.url && (
              <img
                src={block.metadata.url}
                alt={block.metadata?.alt || ""}
                className="max-h-64 rounded-lg object-cover"
              />
            )}
            <input
              type="text"
              value={block.metadata?.alt || ""}
              onChange={(e) => updateBlockMetadata(block.id, { alt: e.target.value })}
              placeholder="Texte alternatif..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        );

      case "video":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="URL YouTube, Vimeo ou lien vidéo..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
            {block.content && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        );

      case "list":
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Élément 1&#10;Élément 2&#10;Élément 3"
            rows={4}
            className="w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
          />
        );

      case "quote":
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Citation..."
            rows={2}
            className="w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300 italic"
          />
        );

      case "code":
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.metadata?.language || ""}
              onChange={(e) => updateBlockMetadata(block.id, { language: e.target.value })}
              placeholder="Langage (js, python, html...)"
              className="w-full px-3 py-1 border border-gray-200 rounded text-xs"
            />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="// Code..."
              rows={6}
              className="w-full resize-none bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]/50"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Liste des blocs */}
      {blocks.map((block, index) => {
        const Icon = blockIcons[block.type];
        return (
          <div
            key={block.id}
            className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-[#ff6b4a]/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Drag handle */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <button
                  onClick={() => moveBlock(block.id, "up")}
                  disabled={index === 0}
                  className="opacity-0 group-hover:opacity-100 disabled:opacity-0 p-1 hover:bg-gray-100 rounded transition-all"
                >
                  ↑
                </button>
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                <button
                  onClick={() => moveBlock(block.id, "down")}
                  disabled={index === blocks.length - 1}
                  className="opacity-0 group-hover:opacity-100 disabled:opacity-0 p-1 hover:bg-gray-100 rounded transition-all"
                >
                  ↓
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">
                    {blockLabels[block.type]}
                  </span>
                </div>
                {renderBlockInput(block)}
              </div>

              {/* Delete */}
              <button
                onClick={() => removeBlock(block.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Add block button */}
      <div className="relative">
        {showAddMenu ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(blockIcons) as BlockType[]).map((type) => {
                const Icon = blockIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-xs text-gray-600">{blockLabels[type]}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowAddMenu(false)}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-[#ff6b4a] hover:text-[#ff6b4a] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un bloc
          </button>
        )}
      </div>
    </div>
  );
}