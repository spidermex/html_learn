
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Home, 
  Users, 
  Thermometer, 
  Activity, 
  PillIcon, 
  BarChart4, 
  Menu,
  LogOut,
  User,
  UserCog
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
  disabled?: boolean;
}

interface UserData {
  id: string;
  username: string;
  role: "admin" | "user";
}

const NavItem = ({ href, icon, text, active, disabled }: NavItemProps) => (
  <Link to={href} className={cn("w-full", disabled && "pointer-events-none opacity-50")}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      )}
      disabled={disabled}
    >
      {icon}
      <span>{text}</span>
    </Button>
  </Link>
);

export const Navegacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const user = localStorage.getItem('usuarioActivo');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuarioActivo');
    toast.success("Sesión cerrada correctamente");
    navigate('/login');
  };

  const navItems = [
    { 
      href: "/", 
      icon: <Home size={20} />, 
      text: "Inicio",
      disabled: false
    },
    { 
      href: "/pacientes", 
      icon: <Users size={20} />, 
      text: "Pacientes",
      disabled: userData?.role !== "admin"
    },
    { 
      href: "/signos-vitales", 
      icon: <Thermometer size={20} />, 
      text: "Signos Vitales",
      disabled: false
    },
    { 
      href: "/eventos", 
      icon: <Activity size={20} />, 
      text: "Eventos de Salud",
      disabled: false
    },
    { 
      href: "/medicacion", 
      icon: <PillIcon size={20} />, 
      text: "Medicación",
      disabled: false
    },
    { 
      href: "/reportes", 
      icon: <BarChart4 size={20} />, 
      text: "Reportes",
      disabled: false
    },
    { 
      href: "/usuarios", 
      icon: <UserCog size={20} />, 
      text: "Usuarios",
      disabled: userData?.role !== "admin"
    },
  ];

  return (
    <>
      {/* Navegación para móviles */}
      <div className="md:hidden p-2 border-b bg-background shadow-sm z-10">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú de navegación"
          >
            <Menu size={20} />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary text-lg">SignosVitales</span>
          </div>
          
          {userData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={16} />
                  <span className="text-sm">{userData.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <Accordion
          type="single"
          collapsible
          className={cn(
            "w-full transition-all duration-300",
            menuOpen ? "max-h-96" : "max-h-0 overflow-hidden"
          )}
          value={menuOpen ? "menu" : ""}
        >
          <AccordionItem value="menu" className="border-none">
            <AccordionContent className="pt-2 pb-0">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    text={item.text}
                    active={location.pathname === item.href}
                    disabled={item.disabled}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Navegación para escritorio */}
      <div className="hidden md:flex flex-col gap-1 p-4 border-r min-h-screen bg-background shadow-sm z-10 w-64">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-primary">SignosVitales</h2>
          </div>
          
          {userData && (
            <div className="mb-6 flex items-center justify-between bg-muted/40 rounded-lg p-3">
              <div className="flex flex-col">
                <span className="font-medium">{userData.username}</span>
                <span className="text-xs text-muted-foreground">{userData.role === "admin" ? "Administrador" : "Usuario"}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={location.pathname === item.href}
              disabled={item.disabled}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export const BotonRegresar = () => {
  const handleRegresar = () => {
    window.history.back();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleRegresar} 
      className="absolute top-4 left-4 md:static mb-4"
      aria-label="Regresar"
    >
      <ChevronLeft size={24} />
    </Button>
  );
};
