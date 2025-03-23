
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  getPatients, 
  createPatient, 
  updatePatient, 
  deletePatient, 
  Patient, 
  formatDate 
} from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, X, Search, Edit, Trash2, User, Save, Check, Calendar, UserPlus 
} from 'lucide-react';
import { toast } from "sonner";

const Patients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    loadPatients();
  }, []);
  
  useEffect(() => {
    // Filter patients based on search query
    if (searchQuery) {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.medicalRecordNumber && 
         patient.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);
  
  const loadPatients = () => {
    const loadedPatients = getPatients();
    setPatients(loadedPatients);
    setFilteredPatients(loadedPatients);
  };
  
  const resetForm = () => {
    setName('');
    setDateOfBirth('');
    setGender('');
    setMedicalRecordNumber('');
    setNotes('');
    setEditingPatient(null);
  };
  
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newPatient = createPatient({
        name,
        dateOfBirth,
        gender,
        medicalRecordNumber,
        notes,
        createdBy: user!.id
      });
      
      setPatients(prev => [...prev, newPatient]);
      setShowAddForm(false);
      resetForm();
      toast.success('Patient added successfully');
    } catch (error) {
      console.error('Failed to add patient:', error);
      toast.error('Failed to add patient');
    }
  };
  
  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPatient) return;
    
    try {
      const updatedPatient = updatePatient(editingPatient.id, {
        name,
        dateOfBirth,
        gender,
        medicalRecordNumber,
        notes
      });
      
      if (updatedPatient) {
        setPatients(prev => 
          prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
        );
        setEditingPatient(null);
        resetForm();
        toast.success('Patient updated successfully');
      }
    } catch (error) {
      console.error('Failed to update patient:', error);
      toast.error('Failed to update patient');
    }
  };
  
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setName(patient.name);
    setDateOfBirth(patient.dateOfBirth);
    setGender(patient.gender);
    setMedicalRecordNumber(patient.medicalRecordNumber || '');
    setNotes(patient.notes || '');
    setShowAddForm(true);
  };
  
  const handleDeletePatient = (id: string, patientName: string) => {
    if (window.confirm(`Are you sure you want to delete ${patientName}? This will also delete all their records.`)) {
      try {
        const success = deletePatient(id);
        
        if (success) {
          setPatients(prev => prev.filter(p => p.id !== id));
          toast.success('Patient deleted successfully');
        }
      } catch (error) {
        console.error('Failed to delete patient:', error);
        toast.error('Failed to delete patient');
      }
    }
  };
  
  const handleCancelEdit = () => {
    setEditingPatient(null);
    resetForm();
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-medium text-foreground">Patients</h1>
            <p className="text-muted-foreground mt-1">Manage your patients and their information</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button 
              className="btn-primary flex items-center" 
              onClick={() => {
                resetForm();
                setShowAddForm(!showAddForm);
              }}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </>
              )}
            </button>
          </div>
        </header>
        
        {/* Add/Edit Patient Form */}
        {showAddForm && (
          <div className="glass-panel mb-8 p-6 animate-slide-up">
            <h2 className="text-xl font-medium mb-4">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            
            <form onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="label">Patient Name *</label>
                  <input
                    id="name"
                    type="text"
                    className="input-field w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="label">Date of Birth *</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="input-field w-full"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="label">Gender *</label>
                  <select
                    id="gender"
                    className="input-field w-full"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="medicalRecordNumber" className="label">Medical Record Number</label>
                  <input
                    id="medicalRecordNumber"
                    type="text"
                    className="input-field w-full"
                    value={medicalRecordNumber}
                    onChange={(e) => setMedicalRecordNumber(e.target.value)}
                    placeholder="Enter medical record number (optional)"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="label">Notes</label>
                <textarea
                  id="notes"
                  className="input-field w-full"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes (optional)"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  {editingPatient ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Patient
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Search & Patient List */}
        <div className="glass-panel p-6">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="input-field w-full pl-10"
                placeholder="Search patients by name or medical record number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              {searchQuery ? (
                <>
                  <Search className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No patients match your search</p>
                </>
              ) : (
                <>
                  <UserPlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No patients added yet</p>
                  <button 
                    className="mt-2 btn-primary"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add your first patient
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date of Birth</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Gender</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">MRN</th>
                    <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="border-b hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-secondary-foreground" />
                          </div>
                          <span className="ml-2 font-medium">{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
                          {formatDate(patient.dateOfBirth)}
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">{patient.gender}</td>
                      <td className="py-3 px-4">{patient.medicalRecordNumber || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            aria-label="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id, patient.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Patients;
