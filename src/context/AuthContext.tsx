import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("spotfile_user");
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const u: User = {
      id: "user-1",
      name: email.split("@")[0],
      email,
    };
    setUser(u);
    localStorage.setItem("spotfile_user", JSON.stringify(u));
    return true;
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const u: User = { id: "user-1", name, email };
    setUser(u);
    localStorage.setItem("spotfile_user", JSON.stringify(u));
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("spotfile_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
