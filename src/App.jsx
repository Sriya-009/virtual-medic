import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { Layout } from './components/Layout.jsx';
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';
import { DoctorDashboard } from './components/doctor/DoctorDashboard.jsx';
import { PatientDashboard } from './components/patient/PatientDashboard.jsx';
import { PharmacistDashboard } from './components/pharmacist/PharmacistDashboard.jsx';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'doctor' && <DoctorDashboard />}
      {user.role === 'patient' && <PatientDashboard />}
      {user.role === 'pharmacist' && <PharmacistDashboard />}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
