export const UserRole = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  PHARMACIST: 'pharmacist'
};

export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PrescriptionStatus = {
  PENDING: 'pending',
  DISPENSED: 'dispensed',
  COMPLETED: 'completed'
};

export const MedicalRecordType = {
  CONSULTATION: 'consultation',
  DIAGNOSIS: 'diagnosis',
  TREATMENT: 'treatment',
  NOTE: 'note'
};

export const LabReportStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REVIEWED: 'reviewed'
};
