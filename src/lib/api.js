import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('medc.auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH ENDPOINTS
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data)
};

// USERS ENDPOINTS
export const usersAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  getByRole: (role) => apiClient.get(`/users/role/${role}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data)
};

// DOCTORS ENDPOINTS
export const doctorsAPI = {
  getAll: () => apiClient.get('/doctors'),
  getById: (id) => apiClient.get(`/doctors/${id}`),
  getBySpecialization: (specialization) => apiClient.get(`/doctors/specialization/${specialization}`),
  update: (id, data) => apiClient.put(`/doctors/${id}`, data)
};

// PATIENTS ENDPOINTS
export const patientsAPI = {
  getAll: () => apiClient.get('/patients'),
  getById: (id) => apiClient.get(`/patients/${id}`),
  update: (id, data) => apiClient.put(`/patients/${id}`, data)
};

// PHARMACISTS ENDPOINTS
export const pharmacistsAPI = {
  getAll: () => apiClient.get('/pharmacists'),
  getById: (id) => apiClient.get(`/pharmacists/${id}`),
  update: (id, data) => apiClient.put(`/pharmacists/${id}`, data)
};

// APPOINTMENTS ENDPOINTS
export const appointmentsAPI = {
  getAll: () => apiClient.get('/appointments'),
  getByPatient: (patientId) => apiClient.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => apiClient.get(`/appointments/doctor/${doctorId}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  cancel: (id) => apiClient.delete(`/appointments/${id}`)
};

// MEDICAL RECORDS ENDPOINTS
export const medicalRecordsAPI = {
  getByPatient: (patientId) => apiClient.get(`/medical-records/patient/${patientId}`),
  create: (data) => apiClient.post('/medical-records', data),
  update: (id, data) => apiClient.put(`/medical-records/${id}`, data)
};

// PRESCRIPTIONS ENDPOINTS
export const prescriptionsAPI = {
  getByPatient: (patientId) => apiClient.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => apiClient.get(`/prescriptions/doctor/${doctorId}`),
  create: (data) => apiClient.post('/prescriptions', data),
  update: (id, data) => apiClient.put(`/prescriptions/${id}`, data)
};

// PAYMENTS ENDPOINTS
export const paymentsAPI = {
  getAll: () => apiClient.get('/payments'),
  getByPatient: (patientId) => apiClient.get(`/payments/patient/${patientId}`),
  create: (data) => apiClient.post('/payments', data),
  update: (id, data) => apiClient.put(`/payments/${id}`, data)
};

// CONSULTATIONS ENDPOINTS
export const consultationsAPI = {
  getAll: () => apiClient.get('/consultations'),
  getByPatient: (patientId) => apiClient.get(`/consultations/patient/${patientId}`),
  getByDoctor: (doctorId) => apiClient.get(`/consultations/doctor/${doctorId}`),
  create: (data) => apiClient.post('/consultations', data),
  update: (id, data) => apiClient.put(`/consultations/${id}`, data)
};

export default apiClient;
