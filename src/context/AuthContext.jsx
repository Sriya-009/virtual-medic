import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('telemedicine_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);

    const demoUsers = {
      'admin@telecare.com': {
        id: '1',
        role: 'admin',
        fullName: 'System Administrator',
        email: 'admin@telecare.com',
        phone: '+1234567890'
      },
      'doctor@telecare.com': {
        id: '2',
        role: 'doctor',
        fullName: 'Dr. Sarah Johnson',
        email: 'doctor@telecare.com',
        phone: '+1234567891'
      },
      'patient@telecare.com': {
        id: '3',
        role: 'patient',
        fullName: 'John Smith',
        email: 'patient@telecare.com',
        phone: '+1234567892'
      },
      'pharmacist@telecare.com': {
        id: '4',
        role: 'pharmacist',
        fullName: 'Emily Brown',
        email: 'pharmacist@telecare.com',
        phone: '+1234567893'
      }
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    const authenticatedUser = demoUsers[email];
    if (authenticatedUser && password === 'demo123') {
      setUser(authenticatedUser);
      localStorage.setItem('telemedicine_user', JSON.stringify(authenticatedUser));
    } else {
      throw new Error('Invalid credentials');
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telemedicine_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
