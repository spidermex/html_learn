
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Activity, LineChart, Settings, Menu, X, Home, LogOut 
} from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Patients', path: '/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Vital Signs', path: '/vital-signs', icon: <Activity className="w-5 h-5" /> },
    { name: 'Reports', path: '/reports', icon: <LineChart className="w-5 h-5" /> },
  ];

  if (isAdmin) {
    navItems.push({ 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile nav toggle */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-white rounded-full shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar/Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="flex items-center justify-center h-20 border-b">
            <Link to="/dashboard" onClick={closeSidebar} className="flex items-center space-x-2">
              <Activity className="w-7 h-7 text-primary" />
              <span className="text-xl font-display font-semibold text-gray-800">VitalTracker</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="text-sm font-medium">Logged in as:</div>
            <div className="text-md font-semibold text-gray-800">{user?.username}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
              {user?.role}
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100 ${
                      isActive(item.path) ? 'bg-secondary text-primary font-medium border-r-4 border-primary' : ''
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Navigation;
