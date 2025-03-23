
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }
    
    if (password.trim().length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await register(username, password, 'user');
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-panel max-w-md w-full p-8 animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-display font-semibold text-foreground">VitalTracker</h1>
          </div>
        </div>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 text-center font-medium border-b-2 transition-all ${
              activeTab === 'login'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input-field w-full"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-sm text-muted-foreground text-center mt-4">
              New to VitalTracker?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveTab('register')}
              >
                Create an account
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="label">
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                className="input-field w-full"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="label">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                className="input-field w-full"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="text-sm text-muted-foreground text-center mt-4">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-xs text-center text-muted-foreground">
          <p>First time? The first registered user will automatically become an admin.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
