
import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPatients, getVitalSigns, getMedications } from "@/lib/store";
import { toast } from "sonner";
import { Patient, VitalSign } from "@/lib/store";
import { Thermometer, Heart, Activity, Droplet } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SignosVitales = () => {
  const [pacienteId, setPacienteId] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");
  const [pulso, setPulso] = useState("");
  const [oxigeno, setOxigeno] = useState("");
  
  const pacienteSelectRef = useRef<HTMLButtonElement>(null);
  
  const pacientes = getPatients();
  const signosVitales = getVitalSigns();
  const medicamentos = getMedications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pacienteId) {
      toast.error("Por favor selecciona un paciente");
      return;
    }
    
    // Validar los campos numéricos
    const tempVal = parseFloat(temperatura);
    const pulsoVal = parseInt(pulso);
    const oxigenoVal = parseInt(oxigeno);
    const sistolicaVal = parseInt(sistolica);
    const diastolicaVal = parseInt(diastolica);
    
    if (temperatura && (isNaN(tempVal) || tempVal < 35 || tempVal > 42)) {
      toast.error("La temperatura debe estar entre 35°C y 42°C");
      return;
    }
    
    if (pulso && (isNaN(pulsoVal) || pulsoVal < 40 || pulsoVal > 200)) {
      toast.error("El pulso debe estar entre 40 y 200 ppm");
      return;
    }
    
    if (oxigeno && (isNaN(oxigenoVal) || oxigenoVal < 50 || oxigenoVal > 100)) {
      toast.error("El nivel de oxígeno debe estar entre 50% y 100%");
      return;
    }
    
    if (sistolica && (isNaN(sistolicaVal) || sistolicaVal < 70 || sistolicaVal > 200)) {
      toast.error("La presión sistólica debe estar entre 70 y 200 mmHg");
      return;
    }
    
    if (diastolica && (isNaN(diastolicaVal) || diastolicaVal < 40 || diastolicaVal > 120)) {
      toast.error("La presión diastólica debe estar entre 40 y 120 mmHg");
      return;
    }
    
    // Crear el valor de presión arterial para mostrar
    let bloodPressure = "";
    if (sistolica && diastolica) {
      bloodPressure = `${sistolica}/${diastolica}`;
    }
    
    // Crear nuevo registro
    const nuevoSignoVital: VitalSign = {
      id: Date.now().toString(),
      patientId: pacienteId,
      date: new Date().toISOString(),
      temperature: tempVal || undefined,
      bloodPressure: bloodPressure || undefined,
      systolic: sistolicaVal || undefined,
      diastolic: diastolicaVal || undefined,
      pulse: pulsoVal || undefined,
      oxygenLevel: oxigenoVal || undefined
    };
    
    // Guardar en localStorage
    const signosActualizados = [...signosVitales, nuevoSignoVital];
    localStorage.setItem('vitalSigns', JSON.stringify(signosActualizados));
    
    toast.success("Signos vitales registrados correctamente");
    
    // Limpiar el formulario
    setTemperatura("");
    setSistolica("");
    setDiastolica("");
    setPulso("");
    setOxigeno("");
    
    // Devolver el foco al selector de paciente
    if (pacienteSelectRef.current) {
      pacienteSelectRef.current.focus();
    }
  };
  
  return (
    <Layout>
      <BotonRegresar />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Registro de Signos Vitales</h1>
            <p className="text-muted-foreground">Registra los signos vitales de los pacientes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl">Nuevo Registro</CardTitle>
              <CardDescription>
                Ingresa los datos del paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <Label htmlFor="paciente" className="text-base font-medium mb-2 block">Selecciona un paciente</Label>
                  <Select
                    value={pacienteId}
                    onValueChange={setPacienteId}
                  >
                    <SelectTrigger id="paciente" ref={pacienteSelectRef} className="bg-white">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="text-orange-500" size={20} />
                      <h3 className="font-medium">Temperatura</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="temperatura">Temperatura (°C)</Label>
                      <div className="flex items-center">
                        <Input
                          id="temperatura"
                          type="number"
                          step="0.1"
                          placeholder="36.5"
                          value={temperatura}
                          onChange={(e) => setTemperatura(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2">
                      <Heart className="text-red-500" size={20} />
                      <h3 className="font-medium">Presión Arterial</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="sistolica">Sistólica (mmHg)</Label>
                        <Input
                          id="sistolica"
                          type="number"
                          placeholder="120"
                          value={sistolica}
                          onChange={(e) => setSistolica(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diastolica">Diastólica (mmHg)</Label>
                        <Input
                          id="diastolica"
                          type="number"
                          placeholder="80"
                          value={diastolica}
                          onChange={(e) => setDiastolica(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="text-purple-500" size={20} />
                      <h3 className="font-medium">Pulso</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pulso">Frecuencia cardíaca (ppm)</Label>
                      <Input
                        id="pulso"
                        type="number"
                        placeholder="80"
                        value={pulso}
                        onChange={(e) => setPulso(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2">
                      <Droplet className="text-blue-500" size={20} />
                      <h3 className="font-medium">Saturación de Oxígeno</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="oxigeno">Nivel de Oxígeno (%)</Label>
                      <Input
                        id="oxigeno"
                        type="number"
                        placeholder="98"
                        value={oxigeno}
                        onChange={(e) => setOxigeno(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  Guardar Registro
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                <Button variant="link" size="sm" asChild className="h-auto p-0">
                  <a href="/reportes">Ver todo</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {signosVitales.slice(-5).reverse().map((signo: VitalSign) => {
                  const paciente = pacientes.find(p => p.id === signo.patientId);
                  const fecha = new Date(signo.date);
                  
                  return (
                    <div key={signo.id} className="p-3 border rounded-md bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-primary">{paciente?.name || "Paciente desconocido"}</h3>
                          <p className="text-xs text-muted-foreground">
                            {format(fecha, "d MMM yyyy, HH:mm", { locale: es })}
                          </p>
                        </div>
                        <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          Signos Vitales
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
                        {signo.temperature !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Thermometer size={14} className="text-orange-500" />
                            <span>{signo.temperature}°C</span>
                          </div>
                        )}
                        
                        {(signo.systolic !== undefined && signo.diastolic !== undefined) && (
                          <div className="flex items-center gap-1.5">
                            <Heart size={14} className="text-red-500" />
                            <span>{signo.systolic}/{signo.diastolic} mmHg</span>
                          </div>
                        )}
                        
                        {signo.pulse !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Activity size={14} className="text-purple-500" />
                            <span>{signo.pulse} ppm</span>
                          </div>
                        )}
                        
                        {signo.oxygenLevel !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Droplet size={14} className="text-blue-500" />
                            <span>{signo.oxygenLevel}% SpO₂</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {signosVitales.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay registros disponibles
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SignosVitales;
