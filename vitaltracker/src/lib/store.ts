
// Tipos para los datos de la aplicación
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  notes?: string;
  medications?: Medication[];
}

export interface User {
  id: string;
  username: string;
  password: string; // En una aplicación real, esto estaría hasheado
  role: 'admin' | 'user';
}

export interface VitalSign {
  id: string;
  patientId: string;
  date: string;
  temperature?: number;
  bloodPressure?: string;
  systolic?: number;     // Agregamos campo para presión sistólica
  diastolic?: number;    // Agregamos campo para presión diastólica
  pulse?: number;
  oxygenLevel?: number;
}

export interface HealthEvent {
  id: string;
  patientId: string;
  date: string;
  type: 'urination' | 'defecation';
  color?: string;
  odor?: string;
  frequency?: number;
  notes?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  schedule?: string;
  active?: boolean;
}

export interface MedicationIntake {
  id: string;
  medicationId: string;
  patientId: string;
  date: string;
  taken: boolean;
  notes?: string;
}

// Datos iniciales para la aplicación
const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'María González',
    birthDate: '1950-05-15',
    notes: 'Hipertensión, diabetes tipo 2'
  },
  {
    id: '2',
    name: 'José Rodríguez',
    birthDate: '1945-09-23',
    notes: 'Artritis, colesterol alto'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    birthDate: '1955-02-10',
    notes: 'Osteoporosis'
  },
  {
    id: '4',
    name: 'Carlos López',
    birthDate: '1942-11-30',
    notes: 'Enfermedad cardíaca, usa marcapasos'
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    username: 'usuario',
    password: 'usuario123',
    role: 'user'
  }
];

const initialVitalSigns: VitalSign[] = [
  {
    id: '1',
    patientId: '1',
    date: '2023-06-15T10:30:00',
    temperature: 37.5,
    bloodPressure: '120/80',
    systolic: 120,
    diastolic: 80,
    pulse: 72,
    oxygenLevel: 98
  },
  {
    id: '2',
    patientId: '2',
    date: '2023-06-14T14:45:00',
    temperature: 36.8,
    bloodPressure: '135/85',
    systolic: 135,
    diastolic: 85,
    pulse: 68,
    oxygenLevel: 97
  },
  {
    id: '3',
    patientId: '3',
    date: '2023-06-14T09:15:00',
    temperature: 37.2,
    bloodPressure: '110/70',
    systolic: 110,
    diastolic: 70,
    pulse: 75,
    oxygenLevel: 99
  }
];

const initialHealthEvents: HealthEvent[] = [
  {
    id: '1',
    patientId: '1',
    date: '2023-06-15T08:45:00',
    type: 'urination',
    color: 'claro',
    frequency: 3
  },
  {
    id: '2',
    patientId: '2',
    date: '2023-06-14T16:30:00',
    type: 'defecation',
    color: 'marrón',
    odor: 'normal'
  }
];

const initialMedications: Medication[] = [
  {
    id: '1',
    patientId: '1',
    name: 'Paracetamol',
    dosage: '500mg',
    schedule: 'Cada 8 horas',
    active: true
  },
  {
    id: '2',
    patientId: '2',
    name: 'Omeprazol',
    dosage: '20mg',
    schedule: 'Antes del desayuno',
    active: true
  },
  {
    id: '3',
    patientId: '3',
    name: 'Insulina',
    dosage: '10 unidades',
    schedule: 'Antes de las comidas',
    active: true
  }
];

const initialMedicationIntakes: MedicationIntake[] = [
  {
    id: '1',
    medicationId: '1',
    patientId: '1',
    date: '2023-06-15T08:00:00',
    taken: true
  },
  {
    id: '2',
    medicationId: '2',
    patientId: '2',
    date: '2023-06-15T07:30:00',
    taken: true
  },
  {
    id: '3',
    medicationId: '3',
    patientId: '3',
    date: '2023-06-14T19:30:00',
    taken: true,
    notes: 'Tomada con la cena'
  }
];

// Función para inicializar el almacenamiento local
export const initializeStore = () => {
  if (!localStorage.getItem('patients')) {
    localStorage.setItem('patients', JSON.stringify(initialPatients));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('vitalSigns')) {
    localStorage.setItem('vitalSigns', JSON.stringify(initialVitalSigns));
  }
  if (!localStorage.getItem('healthEvents')) {
    localStorage.setItem('healthEvents', JSON.stringify(initialHealthEvents));
  }
  if (!localStorage.getItem('medications')) {
    localStorage.setItem('medications', JSON.stringify(initialMedications));
  }
  if (!localStorage.getItem('medicationIntakes')) {
    localStorage.setItem('medicationIntakes', JSON.stringify(initialMedicationIntakes));
  }
};

// Funciones de utilidad para acceder y modificar datos
export const getPatients = (): Patient[] => {
  const patients = localStorage.getItem('patients');
  return patients ? JSON.parse(patients) : [];
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getVitalSigns = (): VitalSign[] => {
  const vitalSigns = localStorage.getItem('vitalSigns');
  return vitalSigns ? JSON.parse(vitalSigns) : [];
};

export const getHealthEvents = (): HealthEvent[] => {
  const healthEvents = localStorage.getItem('healthEvents');
  return healthEvents ? JSON.parse(healthEvents) : [];
};

export const getMedications = (): Medication[] => {
  const medications = localStorage.getItem('medications');
  return medications ? JSON.parse(medications) : [];
};

export const getMedicationIntakes = (): MedicationIntake[] => {
  const medicationIntakes = localStorage.getItem('medicationIntakes');
  return medicationIntakes ? JSON.parse(medicationIntakes) : [];
};

// Para añadir, actualizar y eliminar datos, implementaremos estas funciones
// cuando construyamos las páginas específicas
