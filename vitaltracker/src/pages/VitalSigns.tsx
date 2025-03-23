
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  getPatients, 
  Patient, 
  createVitalSign,
  createHealthEvent,
  formatDateTime
} from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  Thermometer, Heart, Droplet, Activity, Check, 
  ArrowRight, User, Calendar, Clock 
} from 'lucide-react';

const VitalSigns: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [recordType, setRecordType] = useState<'vitals' | 'event'>('vitals');
  
  // Vital signs form state
  const [temperature, setTemperature] = useState<string>('');
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [oxygenLevel, setOxygenLevel] = useState<string>('');
  const [vitalNotes, setVitalNotes] = useState<string>('');
  
  // Health event form state
  const [eventType, setEventType] = useState<'urination' | 'defecation'>('urination');
  const [color, setColor] = useState<string>('');
  const [smell, setSmell] = useState<string>('');
  const [count, setCount] = useState<string>('');
  const [eventNotes, setEventNotes] = useState<string>('');
  
  // Common form state
  const [timestamp, setTimestamp] = useState<string>('');
  
  useEffect(() => {
    loadPatients();
    
    // Set default timestamp to now
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setTimestamp(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);
  
  const loadPatients = () => {
    const loadedPatients = getPatients();
    setPatients(loadedPatients);
    
    // Set the first patient as selected if available
    if (loadedPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(loadedPatients[0].id);
    }
  };
  
  const resetVitalSignsForm = () => {
    setTemperature('');
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setOxygenLevel('');
    setVitalNotes('');
  };
  
  const resetHealthEventForm = () => {
    setEventType('urination');
    setColor('');
    setSmell('');
    setCount('');
    setEventNotes('');
  };
  
  const handleSubmitVitalSigns = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }
    
    if (!timestamp) {
      toast.error('Please set a date and time');
      return;
    }
    
    // At least one vital sign field must be filled
    if (!temperature && !systolic && !pulse && !oxygenLevel) {
      toast.error('Please enter at least one vital sign measurement');
      return;
    }
    
    try {
      createVitalSign({
        patientId: selectedPatient,
        timestamp: new Date(timestamp).toISOString(),
        recordedBy: user!.id,
        temperature: temperature ? parseFloat(temperature) : undefined,
        bloodPressureSystolic: systolic ? parseInt(systolic) : undefined,
        bloodPressureDiastolic: diastolic ? parseInt(diastolic) : undefined,
        pulse: pulse ? parseInt(pulse) : undefined,
        oxygenLevel: oxygenLevel ? parseInt(oxygenLevel) : undefined,
        notes: vitalNotes
      });
      
      toast.success('Vital signs recorded successfully');
      resetVitalSignsForm();
    } catch (error) {
      console.error('Failed to record vital signs:', error);
      toast.error('Failed to record vital signs');
    }
  };
  
  const handleSubmitHealthEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }
    
    if (!timestamp) {
      toast.error('Please set a date and time');
      return;
    }
    
    try {
      createHealthEvent({
        patientId: selectedPatient,
        timestamp: new Date(timestamp).toISOString(),
        recordedBy: user!.id,
        type: eventType,
        color: color || undefined,
        smell: smell || undefined,
        count: count ? parseInt(count) : undefined,
        notes: eventNotes
      });
      
      toast.success('Health event recorded successfully');
      resetHealthEventForm();
    } catch (error) {
      console.error('Failed to record health event:', error);
      toast.error('Failed to record health event');
    }
  };
  
  const getSelectedPatientName = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    return patient ? patient.name : 'Select a patient';
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-display font-medium text-foreground">Record Health Data</h1>
          <p className="text-muted-foreground mt-1">Track vital signs and health events for your patients</p>
        </header>
        
        {/* Patient selection */}
        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-500" />
            Select Patient
          </h2>
          
          {patients.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">No patients available</p>
              <a href="/patients" className="btn-primary">Add a patient first</a>
            </div>
          ) : (
            <div className="space-y-4">
              <select
                className="input-field w-full"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              
              {selectedPatient && (
                <div className="text-sm text-muted-foreground">
                  <p>Recording data for: <span className="font-semibold text-foreground">{getSelectedPatientName()}</span></p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Record type selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'vitals'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => setRecordType('vitals')}
          >
            <div className="flex items-center">
              <div className={`rounded-full p-2 ${
                recordType === 'vitals' ? 'bg-primary/20' : 'bg-gray-100'
              }`}>
                <Activity className={`h-6 w-6 ${
                  recordType === 'vitals' ? 'text-primary' : 'text-gray-500'
                }`} />
              </div>
              <div className="ml-3 text-left">
                <h3 className={`font-medium ${
                  recordType === 'vitals' ? 'text-primary' : 'text-gray-700'
                }`}>
                  Vital Signs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Temperature, blood pressure, pulse, oxygen
                </p>
              </div>
            </div>
          </button>
          
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'event'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => setRecordType('event')}
          >
            <div className="flex items-center">
              <div className={`rounded-full p-2 ${
                recordType === 'event' ? 'bg-primary/20' : 'bg-gray-100'
              }`}>
                <Droplet className={`h-6 w-6 ${
                  recordType === 'event' ? 'text-primary' : 'text-gray-500'
                }`} />
              </div>
              <div className="ml-3 text-left">
                <h3 className={`font-medium ${
                  recordType === 'event' ? 'text-primary' : 'text-gray-700'
                }`}>
                  Health Event
                </h3>
                <p className="text-sm text-muted-foreground">
                  Urination or defecation events
                </p>
              </div>
            </div>
          </button>
        </div>
        
        {/* Date & Time selector */}
        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Date & Time
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timestamp" className="label">When was this recorded? *</label>
                <input
                  id="timestamp"
                  type="datetime-local"
                  className="input-field w-full"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Vital Signs Form */}
        {recordType === 'vitals' && (
          <div className="glass-panel p-6 animate-fade-in">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Vital Signs
            </h2>
            
            <form onSubmit={handleSubmitVitalSigns} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="label">Temperature</label>
                  <div className="flex items-center space-x-3 bg-white rounded-lg border p-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Thermometer className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="36.5"
                          step="0.1"
                          min="30"
                          max="45"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value)}
                        />
                        <span className="ml-2 text-gray-500">°C</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="label">Blood Pressure</label>
                  <div className="flex items-center space-x-3 bg-white rounded-lg border p-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="120"
                          min="60"
                          max="250"
                          value={systolic}
                          onChange={(e) => setSystolic(e.target.value)}
                        />
                        <span className="mx-2 text-gray-500">/</span>
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="80"
                          min="40"
                          max="150"
                          value={diastolic}
                          onChange={(e) => setDiastolic(e.target.value)}
                        />
                        <span className="ml-2 text-gray-500">mmHg</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="label">Pulse</label>
                  <div className="flex items-center space-x-3 bg-white rounded-lg border p-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Activity className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="75"
                          min="30"
                          max="220"
                          value={pulse}
                          onChange={(e) => setPulse(e.target.value)}
                        />
                        <span className="ml-2 text-gray-500">bpm</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="label">Oxygen Level</label>
                  <div className="flex items-center space-x-3 bg-white rounded-lg border p-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Droplet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="input-field w-full"
                          placeholder="98"
                          min="70"
                          max="100"
                          value={oxygenLevel}
                          onChange={(e) => setOxygenLevel(e.target.value)}
                        />
                        <span className="ml-2 text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="vitalNotes" className="label">Notes</label>
                <textarea
                  id="vitalNotes"
                  className="input-field w-full"
                  placeholder="Enter any additional observations..."
                  rows={3}
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                  disabled={!selectedPatient || !timestamp}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Record Vital Signs
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Health Event Form */}
        {recordType === 'event' && (
          <div className="glass-panel p-6 animate-fade-in">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Droplet className="mr-2 h-5 w-5 text-blue-500" />
              Health Event
            </h2>
            
            <form onSubmit={handleSubmitHealthEvent} className="space-y-6">
              <div className="space-y-4">
                <label className="label">Event Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      eventType === 'urination'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setEventType('urination')}
                  >
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${
                        eventType === 'urination' ? 'bg-primary/20' : 'bg-gray-100'
                      }`}>
                        <Droplet className={`h-5 w-5 ${
                          eventType === 'urination' ? 'text-primary' : 'text-gray-500'
                        }`} />
                      </div>
                      <span className="ml-3 font-medium">Urination</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      eventType === 'defecation'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setEventType('defecation')}
                  >
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${
                        eventType === 'defecation' ? 'bg-primary/20' : 'bg-gray-100'
                      }`}>
                        <Activity className={`h-5 w-5 ${
                          eventType === 'defecation' ? 'text-primary' : 'text-gray-500'
                        }`} />
                      </div>
                      <span className="ml-3 font-medium">Defecation</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="color" className="label">Color</label>
                  <input
                    id="color"
                    type="text"
                    className="input-field w-full"
                    placeholder={eventType === 'urination' ? "Yellow, Clear..." : "Brown, Black..."}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="smell" className="label">Smell</label>
                  <input
                    id="smell"
                    type="text"
                    className="input-field w-full"
                    placeholder="Normal, Strong..."
                    value={smell}
                    onChange={(e) => setSmell(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="count" className="label">Count</label>
                  <input
                    id="count"
                    type="number"
                    className="input-field w-full"
                    placeholder="Number of times"
                    min="1"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="eventNotes" className="label">Notes</label>
                <textarea
                  id="eventNotes"
                  className="input-field w-full"
                  placeholder="Enter any additional observations..."
                  rows={3}
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                  disabled={!selectedPatient || !timestamp}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Record Health Event
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VitalSigns;
