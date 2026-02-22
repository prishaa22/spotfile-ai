import React from "react";
import { mockFiles } from "@/data/mockFiles";
import { useApp } from "@/context/AppContext";
import FileCard from "@/components/FileCard";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Favorites() {
  const { favorites } = useApp();
  const favFiles = mockFiles.filter(f => favorites.has(f.id));

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Favorites</h2>
      {favFiles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No favorites yet. Star files to see them here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favFiles.map((file, i) => (
            <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <FileCard file={file} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
