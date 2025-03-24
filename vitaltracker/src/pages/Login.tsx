
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUsers } from "@/lib/store";
import { toast } from "sonner";
import { Activity, User, KeyRound } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si ya hay una sesión activa
    const sesionActiva = localStorage.getItem('usuarioActivo');
    if (sesionActiva) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    if (!username || !password) {
      toast.error("Por favor ingresa usuario y contraseña");
      setCargando(false);
      return;
    }
    
    const usuarios = getUsers();
    const usuarioEncontrado = usuarios.find(
      (user: any) => user.username === username && user.password === password
    );
    
    if (usuarioEncontrado) {
      // Guardar sesión
      localStorage.setItem('usuarioActivo', JSON.stringify({
        id: usuarioEncontrado.id,
        username: usuarioEncontrado.username,
        role: usuarioEncontrado.role
      }));
      
      toast.success("Inicio de sesión exitoso");
      navigate('/');
    } else {
      toast.error("Usuario o contraseña incorrectos");
      setCargando(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">SignosVitales</h1>
          </div>
        </div>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus datos para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="username"
                    placeholder="usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t p-6">
            <div className="w-full space-y-2">
              <p className="text-sm text-center text-muted-foreground font-medium">Usuarios disponibles (demo):</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="border rounded p-2 bg-muted/30 text-center">
                  <p className="text-primary font-medium">Administrador</p>
                  <p className="text-muted-foreground">admin / admin123</p>
                </div>
                <div className="border rounded p-2 bg-muted/30 text-center">
                  <p className="text-primary font-medium">Usuario</p>
                  <p className="text-muted-foreground">usuario / usuario123</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
