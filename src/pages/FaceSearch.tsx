import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, Upload, Loader2, ImageIcon, X } from "lucide-react";
import { mockFiles } from "@/data/mockFiles";
import FileCard from "@/components/FileCard";

const faceFiles = mockFiles.filter(f => f.type === "image" && f.tags.some(t => ["family", "team", "group", "selfie", "wedding", "graduation", "group photo"].includes(t)));

export default function FaceSearch() {
  const [stage, setStage] = useState<"idle" | "processing" | "done">("idle");
  const [results, setResults] = useState<typeof faceFiles>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReferenceImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    setStage("idle");
    setResults([]);
  };

  const clearReference = () => {
    setReferenceImage(null);
    setReferenceFileName("");
    setStage("idle");
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startScan = () => {
    if (!referenceImage) return;
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
        <h3 className="text-lg font-medium text-foreground mb-2">Upload a reference photo to find matching faces</h3>
        <p className="text-sm text-muted-foreground mb-6">Select a photo with a face, then scan your indexed files for matches</p>

        {/* Reference image preview */}
        {referenceImage ? (
          <div className="mb-6 inline-block relative">
            <img src={referenceImage} alt="Reference" className="w-32 h-32 object-cover rounded-xl border-2 border-primary/40 mx-auto" />
            <button
              onClick={clearReference}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-xs text-muted-foreground mt-2 truncate max-w-[160px]">{referenceFileName}</p>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mb-6 w-32 h-32 mx-auto rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Select photo</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex gap-3 justify-center">
          {!referenceImage && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-muted/50 text-foreground font-medium hover:bg-muted/70 transition-all inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose Reference Photo
            </button>
          )}
          {referenceImage && (
            <button
              onClick={startScan}
              disabled={stage === "processing"}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all glow-purple inline-flex items-center gap-2 disabled:opacity-50"
            >
              {stage === "processing" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanFace className="w-4 h-4" />}
              {stage === "processing" ? "Processing..." : "Scan for Matches"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {stage === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-xl p-6 mb-6">
            <div className="space-y-3">
              {["Detecting faces in reference...", "Extracting face embeddings...", "Comparing with indexed files..."].map((step, i) => (
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
