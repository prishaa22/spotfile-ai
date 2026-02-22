import React from "react";
import { useApp, AppSettings } from "@/context/AppContext";
import { Clock, Gauge, Brain, Eye, ScanFace, Type, HardDrive } from "lucide-react";
import { mockFiles, formatFileSize } from "@/data/mockFiles";
import { motion } from "framer-motion";

const models = [
  { key: "clip" as const, label: "CLIP", desc: "Image-text matching", icon: Eye },
  { key: "facenet" as const, label: "FaceNet", desc: "Face recognition", icon: ScanFace },
  { key: "yolo" as const, label: "YOLO", desc: "Object detection", icon: Brain },
  { key: "ocr" as const, label: "OCR", desc: "Text extraction", icon: Type },
];

const priorities = ["low", "balanced", "high"] as const;

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const totalSize = mockFiles.reduce((a, f) => a + f.size, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>
      <div className="space-y-6">

        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Background Scanning</h3>
          </div>
          <label className="text-sm text-muted-foreground block mb-2">Schedule daily scan at:</label>
          <input type="time" value={settings.scanSchedule} onChange={e => updateSettings({ scanSchedule: e.target.value })} className="px-4 py-2 rounded-lg bg-input border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </motion.div>

        {/* Priority */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Indexing Priority</h3>
          </div>
          <div className="flex gap-3">
            {priorities.map(p => (
              <button key={p} onClick={() => updateSettings({ indexingPriority: p })} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${settings.indexingPriority === p ? "bg-primary/20 text-primary neon-border glow-purple" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Models */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">AI Models</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {models.map(m => {
              const enabled = settings.modelsEnabled[m.key];
              return (
                <button
                  key={m.key}
                  onClick={() => updateSettings({ modelsEnabled: { ...settings.modelsEnabled, [m.key]: !enabled } })}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all text-left ${enabled ? "glass neon-border glow-purple" : "bg-muted/30 opacity-60"}`}
                >
                  <m.icon className={`w-5 h-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <div className={`text-sm font-medium ${enabled ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                  <div className={`ml-auto w-10 h-6 rounded-full p-0.5 transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Storage */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Storage Overview</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-xl font-bold text-foreground">{mockFiles.length}</div><div className="text-xs text-muted-foreground">Files Indexed</div></div>
            <div><div className="text-xl font-bold text-foreground">{formatFileSize(totalSize)}</div><div className="text-xs text-muted-foreground">Total Size</div></div>
            <div><div className="text-xl font-bold text-foreground">{formatFileSize(totalSize * 0.05)}</div><div className="text-xs text-muted-foreground">Index Size</div></div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-neon-cyan" style={{ width: "35%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">35% of local storage used</p>
        </motion.div>
      </div>
    </div>
  );
}
