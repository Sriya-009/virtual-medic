import React, { useState } from 'react';
import { Calendar, Clock, Video, FileText, Users, Activity, CheckCircle, XCircle } from 'lucide-react';

export const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const todayAppointments = [
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2025-10-08T09:00:00',
      durationMinutes: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.telecare.com/abc123',
      reason: 'Follow-up consultation for hypertension',
      notes: 'Patient reported improved condition'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Emily Davis',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2025-10-08T10:00:00',
      durationMinutes: 30,
      status: 'in_progress',
      meetingLink: 'https://meet.telecare.com/def456',
      reason: 'General checkup and blood pressure monitoring'
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Michael Brown',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2025-10-08T11:00:00',
      durationMinutes: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.telecare.com/ghi789',
      reason: 'Respiratory symptoms'
    },
    {
      id: '4',
      patientId: 'p4',
      patientName: 'Sarah Williams',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2025-10-08T14:00:00',
      durationMinutes: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.telecare.com/jkl012',
      reason: 'Diabetes management consultation'
    }
  ];

  const recentPatients = [
    { id: 'p1', name: 'John Smith', age: 45, lastVisit: '2025-10-07', condition: 'Hypertension', status: 'Stable' },
    { id: 'p2', name: 'Emily Davis', age: 32, lastVisit: '2025-10-07', condition: 'Asthma', status: 'Monitoring' },
    { id: 'p3', name: 'Michael Brown', age: 58, lastVisit: '2025-10-06', condition: 'Diabetes Type 2', status: 'Stable' },
    { id: 'p4', name: 'Sarah Williams', age: 28, lastVisit: '2025-10-05', condition: 'General Health', status: 'Healthy' }
  ];

  const recentPrescriptions = [
    {
      id: 'rx1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      status: 'pending',
      issuedDate: '2025-10-07',
      expiryDate: '2026-01-07',
      items: [
        { id: '1', medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '90 days', quantity: 90 }
      ]
    },
    {
      id: 'rx2',
      patientId: 'p2',
      patientName: 'Emily Davis',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      status: 'dispensed',
      issuedDate: '2025-10-07',
      expiryDate: '2026-01-07',
      items: [
        { id: '2', medicationName: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', duration: '30 days', quantity: 1 }
      ]
    }
  ];

  const stats = [
    { label: 'Today\'s Appointments', value: '12', icon: Calendar, color: 'bg-cyan-500' },
    { label: 'Total Patients', value: '347', icon: Users, color: 'bg-blue-500' },
    { label: 'Prescriptions (Week)', value: '28', icon: FileText, color: 'bg-green-500' },
    { label: 'Availability', value: 'Online', icon: Activity, color: 'bg-purple-500' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Sarah Johnson</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all">
            <Activity className="w-5 h-5 text-green-500" />
            Available
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md">
            <FileText className="w-5 h-5" />
            New Prescription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'appointments'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'patients'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Patients
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'prescriptions'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Prescriptions
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Appointments</h2>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          <span>• {appointment.durationMinutes} min</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status === 'in_progress' ? 'In Progress' :
                       appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{appointment.reason}</p>
                  {appointment.status === 'in_progress' && (
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all">
                      <Video className="w-5 h-5" />
                      Join Consultation
                    </button>
                  )}
                  {appointment.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                        <Video className="w-5 h-5" />
                        Start
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <XCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedAppointment && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Patient</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedAppointment.appointmentDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900">{selectedAppointment.reason}</p>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all mt-4">
                  <FileText className="w-5 h-5" />
                  Add Medical Record
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Patients</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Visit</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{patient.age}</td>
                    <td className="py-4 px-4 text-gray-700">{patient.lastVisit}</td>
                    <td className="py-4 px-4 text-gray-700">{patient.condition}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === 'Stable' || patient.status === 'Healthy'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                        View Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Prescriptions</h2>
          <div className="space-y-4">
            {recentPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg hover:border-cyan-500 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{prescription.patientName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Issued: {new Date(prescription.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prescription.status === 'completed' ? 'bg-green-100 text-green-700' :
                    prescription.status === 'dispensed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.medicationName}</p>
                        <p className="text-sm text-gray-600">
                          {item.dosage} • {item.frequency} • {item.duration}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
