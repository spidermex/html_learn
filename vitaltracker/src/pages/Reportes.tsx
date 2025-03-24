import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BotonRegresar } from "@/components/Navegacion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPatients, getVitalSigns, getHealthEvents, getMedicationIntakes, getMedications } from "@/lib/store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reportes = () => {
  const [pacienteId, setPacienteId] = useState("");
  const [tipoReporte, setTipoReporte] = useState("signosVitales");
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(subDays(new Date(), 7));
  const [fechaFin, setFechaFin] = useState<Date | undefined>(new Date());
  const [rangoTiempo, setRangoTiempo] = useState("7dias");
  const [fechaInicioStr, setFechaInicioStr] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [fechaFinStr, setFechaFinStr] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const pacientes = getPatients();
  const signosVitales = getVitalSigns();
  const eventos = getHealthEvents();
  const tomasMedicacion = getMedicationIntakes();
  const medicamentos = getMedications();

  useEffect(() => {
    let inicio, fin;
    const hoy = new Date();
    
    switch (rangoTiempo) {
      case "7dias":
        inicio = subDays(hoy, 7);
        fin = hoy;
        break;
      case "30dias":
        inicio = subDays(hoy, 30);
        fin = hoy;
        break;
      case "3meses":
        inicio = subMonths(hoy, 3);
        fin = hoy;
        break;
      case "personalizado":
        return;
      default:
        inicio = subDays(hoy, 7);
        fin = hoy;
    }
    
    setFechaInicio(inicio);
    setFechaFin(fin);
    setFechaInicioStr(format(inicio, "yyyy-MM-dd"));
    setFechaFinStr(format(fin, "yyyy-MM-dd"));
  }, [rangoTiempo]);

  useEffect(() => {
    try {
      const fecha = new Date(fechaInicioStr);
      if (!isNaN(fecha.getTime())) {
        setFechaInicio(fecha);
      }
    } catch (e) {
      // Ignorar fechas inválidas
    }
  }, [fechaInicioStr]);

  useEffect(() => {
    try {
      const fecha = new Date(fechaFinStr);
      if (!isNaN(fecha.getTime())) {
        setFechaFin(fecha);
      }
    } catch (e) {
      // Ignorar fechas inválidas
    }
  }, [fechaFinStr]);
  
  const filtrarDatos = () => {
    if (!pacienteId) return [];
    
    const filtroFechaInicio = fechaInicio ? new Date(fechaInicio) : new Date(0);
    filtroFechaInicio.setHours(0, 0, 0, 0);
    
    const filtroFechaFin = fechaFin ? new Date(fechaFin) : new Date();
    filtroFechaFin.setHours(23, 59, 59, 999);
    
    let datosFiltrados = [];
    
    switch (tipoReporte) {
      case "signosVitales":
        datosFiltrados = signosVitales.filter(sv => 
          sv.patientId === pacienteId &&
          new Date(sv.date) >= filtroFechaInicio &&
          new Date(sv.date) <= filtroFechaFin
        );
        break;
      case "eventos":
        datosFiltrados = eventos.filter(ev => 
          ev.patientId === pacienteId &&
          new Date(ev.date) >= filtroFechaInicio &&
          new Date(ev.date) <= filtroFechaFin
        );
        break;
      case "medicacion":
        datosFiltrados = tomasMedicacion.filter(tm => 
          tm.patientId === pacienteId &&
          new Date(tm.date) >= filtroFechaInicio &&
          new Date(tm.date) <= filtroFechaFin
        );
        break;
      default:
        break;
    }
    
    return datosFiltrados;
  };
  
  const prepararDatosGrafico = () => {
    if (tipoReporte === "signosVitales") {
      const datos = datosFiltrados.map((dato: any) => {
        const fecha = new Date(dato.date);
        return {
          fecha: format(fecha, "dd/MM/yy HH:mm"),
          timestamp: fecha.getTime(),
          temperatura: dato.temperature,
          pulso: dato.pulse,
          oxigeno: dato.oxygenLevel,
          sistolica: dato.systolic,
          diastolica: dato.diastolic
        };
      });
      
      return datos.sort((a, b) => a.timestamp - b.timestamp);
    } else if (tipoReporte === "eventos") {
      const eventosAgrupados = datosFiltrados.reduce((acc: any, evento: any) => {
        const fecha = new Date(evento.date);
        const fechaStr = format(fecha, "dd/MM/yy");
        
        if (!acc[fechaStr]) {
          acc[fechaStr] = {
            fecha: fechaStr,
            timestamp: fecha.getTime(),
            miccion: 0,
            defecacion: 0
          };
        }
        
        if (evento.type === "urination") {
          acc[fechaStr].miccion += 1;
        } else {
          acc[fechaStr].defecacion += 1;
        }
        
        return acc;
      }, {});
      
      return Object.values(eventosAgrupados).sort((a: any, b: any) => a.timestamp - b.timestamp);
    } else if (tipoReporte === "medicacion") {
      const medicacionAgrupada = datosFiltrados.reduce((acc: any, toma: any) => {
        const fecha = new Date(toma.date);
        const fechaStr = format(fecha, "dd/MM/yy");
        
        if (!acc[fechaStr]) {
          acc[fechaStr] = {
            fecha: fechaStr,
            timestamp: fecha.getTime(),
            tomado: 0,
            noTomado: 0
          };
        }
        
        if (toma.taken) {
          acc[fechaStr].tomado += 1;
        } else {
          acc[fechaStr].noTomado += 1;
        }
        
        return acc;
      }, {});
      
      return Object.values(medicacionAgrupada).sort((a: any, b: any) => a.timestamp - b.timestamp);
    }
    
    return [];
  };
  
  const datosFiltrados = filtrarDatos();
  
  const datosGrafico = prepararDatosGrafico();
  
  const renderizarGrafico = () => {
    if (!pacienteId) {
      return (
        <div className="flex flex-col items-center justify-center h-80 bg-muted/20 rounded-lg border">
          <p className="text-muted-foreground mb-4">Selecciona un paciente para ver los datos</p>
          <FilterIcon className="w-12 h-12 text-muted-foreground/50" />
        </div>
      );
    }
    
    if (tipoReporte === "signosVitales" && datosGrafico.length > 0) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={datosGrafico}
            margin={{ top: 20, right: 30, left: 5, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="temperatura" 
              stroke="#FF9800" 
              name="Temperatura (°C)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="pulso" 
              stroke="#9C27B0" 
              name="Pulso (ppm)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="oxigeno" 
              stroke="#2196F3" 
              name="Oxígeno (%)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="sistolica" 
              stroke="#F44336" 
              name="Sistólica (mmHg)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolica" 
              stroke="#E91E63" 
              name="Diastólica (mmHg)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (tipoReporte === "eventos" && datosGrafico.length > 0) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={datosGrafico}
            margin={{ top: 20, right: 30, left: 5, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="miccion" 
              stroke="#2196F3" 
              name="Micciones" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="defecacion" 
              stroke="#795548" 
              name="Defecaciones" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (tipoReporte === "medicacion" && datosGrafico.length > 0) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={datosGrafico}
            margin={{ top: 20, right: 30, left: 5, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="tomado" 
              stroke="#4CAF50" 
              name="Medicamentos Tomados" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="noTomado" 
              stroke="#F44336" 
              name="Medicamentos No Tomados" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-80 bg-muted/20 rounded-lg border">
          <p className="text-muted-foreground mb-4">No hay datos disponibles para el período seleccionado</p>
          <FilterIcon className="w-12 h-12 text-muted-foreground/50" />
        </div>
      );
    }
  };
  
  const renderizarTabla = () => {
    if (!pacienteId) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Selecciona un paciente para ver los datos
        </div>
      );
    }
    
    if (datosFiltrados.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No hay datos disponibles con los filtros seleccionados
        </div>
      );
    }
    
    if (tipoReporte === "signosVitales") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Fecha</th>
                <th className="border p-2 text-left">Temperatura</th>
                <th className="border p-2 text-left">Presión</th>
                <th className="border p-2 text-left">Pulso</th>
                <th className="border p-2 text-left">Oxígeno</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((dato: any) => {
                return (
                  <tr key={dato.id} className="border-b hover:bg-muted/50">
                    <td className="border p-2">{format(new Date(dato.date), "dd/MM/yyyy HH:mm", { locale: es })}</td>
                    <td className="border p-2">{dato.temperature !== undefined ? `${dato.temperature}°C` : "-"}</td>
                    <td className="border p-2">
                      {dato.systolic && dato.diastolic 
                        ? `${dato.systolic}/${dato.diastolic} mmHg` 
                        : dato.bloodPressure || "-"}
                    </td>
                    <td className="border p-2">{dato.pulse !== undefined ? `${dato.pulse} ppm` : "-"}</td>
                    <td className="border p-2">{dato.oxygenLevel !== undefined ? `${dato.oxygenLevel}%` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (tipoReporte === "eventos") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Fecha</th>
                <th className="border p-2 text-left">Tipo</th>
                <th className="border p-2 text-left">Color</th>
                <th className="border p-2 text-left">Olor</th>
                <th className="border p-2 text-left">Frecuencia</th>
                <th className="border p-2 text-left">Notas</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((dato: any) => {
                return (
                  <tr key={dato.id} className="border-b hover:bg-muted/50">
                    <td className="border p-2">{format(new Date(dato.date), "dd/MM/yyyy HH:mm", { locale: es })}</td>
                    <td className="border p-2">{dato.type === "urination" ? "Micción" : "Defecación"}</td>
                    <td className="border p-2">{dato.color || "-"}</td>
                    <td className="border p-2">{dato.odor || "-"}</td>
                    <td className="border p-2">{dato.frequency !== undefined ? dato.frequency : "-"}</td>
                    <td className="border p-2">{dato.notes || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (tipoReporte === "medicacion") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Fecha</th>
                <th className="border p-2 text-left">Medicamento</th>
                <th className="border p-2 text-left">Estado</th>
                <th className="border p-2 text-left">Notas</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((dato: any) => {
                const medicacion = medicamentos.find(m => m.id === dato.medicationId);
                return (
                  <tr key={dato.id} className="border-b hover:bg-muted/50">
                    <td className="border p-2">{format(new Date(dato.date), "dd/MM/yyyy HH:mm", { locale: es })}</td>
                    <td className="border p-2">
                      {medicacion ? `${medicacion.name} - ${medicacion.dosage}` : "-"}
                    </td>
                    <td className="border p-2">
                      <span className={dato.taken ? "text-green-600" : "text-red-600"}>
                        {dato.taken ? "Tomado" : "No tomado"}
                      </span>
                    </td>
                    <td className="border p-2">{dato.notes || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  };
  
  return (
    <Layout>
      <BotonRegresar />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Reportes y Análisis</h1>
            <p className="text-muted-foreground">Visualiza y analiza datos de los pacientes</p>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Download size={16} />
            <span>Exportar datos</span>
          </Button>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-3 border-b">
            <CardTitle>Filtros de Reporte</CardTitle>
            <CardDescription>
              Selecciona los criterios para generar el reporte
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoReporte">Tipo de Reporte</Label>
                <Select
                  value={tipoReporte}
                  onValueChange={setTipoReporte}
                >
                  <SelectTrigger id="tipoReporte" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signosVitales">Signos Vitales</SelectItem>
                    <SelectItem value="eventos">Eventos de Salud</SelectItem>
                    <SelectItem value="medicacion">Medicación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente</Label>
                <Select
                  value={pacienteId}
                  onValueChange={setPacienteId}
                >
                  <SelectTrigger id="paciente" className="bg-white">
                    <SelectValue placeholder="Selecciona un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente: any) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rangoTiempo">Período de Tiempo</Label>
                <Select
                  value={rangoTiempo}
                  onValueChange={setRangoTiempo}
                >
                  <SelectTrigger id="rangoTiempo" className="bg-white">
                    <SelectValue placeholder="Seleccione periodo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7dias">Últimos 7 días</SelectItem>
                    <SelectItem value="30dias">Últimos 30 días</SelectItem>
                    <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Desde</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicioStr}
                    onChange={(e) => setFechaInicioStr(e.target.value)}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Hasta</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={fechaFinStr}
                    onChange={(e) => setFechaFinStr(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <Tabs defaultValue="grafico" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="grafico">Gráfico</TabsTrigger>
                <TabsTrigger value="tabla">Tabla</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grafico">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">
                    {tipoReporte === "signosVitales" 
                      ? "Gráfico de Signos Vitales" 
                      : tipoReporte === "eventos" 
                        ? "Gráfico de Eventos de Salud" 
                        : "Gráfico de Medicación"}
                  </CardTitle>
                  <CardDescription>
                    {pacienteId 
                      ? `Datos de ${pacientes.find(p => p.id === pacienteId)?.name || ""}` 
                      : "Selecciona un paciente para visualizar datos"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderizarGrafico()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tabla">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">
                    {tipoReporte === "signosVitales" 
                      ? "Tabla de Signos Vitales" 
                      : tipoReporte === "eventos" 
                        ? "Tabla de Eventos de Salud" 
                        : "Tabla de Medicación"}
                  </CardTitle>
                  <CardDescription>
                    {pacienteId 
                      ? `Registros de ${pacientes.find(p => p.id === pacienteId)?.name || ""}` 
                      : "Selecciona un paciente para visualizar registros"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderizarTabla()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Reportes;
