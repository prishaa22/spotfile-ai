import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, Upload, Loader2 } from "lucide-react";
import { mockFiles } from "@/data/mockFiles";
import FileCard from "@/components/FileCard";

const faceFiles = mockFiles.filter(f => f.type === "image" && f.tags.some(t => ["family", "team", "group", "selfie", "wedding", "graduation", "group photo"].includes(t)));

export default function FaceSearch() {
  const [stage, setStage] = useState<"idle" | "processing" | "done">("idle");
  const [results, setResults] = useState<typeof faceFiles>([]);

  const simulate = () => {
    setStage("processing");
    setResults([]);
    setTimeout(() => {
      setStage("done");
      setResults(faceFiles.slice(0, 6));
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Face Search</h2>

      <div className="glass-strong rounded-2xl p-8 text-center mb-8">
        <ScanFace className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Upload a photo to find matching faces</h3>
        <p className="text-sm text-muted-foreground mb-6">AI-powered facial recognition across your indexed files</p>
        <button onClick={simulate} disabled={stage === "processing"} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all glow-purple inline-flex items-center gap-2 disabled:opacity-50">
          {stage === "processing" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {stage === "processing" ? "Processing..." : "Upload & Search"}
        </button>
      </div>

      <AnimatePresence>
        {stage === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-xl p-6 mb-6">
            <div className="space-y-3">
              {["Detecting faces...", "Extracting embeddings...", "Comparing with database..."].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.8 }} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-sm text-foreground">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "done" && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{results.length} photos with matching faces</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((file, i) => (
              <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="relative">
                  <FileCard file={file} />
                  {/* Face detection overlay indicator */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-medium neon-border">
                    <ScanFace className="w-3 h-3 inline mr-1" />
                    Face detected
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
