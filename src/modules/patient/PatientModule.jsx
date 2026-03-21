import { useEffect, useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    key: "care-access",
    label: "Care Access",
    items: [
      { key: "home", label: "Home" },
      { key: "doctor-search", label: "Doctor Search" },
      { key: "appointment-booking", label: "Appointment Booking" },
      { key: "virtual-consultation", label: "Virtual Consultation" }
    ]
  },
  {
    key: "records-finance",
    label: "Records & Finance",
    items: [
      { key: "medical-records", label: "Medical Records" },
      { key: "prescription-medicines", label: "Prescription & Medicines" },
      { key: "payment-management", label: "Payment Management" }
    ]
  },
  {
    key: "account",
    label: "Account",
    items: [
      { key: "notifications", label: "Notifications" },
      { key: "profile-management", label: "Profile Management" }
    ]
  }
];

const DOCTORS = [
  { id: "D-1", name: "Dr. Sarah Johnson", specialization: "Cardiology", availability: "Morning", experience: 11, rating: 4.8 },
  { id: "D-2", name: "Dr. Michael Chen", specialization: "Neurology", availability: "Afternoon", experience: 12, rating: 4.7 },
  { id: "D-3", name: "Dr. Lisa Wong", specialization: "Pediatrics", availability: "Morning", experience: 9, rating: 4.6 },
  { id: "D-4", name: "Dr. James Smith", specialization: "Orthopedics", availability: "Evening", experience: 14, rating: 4.5 }
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
  }
];

