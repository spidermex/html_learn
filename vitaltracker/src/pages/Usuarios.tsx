
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsers } from "@/lib/store";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Usuario = {
  id: string;
  username: string;
  password: string;
  role: "admin" | "user";
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    const usuariosGuardados = getUsers();
    setUsuarios(usuariosGuardados);
  }, []);

  // Guardar cambios en localStorage
  const guardarUsuarios = (nuevosUsuarios: Usuario[]) => {
    localStorage.setItem('users', JSON.stringify(nuevosUsuarios));
    setUsuarios(nuevosUsuarios);
  };

  // Abrir diálogo para crear/editar usuario
  const abrirDialogoUsuario = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditar(usuario);
      setUsername(usuario.username);
      setPassword(usuario.password);
      setRole(usuario.role);
    } else {
      setUsuarioEditar(null);
      setUsername("");
      setPassword("");
      setRole("user");
    }
    setDialogoAbierto(true);
  };

  // Cerrar diálogo y limpiar campos
  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setUsuarioEditar(null);
    setUsername("");
    setPassword("");
    setRole("user");
  };

  // Guardar usuario (nuevo o edición)
  const guardarUsuario = () => {
    if (!username || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    let nuevosUsuarios: Usuario[];

    if (usuarioEditar) {
      // Editar usuario existente
      nuevosUsuarios = usuarios.map(u => 
        u.id === usuarioEditar.id 
          ? { ...u, username, password, role } 
          : u
      );
      toast.success("Usuario actualizado correctamente");
    } else {
      // Verificar si ya existe un usuario con ese nombre
      if (usuarios.some(u => u.username === username)) {
        toast.error("Ya existe un usuario con ese nombre");
        return;
      }

      // Crear nuevo usuario
      nuevosUsuarios = [
        ...usuarios,
        {
          id: Date.now().toString(),
          username,
          password,
          role
        }
      ];
      toast.success("Usuario creado correctamente");
    }

    guardarUsuarios(nuevosUsuarios);
    cerrarDialogo();
  };

  // Eliminar usuario
  const eliminarUsuario = () => {
    if (!usuarioEliminar) return;

    // Verificar si es el último administrador
    const administradores = usuarios.filter(u => u.role === "admin");
    if (usuarioEliminar.role === "admin" && administradores.length <= 1) {
      toast.error("No se puede eliminar el último administrador");
      setDialogoEliminarAbierto(false);
      setUsuarioEliminar(null);
      return;
    }

    // Eliminar usuario
    const nuevosUsuarios = usuarios.filter(u => u.id !== usuarioEliminar.id);
    guardarUsuarios(nuevosUsuarios);
    toast.success("Usuario eliminado correctamente");
    setDialogoEliminarAbierto(false);
    setUsuarioEliminar(null);
  };

  // Verificar si el usuario actual está logueado
  const confirmarEliminar = (usuario: Usuario) => {
    setUsuarioEliminar(usuario);
    setDialogoEliminarAbierto(true);
  };

  return (
    <Layout>
      <BotonRegresar />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Gestión de Usuarios</h1>
          <Button onClick={() => abrirDialogoUsuario()} className="flex items-center gap-2">
            <Plus size={16} />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              Administra los usuarios que pueden acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usuarios.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.username}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            usuario.role === "admin" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {usuario.role === "admin" ? "Administrador" : "Usuario"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => abrirDialogoUsuario(usuario)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => confirmarEliminar(usuario)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay usuarios registrados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo para crear/editar usuario */}
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {usuarioEditar ? "Editar Usuario" : "Crear Usuario"}
              </DialogTitle>
              <DialogDescription>
                {usuarioEditar 
                  ? "Modifica los datos del usuario" 
                  : "Ingresa los datos para el nuevo usuario"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usuario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={role} onValueChange={(value: "admin" | "user") => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cerrarDialogo}>Cancelar</Button>
              <Button onClick={guardarUsuario}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación para eliminar */}
        <AlertDialog open={dialogoEliminarAbierto} onOpenChange={setDialogoEliminarAbierto}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirmar eliminación
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar el usuario <strong>{usuarioEliminar?.username}</strong>?
                <br />
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={eliminarUsuario}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Usuarios;
