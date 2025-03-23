
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to retrieve the user from localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem('vitalTracker_currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('vitalTracker_currentUser');
        }
      }
      setIsLoaded(true);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Get users from localStorage
    const usersJson = localStorage.getItem('vitalTracker_users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find user with matching username and password
    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (foundUser) {
      // Create a clean user object without the password
      const userToStore: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      };

      // Save to state and localStorage
      setUser(userToStore);
      localStorage.setItem('vitalTracker_currentUser', JSON.stringify(userToStore));
      
      toast.success(`Welcome back, ${username}!`);
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vitalTracker_currentUser');
    toast.info('You have been logged out');
  };

  const register = async (username: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    // Get existing users
    const usersJson = localStorage.getItem('vitalTracker_users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Check if username already exists
    if (users.some((u: any) => u.username === username)) {
      toast.error('Username already exists');
      return false;
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      username,
      password,
      role,
      createdAt: new Date().toISOString()
    };

    // Add to users array and save
    users.push(newUser);
    localStorage.setItem('vitalTracker_users', JSON.stringify(users));

    // If this is the first user, make them an admin
    if (users.length === 1) {
      newUser.role = 'admin';
    }

    toast.success('Registration successful!');
    
    // Automatically log in the new user
    return login(username, password);
  };

  const isAdmin = user?.role === 'admin';

  // Only render children after the initial load check
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
