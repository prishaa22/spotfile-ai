import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import DashboardLayout from "@/components/DashboardLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import ScanFiles from "@/pages/ScanFiles";
import SmartSearch from "@/pages/SmartSearch";
import AllFiles from "@/pages/AllFiles";
import Favorites from "@/pages/Favorites";
import Recent from "@/pages/Recent";
import FaceSearch from "@/pages/FaceSearch";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="scan" element={<ScanFiles />} />
                <Route path="search" element={<SmartSearch />} />
                <Route path="files" element={<AllFiles />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="recent" element={<Recent />} />
                <Route path="face-search" element={<FaceSearch />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
