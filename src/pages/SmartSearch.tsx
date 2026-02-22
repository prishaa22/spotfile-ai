import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, SortAsc, Filter } from "lucide-react";
import { mockFiles, searchFiles } from "@/data/mockFiles";
import { AI_PROCESSING_STEPS } from "@/types";
import { useApp } from "@/context/AppContext";
import FileCard from "@/components/FileCard";

type SortBy = "relevance" | "date" | "size";
type FileTypeFilter = "all" | "pdf" | "image" | "docx" | "code";

export default function SmartSearch() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<{ file: (typeof mockFiles)[0]; score: number }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>("all");
  const { addRecentSearch } = useApp();

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setProcessing(true);
    setCurrentStep(0);
    setResults([]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < AI_PROCESSING_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setProcessing(false);
        setCurrentStep(-1);
        const r = searchFiles(q, mockFiles);
        setResults(r);
        addRecentSearch(q);
      }
    }, 650);
  }, [addRecentSearch]);

  useEffect(() => {
    if (initialQ) runSearch(initialQ);
  }, []); // eslint-disable-line

  const handleSearch = () => {
    setParams({ q: query });
    runSearch(query);
  };

  const filtered = results.filter(r => typeFilter === "all" || r.file.type === typeFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "relevance") return b.score - a.score;
    if (sortBy === "date") return new Date(b.file.date).getTime() - new Date(a.file.date).getTime();
    return b.file.size - a.file.size;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Smart Search</h2>

      {/* Search */}
      <div className="relative glass-strong rounded-xl mb-6 overflow-hidden">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Describe what you're looking for..."
          className="w-full bg-transparent pl-12 pr-28 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Search
        </button>
      </div>

      {/* AI Processing Animation */}
      <AnimatePresence>
        {processing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-xl p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-4">AI Processing...</p>
            <div className="space-y-3">
              {AI_PROCESSING_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${i <= currentStep ? "bg-primary glow-purple" : "bg-muted"} ${i === currentStep ? "animate-pulse-glow" : ""}`} />
                  <span className={`text-sm transition-colors ${i <= currentStep ? "text-foreground" : "text-muted-foreground/50"}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      {!processing && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            {(["all", "pdf", "image", "docx", "code"] as FileTypeFilter[]).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === t ? "bg-primary/20 text-primary neon-border" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                {t === "all" ? "All" : t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
            <SortAsc className="w-4 h-4" />
            {(["relevance", "date", "size"] as SortBy[]).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === s ? "bg-primary/20 text-primary neon-border" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {!processing && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">{sorted.length} results found</p>
          {sorted.map((r, i) => (
            <motion.div key={r.file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <FileCard file={r.file} relevanceScore={r.score} />
            </motion.div>
          ))}
        </div>
      )}

      {!processing && results.length === 0 && initialQ && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No results found. Try a different query.</p>
        </div>
      )}
    </div>
  );
}
