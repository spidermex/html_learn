
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  getPatients, 
  getVitalSignsByPatient, 
  getHealthEventsByPatient,
  Patient,
  VitalSign,
  HealthEvent,
  formatDateTime
} from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Circle, 
  Filter, 
  Thermometer, 
  Heart, 
  Activity, 
  Droplet,
  Search 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>([]);
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCharts, setShowCharts] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(true);
  
  // Filters
  const [vitalSignFilter, setVitalSignFilter] = useState<boolean>(true);
  const [urinationFilter, setUrinationFilter] = useState<boolean>(true);
  const [defecationFilter, setDefecationFilter] = useState<boolean>(true);
  
  useEffect(() => {
    loadPatients();
  }, []);
  
  useEffect(() => {
    if (selectedPatient) {
      loadPatientData(selectedPatient);
    }
  }, [selectedPatient, dateRange, customStartDate, customEndDate]);
  
  const loadPatients = () => {
    const loadedPatients = getPatients();
    setPatients(loadedPatients);
    
    // Set the first patient as selected if available
    if (loadedPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(loadedPatients[0].id);
    }
  };
  
  const loadPatientData = (patientId: string) => {
    // Get raw data
    const vitalSignsData = getVitalSignsByPatient(patientId);
    const healthEventsData = getHealthEventsByPatient(patientId);
    
    // Apply date filters
    const filteredVitalSigns = filterByDateRange(vitalSignsData);
    const filteredHealthEvents = filterByDateRange(healthEventsData);
    
    setVitalSigns(filteredVitalSigns);
    setHealthEvents(filteredHealthEvents);
  };
  
  const filterByDateRange = <T extends { timestamp: string }>(data: T[]): T[] => {
    if (dateRange === 'all') {
      return data;
    }
    
    const now = new Date();
    let startDate: Date;
    
    if (dateRange === '7days') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === '30days') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else if (dateRange === 'custom' && customStartDate) {
      startDate = new Date(customStartDate);
      let endDate = customEndDate ? new Date(customEndDate) : now;
      
      // Set end date to end of day
      if (customEndDate) {
        endDate.setHours(23, 59, 59, 999);
      }
      
      return data.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= startDate && itemDate <= endDate;
      });
    } else {
      return data; // Fallback to all data
    }
    
    return data.filter(item => new Date(item.timestamp) >= startDate);
  };
  
  const getSelectedPatientName = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    return patient ? patient.name : 'Select a patient';
  };
  
  const prepareChartData = () => {
    // Combine and sort all data
    const allData: Array<VitalSign | HealthEvent | any> = [];
    
    // Add vital signs if filter is active
    if (vitalSignFilter) {
      vitalSigns.forEach(vs => {
        allData.push({
          ...vs,
          dataType: 'vitalSign',
          date: new Date(vs.timestamp).toLocaleDateString(),
          time: new Date(vs.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });
    }
    
    // Add urination events if filter is active
    if (urinationFilter) {
      healthEvents
        .filter(he => he.type === 'urination')
        .forEach(he => {
          allData.push({
            ...he,
            dataType: 'urination',
            date: new Date(he.timestamp).toLocaleDateString(),
            time: new Date(he.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        });
    }
    
    // Add defecation events if filter is active
    if (defecationFilter) {
      healthEvents
        .filter(he => he.type === 'defecation')
        .forEach(he => {
          allData.push({
            ...he,
            dataType: 'defecation',
            date: new Date(he.timestamp).toLocaleDateString(),
            time: new Date(he.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        });
    }
    
    // Sort by timestamp
    return allData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };
  
  const getTableData = () => {
    const chartData = prepareChartData();
    
    // Paginate and return table data
    return chartData;
  };
  
  const getVitalSignsChartData = () => {
    // Ensure we have vital signs data with timestamps
    if (!vitalSigns.length) return [];
    
    // Sort by timestamp
    const sorted = [...vitalSigns].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Format for chart
    return sorted.map(vs => ({
      date: formatDateTime(vs.timestamp),
      temperature: vs.temperature,
      systolic: vs.bloodPressureSystolic,
      diastolic: vs.bloodPressureDiastolic,
      pulse: vs.pulse,
      oxygenLevel: vs.oxygenLevel
    }));
  };
  
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'vitalSign':
        return <Thermometer className="w-5 h-5 text-yellow-500" />;
      case 'urination':
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'defecation':
        return <Activity className="w-5 h-5 text-amber-700" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getEventDetails = (item: any) => {
    if (item.dataType === 'vitalSign') {
      return (
        <div className="space-y-1">
          {item.temperature && (
            <div className="flex items-center">
              <Thermometer className="w-4 h-4 mr-1 text-yellow-500" />
              <span>Temp: {item.temperature}°C</span>
            </div>
          )}
          {item.bloodPressureSystolic && (
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span>BP: {item.bloodPressureSystolic}/{item.bloodPressureDiastolic} mmHg</span>
            </div>
          )}
          {item.pulse && (
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1 text-purple-500" />
              <span>Pulse: {item.pulse} bpm</span>
            </div>
          )}
          {item.oxygenLevel && (
            <div className="flex items-center">
              <Droplet className="w-4 h-4 mr-1 text-blue-500" />
              <span>O₂: {item.oxygenLevel}%</span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-1">
          <div className="capitalize">
            <span className="font-medium">{item.type}</span>
          </div>
          {item.color && (
            <div>
              <span className="text-gray-600">Color:</span> {item.color}
            </div>
          )}
          {item.smell && (
            <div>
              <span className="text-gray-600">Smell:</span> {item.smell}
            </div>
          )}
          {item.count && (
            <div>
              <span className="text-gray-600">Count:</span> {item.count}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-display font-medium text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze patient data and view trends over time</p>
        </header>
        
        {/* Filters and options */}
        <div className="glass-panel p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="patient-select" className="label">Patient</label>
              <select
                id="patient-select"
                className="input-field w-full"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="date-range" className="label">Date Range</label>
              <select
                id="date-range"
                className="input-field w-full"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-3">
              <button 
                className={`px-3 py-2 rounded border transition-colors ${vitalSignFilter ? 'bg-secondary border-gray-300' : 'bg-white border-gray-200'}`}
                onClick={() => setVitalSignFilter(!vitalSignFilter)}
              >
                <div className="flex items-center">
                  <Thermometer className={`w-4 h-4 mr-1 ${vitalSignFilter ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className={vitalSignFilter ? 'text-foreground' : 'text-gray-400'}>Vital Signs</span>
                </div>
              </button>
              
              <button 
                className={`px-3 py-2 rounded border transition-colors ${urinationFilter ? 'bg-secondary border-gray-300' : 'bg-white border-gray-200'}`}
                onClick={() => setUrinationFilter(!urinationFilter)}
              >
                <div className="flex items-center">
                  <Droplet className={`w-4 h-4 mr-1 ${urinationFilter ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={urinationFilter ? 'text-foreground' : 'text-gray-400'}>Urination</span>
                </div>
              </button>
              
              <button 
                className={`px-3 py-2 rounded border transition-colors ${defecationFilter ? 'bg-secondary border-gray-300' : 'bg-white border-gray-200'}`}
                onClick={() => setDefecationFilter(!defecationFilter)}
              >
                <div className="flex items-center">
                  <Activity className={`w-4 h-4 mr-1 ${defecationFilter ? 'text-amber-700' : 'text-gray-400'}`} />
                  <span className={defecationFilter ? 'text-foreground' : 'text-gray-400'}>Defecation</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Custom date range fields */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="start-date" className="label">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  className="input-field w-full"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="label">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  className="input-field w-full"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        {!selectedPatient ? (
          <div className="glass-panel p-10 text-center">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h2 className="text-xl font-medium mb-2">Select a Patient</h2>
            <p className="text-muted-foreground">
              Choose a patient to view their health data reports
            </p>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="glass-panel p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">
                  Vital Signs Chart
                </h2>
                <button
                  className="text-primary flex items-center"
                  onClick={() => setShowCharts(!showCharts)}
                >
                  {showCharts ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      <span>Hide Charts</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      <span>Show Charts</span>
                    </>
                  )}
                </button>
              </div>
              
              {showCharts && (
                <div className="animate-fade-in">
                  {vitalSigns.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No vital signs data available for this period</p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Temperature (°C)</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={getVitalSignsChartData()}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="temperature" 
                                stroke="#f59e0b" 
                                activeDot={{ r: 8 }} 
                                name="Temperature"
                                connectNulls 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Blood Pressure (mmHg)</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={getVitalSignsChartData()}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="systolic" 
                                stroke="#ef4444" 
                                activeDot={{ r: 8 }} 
                                name="Systolic" 
                                connectNulls
                              />
                              <Line 
                                type="monotone" 
                                dataKey="diastolic" 
                                stroke="#10b981" 
                                name="Diastolic" 
                                connectNulls
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Pulse (bpm)</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={getVitalSignsChartData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="pulse" 
                                  stroke="#8b5cf6" 
                                  activeDot={{ r: 8 }} 
                                  name="Pulse" 
                                  connectNulls
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Oxygen Level (%)</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={getVitalSignsChartData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="oxygenLevel" 
                                  stroke="#3b82f6" 
                                  activeDot={{ r: 8 }} 
                                  name="Oxygen" 
                                  connectNulls
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Data Table */}
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">
                  Health Records Timeline
                </h2>
                
                <button
                  className="text-primary flex items-center"
                  onClick={() => setShowTable(!showTable)}
                >
                  {showTable ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      <span>Hide Timeline</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      <span>Show Timeline</span>
                    </>
                  )}
                </button>
              </div>
              
              {showTable && (
                <div className="animate-fade-in">
                  {getTableData().length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No data available for this period</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Date & Time</th>
                              <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Type</th>
                              <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Details</th>
                              <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Notes</th>
                            </tr>
                          </thead>
                          
                          <tbody>
                            {getTableData().map((item, index) => (
                              <tr key={index} className="border-b hover:bg-secondary/40 transition-colors">
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-medium">{item.date}</div>
                                    <div className="text-sm text-muted-foreground">{item.time}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    {getEventTypeIcon(item.dataType)}
                                    <span className="ml-2 capitalize">
                                      {item.dataType === 'vitalSign' ? 'Vital Signs' : item.type}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {getEventDetails(item)}
                                </td>
                                <td className="py-3 px-4">
                                  {item.notes || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
