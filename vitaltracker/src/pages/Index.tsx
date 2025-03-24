
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPatients, getVitalSigns, getHealthEvents, getMedicationIntakes, getMedications } from "@/lib/store";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Users, 
  Thermometer, 
  Activity, 
  PillIcon, 
  BarChart4, 
  Heart, 
  Droplet, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('usuarioActivo');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);
  
  const pacientes = getPatients();
  const signosVitales = getVitalSigns();
  const eventos = getHealthEvents();
  const tomasMedicacion = getMedicationIntakes();
  const medicamentos = getMedications();
  
  // Función para obtener el nombre del medicamento
  const getNombreMedicamento = (medicacionId: string) => {
    const medicamento = medicamentos.find(m => m.id === medicacionId);
    return medicamento ? medicamento.name : "Desconocido";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Bienvenido, {userData?.username || "Usuario"}
          </h1>
          <p className="text-muted-foreground">
            Aquí se muestra un resumen de la actividad y los datos registrados
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Pacientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pacientes.length}</p>
              <p className="text-sm text-muted-foreground">Total de pacientes registrados</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link to={userData?.role === "admin" ? "/pacientes" : "#"} className={userData?.role !== "admin" ? "pointer-events-none opacity-50" : ""}>
                  <span>Ver pacientes</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <span>Signos Vitales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{signosVitales.length}</p>
              <p className="text-sm text-muted-foreground">Registros de signos vitales</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link to="/signos-vitales">
                  <span>Registrar</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-500" />
                <span>Eventos de Salud</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{eventos.length}</p>
              <p className="text-sm text-muted-foreground">Eventos registrados</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link to="/eventos">
                  <span>Registrar</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PillIcon className="h-5 w-5 text-green-500" />
                <span>Medicación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{tomasMedicacion.length}</p>
              <p className="text-sm text-muted-foreground">Tomas de medicación registradas</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link to="/medicacion">
                  <span>Registrar</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Actividad Reciente</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/reportes">Ver todo</Link>
                </Button>
              </div>
              <CardDescription>
                Últimos registros de todos los pacientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {[...signosVitales, ...eventos, ...tomasMedicacion]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((actividad: any) => {
                    const paciente = pacientes.find(p => p.id === actividad.patientId);
                    const fecha = new Date(actividad.date);
                    
                    // Determinar tipo de actividad
                    let tipo = "";
                    let contenido = null;
                    
                    if (actividad.temperature !== undefined || actividad.pulse !== undefined) {
                      tipo = "signosVitales";
                      contenido = (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 mt-3 text-sm">
                          {actividad.temperature !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Thermometer size={14} className="text-orange-500" />
                              <span>{actividad.temperature}°C</span>
                            </div>
                          )}
                          
                          {(actividad.systolic !== undefined && actividad.diastolic !== undefined) && (
                            <div className="flex items-center gap-1.5">
                              <Heart size={14} className="text-red-500" />
                              <span>{actividad.systolic}/{actividad.diastolic} mmHg</span>
                            </div>
                          )}
                          
                          {actividad.pulse !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Activity size={14} className="text-purple-500" />
                              <span>{actividad.pulse} ppm</span>
                            </div>
                          )}
                          
                          {actividad.oxygenLevel !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Droplet size={14} className="text-blue-500" />
                              <span>{actividad.oxygenLevel}% SpO₂</span>
                            </div>
                          )}
                        </div>
                      );
                    } else if (actividad.type !== undefined) {
                      tipo = "eventos";
                      contenido = (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 mt-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span>Tipo:</span>
                            <span className="font-medium">{actividad.type === "urination" ? "Micción" : "Defecación"}</span>
                          </div>
                          {actividad.color && (
                            <div className="flex items-center gap-1.5">
                              <span>Color:</span>
                              <span className="font-medium">{actividad.color}</span>
                            </div>
                          )}
                          {actividad.odor && (
                            <div className="flex items-center gap-1.5">
                              <span>Olor:</span>
                              <span className="font-medium">{actividad.odor}</span>
                            </div>
                          )}
                        </div>
                      );
                    } else if (actividad.medicationId !== undefined) {
                      tipo = "medicacion";
                      contenido = (
                        <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span>Medicamento:</span>
                            <span className="font-medium">{getNombreMedicamento(actividad.medicationId)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>Estado:</span>
                            <span className={`font-medium ${actividad.taken ? "text-green-600" : "text-red-600"}`}>
                              {actividad.taken ? "Tomado" : "No tomado"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={actividad.id} className="p-4 border rounded-md bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-primary">{paciente?.name || "Paciente desconocido"}</h3>
                            <p className="text-xs text-muted-foreground">
                              {format(fecha, "d MMM yyyy, HH:mm", { locale: es })}
                            </p>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            tipo === "signosVitales" 
                              ? "bg-primary/10 text-primary" 
                              : tipo === "eventos" 
                                ? "bg-violet-100 text-violet-700" 
                                : "bg-green-100 text-green-700"
                          }`}>
                            {tipo === "signosVitales" 
                              ? "Signos Vitales" 
                              : tipo === "eventos" 
                                ? "Evento de Salud" 
                                : "Medicación"
                            }
                          </div>
                        </div>
                        
                        {contenido}
                      </div>
                    );
                  })}
                
                {[...signosVitales, ...eventos, ...tomasMedicacion].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay actividad registrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                  <Button className="justify-start" asChild>
                    <Link to="/signos-vitales">
                      <Thermometer className="mr-2 h-4 w-4" />
                      Registrar Signos Vitales
                    </Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link to="/eventos">
                      <Activity className="mr-2 h-4 w-4" />
                      Registrar Evento de Salud
                    </Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link to="/medicacion">
                      <PillIcon className="mr-2 h-4 w-4" />
                      Registrar Medicación
                    </Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link to="/reportes">
                      <BarChart4 className="mr-2 h-4 w-4" />
                      Ver Reportes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Tu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Usuario</p>
                    <p className="font-medium">{userData?.username || "Usuario"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="font-medium">{userData?.role === "admin" ? "Administrador" : "Usuario"}</p>
                  </div>
                  
                  {userData?.role === "admin" && (
                    <Button className="w-full justify-start mt-4" variant="outline" asChild>
                      <Link to="/usuarios">
                        <Users className="mr-2 h-4 w-4" />
                        Administrar Usuarios
                      </Link>
                    </Button>
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

export default Index;
