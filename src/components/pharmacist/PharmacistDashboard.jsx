import React, { useState } from 'react';
import { Pill, CheckCircle, Clock, FileText, Search, AlertCircle, Package, TrendingUp } from 'lucide-react';

export const PharmacistDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const prescriptions = [
    {
      id: 'rx1',
      appointmentId: 'apt1',
      patientId: 'p1',
      patientName: 'John Smith',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      status: 'pending',
      issuedDate: '2025-10-08',
      expiryDate: '2026-01-08',
      notes: 'Patient has penicillin allergy',
      items: [
        {
          id: '1',
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '90 days',
          quantity: 90,
          instructions: 'Take in the morning with food'
        },
        {
          id: '2',
          medicationName: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '90 days',
          quantity: 180,
          instructions: 'Take with meals'
        }
      ]
    },
    {
      id: 'rx2',
      patientId: 'p2',
      patientName: 'Emily Davis',
      doctorId: 'd2',
      doctorName: 'Dr. Michael Chen',
      status: 'pending',
      issuedDate: '2025-10-08',
      expiryDate: '2026-01-08',
      items: [
        {
          id: '3',
          medicationName: 'Albuterol Inhaler',
          dosage: '90mcg',
          frequency: 'As needed',
          duration: '30 days',
          quantity: 1,
          instructions: 'Use as rescue inhaler for breathing difficulties'
        }
      ]
    },
    {
      id: 'rx3',
      patientId: 'p3',
      patientName: 'Michael Brown',
      doctorId: 'd1',
      doctorName: 'Dr. Sarah Johnson',
      pharmacistId: 'ph1',
      pharmacistName: 'Emily Brown',
      status: 'dispensed',
      issuedDate: '2025-10-07',
      expiryDate: '2026-01-07',
      items: [
        {
          id: '4',
          medicationName: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '10 days',
          quantity: 30
        }
      ]
    },
    {
      id: 'rx4',
      patientId: 'p4',
      patientName: 'Sarah Williams',
      doctorId: 'd3',
      doctorName: 'Dr. Emily Davis',
      pharmacistId: 'ph1',
      pharmacistName: 'Emily Brown',
      status: 'completed',
      issuedDate: '2025-10-05',
      expiryDate: '2026-01-05',
      items: [
        {
          id: '5',
          medicationName: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          duration: '90 days',
          quantity: 90
        }
      ]
    }
  ];

  const stats = [
    { label: 'Pending Orders', value: prescriptions.filter(p => p.status === 'pending').length, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Dispensed Today', value: prescriptions.filter(p => p.status === 'dispensed').length, icon: Package, color: 'bg-blue-500' },
    { label: 'Completed (Week)', value: prescriptions.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Total Prescriptions', value: prescriptions.length, icon: FileText, color: 'bg-purple-500' }
  ];

  const filteredPrescriptions = prescriptions.filter(p => p.status === activeTab);

  const handleDispense = (prescriptionId) => {
    alert(`Prescription ${prescriptionId} marked as dispensed`);
  };

  const handleComplete = (prescriptionId) => {
    alert(`Prescription ${prescriptionId} marked as completed`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacist Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage prescriptions and medication orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
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
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'pending'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Orders
          <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
            {prescriptions.filter(p => p.status === 'pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('dispensed')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'dispensed'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dispensed
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'completed'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No prescriptions in this category</p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                onClick={() => setSelectedPrescription(prescription)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {prescription.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{prescription.patientName}</p>
                      <p className="text-sm text-gray-600">Prescribed by {prescription.doctorName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prescription.status === 'completed' ? 'bg-green-100 text-green-700' :
                    prescription.status === 'dispensed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>

                {prescription.notes && (
                  <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Important Note</p>
                      <p className="text-sm text-amber-800">{prescription.notes}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {prescription.items.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-cyan-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{item.medicationName}</p>
                            <p className="text-sm text-gray-600">{item.dosage}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
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
                        <p className="text-xs text-gray-600 mt-2 italic border-t border-gray-200 pt-2">
                          {item.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pt-3 border-t border-gray-200">
                  <span>Issued: {new Date(prescription.issuedDate).toLocaleDateString()}</span>
                  <span>Expires: {new Date(prescription.expiryDate).toLocaleDateString()}</span>
                </div>

                {prescription.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispense(prescription.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Dispensed
                    </button>
                  </div>
                )}

                {prescription.status === 'dispensed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(prescription.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Completed
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {selectedPrescription && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Prescription Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prescription ID</p>
                <p className="font-mono text-sm text-gray-900">{selectedPrescription.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Patient</p>
                <p className="font-semibold text-gray-900">{selectedPrescription.patientName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Prescribing Doctor</p>
                <p className="font-semibold text-gray-900">{selectedPrescription.doctorName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                <p className="text-gray-900">{new Date(selectedPrescription.issuedDate).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                <p className="text-gray-900">{new Date(selectedPrescription.expiryDate).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="font-semibold text-gray-900">{selectedPrescription.items.length}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedPrescription.status === 'completed' ? 'bg-green-100 text-green-700' :
                  selectedPrescription.status === 'dispensed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                </span>
              </div>

              {selectedPrescription.pharmacistId && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dispensed By</p>
                  <p className="text-gray-900">{selectedPrescription.pharmacistName}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <FileText className="w-5 h-5" />
                  Print Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Medication Information</h2>
            <p className="text-sm text-gray-600">Quick reference guide</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Lisinopril', category: 'ACE Inhibitor', commonUse: 'High Blood Pressure' },
            { name: 'Metformin', category: 'Antidiabetic', commonUse: 'Type 2 Diabetes' },
            { name: 'Atorvastatin', category: 'Statin', commonUse: 'High Cholesterol' },
            { name: 'Albuterol', category: 'Bronchodilator', commonUse: 'Asthma/COPD' },
            { name: 'Amoxicillin', category: 'Antibiotic', commonUse: 'Bacterial Infections' },
            { name: 'Omeprazole', category: 'PPI', commonUse: 'Acid Reflux' }
          ].map((med) => (
            <div key={med.name} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-5 h-5 text-cyan-600" />
                <p className="font-semibold text-gray-900">{med.name}</p>
              </div>
              <p className="text-sm text-gray-600 mb-1">{med.category}</p>
              <p className="text-xs text-gray-500">{med.commonUse}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
