import React from "react";
import { mockFiles } from "@/data/mockFiles";
import { useApp } from "@/context/AppContext";
import FileCard from "@/components/FileCard";
import { Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Recent() {
  const { recentFiles, recentSearches } = useApp();
  const navigate = useNavigate();
  const files = recentFiles.map(id => mockFiles.find(f => f.id === id)).filter(Boolean) as typeof mockFiles;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Recent</h2>

      {recentSearches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(q => (
              <button key={q} onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)} className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                <Search className="w-3.5 h-3.5" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No recent files. Preview files to see them here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, i) => (
            <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <FileCard file={file} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
