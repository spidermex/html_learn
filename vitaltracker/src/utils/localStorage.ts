
// Types
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  medicalRecordNumber?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  timestamp: string;
  recordedBy: string;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulse?: number;
  oxygenLevel?: number;
  notes?: string;
}

export interface HealthEvent {
  id: string;
  patientId: string;
  timestamp: string;
  recordedBy: string;
  type: 'urination' | 'defecation';
  color?: string;
  smell?: string;
  count?: number;
  notes?: string;
}

// Storage keys
const PATIENTS_KEY = 'vitalTracker_patients';
const VITAL_SIGNS_KEY = 'vitalTracker_vitalSigns';
const HEALTH_EVENTS_KEY = 'vitalTracker_healthEvents';

// Initialize local storage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(PATIENTS_KEY)) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(VITAL_SIGNS_KEY)) {
    localStorage.setItem(VITAL_SIGNS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(HEALTH_EVENTS_KEY)) {
    localStorage.setItem(HEALTH_EVENTS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem('vitalTracker_users')) {
    localStorage.setItem('vitalTracker_users', JSON.stringify([]));
  }
};

// Patient CRUD operations
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPatient = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find(patient => patient.id === id);
};

export const createPatient = (patient: Omit<Patient, 'id' | 'createdAt'>): Patient => {
  const patients = getPatients();
  
  const newPatient: Patient = {
    ...patient,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  
  return newPatient;
};

export const updatePatient = (id: string, updates: Partial<Patient>): Patient | null => {
  const patients = getPatients();
  const index = patients.findIndex(patient => patient.id === id);
  
  if (index === -1) return null;
  
  patients[index] = { ...patients[index], ...updates };
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  
  return patients[index];
};

export const deletePatient = (id: string): boolean => {
  const patients = getPatients();
  const filtered = patients.filter(patient => patient.id !== id);
  
  if (filtered.length === patients.length) return false;
  
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(filtered));
  
  // Also delete related vital signs and health events
  const vitalSigns = getVitalSigns();
  const filteredVitalSigns = vitalSigns.filter(vs => vs.patientId !== id);
  localStorage.setItem(VITAL_SIGNS_KEY, JSON.stringify(filteredVitalSigns));
  
  const healthEvents = getHealthEvents();
  const filteredHealthEvents = healthEvents.filter(he => he.patientId !== id);
  localStorage.setItem(HEALTH_EVENTS_KEY, JSON.stringify(filteredHealthEvents));
  
  return true;
};

// Vital signs CRUD operations
export const getVitalSigns = (): VitalSign[] => {
  const data = localStorage.getItem(VITAL_SIGNS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getVitalSignsByPatient = (patientId: string): VitalSign[] => {
  const vitalSigns = getVitalSigns();
  return vitalSigns.filter(vs => vs.patientId === patientId);
};

export const createVitalSign = (vitalSign: Omit<VitalSign, 'id'>): VitalSign => {
  const vitalSigns = getVitalSigns();
  
  const newVitalSign: VitalSign = {
    ...vitalSign,
    id: crypto.randomUUID(),
  };
  
  vitalSigns.push(newVitalSign);
  localStorage.setItem(VITAL_SIGNS_KEY, JSON.stringify(vitalSigns));
  
  return newVitalSign;
};

export const updateVitalSign = (id: string, updates: Partial<VitalSign>): VitalSign | null => {
  const vitalSigns = getVitalSigns();
  const index = vitalSigns.findIndex(vs => vs.id === id);
  
  if (index === -1) return null;
  
  vitalSigns[index] = { ...vitalSigns[index], ...updates };
  localStorage.setItem(VITAL_SIGNS_KEY, JSON.stringify(vitalSigns));
  
  return vitalSigns[index];
};

export const deleteVitalSign = (id: string): boolean => {
  const vitalSigns = getVitalSigns();
  const filtered = vitalSigns.filter(vs => vs.id !== id);
  
  if (filtered.length === vitalSigns.length) return false;
  
  localStorage.setItem(VITAL_SIGNS_KEY, JSON.stringify(filtered));
  
  return true;
};

// Health events CRUD operations
export const getHealthEvents = (): HealthEvent[] => {
  const data = localStorage.getItem(HEALTH_EVENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getHealthEventsByPatient = (patientId: string): HealthEvent[] => {
  const healthEvents = getHealthEvents();
  return healthEvents.filter(he => he.patientId === patientId);
};

export const createHealthEvent = (healthEvent: Omit<HealthEvent, 'id'>): HealthEvent => {
  const healthEvents = getHealthEvents();
  
  const newHealthEvent: HealthEvent = {
    ...healthEvent,
    id: crypto.randomUUID(),
  };
  
  healthEvents.push(newHealthEvent);
  localStorage.setItem(HEALTH_EVENTS_KEY, JSON.stringify(healthEvents));
  
  return newHealthEvent;
};

export const updateHealthEvent = (id: string, updates: Partial<HealthEvent>): HealthEvent | null => {
  const healthEvents = getHealthEvents();
  const index = healthEvents.findIndex(he => he.id === id);
  
  if (index === -1) return null;
  
  healthEvents[index] = { ...healthEvents[index], ...updates };
  localStorage.setItem(HEALTH_EVENTS_KEY, JSON.stringify(healthEvents));
  
  return healthEvents[index];
};

export const deleteHealthEvent = (id: string): boolean => {
  const healthEvents = getHealthEvents();
  const filtered = healthEvents.filter(he => he.id !== id);
  
  if (filtered.length === healthEvents.length) return false;
  
  localStorage.setItem(HEALTH_EVENTS_KEY, JSON.stringify(filtered));
  
  return true;
};

// Format date and time
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
