
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../context/AuthContext';
import { initializeStorage } from '../utils/localStorage';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize local storage
    initializeStorage();
    
    // If no user is logged in, redirect to login page
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // If no user, don't render the layout (redirect will happen)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      
      <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
        <div className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
