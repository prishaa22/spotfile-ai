import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, Image, Code, Brain, Sparkles, HardDrive, Cpu } from "lucide-react";
import { mockFiles } from "@/data/mockFiles";
import { useApp } from "@/context/AppContext";

const suggestions = [
  "birthday photo with cake",
  "machine learning pdf",
  "invoice from March",
  "team photos at offsite",
  "python data analysis",
  "travel sunset photos",
];

const stats = [
  { label: "Total Files", value: mockFiles.length, icon: HardDrive, color: "text-primary" },
  { label: "Images", value: mockFiles.filter(f => f.type === "image").length, icon: Image, color: "text-neon-cyan" },
  { label: "PDFs", value: mockFiles.filter(f => f.type === "pdf").length, icon: FileText, color: "text-neon-blue" },
  { label: "AI Models", value: 4, icon: Cpu, color: "text-primary" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { addRecentSearch } = useApp();

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    addRecentSearch(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/15 glow-purple flex items-center justify-center mx-auto mb-6 animate-float">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          What are you looking for?
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe what you need in natural language
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="relative glass-strong rounded-2xl glow-purple overflow-hidden">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search your files with AI..."
            className="w-full bg-transparent pl-14 pr-32 py-5 text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            onClick={() => handleSearch()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Search
          </button>
        </div>
      </motion.div>

      {/* Suggestion Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 justify-center mb-12"
      >
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); handleSearch(s); }}
            className="px-4 py-2 rounded-full text-sm glass border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:glow-purple transition-all"
          >
            {s}
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="glass rounded-xl p-5 text-center hover:glow-purple transition-all duration-300"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
