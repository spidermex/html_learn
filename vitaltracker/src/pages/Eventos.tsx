
import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPatients, getHealthEvents } from "@/lib/store";
import { toast } from "sonner";
import { Patient, HealthEvent } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Eventos = () => {
  const [pacienteId, setPacienteId] = useState("");
  const [tipoEvento, setTipoEvento] = useState<"urination" | "defecation">("urination");
  const [color, setColor] = useState("");
  const [olor, setOlor] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");
  
  const pacienteSelectRef = useRef<HTMLButtonElement>(null);
  
  const pacientes = getPatients();
  const eventos = getHealthEvents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pacienteId) {
      toast.error("Por favor selecciona un paciente");
      return;
    }
    
    if (!tipoEvento) {
      toast.error("Por favor selecciona un tipo de evento");
      return;
    }
    
    // Crear nuevo registro
    const nuevoEvento: HealthEvent = {
      id: Date.now().toString(),
      patientId: pacienteId,
      date: new Date().toISOString(),
      type: tipoEvento,
      color: color || undefined,
      odor: olor || undefined,
      frequency: frecuencia ? parseInt(frecuencia) : undefined,
      notes: notas || undefined
    };
    
    // Guardar en localStorage
    const eventosActualizados = [...eventos, nuevoEvento];
    localStorage.setItem('healthEvents', JSON.stringify(eventosActualizados));
    
    toast.success("Evento de salud registrado correctamente");
    
    // Limpiar el formulario
    setColor("");
    setOlor("");
    setFrecuencia("");
    setNotas("");
    
    // Devolver el foco al selector de paciente
    if (pacienteSelectRef.current) {
      pacienteSelectRef.current.focus();
    }
  };
  
  const coloresOpciones = [
    { value: "amarillo", label: "Amarillo" },
    { value: "ámbar", label: "Ámbar" },
    { value: "marrón claro", label: "Marrón claro" },
    { value: "marrón", label: "Marrón" },
    { value: "marrón oscuro", label: "Marrón oscuro" },
    { value: "verde", label: "Verde" },
    { value: "rojo", label: "Rojo" },
    { value: "claro", label: "Claro" },
    { value: "transparente", label: "Transparente" }
  ];
  
  const oloresOpciones = [
    { value: "normal", label: "Normal" },
    { value: "fuerte", label: "Fuerte" },
    { value: "amoniacal", label: "Amoniacal" },
    { value: "dulce", label: "Dulce" },
    { value: "fétido", label: "Fétido" }
  ];
  
  return (
    <Layout>
      <BotonRegresar />
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Registro de Eventos de Salud</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Evento</CardTitle>
            <CardDescription>
              Registra eventos de salud del paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="urination" onValueChange={(value) => setTipoEvento(value as "urination" | "defecation")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="urination">Micción</TabsTrigger>
                <TabsTrigger value="defecation">Defecación</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paciente">Paciente</Label>
                  <Select
                    value={pacienteId}
                    onValueChange={setPacienteId}
                  >
                    <SelectTrigger id="paciente" ref={pacienteSelectRef}>
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map((paciente: Patient) => (
                        <SelectItem key={paciente.id} value={paciente.id}>
                          {paciente.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={color}
                      onValueChange={setColor}
                    >
                      <SelectTrigger id="color">
                        <SelectValue placeholder="Selecciona color" />
                      </SelectTrigger>
                      <SelectContent>
                        {coloresOpciones.map((opcion) => (
                          <SelectItem key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="olor">Olor</Label>
                    <Select
                      value={olor}
                      onValueChange={setOlor}
                    >
                      <SelectTrigger id="olor">
                        <SelectValue placeholder="Selecciona olor" />
                      </SelectTrigger>
                      <SelectContent>
                        {oloresOpciones.map((opcion) => (
                          <SelectItem key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frecuencia">Frecuencia (veces por día)</Label>
                    <Input
                      id="frecuencia"
                      type="number"
                      min="1"
                      placeholder="3"
                      value={frecuencia}
                      onChange={(e) => setFrecuencia(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas adicionales</Label>
                  <Textarea
                    id="notas"
                    placeholder="Observaciones adicionales sobre el evento"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Guardar Registro
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Registros Recientes</CardTitle>
            <CardDescription>
              Últimos eventos de salud registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventos.slice(-5).reverse().map((evento: HealthEvent) => {
                const paciente = pacientes.find(p => p.id === evento.patientId);
                return (
                  <div key={evento.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{paciente?.name || "Paciente desconocido"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(evento.date).toLocaleString("es-ES")}
                        </p>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-xs">
                        {evento.type === "urination" ? "Micción" : "Defecación"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      {evento.color && (
                        <div>
                          <p className="text-xs text-muted-foreground">Color</p>
                          <p className="font-medium">{evento.color}</p>
                        </div>
                      )}
                      {evento.odor && (
                        <div>
                          <p className="text-xs text-muted-foreground">Olor</p>
                          <p className="font-medium">{evento.odor}</p>
                        </div>
                      )}
                      {evento.frequency !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Frecuencia</p>
                          <p className="font-medium">{evento.frequency} veces</p>
                        </div>
                      )}
                    </div>
                    {evento.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Notas</p>
                        <p className="text-sm">{evento.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {eventos.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No hay registros disponibles
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Eventos;
