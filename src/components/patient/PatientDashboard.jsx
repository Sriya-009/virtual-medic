import React, { useState } from 'react';
import { Calendar, FileText, Activity, Clock, Plus, Search, Video, Download, Upload } from 'lucide-react';

export const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const upcomingAppointments = [
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      appointmentDate: '2025-10-09T10:00:00',
      durationMinutes: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.telecare.com/xyz789',
      reason: 'Follow-up consultation'
    },
    {
      id: '2',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd2',
      doctorName: 'Dr. Michael Chen',
      appointmentDate: '2025-10-15T14:30:00',
      durationMinutes: 30,
      status: 'scheduled',
      reason: 'Annual physical examination'
    }
  ];

  const activePrescriptions = [
    {
      id: 'rx1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      status: 'dispensed',
      issuedDate: '2025-10-01',
      expiryDate: '2026-01-01',
      items: [
        {
          id: '1',
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '90 days',
          quantity: 90,
          instructions: 'Take in the morning with food'
        }
      ]
    },
    {
      id: 'rx2',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      status: 'completed',
      issuedDate: '2025-09-15',
      expiryDate: '2025-12-15',
      items: [
        {
          id: '2',
          medicationName: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          quantity: 21
        }
      ]
    }
  ];

  const medicalRecords = [
    {
      id: 'mr1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      recordType: 'consultation',
      title: 'Hypertension Follow-up',
      content: 'Patient reports feeling well. Blood pressure readings have improved.',
      diagnosis: 'Essential hypertension, controlled',
      vitalSigns: {
        bloodPressure: '128/82',
        pulse: '72',
        temperature: '98.4°F'
      },
      createdAt: '2025-10-01'
    },
    {
      id: 'mr2',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd2',
      doctorName: 'Dr. Michael Chen',
      recordType: 'diagnosis',
      title: 'Annual Physical Exam',
      content: 'Comprehensive examination completed. Overall health is good.',
      diagnosis: 'No acute findings',
      vitalSigns: {
        bloodPressure: '130/85',
        pulse: '75',
        temperature: '98.6°F',
        respiratoryRate: '16'
      },
      createdAt: '2025-09-15'
    }
  ];

  const labReports = [
    {
      id: 'lab1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      testName: 'Complete Blood Count (CBC)',
      testDate: '2025-09-20',
      status: 'completed',
      results: {
        WBC: '7.2 K/uL',
        RBC: '5.1 M/uL',
        Hemoglobin: '15.2 g/dL',
        Platelets: '240 K/uL'
      },
      createdAt: '2025-09-20'
    },
    {
      id: 'lab2',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      testName: 'Lipid Panel',
      testDate: '2025-09-20',
      status: 'completed',
      results: {
        'Total Cholesterol': '185 mg/dL',
        'LDL': '110 mg/dL',
        'HDL': '55 mg/dL',
        'Triglycerides': '100 mg/dL'
      },
      createdAt: '2025-09-20'
    }
  ];

  const availableDoctors = [
    { id: 'd1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine', fee: 75 },
    { id: 'd2', name: 'Dr. Michael Chen', specialization: 'Cardiology', fee: 120 },
    { id: 'd3', name: 'Dr. Emily Davis', specialization: 'Pediatrics', fee: 85 },
    { id: 'd4', name: 'Dr. Robert Wilson', specialization: 'Dermatology', fee: 95 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
          <p className="text-gray-600 mt-1">Manage your health and appointments</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'appointments', label: 'Appointments' },
          { key: 'records', label: 'Medical Records' },
          { key: 'prescriptions', label: 'Prescriptions' },
          { key: 'labs', label: 'Lab Reports' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-cyan-600 border-b-2 border-cyan-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
              <Calendar className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-3xl font-bold mb-1">{upcomingAppointments.length}</p>
              <p className="opacity-90">Upcoming Appointments</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <FileText className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-3xl font-bold mb-1">{activePrescriptions.length}</p>
              <p className="opacity-90">Active Prescriptions</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <Activity className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-3xl font-bold mb-1">{medicalRecords.length}</p>
              <p className="opacity-90">Medical Records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      {new Date(appointment.appointmentDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Prescriptions</h2>
              <div className="space-y-3">
                {activePrescriptions.filter(p => p.status !== 'completed').map((prescription) => (
                  <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                    {prescription.items.map((item) => (
                      <div key={item.id}>
                        <p className="font-semibold text-gray-900">{item.medicationName}</p>
                        <p className="text-sm text-gray-600">{item.dosage} • {item.frequency}</p>
                        <p className="text-xs text-gray-500 mt-1">Expires: {new Date(prescription.expiryDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
                <option>All Appointments</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 border border-gray-200 rounded-lg hover:border-cyan-500 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {appointment.doctorName.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{appointment.doctorName}</p>
                      <p className="text-gray-600">{appointment.reason}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {appointment.meetingLink && (
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                      <Video className="w-5 h-5" />
                      Join Meeting
                    </button>
                  )}
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
                    Reschedule
                  </button>
                  <button className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Medical Records</h2>
            <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium">
              <Upload className="w-5 h-5" />
              Upload Document
            </button>
          </div>

          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div key={record.id} className="p-6 border border-gray-200 rounded-lg hover:border-cyan-500 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{record.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {record.doctorName} • {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1)}
                  </span>
                </div>

                {record.vitalSigns && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {Object.entries(record.vitalSigns).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-600 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-700 mb-3">{record.content}</p>

                {record.diagnosis && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-900">Diagnosis</p>
                    <p className="text-sm text-yellow-800 mt-1">{record.diagnosis}</p>
                  </div>
                )}

                <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mt-4">
                  <Download className="w-5 h-5" />
                  Download Record
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Prescriptions</h2>
          <div className="space-y-4">
            {activePrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{prescription.doctorName}</p>
                    <p className="text-sm text-gray-600">
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

                <div className="space-y-3 mb-4">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">{item.medicationName}</p>
                          <p className="text-sm text-gray-600">{item.dosage}</p>
                        </div>
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Frequency</p>
                          <p className="font-medium text-gray-900">{item.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium text-gray-900">{item.duration}</p>
                        </div>
                      </div>
                      {item.instructions && (
                        <p className="text-sm text-gray-700 mt-2 italic">{item.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  {prescription.status === 'pending' && (
                    <button className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                      Send to Pharmacy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lab Reports</h2>
          <div className="space-y-4">
            {labReports.map((report) => (
              <div key={report.id} className="p-6 border border-gray-200 rounded-lg hover:border-cyan-500 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{report.testName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.doctorName} • {new Date(report.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>

                {report.results && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    {Object.entries(report.results).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-600 mb-1">{key}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium">
                  <Download className="w-5 h-5" />
                  Download Full Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {doctor.name.split(' ')[1][0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${doctor.fee}</p>
                        <p className="text-sm text-gray-600">per session</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                      Select & Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
