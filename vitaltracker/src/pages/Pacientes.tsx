
import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getPatients, getMedications } from "@/lib/store";
import { toast } from "sonner";
import { Patient, Medication } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Pacientes = () => {
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>();
  const [notas, setNotas] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState<string | null>(null);
  
  const nombreInputRef = useRef<HTMLInputElement>(null);
  
  const pacientes = getPatients();
  const medicamentos = getMedications();

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setNombre("");
    setFechaNacimiento(undefined);
    setNotas("");
    setEditandoId(null);
    
    // Devolver el foco al campo de nombre
    if (nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  };
  
  // Función para cargar los datos de un paciente en el formulario
  const cargarPaciente = (paciente: Patient) => {
    setNombre(paciente.name);
    setFechaNacimiento(paciente.birthDate ? new Date(paciente.birthDate) : undefined);
    setNotas(paciente.notes || "");
    setEditandoId(paciente.id);
  };
  
  // Función para guardar un paciente (nuevo o editado)
  const guardarPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre) {
      toast.error("Por favor ingresa el nombre del paciente");
      return;
    }
    
    if (!fechaNacimiento) {
      toast.error("Por favor selecciona la fecha de nacimiento");
      return;
    }
    
    if (editandoId) {
      // Editar paciente existente
      const pacientesActualizados = pacientes.map((p: Patient) => {
        if (p.id === editandoId) {
          return {
            ...p,
            name: nombre,
            birthDate: fechaNacimiento.toISOString(),
            notes: notas || undefined
          };
        }
        return p;
      });
      
      localStorage.setItem('patients', JSON.stringify(pacientesActualizados));
      toast.success("Paciente actualizado correctamente");
    } else {
      // Crear nuevo paciente
      const nuevoPaciente: Patient = {
        id: Date.now().toString(),
        name: nombre,
        birthDate: fechaNacimiento.toISOString(),
        notes: notas || undefined
      };
      
      const pacientesActualizados = [...pacientes, nuevoPaciente];
      localStorage.setItem('patients', JSON.stringify(pacientesActualizados));
      toast.success("Paciente registrado correctamente");
    }
    
    limpiarFormulario();
  };
  
  // Función para eliminar un paciente
  const eliminarPaciente = () => {
    if (!pacienteAEliminar) return;
    
    const pacientesActualizados = pacientes.filter((p: Patient) => p.id !== pacienteAEliminar);
    localStorage.setItem('patients', JSON.stringify(pacientesActualizados));
    
    // También eliminar los medicamentos asociados
    const medicamentosActualizados = medicamentos.filter((m: Medication) => m.patientId !== pacienteAEliminar);
    localStorage.setItem('medications', JSON.stringify(medicamentosActualizados));
    
    toast.success("Paciente eliminado correctamente");
    setDialogoEliminarAbierto(false);
    setPacienteAEliminar(null);
    
    // Si estábamos editando el paciente que se eliminó, limpiar el formulario
    if (editandoId === pacienteAEliminar) {
      limpiarFormulario();
    }
  };
  
  // Calcular la edad a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };
  
  // Obtener medicamentos de un paciente
  const obtenerMedicamentosPaciente = (pacienteId: string) => {
    return medicamentos.filter((m: Medication) => m.patientId === pacienteId);
  };
  
  return (
    <Layout>
      <BotonRegresar />
      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Pacientes</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editandoId ? "Editar Paciente" : "Nuevo Paciente"}</CardTitle>
                <CardDescription>
                  {editandoId ? "Actualiza los datos del paciente" : "Registra un nuevo paciente"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={guardarPaciente} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      ref={nombreInputRef}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fecha de nacimiento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fechaNacimiento && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaNacimiento ? format(fechaNacimiento, "P", { locale: es }) : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fechaNacimiento}
                          onSelect={setFechaNacimiento}
                          disabled={(date) => date > new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas médicas</Label>
                    <Textarea
                      id="notas"
                      placeholder="Información médica relevante, condiciones, alergias, etc."
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editandoId ? "Actualizar" : "Guardar"}
                    </Button>
                    {editandoId && (
                      <Button type="button" variant="outline" onClick={limpiarFormulario}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pacientes Registrados</CardTitle>
                <CardDescription>
                  Listado de pacientes y sus detalles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pacientes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay pacientes registrados
                    </div>
                  ) : (
                    pacientes.map((paciente: Patient) => {
                      const medicamentosPaciente = obtenerMedicamentosPaciente(paciente.id);
                      
                      return (
                        <Card key={paciente.id} className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{paciente.name}</CardTitle>
                                <CardDescription>
                                  {paciente.birthDate && (
                                    <>
                                      {format(new Date(paciente.birthDate), "PPP", { locale: es })}
                                      {` (${calcularEdad(paciente.birthDate)} años)`}
                                    </>
                                  )}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => cargarPaciente(paciente)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Dialog
                                  open={dialogoEliminarAbierto && pacienteAEliminar === paciente.id}
                                  onOpenChange={(open) => {
                                    setDialogoEliminarAbierto(open);
                                    if (!open) setPacienteAEliminar(null);
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setPacienteAEliminar(paciente.id)}
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirmar eliminación</DialogTitle>
                                      <DialogDescription>
                                        ¿Estás seguro de que deseas eliminar a {paciente.name}? Esta acción no se puede deshacer.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setDialogoEliminarAbierto(false)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={eliminarPaciente}
                                      >
                                        Eliminar
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Tabs defaultValue="info">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">Información</TabsTrigger>
                                <TabsTrigger value="medicamentos">Medicamentos ({medicamentosPaciente.length})</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="info">
                                <div className="mt-2">
                                  {paciente.notes ? (
                                    <div>
                                      <h4 className="text-sm font-medium">Notas médicas:</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{paciente.notes}</p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No hay notas médicas registradas</p>
                                  )}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="medicamentos">
                                <div className="mt-2">
                                  {medicamentosPaciente.length > 0 ? (
                                    <div className="space-y-2">
                                      {medicamentosPaciente.map((med: Medication) => (
                                        <div
                                          key={med.id}
                                          className={`p-2 rounded-md text-sm ${med.active ? 'bg-green-100' : 'bg-muted'}`}
                                        >
                                          <div className="font-medium">{med.name}</div>
                                          <div className="text-xs text-muted-foreground">
                                            Dosis: {med.dosage}
                                            {med.schedule && ` | Horario: ${med.schedule}`}
                                            {` | Estado: ${med.active ? 'Activo' : 'Inactivo'}`}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No hay medicamentos registrados</p>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pacientes;
