
import React from "react";
import { Navegacion } from "./Navegacion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Navegacion />
        <main className="flex-1 p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};
