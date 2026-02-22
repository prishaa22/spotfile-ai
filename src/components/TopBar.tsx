import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Shield, Type, Contrast, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useApp();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border/30 glass">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 neon-border">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-medium text-accent">100% Offline</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Accessibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Type className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-strong border-border/50">
            <DropdownMenuItem onClick={() => updateSettings({ fontSize: Math.min(22, settings.fontSize + 2) })}>
              Increase Font Size
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSettings({ fontSize: Math.max(12, settings.fontSize - 2) })}>
              Decrease Font Size
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => updateSettings({ highContrast: !settings.highContrast })}>
              <Contrast className="w-4 h-4 mr-2" />
              {settings.highContrast ? "Normal Contrast" : "High Contrast"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground hidden md:inline">{user?.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-strong border-border/50">
            <DropdownMenuItem className="text-muted-foreground text-xs">{user?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
