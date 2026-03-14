import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image, FileCode, File, X, Play, CheckCircle2, Loader2, ScanLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ScanFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "queued" | "scanning" | "done" | "error";
  progress: number;
}

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  code: FileCode,
};

function getFileCategory(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) return "image";
  if (["pdf"].includes(ext)) return "pdf";
  if (["js", "ts", "tsx", "jsx", "py", "go", "rs", "java", "cpp", "c", "html", "css"].includes(ext)) return "code";
  return "other";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ScanFiles() {
  const [files, setFiles] = useState<ScanFile[]>([]);
  const [scanning, setScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: ScanFile[] = Array.from(fileList).map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      status: "queued" as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    toast({ title: `${newFiles.length} file(s) added`, description: "Ready for scanning." });
  }, [toast]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  const startScan = useCallback(async () => {
    const queued = files.filter(f => f.status === "queued");
    if (queued.length === 0) {
      toast({ title: "No files to scan", description: "Add files first.", variant: "destructive" });
      return;
    }
    setScanning(true);

    for (const file of queued) {
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "scanning", progress: 0 } : f));

      // Simulate scanning progress
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 120 + Math.random() * 80));
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: p } : f));
      }

      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "done", progress: 100 } : f));
    }

    setScanning(false);
    toast({ title: "Scan complete", description: `${queued.length} file(s) processed successfully.` });
  }, [files, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const queuedCount = files.filter(f => f.status === "queued").length;
  const doneCount = files.filter(f => f.status === "done").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scan Files</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload files to scan and index them in the background using AI models.</p>
      </div>

      {/* Drop zone */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 ${
          dragOver ? "border-primary bg-primary/10" : "border-border/50 bg-muted/20 hover:border-primary/50"
        }`}
      >
        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground font-medium">Drag & drop files here</p>
        <p className="text-muted-foreground text-sm mt-1">or click to browse</p>
        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={e => addFiles(e.target.files)}
        />
      </motion.div>

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{files.length} file(s)</span>
            <span>•</span>
            <span>{queuedCount} queued</span>
            <span>•</span>
            <span>{doneCount} done</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} disabled={scanning}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
            <Button size="sm" onClick={startScan} disabled={scanning || queuedCount === 0} className="bg-primary hover:bg-primary/80">
              {scanning ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
              {scanning ? "Scanning…" : "Start Scan"}
            </Button>
          </div>
        </div>
      )}

      {/* File list */}
      <AnimatePresence>
        {files.map(file => {
          const category = getFileCategory(file.name);
          const Icon = FILE_TYPE_ICONS[category] || File;

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-lg p-4 flex items-center gap-4 mb-2"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                {file.status === "scanning" && (
                  <Progress value={file.progress} className="h-1.5 mt-1.5" />
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {file.status === "queued" && (
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">Queued</span>
                )}
                {file.status === "scanning" && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <ScanLine className="w-3.5 h-3.5 animate-pulse" /> Scanning
                  </span>
                )}
                {file.status === "done" && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                )}
                {file.status !== "scanning" && !scanning && (
                  <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {files.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ScanLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No files added yet. Upload files to begin scanning.</p>
        </div>
      )}
    </div>
  );
}
