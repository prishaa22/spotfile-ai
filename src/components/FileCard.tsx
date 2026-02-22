import React from "react";
import { FileText, Image, Code, FileSpreadsheet, Video, Music, File, Star, StarOff, Copy, Trash2, Eye } from "lucide-react";
import { MockFile, formatFileSize } from "@/data/mockFiles";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  docx: FileText,
  code: Code,
  spreadsheet: FileSpreadsheet,
  video: Video,
  audio: Music,
};

const typeColors: Record<string, string> = {
  pdf: "text-red-400 bg-red-400/10",
  image: "text-emerald-400 bg-emerald-400/10",
  docx: "text-blue-400 bg-blue-400/10",
  code: "text-amber-400 bg-amber-400/10",
  spreadsheet: "text-green-400 bg-green-400/10",
  video: "text-purple-400 bg-purple-400/10",
  audio: "text-pink-400 bg-pink-400/10",
};

interface FileCardProps {
  file: MockFile;
  relevanceScore?: number;
  compact?: boolean;
}

export default function FileCard({ file, relevanceScore, compact }: FileCardProps) {
  const { toggleFavorite, isFavorite, addRecentFile } = useApp();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const Icon = typeIcons[file.type] || File;
  const colorClass = typeColors[file.type] || "text-muted-foreground bg-muted";
  const fav = isFavorite(file.id);

  const copyPath = () => {
    navigator.clipboard.writeText(file.path);
    toast({ title: "Path copied!", description: file.path });
  };

  return (
    <>
      <div className={`glass rounded-xl p-4 hover:glow-purple transition-all duration-300 group ${compact ? "" : ""}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">{file.name}</h3>
              {relevanceScore !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium shrink-0">
                  {Math.round(relevanceScore)}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{file.path}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {file.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground/60">
                {formatFileSize(file.size)} · {new Date(file.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => { setShowPreview(true); addRecentFile(file.id); }} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Preview">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => toggleFavorite(file.id)} className={`p-1.5 rounded-lg hover:bg-muted/50 transition-colors ${fav ? "text-amber-400" : "text-muted-foreground hover:text-foreground"}`} title="Favorite">
              {fav ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <button onClick={copyPath} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Copy path">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={() => toast({ title: "Deleted", description: `${file.name} removed (mock)` })} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-strong rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${colorClass}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center">{file.name}</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">{file.path}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{file.type.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-foreground">{formatFileSize(file.size)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{new Date(file.date).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">Tags</span><div className="flex flex-wrap gap-1 mt-1">{file.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{t}</span>)}</div></div>
                <div><span className="text-muted-foreground">Embedding Vector</span><p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">[{file.embedding.join(", ")}]</p></div>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-full mt-6 py-2.5 rounded-lg bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
