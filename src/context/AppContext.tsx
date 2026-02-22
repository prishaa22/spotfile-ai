import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AppContextType {
  favorites: Set<string>;
  recentSearches: string[];
  recentFiles: string[];
  toggleFavorite: (fileId: string) => void;
  isFavorite: (fileId: string) => boolean;
  addRecentSearch: (query: string) => void;
  addRecentFile: (fileId: string) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

export interface AppSettings {
  scanSchedule: string;
  indexingPriority: "low" | "balanced" | "high";
  modelsEnabled: { clip: boolean; facenet: boolean; yolo: boolean; ocr: boolean };
  fontSize: number;
  highContrast: boolean;
}

const defaultSettings: AppSettings = {
  scanSchedule: "02:00",
  indexingPriority: "balanced",
  modelsEnabled: { clip: true, facenet: true, yolo: false, ocr: true },
  fontSize: 16,
  highContrast: false,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const s = localStorage.getItem("spotfile_favorites");
    return s ? new Set(JSON.parse(s)) : new Set();
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const s = localStorage.getItem("spotfile_recent_searches");
    return s ? JSON.parse(s) : [];
  });
  const [recentFiles, setRecentFiles] = useState<string[]>(() => {
    const s = localStorage.getItem("spotfile_recent_files");
    return s ? JSON.parse(s) : [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = localStorage.getItem("spotfile_settings");
    return s ? { ...defaultSettings, ...JSON.parse(s) } : defaultSettings;
  });

  const toggleFavorite = useCallback((fileId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      localStorage.setItem("spotfile_favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback((fileId: string) => favorites.has(fileId), [favorites]);

  const addRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const next = [query, ...prev.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem("spotfile_recent_searches", JSON.stringify(next));
      return next;
    });
  }, []);

  const addRecentFile = useCallback((fileId: string) => {
    setRecentFiles(prev => {
      const next = [fileId, ...prev.filter(f => f !== fileId)].slice(0, 20);
      localStorage.setItem("spotfile_recent_files", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...s };
      localStorage.setItem("spotfile_settings", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ favorites, recentSearches, recentFiles, toggleFavorite, isFavorite, addRecentSearch, addRecentFile, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
