import { useEffect, useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    key: "doctor-search-main",
    label: "Doctor Search",
    mainMenu: "doctor-search",
    items: [
      {
        key: "doctor-search-specialization",
        label: "Specialization",
        targetMenu: "doctor-search"
      },
      {
        key: "doctor-search-name",
        label: "Name",
        targetMenu: "doctor-search"
      },
      {
        key: "doctor-search-availability",
        label: "Availability",
        targetMenu: "doctor-search",
      },
      {
        key: "doctor-profiles",
        label: "View doctor profiles",
        targetMenu: "doctor-search",
        children: ["Experience", "Ratings"]
      }
    ]
  },
  {
    key: "appointment-booking-main",
    label: "Appointment Booking",
    mainMenu: "appointment-booking",
    items: [
      { key: "book-appointments", label: "Book appointments with doctors", targetMenu: "appointment-booking" },
      { key: "select-slot", label: "Select date & time slot", targetMenu: "appointment-booking" },
      { key: "upcoming-appointments", label: "View upcoming appointments", targetMenu: "appointment-booking" },
      { key: "cancel-reschedule", label: "Cancel/reschedule appointments", targetMenu: "appointment-booking" }
    ]
  },
  {
    key: "virtual-consultation-main",
    label: "Virtual Consultation",
    mainMenu: "virtual-consultation",
    items: [
      { key: "join-consultation", label: "Join online consultation (video/chat)", targetMenu: "virtual-consultation" },
      { key: "communicate-symptoms", label: "Communicate symptoms to doctor", targetMenu: "virtual-consultation" }
    ]
  },
  {
    key: "medical-records-main",
    label: "Medical Records",
    mainMenu: "medical-records",
    items: [
      { key: "view-history", label: "View personal medical history", targetMenu: "medical-records" },
      {
        key: "access-records",
        label: "Access",
        targetMenu: "medical-records",
        children: ["Diagnoses", "Prescriptions"]
      },
      { key: "download-reports", label: "Download reports", targetMenu: "medical-records" }
    ]
  },
  {
    key: "prescription-main",
    label: "Prescription & Medicines",
    mainMenu: "prescriptions",
    items: [
      { key: "receive-prescriptions", label: "Receive prescriptions from doctor", targetMenu: "prescriptions" },
      { key: "send-to-pharmacist", label: "Send prescription to pharmacist", targetMenu: "prescriptions" },
      { key: "order-medicines", label: "Order medicines", targetMenu: "prescriptions" }
    ]
  },
  {
    key: "payment-management-main",
    label: "Payment Management",
    mainMenu: "billing",
    items: [
      {
        key: "payment-consultation",
        label: "Consultation",
        targetMenu: "billing",
      },
      {
        key: "payment-medicines",
        label: "Medicines",
        targetMenu: "billing"
      },
      {
        key: "view-payment-history",
        label: "View payment history",
        targetMenu: "payment-history"
      },
      {
        key: "payment-status",
        label: "Payment status",
        targetMenu: "billing"
      }
    ]
  },
  {
    key: "notifications-main",
    label: "Notifications",
    mainMenu: "notifications",
    items: [
      {
        key: "alerts-parent",
        label: "Get alerts for",
        targetMenu: "notifications"
      },
      {
        key: "alert-appointment-confirmation",
        label: "Appointment confirmation",
        targetMenu: "notifications"
      },
      {
        key: "alert-prescription-updates",
        label: "Prescription updates",
        targetMenu: "notifications",
      }
    ]
  },
  {
    key: "profile-management-main",
    label: "Profile Management",
    mainMenu: "edit-profile",
    items: [
      {
        key: "update-details",
        label: "Update personal details",
        targetMenu: "edit-profile"
      }
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

function PatientModule({ currentUsername = "patient" }) {
  const [activeMenu, setActiveMenu] = useState("doctor-search");
  const [activeSubNavKey, setActiveSubNavKey] = useState("");
  const [openGroups, setOpenGroups] = useState({
    "doctor-search-main": true,
    "appointment-booking-main": true,
    "virtual-consultation-main": true,
    "medical-records-main": true,
    "prescription-main": true,
    "payment-management-main": true,
    "notifications-main": true,
    "profile-management-main": true
  });
  const [uiNotice, setUiNotice] = useState("");
  const [doctorSearch, setDoctorSearch] = useState({ name: "", specialization: "All", availability: "All" });

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
  const [profileDraft, setProfileDraft] = useState(profile);
  const [payingInvoiceId, setPayingInvoiceId] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    method: "Card",
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: "",
    city: "",
    country: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const showNotice = (message) => {
    setUiNotice(message);
    window.setTimeout(() => setUiNotice(""), 2500);
  };

  const currentPatientName = profile.name.trim() || "John Doe";

  const menuTitle = useMemo(() => {
    if (activeSubNavKey) {
      const sub = MENU_GROUPS.flatMap((group) => group.items).find((entry) => entry.key === activeSubNavKey);
      if (sub) {
        return sub.label;
      }
    }
    const group = MENU_GROUPS.find((entry) => entry.mainMenu === activeMenu);
    if (group) {
      return group.label;
    }
    const item = MENU_GROUPS.flatMap((entry) => entry.items).find((entry) => entry.targetMenu === activeMenu);
    return item ? item.label : "Patient Dashboard";
  }, [activeMenu, activeSubNavKey]);

  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.name.trim().toLowerCase();
    return DOCTORS.filter((doctor) => {
      const byText =
        !query ||
        doctor.name.toLowerCase().includes(query);
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
        detail: "Next: March 25, 2026"
      },
      {
        key: "prescriptions",
        label: "Active Prescriptions",
        value: activePrescriptions.length,
        detail: "1 refill needed"
      },
      {
        key: "medical-records",
        label: "Medical Records",
        value: MEDICAL_HISTORY.length,
        detail: "Last updated today"
      },
      {
        key: "billing",
        label: "Health Score",
        value: "85%",
        detail: "Good condition"
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

  const payInvoice = (invoice, details) => {
    setInvoices((prev) =>
      prev.map((entry) => (entry.id === invoice.id ? { ...entry, status: "Paid" } : entry))
    );

    const last4 = details.cardNumber.slice(-4);
    setPayments((prev) => [
      {
        id: `PAY-${Date.now()}`,
        item: invoice.item,
        amount: invoice.amount,
        paidAt: new Date().toLocaleString(),
        method: details.method,
        reference: `TXN-${Date.now()}`,
        cardLast4: last4
      },
      ...prev
    ]);
  };

  const handleProfileField = (event) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentField = (event) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const startInvoicePayment = (invoice) => {
    setPayingInvoiceId(invoice.id);
    setPaymentForm({
      method: "Card",
      cardholderName: profile.name,
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      billingAddress: "",
      city: "",
      country: ""
    });
  };

  const closePaymentModal = () => {
    setPayingInvoiceId("");
  };

  const submitInvoicePayment = () => {
    const { cardholderName, cardNumber, expiryMonth, expiryYear, cvv, billingAddress, city, country, method } = paymentForm;
    if (
      !cardholderName.trim() ||
      !cardNumber.trim() ||
      !expiryMonth.trim() ||
      !expiryYear.trim() ||
      !cvv.trim() ||
      !billingAddress.trim() ||
      !city.trim() ||
      !country.trim() ||
      !method
    ) {
      showNotice("Please fill all payment details.");
      return;
    }

    const numberOnly = cardNumber.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(numberOnly)) {
      showNotice("Card number must be 16 digits.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth)) {
      showNotice("Expiry month must be between 01 and 12.");
      return;
    }

    if (!/^\d{4}$/.test(expiryYear)) {
      showNotice("Expiry year must be 4 digits.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      showNotice("CVV must be 3 or 4 digits.");
      return;
    }

    const invoice = invoices.find((entry) => entry.id === payingInvoiceId);
    if (!invoice) {
      closePaymentModal();
      return;
    }

    payInvoice(invoice, { ...paymentForm, cardNumber: numberOnly });
    closePaymentModal();
    showNotice(`Payment completed for ${invoice.item}.`);
  };

  const handlePasswordField = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    if (!profileDraft.name.trim() || !profileDraft.phone.trim() || !profileDraft.email.trim()) {
      showNotice("Please complete name, phone, and email.");
      return;
    }

    setProfile(profileDraft);
    showNotice("Profile updated successfully.");
  };

  const updatePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showNotice("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotice("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotice("New password and confirm password must match.");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showNotice("Password changed successfully.");
  };

  const downloadMedicalReport = (entry) => {
    const reportText = [
      `Report ID: ${entry.id}`,
      `Date: ${entry.date}`,
      `Patient: ${currentPatientName}`,
      `Record: ${entry.title}`,
      `Diagnosis: ${entry.diagnosis}`,
      `Prescriptions: ${entry.prescriptions}`,
      `Doctor: ${entry.doctor}`
    ].join("\n");

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${entry.id}-report.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    showNotice(`Downloaded ${entry.id} report.`);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    setProfileDraft(profile);
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
              Name
              <input
                name="name"
                value={doctorSearch.name}
                onChange={handleDoctorSearch}
                placeholder="Search by doctor name"
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
                        <button type="button" onClick={() => downloadMedicalReport(entry)}>
                          Download
                        </button>
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

    if (activeMenu === "prescriptions") {
      return (
        <section className="erp-panel">
          <h3>Prescriptions</h3>
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

    if (activeMenu === "payment-history") {
      return (
        <section className="erp-panel">
          <h3>Payment History</h3>
          <p>Track completed payments and transaction references.</p>
          <div className="quick-section">
            <h4>Payment History</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Paid At</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.paidAt}</td>
                        <td>{entry.item}</td>
                        <td>${entry.amount}</td>
                        <td>{entry.method}{entry.cardLast4 ? ` •••• ${entry.cardLast4}` : ""}</td>
                        <td>{entry.reference}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No payments made yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

    if (activeMenu === "billing") {
      return (
        <section className="erp-panel">
          <h3>Payment Management</h3>
          <p>Make payments for consultation and medicines, and track payment status.</p>

          <div className="quick-section">
            <h4>Billing Summary</h4>
            <div className="erp-stats-grid">
              <article className="erp-stat-card">
                <h4>Total Invoices</h4>
                <p>{invoices.length}</p>
                <span>Generated bills</span>
              </article>
              <article className="erp-stat-card">
                <h4>Pending</h4>
                <p>{pendingInvoices.length}</p>
                <span>Awaiting payment</span>
              </article>
              <article className="erp-stat-card">
                <h4>Paid</h4>
                <p>{invoices.filter((entry) => entry.status === "Paid").length}</p>
                <span>Completed invoices</span>
              </article>
              <article className="erp-stat-card">
                <h4>Outstanding</h4>
                <p>${pendingInvoices.reduce((sum, entry) => sum + entry.amount, 0)}</p>
                <span>Total due amount</span>
              </article>
            </div>
          </div>

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
                          <button className="erp-primary-btn" type="button" onClick={() => startInvoicePayment(entry)}>
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
            <h4>All Invoices</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length > 0 ? (
                    invoices.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.id}</td>
                        <td>{entry.item}</td>
                        <td>${entry.amount}</td>
                        <td>{entry.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No invoices available.</td>
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

    if (activeMenu === "change-password") {
      return (
        <section className="erp-panel">
          <h3>Change Password</h3>
          <p>Update your password to keep your account secure.</p>
          <div className="erp-form-grid">
            <label>
              Current Password
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordField}
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordField}
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordField}
              />
            </label>
          </div>
          <button className="erp-primary-btn" type="button" onClick={updatePassword}>
            Change Password
          </button>
        </section>
      );
    }

    if (["help-faq", "contact-support", "report-issue"].includes(activeMenu)) {
      const supportContent = {
        "help-faq": {
          title: "Help and FAQ",
          description: "Quick answers about appointments, payments, and prescriptions.",
          points: [
            "Use Appointment Booking to create or reschedule visits.",
            "Use Billing to clear pending invoices.",
            "Use Prescriptions to send medicines to pharmacist."
          ]
        },
        "contact-support": {
          title: "Contact Support",
          description: "Reach support for urgent account or portal issues.",
          points: [
            "Phone: +1-800-323-4567",
            "Email: support@medico.com",
            "Working hours: 24/7"
          ]
        },
        "report-issue": {
          title: "Report Issue",
          description: "Submit a portal issue and our team will review it quickly.",
          points: [
            "Include a short summary of what happened.",
            "Add date/time and affected section.",
            "Support team usually responds within 2 hours."
          ]
        }
      };

      const current = supportContent[activeMenu];
      return (
        <section className="erp-panel">
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          <ul className="alert-list">
            {current.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      );
    }

    if (activeMenu === "profile") {
      return (
        <section className="erp-panel">
          <h3>Profile</h3>
          <p>View your name, contact info, and medical details.</p>

          <div className="erp-form-grid">
            <label>
              Name
              <input name="name" value={profile.name} readOnly />
            </label>
            <label>
              Phone
              <input name="phone" value={profile.phone} readOnly />
            </label>
            <label>
              Email
              <input name="email" value={profile.email} readOnly />
            </label>
            <label>
              Blood Group
              <input name="bloodGroup" value={profile.bloodGroup} readOnly />
            </label>
            <label>
              Medical Info (optional)
              <input name="allergyInfo" value={profile.allergyInfo} readOnly />
            </label>
          </div>
        </section>
      );
    }

    return (
      <section className="erp-panel">
        <h3>Edit Profile</h3>
        <p>Update your name, contact info, and optional medical details.</p>

        <div className="erp-form-grid">
          <label>
            Name
            <input name="name" value={profileDraft.name} onChange={handleProfileField} />
          </label>
          <label>
            Phone
            <input name="phone" value={profileDraft.phone} onChange={handleProfileField} />
          </label>
          <label>
            Email
            <input name="email" value={profileDraft.email} onChange={handleProfileField} />
          </label>
          <label>
            Blood Group
            <input name="bloodGroup" value={profileDraft.bloodGroup} onChange={handleProfileField} />
          </label>
          <label>
            Medical Info (optional)
            <input name="allergyInfo" value={profileDraft.allergyInfo} onChange={handleProfileField} />
          </label>
        </div>

        <div className="inline-actions">
          <button
            type="button"
            onClick={() => setProfileDraft(profile)}
          >
            Reset
          </button>
          <button className="erp-primary-btn" type="button" onClick={saveProfile}>
            Update Profile
          </button>
        </div>
      </section>
    );
  };

  const payingInvoice = invoices.find((entry) => entry.id === payingInvoiceId);

  return (
    <section className="patient-erp-shell">
      <aside className="patient-left-panel">
        <nav className="erp-side-nav patient-erp-side-nav">
          {MENU_GROUPS.map((group) => (
            <div key={group.key} className="erp-nav-group patient-erp-nav-group">
              <button
                type="button"
                className="erp-group-btn patient-erp-group-btn"
                onClick={() => {
                  setActiveSubNavKey("");
                  setActiveMenu(group.mainMenu);
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.key]: !prev[group.key]
                  }));
                }}
              >
                <span>{group.label}</span>
                <span aria-hidden="true">{openGroups[group.key] ? "▼" : "▶"}</span>
              </button>

              {openGroups[group.key] ? (
                <div className="erp-group-items patient-erp-group-items">
                  {group.items.map((item) => (
                    <div key={item.key}>
                      <button
                        type="button"
                        className={activeSubNavKey === item.key ? "active" : ""}
                        onClick={() => {
                          setActiveSubNavKey(item.key);
                          setActiveMenu(item.targetMenu || item.key);
                        }}
                      >
                        {item.label}
                      </button>
                      {item.children ? (
                        <div className="erp-subpoints">
                          {item.children.map((point) => (
                            <p key={`${item.key}-${point}`}>. {point}</p>
                          ))}
                        </div>
                      ) : null}
                    </div>
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
          <p className="dashboard-subtitle">Manage appointments, records, prescriptions, and payments.</p>
          <p className="dashboard-userline">Signed in as: {currentUsername}</p>
        </header>

        {uiNotice ? <p className="patient-notice">{uiNotice}</p> : null}

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

      {payingInvoice ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Complete Payment</h3>
            <p>
              Invoice: <strong>{payingInvoice.item}</strong> | Amount: <strong>${payingInvoice.amount}</strong>
            </p>

            <div className="modal-form-grid">
              <label>
                Payment Method
                <select name="method" value={paymentForm.method} onChange={handlePaymentField}>
                  <option value="Card">Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </label>
              <label>
                Cardholder Name
                <input
                  name="cardholderName"
                  value={paymentForm.cardholderName}
                  onChange={handlePaymentField}
                  placeholder="Name on card"
                />
              </label>
              <label>
                Card Number
                <input
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentField}
                  placeholder="16-digit card number"
                />
              </label>
              <label>
                Expiry Month (MM)
                <input
                  name="expiryMonth"
                  value={paymentForm.expiryMonth}
                  onChange={handlePaymentField}
                  placeholder="MM"
                />
              </label>
              <label>
                Expiry Year (YYYY)
                <input
                  name="expiryYear"
                  value={paymentForm.expiryYear}
                  onChange={handlePaymentField}
                  placeholder="YYYY"
                />
              </label>
              <label>
                CVV
                <input
                  name="cvv"
                  value={paymentForm.cvv}
                  onChange={handlePaymentField}
                  placeholder="CVV"
                  type="password"
                />
              </label>
              <label>
                Billing Address
                <input
                  name="billingAddress"
                  value={paymentForm.billingAddress}
                  onChange={handlePaymentField}
                  placeholder="Street address"
                />
              </label>
              <label>
                City
                <input name="city" value={paymentForm.city} onChange={handlePaymentField} />
              </label>
              <label>
                Country
                <input name="country" value={paymentForm.country} onChange={handlePaymentField} />
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={closePaymentModal}>Cancel</button>
              <button className="erp-primary-btn" type="button" onClick={submitInvoicePayment}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default PatientModule;
