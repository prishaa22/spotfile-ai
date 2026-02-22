import React, { useState } from "react";
import { mockFiles } from "@/data/mockFiles";
import FileCard from "@/components/FileCard";
import { LayoutGrid, List, Filter } from "lucide-react";
import { motion } from "framer-motion";

const FILE_TYPES = ["all", "pdf", "image", "docx", "code", "spreadsheet", "video", "audio"] as const;
const PER_PAGE = 12;

export default function AllFiles() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = filter === "all" ? mockFiles : mockFiles.filter(f => f.type === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">All Files</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground mt-1" />
        {FILE_TYPES.map(t => (
          <button key={t} onClick={() => { setFilter(t); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === t ? "bg-primary/20 text-primary neon-border" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" : "space-y-3"}>
        {paginated.map((file, i) => (
          <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <FileCard file={file} compact={view === "grid"} />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-primary text-primary-foreground glow-purple" : "glass text-muted-foreground hover:text-foreground"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
