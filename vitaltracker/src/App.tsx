
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Pacientes from "./pages/Pacientes";
import SignosVitales from "./pages/SignosVitales";
import Eventos from "./pages/Eventos";
import Medicacion from "./pages/Medicacion";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Crear el queryClient fuera del componente para evitar recreaciones
const queryClient = new QueryClient();

// Componente para proteger rutas
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode,
  requiredRole?: "admin" | "user" 
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('usuarioActivo');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/pacientes" element={
              <ProtectedRoute requiredRole="admin">
                <Pacientes />
              </ProtectedRoute>
            } />
            
            <Route path="/signos-vitales" element={
              <ProtectedRoute>
                <SignosVitales />
              </ProtectedRoute>
            } />
            
            <Route path="/eventos" element={
              <ProtectedRoute>
                <Eventos />
              </ProtectedRoute>
            } />
            
            <Route path="/medicacion" element={
              <ProtectedRoute>
                <Medicacion />
              </ProtectedRoute>
            } />
            
            <Route path="/reportes" element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios" element={
              <ProtectedRoute requiredRole="admin">
                <Usuarios />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
