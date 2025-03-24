
import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPatients, getMedications, getMedicationIntakes } from "@/lib/store";
import { toast } from "sonner";
import { Patient, Medication, MedicationIntake } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Medicacion = () => {
  const [tab, setTab] = useState("toma");
  const [pacienteId, setPacienteId] = useState("");
  const [medicacionId, setMedicacionId] = useState("");
  const [tomado, setTomado] = useState("true");
  const [notas, setNotas] = useState("");
  
  // Campos para registrar nuevo medicamento
  const [nombreMedicamento, setNombreMedicamento] = useState("");
  const [dosis, setDosis] = useState("");
  const [horario, setHorario] = useState("");
  const [activo, setActivo] = useState("true");
  
  const pacienteSelectRef = useRef<HTMLButtonElement>(null);
  
  const pacientes = getPatients();
  const medicamentos = getMedications();
  const tomasMedicacion = getMedicationIntakes();

  // Filtrar medicamentos por paciente seleccionado
  const medicamentosPaciente = medicamentos.filter(
    (med: Medication) => med.patientId === pacienteId
  );

  const handleSubmitToma = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pacienteId) {
      toast.error("Por favor selecciona un paciente");
      return;
    }
    
    if (!medicacionId) {
      toast.error("Por favor selecciona un medicamento");
      return;
    }
    
    // Crear nuevo registro
    const nuevaToma: MedicationIntake = {
      id: Date.now().toString(),
      medicationId: medicacionId,
      patientId: pacienteId,
      date: new Date().toISOString(),
      taken: tomado === "true",
      notes: notas || undefined
    };
    
    // Guardar en localStorage
    const tomasActualizadas = [...tomasMedicacion, nuevaToma];
    localStorage.setItem('medicationIntakes', JSON.stringify(tomasActualizadas));
    
    toast.success("Toma de medicamento registrada correctamente");
    
    // Limpiar el formulario
    setMedicacionId("");
    setTomado("true");
    setNotas("");
    
    // Devolver el foco al selector de paciente
    if (pacienteSelectRef.current) {
      pacienteSelectRef.current.focus();
    }
  };

  const handleSubmitMedicamento = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pacienteId) {
      toast.error("Por favor selecciona un paciente");
      return;
    }
    
    if (!nombreMedicamento) {
      toast.error("Por favor ingresa el nombre del medicamento");
      return;
    }
    
    if (!dosis) {
      toast.error("Por favor ingresa la dosis del medicamento");
      return;
    }
    
    // Crear nuevo medicamento
    const nuevoMedicamento: Medication = {
      id: Date.now().toString(),
      patientId: pacienteId,
      name: nombreMedicamento,
      dosage: dosis,
      schedule: horario || undefined,
      active: activo === "true"
    };
    
    // Guardar en localStorage
    const medicamentosActualizados = [...medicamentos, nuevoMedicamento];
    localStorage.setItem('medications', JSON.stringify(medicamentosActualizados));
    
    toast.success("Medicamento registrado correctamente");
    
    // Limpiar el formulario
    setNombreMedicamento("");
    setDosis("");
    setHorario("");
    setActivo("true");
    
    // Devolver el foco al selector de paciente
    if (pacienteSelectRef.current) {
      pacienteSelectRef.current.focus();
    }
  };
  
  return (
    <Layout>
      <BotonRegresar />
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Medicación</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Medicación</CardTitle>
            <CardDescription>
              Registra medicamentos y su administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="toma" onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="toma">Registrar Toma</TabsTrigger>
                <TabsTrigger value="medicamento">Registrar Medicamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="toma">
                <form onSubmit={handleSubmitToma} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paciente">Paciente</Label>
                    <Select
                      value={pacienteId}
                      onValueChange={(value) => {
                        setPacienteId(value);
                        setMedicacionId(""); // Limpiar medicamento al cambiar paciente
                      }}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicamento">Medicamento</Label>
                    <Select
                      value={medicacionId}
                      onValueChange={setMedicacionId}
                      disabled={!pacienteId || medicamentosPaciente.length === 0}
                    >
                      <SelectTrigger id="medicamento">
                        <SelectValue placeholder={
                          !pacienteId 
                            ? "Primero selecciona un paciente" 
                            : medicamentosPaciente.length === 0 
                              ? "No hay medicamentos para este paciente" 
                              : "Selecciona un medicamento"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {medicamentosPaciente.map((med: Medication) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} - {med.dosage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tomado">¿Medicamento tomado?</Label>
                    <Select
                      value={tomado}
                      onValueChange={setTomado}
                    >
                      <SelectTrigger id="tomado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      placeholder="Observaciones sobre la toma del medicamento"
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Guardar Registro
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="medicamento">
                <form onSubmit={handleSubmitMedicamento} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pacienteMed">Paciente</Label>
                    <Select
                      value={pacienteId}
                      onValueChange={setPacienteId}
                    >
                      <SelectTrigger id="pacienteMed" ref={pacienteSelectRef}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombreMed">Nombre del medicamento</Label>
                    <input
                      id="nombreMed"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Paracetamol"
                      value={nombreMedicamento}
                      onChange={(e) => setNombreMedicamento(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosis">Dosis</Label>
                    <input
                      id="dosis"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="500mg"
                      value={dosis}
                      onChange={(e) => setDosis(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horario/Frecuencia</Label>
                    <input
                      id="horario"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Cada 8 horas"
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activo">Estado</Label>
                    <Select
                      value={activo}
                      onValueChange={setActivo}
                    >
                      <SelectTrigger id="activo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Guardar Medicamento
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Registros Recientes</CardTitle>
            <CardDescription>
              Últimas tomas de medicamentos registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tomasMedicacion.slice(-5).reverse().map((toma: MedicationIntake) => {
                const paciente = pacientes.find(p => p.id === toma.patientId);
                const medicamento = medicamentos.find(m => m.id === toma.medicationId);
                return (
                  <div key={toma.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{paciente?.name || "Paciente desconocido"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(toma.date).toLocaleString("es-ES")}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        toma.taken ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {toma.taken ? "Tomado" : "No tomado"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Medicamento</p>
                      <p className="font-medium">{medicamento?.name || "Desconocido"} - {medicamento?.dosage || ""}</p>
                    </div>
                    {toma.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Notas</p>
                        <p className="text-sm">{toma.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {tomasMedicacion.length === 0 && (
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

export default Medicacion;
