import { useEffect, useMemo, useState } from "react";

const TABS = [
  {
    key: "overview",
    label: "Dashboard & Planning",
    items: [
      { key: "dashboard", label: "Dashboard / Overview" },
      { key: "appointments", label: "Appointment Management" },
      { key: "availability", label: "Availability Settings" }
    ]
  },
  {
    key: "clinical",
    label: "Clinical Care",
    items: [
      { key: "interaction", label: "Patient Interaction" },
      { key: "records", label: "Medical Records" },
      { key: "prescriptions", label: "Prescription Management" }
    ]
  },
  {
    key: "insights",
    label: "Insights & Account",
    items: [
      { key: "reports", label: "Reports" },
      { key: "profile", label: "Profile" },
      { key: "notifications", label: "Notifications" },
    ]
  }
];

const CURRENT_DOCTOR_NAME = "Dr. Michael Chen";

const PATIENTS = [
  { id: "P-01", name: "John Doe", age: 45, history: "Hypertension", lastVisit: "2026-03-15" },
  { id: "P-02", name: "Jane Smith", age: 32, history: "Asthma", lastVisit: "2026-03-21" },
  { id: "P-03", name: "Robert Johnson", age: 58, history: "Diabetes Type 2", lastVisit: "2026-03-19" }
];

const CONSULTATION_LOGS = [
  { date: "2026-03-21", patient: "John Doe", mode: "Video", note: "Blood pressure review" },
  { date: "2026-03-20", patient: "Jane Smith", mode: "Chat", note: "Inhaler dosage advice" },
  { date: "2026-03-19", patient: "Robert Johnson", mode: "Video", note: "Diet and exercise counseling" }
];

const NOTIFICATIONS = [
  "New appointment request from Mia Clark",
  "Patient John Doe sent a new message",
  "Prescription delivered to pharmacist for Jane Smith"
];

const SHARED_DEFAULT_APPOINTMENTS = [
  {
    id: "AP-101",
    doctorName: "Dr. Sarah Johnson",
    patientName: "John Doe",
    specialization: "Cardiology",
    date: "2026-03-25",
    time: "10:00",
    type: "Follow-up",
    status: "Confirmed"
  },
  {
    id: "AP-102",
    doctorName: "Dr. Michael Chen",
    patientName: "John Doe",
    specialization: "Neurology",
    date: "2026-03-28",
    time: "14:30",
    type: "Consultation",
    status: "Requested"
  },
  {
    id: "AP-103",
    doctorName: "Dr. Michael Chen",
    patientName: "Jane Smith",
    specialization: "Neurology",
    date: "2026-03-20",
    time: "11:45",
    type: "Check-up",
    status: "Completed"
  }
];

const SHARED_DEFAULT_PRESCRIPTIONS = [
  {
    id: "RX-301",
    patientName: "John Doe",
    medicine: "Lisinopril 10mg",
    dosage: "Once daily",
    duration: "30 days",
    prescribedBy: "Dr. Sarah Johnson",
    refill: "Needed",
    status: "Active",
    sentTo: "Patient",
    createdAt: "2026-03-15 10:30"
  },
  {
    id: "RX-302",
    patientName: "John Doe",
    medicine: "Metformin 500mg",
    dosage: "Twice daily",
    duration: "60 days",
    prescribedBy: "Dr. Michael Chen",
    refill: "Available",
    status: "Active",
    sentTo: "Patient & Pharmacist",
    createdAt: "2026-03-18 09:20"
  }
];

const STORAGE_KEYS = {
  appointments: "medico.shared.appointments",
  records: "medico.doctor.records",
  prescriptions: "medico.shared.prescriptions",
  availability: "medico.doctor.availability",
  profile: "medico.doctor.profile",
  consultationLogs: "medico.doctor.consultationLogs"
};

const DEFAULT_AVAILABILITY = {
  monday: "09:00 - 17:00",
  tuesday: "09:00 - 17:00",
  wednesday: "09:00 - 15:00",
  thursday: "10:00 - 18:00",
  friday: "09:00 - 14:00",
  saturday: "Closed",
  slotDuration: "30 mins",
  maxSlotsPerHour: "2",
  breakWindow: "13:00 - 14:00"
};

