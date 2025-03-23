
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  User, 
  Shield, 
  Settings as SettingsIcon,
  AlertTriangle,
  Info
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

const Settings: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      toast.error('Only administrators can access settings');
      window.location.href = '/dashboard';
      return;
    }
    
    loadUsers();
  }, [isAdmin]);
  
  const loadUsers = () => {
    const usersJson = localStorage.getItem('vitalTracker_users');
    if (usersJson) {
      try {
        const allUsers = JSON.parse(usersJson);
        // Clean user objects to remove passwords
        const safeUsers = allUsers.map((u: any) => ({
          id: u.id,
          username: u.username,
          role: u.role,
          createdAt: u.createdAt
        }));
        setUsers(safeUsers);
      } catch (error) {
        console.error('Failed to parse users from localStorage', error);
        toast.error('Could not load user data');
      }
    }
  };
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUsername.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    
    if (newPassword.trim().length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    
    // Check if username already exists
    const usersJson = localStorage.getItem('vitalTracker_users');
    const existingUsers = usersJson ? JSON.parse(usersJson) : [];
    
    if (existingUsers.some((u: any) => u.username === newUsername)) {
      toast.error('Username already exists');
      return;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      username: newUsername,
      password: newPassword,
      role: newRole,
      createdAt: new Date().toISOString()
    };
    
    // Add to storage
    existingUsers.push(newUser);
    localStorage.setItem('vitalTracker_users', JSON.stringify(existingUsers));
    
    // Clear form and reload users
    setNewUsername('');
    setNewPassword('');
    setNewRole('user');
    setShowAddUser(false);
    loadUsers();
    
    toast.success('User added successfully');
  };
  
  const handleDeleteUser = (userId: string, username: string) => {
    // Prevent deleting yourself
    if (userId === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the user "${username}"?`)) {
      const usersJson = localStorage.getItem('vitalTracker_users');
      if (usersJson) {
        try {
          const existingUsers = JSON.parse(usersJson);
          const filteredUsers = existingUsers.filter((u: any) => u.id !== userId);
          
          localStorage.setItem('vitalTracker_users', JSON.stringify(filteredUsers));
          loadUsers();
          
          toast.success('User deleted successfully');
        } catch (error) {
          console.error('Failed to delete user', error);
          toast.error('Could not delete user');
        }
      }
    }
  };
  
  const handleToggleRole = (userId: string, currentRole: 'admin' | 'user') => {
    // Prevent demoting yourself
    if (userId === user?.id) {
      toast.error('You cannot change your own role');
      return;
    }
    
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const usersJson = localStorage.getItem('vitalTracker_users');
    if (usersJson) {
      try {
        const existingUsers = JSON.parse(usersJson);
        const updatedUsers = existingUsers.map((u: any) => {
          if (u.id === userId) {
            return { ...u, role: newRole };
          }
          return u;
        });
        
        localStorage.setItem('vitalTracker_users', JSON.stringify(updatedUsers));
        loadUsers();
        
        toast.success(`User role updated to ${newRole}`);
      } catch (error) {
        console.error('Failed to update user role', error);
        toast.error('Could not update user role');
      }
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Count admins to prevent removing the last admin
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-medium text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage users and application settings</p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 col-span-2 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                User Management
              </h2>
              
              <button
                className="btn-primary flex items-center"
                onClick={() => setShowAddUser(!showAddUser)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {showAddUser ? 'Cancel' : 'Add User'}
              </button>
            </div>
            
            {showAddUser && (
              <div className="mb-6 p-4 border rounded-md bg-secondary/50 animate-slide-up">
                <h3 className="text-lg font-medium mb-3">Add New User</h3>
                
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="label">Username</label>
                    <input
                      id="username"
                      type="text"
                      className="input-field w-full"
                      placeholder="Enter username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                      minLength={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="label">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="input-field w-full"
                      placeholder="Enter password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={4}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="label">Role</label>
                    <select
                      id="role"
                      className="input-field w-full"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary">
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {users.length === 0 ? (
              <div className="text-center py-10">
                <User className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Username</th>
                      <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Role</th>
                      <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Created</th>
                      <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-medium">{user.username}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <Shield className="w-3 h-3 mr-1" />
                            ) : (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleToggleRole(user.id, user.role)}
                              className={`p-2 rounded-full transition-colors ${
                                user.id === isAdmin 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : user.role === 'admin'
                                    ? 'text-blue-600 hover:bg-blue-50'
                                    : 'text-red-600 hover:bg-red-50'
                              }`}
                              disabled={user.id === user?.id}
                              title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              aria-label={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className={`p-2 rounded-full transition-colors ${
                                user.id === user?.id 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              disabled={user.id === user?.id}
                              title="Delete User"
                              aria-label="Delete User"
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
          </div>
          
          <div className="glass-panel p-6 col-span-2 md:col-span-1">
            <h2 className="text-xl font-medium flex items-center mb-4">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              App Information
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-blue-50 border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-1">About Vital Tracker</h3>
                <p className="text-sm text-blue-700">
                  This application is designed to help track and monitor vital signs
                  and health events for multiple patients. All data is stored locally
                  on your device.
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-amber-50 border-amber-100">
                <h3 className="text-sm font-medium text-amber-800 mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Data Privacy Notice
                </h3>
                <p className="text-sm text-amber-700">
                  Patient data is stored in your browser's local storage and does
                  not leave your device. Clearing your browser data will erase all
                  recorded information.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">System Information</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>1.0.0</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>LocalStorage</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span>{users.length}</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Data Management</h3>
                <button 
                  className="w-full py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors text-sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                      // Don't delete users data
                      localStorage.removeItem('vitalTracker_patients');
                      localStorage.removeItem('vitalTracker_vitalSigns');
                      localStorage.removeItem('vitalTracker_healthEvents');
                      
                      toast.success('All patient data has been reset');
                    }
                  }}
                >
                  Reset Patient Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