const MEDICAL_HISTORY = [
  {
    id: "MR-201",
    title: "Hypertension Follow-up",
    diagnosis: "Blood pressure within control range",
    prescriptions: "Lisinopril 10mg",
    doctor: "Dr. Sarah Johnson",
    date: "2026-03-15"
  },
  {
    id: "MR-202",
    title: "Annual Blood Work",
    diagnosis: "Mild cholesterol elevation",
    prescriptions: "Atorvastatin 40mg",
    doctor: "Dr. Sarah Johnson",
    date: "2026-02-10"
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

const INITIAL_INVOICES = [
  { id: "INV-401", item: "Consultation - Cardiology", amount: 45, status: "Pending" },
  { id: "INV-402", item: "Medicine Order", amount: 28, status: "Pending" }
];

const STORAGE_KEYS = {
  appointments: "medico.shared.appointments",
  profile: "medico.patient.profile",
  payments: "medico.patient.payments",
  invoices: "medico.patient.invoices",
  prescriptions: "medico.shared.prescriptions"
};

function getStored(key, fallbackValue) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      return fallbackValue;
    }
    const parsed = JSON.parse(saved);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function normalizeAppointment(entry) {
  return {
    id: entry.id || `AP-${Date.now()}`,
    doctorName: entry.doctorName || "Unknown Doctor",
    patientName: entry.patientName || "John Doe",
    specialization: entry.specialization || "General",
    date: entry.date || "2026-03-25",
    time: entry.time || "10:00",
    type: entry.type || "Consultation",
    status: entry.status === "Upcoming" ? "Confirmed" : entry.status || "Requested"
  };
}

function PatientModule() {
  const [activeMenu, setActiveMenu] = useState("home");
  const [openGroup, setOpenGroup] = useState("care-access");
  const [doctorSearch, setDoctorSearch] = useState({ text: "", specialization: "All", availability: "All" });

  const [appointments, setAppointments] = useState(() =>
    getStored(STORAGE_KEYS.appointments, SHARED_DEFAULT_APPOINTMENTS).map(normalizeAppointment)
  );
  const [bookingForm, setBookingForm] = useState({ doctorId: "D-1", date: "", time: "" });

  const [rescheduleId, setRescheduleId] = useState("");
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "" });

  const [consultSymptoms, setConsultSymptoms] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const [prescriptions, setPrescriptions] = useState(() =>
    getStored(STORAGE_KEYS.prescriptions, SHARED_DEFAULT_PRESCRIPTIONS)
  );

  const [invoices, setInvoices] = useState(() => getStored(STORAGE_KEYS.invoices, INITIAL_INVOICES));
  const [payments, setPayments] = useState(() => getStored(STORAGE_KEYS.payments, []));

  const [profile, setProfile] = useState(() =>
    getStored(STORAGE_KEYS.profile, {
      name: "John Doe",
      phone: "+1 555-881-021",
      email: "john.doe@email.com",
      bloodGroup: "O+",
      allergyInfo: "No known drug allergies"
    })
  );

  const currentPatientName = profile.name.trim() || "John Doe";

  const menuTitle = useMemo(() => {
    const item = MENU_GROUPS.flatMap((group) => group.items).find((entry) => entry.key === activeMenu);
    return item ? item.label : "Patient Dashboard";
  }, [activeMenu]);

  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.text.trim().toLowerCase();
    return DOCTORS.filter((doctor) => {
      const byText =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query);
      const bySpecialization =
        doctorSearch.specialization === "All" || doctor.specialization === doctorSearch.specialization;
      const byAvailability =
        doctorSearch.availability === "All" || doctor.availability === doctorSearch.availability;

      return byText && bySpecialization && byAvailability;
    });
  }, [doctorSearch]);

  const patientAppointments = useMemo(
    () => appointments.filter((entry) => entry.patientName === currentPatientName),
    [appointments, currentPatientName]
  );

  const upcomingAppointments = useMemo(
    () => patientAppointments.filter((entry) => entry.status === "Confirmed"),
    [patientAppointments]
  );

  const notifications = useMemo(() => {
    const appointmentAlerts = patientAppointments.map(
      (entry) => `Appointment ${entry.status.toLowerCase()} with ${entry.doctorName} on ${entry.date} ${entry.time}`
    );
    const prescriptionAlerts = prescriptions
      .filter((entry) => entry.patientName === currentPatientName)
      .map((entry) => `Prescription update: ${entry.medicine} (${entry.refill} refill)`);
    const paymentAlerts = payments.map(
      (entry) => `Payment success: $${entry.amount} for ${entry.item}`
    );

    return [...appointmentAlerts, ...prescriptionAlerts, ...paymentAlerts].slice(0, 10);
  }, [patientAppointments, prescriptions, payments, currentPatientName]);

  const pendingInvoices = useMemo(() => invoices.filter((entry) => entry.status === "Pending"), [invoices]);

  const patientPrescriptions = useMemo(
    () => prescriptions.filter((entry) => entry.patientName === currentPatientName),
    [prescriptions, currentPatientName]
  );

  const activePrescriptions = useMemo(
    () => patientPrescriptions.filter((entry) => entry.status === "Active"),
    [patientPrescriptions]
  );

  const homeCards = useMemo(
    () => [
      {
        key: "appointment-booking",
        label: "Upcoming Appointments",
        value: upcomingAppointments.length,
        detail: "Next: March 25, 2026",
        iconClass: "blue"
      },
      {
        key: "prescription-medicines",
        label: "Active Prescriptions",
        value: activePrescriptions.length,
        detail: "1 refill needed",
        iconClass: "cyan"
      },
      {
        key: "medical-records",
        label: "Medical Records",
        value: MEDICAL_HISTORY.length,
        detail: "Last updated today",
        iconClass: "green"
      },
      {
        key: "payment-management",
        label: "Health Score",
        value: "85%",
        detail: "Good condition",
        iconClass: "violet"
      }
    ],
    [upcomingAppointments.length, activePrescriptions.length]
  );

  const handleDoctorSearch = (event) => {
    const { name, value } = event.target;
    setDoctorSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingField = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const bookAppointment = () => {
    if (!bookingForm.date || !bookingForm.time) {
      return;
    }

    const doctor = DOCTORS.find((entry) => entry.id === bookingForm.doctorId);
    if (!doctor) {
      return;
    }

    setAppointments((prev) => [
      {
        id: `AP-${Date.now()}`,
        doctorName: doctor.name,
        patientName: currentPatientName,
        specialization: doctor.specialization,
        date: bookingForm.date,
        time: bookingForm.time,
        type: "Consultation",
        status: "Requested"
      },
      ...prev
    ]);
    setBookingForm((prev) => ({ ...prev, date: "", time: "" }));
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status: "Cancelled" } : entry)));
  };

  const startReschedule = (appointment) => {
    setRescheduleId(appointment.id);
    setRescheduleForm({ date: appointment.date, time: appointment.time });
  };

  const submitReschedule = () => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      return;
    }

    setAppointments((prev) =>
      prev.map((entry) =>
        entry.id === rescheduleId
          ? { ...entry, date: rescheduleForm.date, time: rescheduleForm.time, status: "Requested" }
          : entry
      )
    );
    setRescheduleId("");
  };

  const joinConsultation = (appointment, mode) => {
    if (!consultSymptoms.trim()) {
      return;
    }

    setChatLog((prev) => [
      {
        id: `MSG-${Date.now()}`,
        message: `Sent symptoms to ${appointment.doctorName} via ${mode}: ${consultSymptoms.trim()}`
      },
      ...prev
    ]);
    setConsultSymptoms("");
  };

  const sendToPharmacist = (id) => {
    setPrescriptions((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, sentTo: "Pharmacist", refill: "Sent to pharmacist" } : entry))
    );
  };

  const orderMedicine = (prescription) => {
    setInvoices((prev) => [
      {
        id: `INV-${Date.now()}`,
        item: `Medicine Order - ${prescription.medicine}`,
        amount: 22,
        status: "Pending"
      },
      ...prev
    ]);
  };

  const payInvoice = (invoice) => {
    setInvoices((prev) =>
      prev.map((entry) => (entry.id === invoice.id ? { ...entry, status: "Paid" } : entry))
    );
    setPayments((prev) => [
      {
        id: `PAY-${Date.now()}`,
        item: invoice.item,
        amount: invoice.amount,
        paidAt: new Date().toLocaleString()
      },
      ...prev
    ]);
  };

  const handleProfileField = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.prescriptions, JSON.stringify(prescriptions));
  }, [prescriptions]);

  const renderSection = () => {
    if (activeMenu === "home") {
      return (
        <section className="erp-panel patient-home-panel">
          <h3 className="patient-welcome">Welcome {currentPatientName}</h3>
          <div className="patient-home-grid">
            {homeCards.map((card) => (
              <button
                key={card.key}
                type="button"
                className="patient-home-card"
                onClick={() => setActiveMenu(card.key)}
              >
                <div className="patient-card-icon-wrapper">
                  <span className={`patient-home-icon-small ${card.iconClass}`} aria-hidden="true">
                    ?
                  </span>
                </div>
                <div className="patient-card-content">
                  <p className="patient-card-label">{card.label}</p>
                  <p className="patient-card-value">{card.value}</p>
                  <p className="patient-card-detail">{card.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (activeMenu === "doctor-search") {
      return (
        <section className="erp-panel">
          <h3>Doctor Search</h3>
          <p>Search doctors by name, specialization, and availability.</p>

          <div className="erp-form-grid">
            <label>
              Name / Specialization
              <input
                name="text"
                value={doctorSearch.text}
                onChange={handleDoctorSearch}
                placeholder="Search doctor"
              />
            </label>
            <label>
              Specialization
              <select name="specialization" value={doctorSearch.specialization} onChange={handleDoctorSearch}>
                <option value="All">All</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </label>
            <label>
              Availability
              <select name="availability" value={doctorSearch.availability} onChange={handleDoctorSearch}>
                <option value="All">All</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </label>
          </div>

          <div className="patient-cards-grid">
            {filteredDoctors.map((doctor) => (
              <article key={doctor.id} className="patient-card">
                <h4>{doctor.name}</h4>
                <p>Specialization: {doctor.specialization}</p>
                <p>Availability: {doctor.availability}</p>
                <p>Experience: {doctor.experience} years</p>
                <p>Rating: {doctor.rating} / 5</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeMenu === "appointment-booking") {
      return (
        <section className="erp-panel">
          <h3>Appointment Booking</h3>
          <p>Book appointments, view upcoming schedule, cancel or reschedule.</p>

          <div className="quick-section">
            <h4>Book New Appointment</h4>
            <div className="erp-form-grid">
              <label>
                Doctor
                <select name="doctorId" value={bookingForm.doctorId} onChange={handleBookingField}>
                  {DOCTORS.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input type="date" name="date" value={bookingForm.date} onChange={handleBookingField} />
              </label>
              <label>
                Time Slot
                <input type="time" name="time" value={bookingForm.time} onChange={handleBookingField} />
              </label>
            </div>
            <button className="erp-primary-btn" type="button" onClick={bookAppointment}>
              Book Appointment
            </button>
          </div>

          <div className="quick-section">
            <h4>My Appointments</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.doctorName}</td>
                      <td>{entry.specialization}</td>
                      <td>{entry.date}</td>
                      <td>{entry.time}</td>
                      <td>{entry.status}</td>
                      <td>
                        {entry.status === "Confirmed" || entry.status === "Requested" ? (
                          <div className="table-actions">
                            <button type="button" onClick={() => startReschedule(entry)}>
                              Reschedule
                            </button>
                            <button type="button" className="danger" onClick={() => cancelAppointment(entry.id)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

    if (activeMenu === "virtual-consultation") {
      return (
        <section className="erp-panel">
          <h3>Virtual Consultation</h3>
          <p>Join video/chat consultation and communicate symptoms.</p>

          <label className="doctor-notes-label">
            Symptoms / Message to Doctor
            <textarea
              value={consultSymptoms}
              onChange={(event) => setConsultSymptoms(event.target.value)}
              placeholder="Describe your current symptoms"
            />
          </label>

          <div className="patient-cards-grid">
            {upcomingAppointments.map((entry) => (
              <article key={entry.id} className="patient-card">
                <h4>{entry.doctorName}</h4>
                <p>
                  {entry.date} at {entry.time}
                </p>
                <div className="table-actions">
                  <button type="button" onClick={() => joinConsultation(entry, "Video")}>Join Video</button>
                  <button type="button" onClick={() => joinConsultation(entry, "Chat")}>Join Chat</button>
                </div>
              </article>
            ))}
          </div>

          <div className="quick-section">
            <h4>Communication Log</h4>
            <ul className="alert-list">
              {chatLog.length > 0 ? chatLog.map((entry) => <li key={entry.id}>{entry.message}</li>) : <li>No messages sent yet.</li>}
            </ul>
          </div>
        </section>
      );
    }

    if (activeMenu === "medical-records") {
      return (
        <section className="erp-panel">
          <h3>Medical Records</h3>
          <p>View diagnoses, prescriptions, and report history.</p>

          <div className="quick-section">
            <h4>Personal Medical History</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Record</th>
                    <th>Diagnosis</th>
                    <th>Prescriptions</th>
                    <th>Doctor</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {MEDICAL_HISTORY.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>{entry.title}</td>
                      <td>{entry.diagnosis}</td>
                      <td>{entry.prescriptions}</td>
                      <td>{entry.doctor}</td>
                      <td>
                        <button type="button">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

    if (activeMenu === "prescription-medicines") {
      return (
        <section className="erp-panel">
          <h3>Prescription & Medicines</h3>
          <p>Receive prescriptions, send to pharmacist, and order medicines.</p>
          <div className="table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                  <th>Prescribed By</th>
                  <th>Refill</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientPrescriptions.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.medicine}</td>
                    <td>{entry.dosage}</td>
                    <td>{entry.duration}</td>
                    <td>{entry.prescribedBy}</td>
                    <td>{entry.refill}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => sendToPharmacist(entry.id)}>
                          Send to Pharmacist
                        </button>
                        <button type="button" onClick={() => orderMedicine(entry)}>Order Medicine</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeMenu === "payment-management") {
      return (
        <section className="erp-panel">
          <h3>Payment Management</h3>
          <p>Make payments for consultations/medicines and view payment history.</p>

          <div className="quick-section">
            <h4>Pending Payments</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvoices.length > 0 ? (
                    pendingInvoices.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.item}</td>
                        <td>${entry.amount}</td>
                        <td>{entry.status}</td>
                        <td>
                          <button className="erp-primary-btn" type="button" onClick={() => payInvoice(entry)}>
                            Pay Now
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No pending invoices.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="quick-section">
            <h4>Payment History</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Paid At</th>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.paidAt}</td>
                        <td>{entry.item}</td>
                        <td>${entry.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No payments made yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

    if (activeMenu === "notifications") {
      return (
        <section className="erp-panel">
          <h3>Notifications</h3>
          <p>Get alerts for appointments, prescriptions, and payments.</p>
          <ul className="alert-list">
            {notifications.length > 0 ? notifications.map((entry) => <li key={entry}>{entry}</li>) : <li>No notifications yet.</li>}
          </ul>
        </section>
      );
    }

    return (
      <section className="erp-panel">
        <h3>Profile Management</h3>
        <p>Update your name, contact info, and optional medical details.</p>

        <div className="erp-form-grid">
          <label>
            Name
            <input name="name" value={profile.name} onChange={handleProfileField} />
          </label>
          <label>
            Phone
            <input name="phone" value={profile.phone} onChange={handleProfileField} />
          </label>
          <label>
            Email
            <input name="email" value={profile.email} onChange={handleProfileField} />
          </label>
          <label>
            Blood Group
            <input name="bloodGroup" value={profile.bloodGroup} onChange={handleProfileField} />
          </label>
          <label>
            Medical Info (optional)
            <input name="allergyInfo" value={profile.allergyInfo} onChange={handleProfileField} />
          </label>
        </div>

        <button className="erp-primary-btn" type="button">Update Profile</button>
      </section>
    );
  };

  return (
    <section className="patient-erp-shell">
      <aside className="patient-left-panel">
        <h2>Patient Portal</h2>
        <p>ERP Navigation</p>
        <div className="role-card">
          <strong>Role: Patient</strong>
          <span>Access level: Care and appointments</span>
        </div>

        <nav className="erp-side-nav">
          {MENU_GROUPS.map((group) => (
            <div key={group.key} className="erp-nav-group">
              <button
                type="button"
                className="erp-group-btn"
                onClick={() => setOpenGroup((prev) => (prev === group.key ? "" : group.key))}
              >
                <span>{group.label}</span>
                <span>{openGroup === group.key ? "?" : "?"}</span>
              </button>

              {openGroup === group.key ? (
                <div className="erp-group-items">
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={activeMenu === item.key ? "active" : ""}
                      onClick={() => setActiveMenu(item.key)}
                    >
                      � {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <div className="patient-main-area">
        <header className="doctor-header">
          <h2>{menuTitle}</h2>
          <p>Manage appointments, records, prescriptions, and payments.</p>
        </header>

        {activeMenu !== "home" ? (
          <div className="erp-stats-grid patient-stats">
            <article className="erp-stat-card">
              <h4>Upcoming Appointments</h4>
              <p>{upcomingAppointments.length}</p>
              <span>Next care sessions</span>
            </article>
            <article className="erp-stat-card">
              <h4>Active Prescriptions</h4>
              <p>{activePrescriptions.length}</p>
              <span>Ongoing medications</span>
            </article>
            <article className="erp-stat-card">
              <h4>Pending Payments</h4>
              <p>{pendingInvoices.length}</p>
              <span>Awaiting payment</span>
            </article>
            <article className="erp-stat-card">
              <h4>Notifications</h4>
              <p>{notifications.length}</p>
              <span>Recent alerts</span>
            </article>
          </div>
        ) : null}

        {renderSection()}
      </div>

      {rescheduleId ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card delete-modal">
            <h3>Reschedule Appointment</h3>
            <p>Pick a new date and time slot.</p>

            <label>
              Date
              <input
                type="date"
                value={rescheduleForm.date}
                onChange={(event) => setRescheduleForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </label>

            <label>
              Time
              <input
                type="time"
                value={rescheduleForm.time}
                onChange={(event) => setRescheduleForm((prev) => ({ ...prev, time: event.target.value }))}
              />
            </label>

            <div className="modal-actions">
              <button type="button" onClick={() => setRescheduleId("")}>Cancel</button>
              <button className="erp-primary-btn" type="button" onClick={submitReschedule}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default PatientModule;