const DEFAULT_PROFILE = {
  fullName: CURRENT_DOCTOR_NAME,
  specialization: "Neurology",
  experience: "12 years",
  email: "michael.chen@hospital.com",
  phone: "+1 555-730-2201",
  department: "Neurology",
  bio: "Focused on neuro care, long-term treatment plans, and tele-consult follow-ups."
};

function readStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function normalizeAppointment(entry) {
  return {
    id: entry.id || `AP-${Date.now()}`,
    doctorName: entry.doctorName || CURRENT_DOCTOR_NAME,
    patientName: entry.patientName || entry.patient || "John Doe",
    specialization: entry.specialization || "General",
    date: entry.date || "2026-03-25",
    time: entry.time || "10:00",
    type: entry.type || "Consultation",
    status: entry.status === "Upcoming" ? "Confirmed" : entry.status || "Requested"
  };
}

function DoctorModule({ currentUsername = "doctor" }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openGroup, setOpenGroup] = useState("overview");
  const [uiNotice, setUiNotice] = useState("");
  const [appointmentRows, setAppointmentRows] = useState(() => {
    const shared = readStorage(STORAGE_KEYS.appointments, SHARED_DEFAULT_APPOINTMENTS);
    return shared.map(normalizeAppointment);
  });
  const [patientSearch, setPatientSearch] = useState("");
  const [recordForm, setRecordForm] = useState({ patientId: "P-01", diagnosis: "", symptoms: "", notes: "" });
  const [medicalRecords, setMedicalRecords] = useState(() => readStorage(STORAGE_KEYS.records, []));
  const [consultationLogs, setConsultationLogs] = useState(() =>
    readStorage(STORAGE_KEYS.consultationLogs, CONSULTATION_LOGS)
  );
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "P-01",
    medicine: "",
    dosage: "",
    duration: "",
    sendToPatient: true,
    sendToPharmacist: true
  });
  const [editingPrescriptionId, setEditingPrescriptionId] = useState("");
  const [prescriptions, setPrescriptions] = useState(() =>
    readStorage(STORAGE_KEYS.prescriptions, SHARED_DEFAULT_PRESCRIPTIONS)
  );
  const [availability, setAvailability] = useState(() => ({
    ...DEFAULT_AVAILABILITY,
    ...readStorage(STORAGE_KEYS.availability, DEFAULT_AVAILABILITY)
  }));
  const [profileForm, setProfileForm] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...readStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  }));
  const [profileDraft, setProfileDraft] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...readStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  }));
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [consultationModal, setConsultationModal] = useState({
    open: false,
    patientName: "",
    mode: "",
    note: ""
  });

  const showNotice = (message) => {
    setUiNotice(message);
    window.setTimeout(() => setUiNotice(""), 2500);
  };

  const activeTabLabel = useMemo(() => {
    const tab = TABS.flatMap((group) => group.items).find((entry) => entry.key === activeTab);
    return tab ? tab.label : "Doctor Dashboard";
  }, [activeTab]);

  const doctorAppointments = useMemo(
    () => appointmentRows.filter((entry) => entry.doctorName === CURRENT_DOCTOR_NAME),
    [appointmentRows]
  );

  const upcomingAppointments = useMemo(
    () => doctorAppointments.filter((entry) => ["Confirmed", "Requested"].includes(entry.status)),
    [doctorAppointments]
  );
  const pastAppointments = useMemo(
    () => doctorAppointments.filter((entry) => ["Completed", "Rejected", "Cancelled"].includes(entry.status)),
    [doctorAppointments]
  );

  const doctorPrescriptions = useMemo(
    () => prescriptions.filter((entry) => entry.prescribedBy === CURRENT_DOCTOR_NAME),
    [prescriptions]
  );

  const filteredPatients = useMemo(() => {
    const query = patientSearch.trim().toLowerCase();
    if (!query) {
      return PATIENTS;
    }

    return PATIENTS.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.history.toLowerCase().includes(query) ||
        String(patient.age).includes(query)
      );
    });
  }, [patientSearch]);

  const nextUpcoming = upcomingAppointments[0];
  const doctorHomeCards = useMemo(
    () => [
      {
        key: "appointments",
        label: "Today's Appointments",
        value: upcomingAppointments.length,
        detail: `${upcomingAppointments.filter((entry) => entry.status === "Confirmed").length} confirmed, ${upcomingAppointments.filter((entry) => entry.status === "Requested").length} pending`
      },
      {
        key: "interaction",
        label: "Total Patients",
        value: PATIENTS.length,
        detail: "Active patients under care"
      },
      {
        key: "records",
        label: "Pending Reviews",
        value: medicalRecords.length,
        detail: "Medical records to review"
      },
      {
        key: "appointments",
        label: "Next Appointment",
        value: nextUpcoming ? `${nextUpcoming.time}` : "-",
        detail: nextUpcoming ? `${nextUpcoming.patientName} - ${nextUpcoming.type}` : "No confirmed appointments"
      }
    ],
    [upcomingAppointments, medicalRecords.length, nextUpcoming]
  );

  const updateAppointmentStatus = (id, nextStatus) => {
    setAppointmentRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: nextStatus } : row))
    );
  };

  const handleRecordChange = (event) => {
    const { name, value } = event.target;
    setRecordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (event) => {
    const { name, value, checked, type } = event.target;
    setPrescriptionForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAvailabilityChange = (event) => {
    const { name, value } = event.target;
    setAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const saveAvailabilitySettings = () => {
    showNotice("Availability settings saved.");
  };

  const startPatientCommunication = (patientName, mode) => {
    setConsultationModal({
      open: true,
      patientName,
      mode,
      note: ""
    });
  };

  const closeConsultationModal = () => {
    setConsultationModal({ open: false, patientName: "", mode: "", note: "" });
  };

  const submitConsultationStart = () => {
    if (!consultationModal.note.trim()) {
      showNotice("Please add consultation reason or notes before starting.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    setConsultationLogs((prev) => [
      {
        date: today,
        patient: consultationModal.patientName,
        mode: consultationModal.mode,
        note: consultationModal.note.trim()
      },
      ...prev
    ]);

    showNotice(`${consultationModal.mode} started with ${consultationModal.patientName}.`);
    closeConsultationModal();
  };

  const handleNotificationsAction = (action) => {
    if (action === "mark-read") {
      showNotice("All notifications marked as read.");
      return;
    }

    showNotice("Messages panel opened.");
  };

  const saveDoctorProfile = () => {
    if (
      !profileDraft.fullName.trim() ||
      !profileDraft.specialization.trim() ||
      !profileDraft.experience.trim() ||
      !profileDraft.email.trim() ||
      !profileDraft.phone.trim() ||
      !profileDraft.department.trim()
    ) {
      showNotice("Please complete all required profile fields.");
      return;
    }

    setProfileForm(profileDraft);
    setIsEditingProfile(false);
    showNotice("Profile updated successfully.");
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profileForm);
    setIsEditingProfile(false);
  };

  const saveMedicalRecord = () => {
    const selectedPatient = PATIENTS.find((patient) => patient.id === recordForm.patientId);
    if (!selectedPatient) {
      return;
    }

    if (!recordForm.diagnosis.trim() && !recordForm.symptoms.trim() && !recordForm.notes.trim()) {
      return;
    }

    setMedicalRecords((prev) => [
      {
        id: `MR-${Date.now()}`,
        patient: selectedPatient.name,
        diagnosis: recordForm.diagnosis.trim() || "Not specified",
        symptoms: recordForm.symptoms.trim() || "Not specified",
        notes: recordForm.notes.trim() || "No notes",
        updatedAt: new Date().toLocaleString()
      },
      ...prev
    ]);

    setRecordForm((prev) => ({ ...prev, diagnosis: "", symptoms: "", notes: "" }));
  };

  const createPrescription = () => {
    const selectedPatient = PATIENTS.find((patient) => patient.id === prescriptionForm.patientId);
    if (!selectedPatient) {
      return;
    }

    if (!prescriptionForm.medicine.trim() || !prescriptionForm.dosage.trim() || !prescriptionForm.duration.trim()) {
      return;
    }

    const payload = {
      patientName: selectedPatient.name,
      medicine: prescriptionForm.medicine.trim(),
      dosage: prescriptionForm.dosage.trim(),
      duration: prescriptionForm.duration.trim(),
      prescribedBy: CURRENT_DOCTOR_NAME,
      refill: "Available",
      status: "Active",
      sentTo: [
        prescriptionForm.sendToPatient ? "Patient" : null,
        prescriptionForm.sendToPharmacist ? "Pharmacist" : null
      ]
        .filter(Boolean)
        .join(" & "),
      createdAt: new Date().toLocaleString()
    };

    if (editingPrescriptionId) {
      setPrescriptions((prev) =>
        prev.map((entry) =>
          entry.id === editingPrescriptionId
            ? { ...entry, ...payload, createdAt: entry.createdAt }
            : entry
        )
      );
    } else {
      setPrescriptions((prev) => [{ id: `RX-${Date.now()}`, ...payload }, ...prev]);
    }

    setPrescriptionForm((prev) => ({
      ...prev,
      medicine: "",
      dosage: "",
      duration: ""
    }));
    setEditingPrescriptionId("");
  };

  const editPrescription = (entry) => {
    const selectedPatient = PATIENTS.find((patient) => patient.name === entry.patientName);
    setEditingPrescriptionId(entry.id);
    setPrescriptionForm({
      patientId: selectedPatient ? selectedPatient.id : "P-01",
      medicine: entry.medicine,
      dosage: entry.dosage,
      duration: entry.duration,
      sendToPatient: entry.sentTo.includes("Patient"),
      sendToPharmacist: entry.sentTo.includes("Pharmacist")
    });
    setActiveTab("prescriptions");
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointmentRows));
  }, [appointmentRows]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.prescriptions, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.availability, JSON.stringify(availability));
  }, [availability]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileForm));
  }, [profileForm]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.consultationLogs, JSON.stringify(consultationLogs));
  }, [consultationLogs]);

  return (
    <section className="doctor-erp-shell">
      <aside className="doctor-left-panel">
        <h2>Doctor Portal</h2>
        <p>ERP Navigation</p>
        <nav className="erp-side-nav doctor-erp-side-nav">
          {TABS.map((group) => (
            <div key={group.key} className="erp-nav-group doctor-erp-nav-group">
              <button
                type="button"
                className="erp-group-btn doctor-erp-group-btn"
                onClick={() => setOpenGroup((prev) => (prev === group.key ? "" : group.key))}
              >
                <span>{group.label}</span>
                <span aria-hidden="true">{openGroup === group.key ? "▼" : "▶"}</span>
              </button>

              {openGroup === group.key ? (
                <div className="erp-group-items doctor-erp-group-items">
                  {group.items.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={activeTab === tab.key ? "active" : ""}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <div className="doctor-main-area">
        <header className="doctor-header">
          <h2>{activeTabLabel}</h2>
          <p className="dashboard-subtitle">Manage appointments, patient care, records, prescriptions, and communication.</p>
          <p className="dashboard-userline">Signed in as: {currentUsername}</p>
        </header>

        {uiNotice ? <p className="doctor-notice">{uiNotice}</p> : null}

        {activeTab !== "dashboard" ? (
          <div className="erp-stats-grid doctor-stats">
            <article className="erp-stat-card">
              <h4>Today's Appointments</h4>
              <p>{upcomingAppointments.length}</p>
              <span>Including pending requests</span>
            </article>
            <article className="erp-stat-card">
              <h4>Total Patients</h4>
              <p>{PATIENTS.length}</p>
              <span>Active under care</span>
            </article>
            <article className="erp-stat-card">
              <h4>Consultations This Week</h4>
              <p>{consultationLogs.length}</p>
              <span>Video and chat combined</span>
            </article>
            <article className="erp-stat-card">
              <h4>Pending Notifications</h4>
              <p>{NOTIFICATIONS.length}</p>
              <span>Needs your attention</span>
            </article>
          </div>
        ) : null}

        {activeTab === "dashboard" ? (
          <section className="erp-panel patient-home-panel">
            <h3 className="patient-welcome">Welcome {profileForm.fullName}</h3>

            <div className="patient-home-grid">
              {doctorHomeCards.map((card) => (
                <button
                  key={`${card.key}-${card.label}`}
                  type="button"
                  className="patient-home-card"
                  onClick={() => setActiveTab(card.key)}
                >
                  <div className="patient-card-content">
                    <p className="patient-card-label">{card.label}</p>
                    <p className="patient-card-value">{card.value}</p>
                    <p className="patient-card-detail">{card.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "appointments" ? (
          <section className="erp-panel">
            <h3>Appointment Management</h3>
            <p>View upcoming and past appointments and handle requests.</p>

            <div className="doctor-split-grid">
              <article className="quick-section">
                <h4>Upcoming Appointments</h4>
                <div className="table-wrap">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((row) => (
                        <tr key={row.id}>
                          <td>{row.date}</td>
                          <td>{row.time}</td>
                          <td>{row.patientName}</td>
                          <td>{row.type}</td>
                          <td>{row.status}</td>
                          <td>
                            {row.status === "Requested" ? (
                              <div className="table-actions">
                                <button type="button" onClick={() => updateAppointmentStatus(row.id, "Confirmed")}>
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() => updateAppointmentStatus(row.id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => updateAppointmentStatus(row.id, "Completed")}>
                                Mark Done
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="quick-section">
                <h4>Past / History</h4>
                <div className="table-wrap">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastAppointments.map((row) => (
                        <tr key={row.id}>
                          <td>{row.date}</td>
                          <td>{row.time}</td>
                          <td>{row.patientName}</td>
                          <td>{row.type}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>

          </section>
        ) : null}

        {activeTab === "availability" ? (
          <section className="erp-panel">
            <h3>Availability Settings</h3>
            <p>Set working hours and manage consultation slots.</p>

            <div className="quick-section">
              <h4>Set Working Hours</h4>
              <div className="erp-form-grid">
                <label>
                  Monday
                  <input name="monday" value={availability.monday} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Tuesday
                  <input name="tuesday" value={availability.tuesday} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Wednesday
                  <input name="wednesday" value={availability.wednesday} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Thursday
                  <input name="thursday" value={availability.thursday} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Friday
                  <input name="friday" value={availability.friday} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Saturday
                  <input name="saturday" value={availability.saturday} onChange={handleAvailabilityChange} />
                </label>
              </div>
            </div>

            <div className="quick-section">
              <h4>Manage Slots</h4>
              <div className="erp-form-grid">
                <label>
                  Slot Duration
                  <input name="slotDuration" value={availability.slotDuration} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Max Slots Per Hour
                  <input name="maxSlotsPerHour" value={availability.maxSlotsPerHour} onChange={handleAvailabilityChange} />
                </label>
                <label>
                  Break Window
                  <input name="breakWindow" value={availability.breakWindow} onChange={handleAvailabilityChange} />
                </label>
              </div>
            </div>

            <button className="erp-primary-btn" type="button" onClick={saveAvailabilitySettings}>
              Save Availability Settings
            </button>
          </section>
        ) : null}

        {activeTab === "interaction" ? (
          <section className="erp-panel">
            <h3>Patient Interaction</h3>
            <p>View patient details, run virtual consultations, and communicate with patients.</p>

            <div className="users-heading-row">
              <h4>Patients</h4>
              <input
                type="text"
                placeholder="Search by patient name, history, age"
                value={patientSearch}
                onChange={(event) => setPatientSearch(event.target.value)}
              />
            </div>

            <div className="doctor-cards-grid">
              {filteredPatients.map((patient) => (
                <article key={patient.id} className="doctor-card">
                  <h4>{patient.name}</h4>
                  <p>Age: {patient.age}</p>
                  <p>History: {patient.history}</p>
                  <p>Last visit: {patient.lastVisit}</p>
                  <div className="table-actions">
                    <button type="button" onClick={() => startPatientCommunication(patient.name, "Video consultation")}>
                      Start Video Consultation
                    </button>
                    <button type="button" onClick={() => startPatientCommunication(patient.name, "Chat")}>
                      Open Chat
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "records" ? (
          <section className="erp-panel">
            <h3>Medical Records Management</h3>
            <p>Access and update diagnosis, symptoms, and notes for each patient.</p>

            <div className="erp-form-grid">
              <label>
                Select Patient
                <select name="patientId" value={recordForm.patientId} onChange={handleRecordChange}>
                  {PATIENTS.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Diagnosis
                <input
                  name="diagnosis"
                  value={recordForm.diagnosis}
                  onChange={handleRecordChange}
                  placeholder="Type diagnosis"
                />
              </label>
              <label>
                Symptoms
                <input
                  name="symptoms"
                  value={recordForm.symptoms}
                  onChange={handleRecordChange}
                  placeholder="Type symptoms"
                />
              </label>
            </div>
            <label className="doctor-notes-label">
              Notes
              <textarea
                name="notes"
                value={recordForm.notes}
                onChange={handleRecordChange}
                placeholder="Add consultation notes"
              />
            </label>
            <button className="erp-primary-btn" type="button" onClick={saveMedicalRecord}>
              Update Patient Record
            </button>

            <div className="quick-section">
              <h4>Saved Record Updates</h4>
              <div className="table-wrap">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Updated At</th>
                      <th>Patient</th>
                      <th>Diagnosis</th>
                      <th>Symptoms</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecords.length > 0 ? (
                      medicalRecords.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.updatedAt}</td>
                          <td>{entry.patient}</td>
                          <td>{entry.diagnosis}</td>
                          <td>{entry.symptoms}</td>
                          <td>{entry.notes}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No record updates saved yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "prescriptions" ? (
          <section className="erp-panel">
            <h3>Prescription Management</h3>
            <p>Create digital prescriptions and send to patient and pharmacist.</p>

            <div className="erp-form-grid">
              <label>
                Patient
                <select name="patientId" value={prescriptionForm.patientId} onChange={handlePrescriptionChange}>
                  {PATIENTS.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Medicine
                <input
                  name="medicine"
                  value={prescriptionForm.medicine}
                  onChange={handlePrescriptionChange}
                  placeholder="Medicine name"
                />
              </label>
              <label>
                Dosage
                <input
                  name="dosage"
                  value={prescriptionForm.dosage}
                  onChange={handlePrescriptionChange}
                  placeholder="e.g. Once daily"
                />
              </label>
              <label>
                Duration
                <input
                  name="duration"
                  value={prescriptionForm.duration}
                  onChange={handlePrescriptionChange}
                  placeholder="e.g. 30 days"
                />
              </label>
            </div>

            <div className="feature-grid doctor-send-grid">
              <label>
                <input
                  name="sendToPatient"
                  type="checkbox"
                  checked={prescriptionForm.sendToPatient}
                  onChange={handlePrescriptionChange}
                />
                Send to Patient
              </label>
              <label>
                <input
                  name="sendToPharmacist"
                  type="checkbox"
                  checked={prescriptionForm.sendToPharmacist}
                  onChange={handlePrescriptionChange}
                />
                Send to Pharmacist
              </label>
            </div>

            <button className="erp-primary-btn" type="button" onClick={createPrescription}>
              {editingPrescriptionId ? "Save Prescription Changes" : "Create and Send Prescription"}
            </button>

            <div className="quick-section">
              <h4>Saved Prescriptions</h4>
              <div className="table-wrap">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Created At</th>
                      <th>Patient</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Sent To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorPrescriptions.length > 0 ? (
                      doctorPrescriptions.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.createdAt}</td>
                          <td>{entry.patientName}</td>
                          <td>{entry.medicine}</td>
                          <td>{entry.dosage}</td>
                          <td>{entry.duration}</td>
                          <td>{entry.sentTo || "Not selected"}</td>
                          <td>
                            <button type="button" onClick={() => editPrescription(entry)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No prescriptions saved yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "reports" ? (
          <section className="erp-panel">
            <h3>Reports & Tracking</h3>
            <p>Track patients handled, consultation history, and treatment records.</p>

            <div className="erp-stats-grid doctor-stats-3">
              <article className="erp-stat-card">
                <h4>Patients Handled (Month)</h4>
                <p>94</p>
                <span>+11% from last month</span>
              </article>
              <article className="erp-stat-card">
                <h4>Total Consultations</h4>
                <p>212</p>
                <span>Video + chat combined</span>
              </article>
              <article className="erp-stat-card">
                <h4>Ongoing Treatments</h4>
                <p>38</p>
                <span>Currently monitored</span>
              </article>
            </div>

            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Consultation Mode</th>
                    <th>Treatment Note</th>
                  </tr>
                </thead>
                <tbody>
                  {consultationLogs.map((row) => (
                    <tr key={`${row.date}-${row.patient}`}>
                      <td>{row.date}</td>
                      <td>{row.patient}</td>
                      <td>{row.mode}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {activeTab === "notifications" ? (
          <section className="erp-panel">
            <h3>Notifications</h3>
            <p>Get alerts for appointments and patient messages.</p>
            <ul className="alert-list">
              {NOTIFICATIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="inline-actions">
              <button type="button" onClick={() => handleNotificationsAction("mark-read")}>
                Mark All as Read
              </button>
              <button type="button" onClick={() => handleNotificationsAction("open-messages")}>
                Open Messages
              </button>
            </div>
          </section>
        ) : null}

        {activeTab === "profile" ? (
          <section className="erp-panel">
            <h3>Profile</h3>
            <p>View and manage professional profile details.</p>

            {!isEditingProfile ? (
              <>
                <div className="erp-form-grid">
                  <label>
                    Full Name
                    <input name="fullName" value={profileForm.fullName} readOnly />
                  </label>
                  <label>
                    Specialization
                    <input name="specialization" value={profileForm.specialization} readOnly />
                  </label>
                  <label>
                    Experience
                    <input name="experience" value={profileForm.experience} readOnly />
                  </label>
                  <label>
                    Email
                    <input name="email" value={profileForm.email} readOnly />
                  </label>
                  <label>
                    Phone
                    <input name="phone" value={profileForm.phone} readOnly />
                  </label>
                  <label>
                    Department
                    <input name="department" value={profileForm.department} readOnly />
                  </label>
                  <label style={{ gridColumn: "1 / -1" }}>
                    Bio
                    <input name="bio" value={profileForm.bio} readOnly />
                  </label>
                </div>

                <button className="erp-primary-btn" type="button" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="erp-form-grid">
                  <label>
                    Full Name
                    <input name="fullName" value={profileDraft.fullName} onChange={handleProfileChange} />
                  </label>
                  <label>
                    Specialization
                    <input name="specialization" value={profileDraft.specialization} onChange={handleProfileChange} />
                  </label>
                  <label>
                    Experience
                    <input name="experience" value={profileDraft.experience} onChange={handleProfileChange} />
                  </label>
                  <label>
                    Email
                    <input name="email" value={profileDraft.email} onChange={handleProfileChange} />
                  </label>
                  <label>
                    Phone
                    <input name="phone" value={profileDraft.phone} onChange={handleProfileChange} />
                  </label>
                  <label>
                    Department
                    <input name="department" value={profileDraft.department} onChange={handleProfileChange} />
                  </label>
                  <label style={{ gridColumn: "1 / -1" }}>
                    Bio
                    <input name="bio" value={profileDraft.bio} onChange={handleProfileChange} />
                  </label>
                </div>

                <div className="inline-actions">
                  <button type="button" onClick={cancelProfileEdit}>Cancel</button>
                  <button className="erp-primary-btn" type="button" onClick={saveDoctorProfile}>
                    Save Profile
                  </button>
                </div>
              </>
            )}
          </section>
        ) : null}
      </div>

      {consultationModal.open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Start {consultationModal.mode}</h3>
            <p>
              Patient: <strong>{consultationModal.patientName}</strong>
            </p>

            <label className="doctor-notes-label">
              Consultation Reason / Notes
              <textarea
                value={consultationModal.note}
                onChange={(event) =>
                  setConsultationModal((prev) => ({ ...prev, note: event.target.value }))
                }
                placeholder="Add reason for starting this consultation"
              />
            </label>

            <div className="modal-actions">
              <button type="button" onClick={closeConsultationModal}>Cancel</button>
              <button className="erp-primary-btn" type="button" onClick={submitConsultationStart}>
                Start Session
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default DoctorModule;
