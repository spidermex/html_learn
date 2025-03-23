
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  getPatients, 
  getVitalSigns, 
  getHealthEvents, 
  formatDateTime,
  Patient,
  VitalSign,
  HealthEvent
} from '../utils/localStorage';
import { 
  Users, 
  Activity, 
  LineChart, 
  Calendar, 
  User, 
  Thermometer, 
  Heart, 
  Droplet 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<VitalSign | HealthEvent>>([]);
  
  useEffect(() => {
    setPatients(getPatients());
    setVitalSigns(getVitalSigns());
    setHealthEvents(getHealthEvents());
    
    // Combine vital signs and health events for recent activity
    const allActivity = [
      ...getVitalSigns(),
      ...getHealthEvents()
    ];
    
    // Sort by timestamp, descending
    const sorted = allActivity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setRecentActivity(sorted.slice(0, 10));
  }, []);
  
  const getPatientName = (id: string): string => {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.name : 'Unknown Patient';
  };
  
  // Fix for error: Using type guards to check if an activity is a VitalSign or HealthEvent
  const isHealthEvent = (activity: VitalSign | HealthEvent): activity is HealthEvent => {
    return 'type' in activity;
  };
  
  const getActivityIcon = (activity: VitalSign | HealthEvent) => {
    if ('temperature' in activity) {
      return <Thermometer className="w-5 h-5 text-yellow-500" />;
    } else if (isHealthEvent(activity) && activity.type === 'urination') {
      return <Droplet className="w-5 h-5 text-blue-500" />;
    } else {
      return <Activity className="w-5 h-5 text-brown-500" />;
    }
  };
  
  const getActivityLabel = (activity: VitalSign | HealthEvent): string => {
    if ('temperature' in activity) {
      return 'Vital Signs Recorded';
    } else if (isHealthEvent(activity)) {
      return `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Recorded`;
    } else {
      return 'Activity Recorded';
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-medium text-foreground">Welcome, {user?.username}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your vital tracking data</p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Patients</p>
                <h3 className="text-2xl font-semibold mt-1">{patients.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/patients" className="text-sm text-primary font-medium hover:underline">View all patients</Link>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Vital Signs Recorded</p>
                <h3 className="text-2xl font-semibold mt-1">{vitalSigns.length}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/vital-signs" className="text-sm text-primary font-medium hover:underline">Record vital signs</Link>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Health Events</p>
                <h3 className="text-2xl font-semibold mt-1">{healthEvents.length}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/vital-signs" className="text-sm text-primary font-medium hover:underline">Record health event</Link>
            </div>
          </div>

          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Records</p>
                <h3 className="text-2xl font-semibold mt-1">{vitalSigns.length + healthEvents.length}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <LineChart className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports" className="text-sm text-primary font-medium hover:underline">View reports</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Patients */}
          <div className="glass-card p-6 animate-blur-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Patients</h3>
              <Link to="/patients" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            {patients.length === 0 ? (
              <div className="text-center py-6">
                <User className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No patients yet</p>
                <Link to="/patients" className="mt-2 inline-block btn-primary">
                  Add your first patient
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {patients.slice(0, 5).map(patient => (
                  <li key={patient.id} className="py-3">
                    <Link to={`/patients/${patient.id}`} className="flex items-center hover:bg-gray-50 p-2 rounded transition-colors">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Added on {formatDateTime(patient.createdAt).split(',')[0]}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 lg:col-span-2 animate-blur-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link to="/reports" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No activity recorded yet</p>
                <Link to="/vital-signs" className="mt-2 inline-block btn-primary">
                  Record vital signs
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="py-3">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mt-1">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{getActivityLabel(activity)}</p>
                        <p className="text-sm text-muted-foreground">
                          {getPatientName(activity.patientId)} • {formatDateTime(activity.timestamp)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {'temperature' in activity && activity.temperature ? 
                            `Temp: ${activity.temperature}°C, ` : ''}
                          {'bloodPressureSystolic' in activity && activity.bloodPressureSystolic ? 
                            `BP: ${activity.bloodPressureSystolic}/${activity.bloodPressureDiastolic}, ` : ''}
                          {'pulse' in activity && activity.pulse ? 
                            `Pulse: ${activity.pulse} bpm, ` : ''}
                          {'oxygenLevel' in activity && activity.oxygenLevel ? 
                            `O₂: ${activity.oxygenLevel}%` : ''}
                          {'type' in activity && activity.type === 'urination' ? 
                            `Urination` : ''}
                          {'type' in activity && activity.type === 'defecation' ? 
                            `Defecation` : ''}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
