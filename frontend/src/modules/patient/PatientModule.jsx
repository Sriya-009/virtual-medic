import { useEffect, useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    key: "home-main",
    label: "Home",
    mainMenu: "home",
    items: [
      { key: "home-dashboard", label: "Dashboard overview", targetMenu: "home" }
    ]
  },
  {
    key: "doctor-search-main",
    label: "Doctor Search",
    mainMenu: "doctor-search",
    items: [
      { key: "search-by-name", label: "By Name", targetMenu: "doctor-search" },
      { key: "search-by-specialization", label: "By Specialization", targetMenu: "doctor-search" },
      { key: "search-by-availability", label: "By Availability", targetMenu: "doctor-search" }
    ]
  },
  {
    key: "appointment-booking-main",
    label: "Appointment Booking",
    mainMenu: "appointment-booking",
    items: [
      { key: "book-appointment", label: "Book Appointment", targetMenu: "appointment-booking" },
      { key: "view-appointments", label: "View Appointments", targetMenu: "appointment-booking" },
      { key: "cancel-reschedule", label: "Cancel/Reschedule", targetMenu: "appointment-booking" }
    ]
  },
  {
    key: "virtual-consultation-main",
    label: "Virtual Consultation",
    mainMenu: "virtual-consultation",
    items: [
      { key: "join-consultation", label: "Join Consultation", targetMenu: "virtual-consultation" },
      { key: "chat-symptoms", label: "Report Symptoms", targetMenu: "virtual-consultation" }
    ]
  },
  {
    key: "medical-records-main",
    label: "Medical Records",
    mainMenu: "medical-records",
    items: [
      { key: "view-history", label: "Medical History", targetMenu: "medical-records" },
      { key: "download-reports", label: "Download Reports", targetMenu: "medical-records" }
    ]
  },
  {
    key: "prescription-main",
    label: "Prescriptions",
    mainMenu: "prescriptions",
    items: [
      { key: "view-prescriptions", label: "View Prescriptions", targetMenu: "prescriptions" },
      { key: "send-to-pharmacy", label: "Send to Pharmacy", targetMenu: "prescriptions" }
    ]
  },
  {
    key: "payment-management-main",
    label: "Payments",
    mainMenu: "billing",
    items: [
      { key: "view-invoices", label: "Invoices", targetMenu: "billing" },
      { key: "payment-history", label: "Payment History", targetMenu: "payment-history" }
    ]
  },
  {
    key: "profile-management-main",
    label: "Profile",
    mainMenu: "profile",
    items: [
      { key: "edit-profile", label: "Edit Profile", targetMenu: "edit-profile" },
      { key: "view-profile", label: "View Profile", targetMenu: "profile" }
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
  prescriptions: "medico.shared.prescriptions",
  patientFiles: "medico.shared.patientFiles"
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

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function formatCurrency(amount) {
  const normalizedAmount =
    typeof amount === "number"
      ? amount
      : Number(String(amount ?? "").replace(/[^0-9.-]/g, ""));

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number.isFinite(normalizedAmount) ? normalizedAmount : 0);
}

function normalizeMoneyEntryAmount(entry) {
  const parsed = Number(String(entry.amount ?? "").replace(/[^0-9.-]/g, ""));
  return {
    ...entry,
    amount: Number.isFinite(parsed) ? parsed : 0
  };
}

function PatientModule({ currentUsername = "patient" }) {
  const [activeMenu, setActiveMenu] = useState("home");
  const [activeSubNavKey, setActiveSubNavKey] = useState("");
  const [openGroups, setOpenGroups] = useState({
    "home-main": true,
    "doctor-search-main": false,
    "appointment-booking-main": false,
    "virtual-consultation-main": false,
    "medical-records-main": false,
    "prescription-main": false,
    "payment-management-main": false,
    "profile-management-main": false
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
  const [selectedConsultationId, setSelectedConsultationId] = useState("");
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [consultationDraftMessage, setConsultationDraftMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const [prescriptions, setPrescriptions] = useState(() =>
    getStored(STORAGE_KEYS.prescriptions, SHARED_DEFAULT_PRESCRIPTIONS)
  );
  const [uploadedPatientFiles] = useState(() => getStored(STORAGE_KEYS.patientFiles, []));

  const [invoices, setInvoices] = useState(() =>
    getStored(STORAGE_KEYS.invoices, INITIAL_INVOICES).map(normalizeMoneyEntryAmount)
  );
  const [payments, setPayments] = useState(() =>
    getStored(STORAGE_KEYS.payments, []).map(normalizeMoneyEntryAmount)
  );

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
  const [previewFile, setPreviewFile] = useState(null);

  const showNotice = (message) => {
    setUiNotice(message);
    window.setTimeout(() => setUiNotice(""), 2500);
  };

  const currentPatientName = profile.name.trim() || "John Doe";

  const menuTitle = useMemo(() => {
    if (activeSubNavKey) {
      const sub = MENU_GROUPS.flatMap((group) => group.items).find((entry) => entry.key === activeSubNavKey);
      if (sub && sub.targetMenu === activeMenu) {
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

  const isSubSectionVisible = (keys) => {
    if (!activeSubNavKey) {
      return true;
    }

    const selected = MENU_GROUPS.flatMap((group) => group.items).find((item) => item.key === activeSubNavKey);
    if (!selected || selected.targetMenu !== activeMenu) {
      return true;
    }

    return keys.includes(activeSubNavKey);
  };

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

  const reportableConsultations = useMemo(
    () => (upcomingAppointments.length > 0 ? upcomingAppointments : patientAppointments),
    [upcomingAppointments, patientAppointments]
  );

  const notifications = useMemo(() => {
    const appointmentAlerts = patientAppointments.map(
      (entry) => `Appointment ${entry.status.toLowerCase()} with ${entry.doctorName} on ${entry.date} ${entry.time}`
    );
    const prescriptionAlerts = prescriptions
      .filter((entry) => entry.patientName === currentPatientName)
      .map((entry) => `Prescription update: ${entry.medicine} (${entry.refill} refill)`);
    const paymentAlerts = payments.map(
      (entry) => `Payment success: ${formatCurrency(entry.amount)} for ${entry.item}`
    );

    return [...appointmentAlerts, ...prescriptionAlerts, ...paymentAlerts].slice(0, 10);
  }, [patientAppointments, prescriptions, payments, currentPatientName]);

  const pendingInvoices = useMemo(() => invoices.filter((entry) => entry.status === "Pending"), [invoices]);

  const patientPrescriptions = useMemo(
    () => prescriptions.filter((entry) => entry.patientName === currentPatientName),
    [prescriptions, currentPatientName]
  );

  const myUploadedFiles = useMemo(
    () => uploadedPatientFiles.filter((entry) => entry.patientName === currentPatientName),
    [uploadedPatientFiles, currentPatientName]
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
      showNotice("Please select date and time before booking.");
      return;
    }

    const doctor = DOCTORS.find((entry) => entry.id === bookingForm.doctorId);
    if (!doctor) {
      showNotice("Selected doctor was not found.");
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
    showNotice(`Appointment requested with ${doctor.name}.`);
  };

  const cancelAppointment = (id) => {
    const appointment = appointments.find((entry) => entry.id === id);
    setAppointments((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status: "Cancelled" } : entry)));
    if (appointment) {
      showNotice(`Appointment with ${appointment.doctorName} cancelled.`);
    }
  };

  const startReschedule = (appointment) => {
    setRescheduleId(appointment.id);
    setRescheduleForm({ date: appointment.date, time: appointment.time });
  };

  const submitReschedule = () => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      showNotice("Please select a new date and time.");
      return;
    }

    const selected = appointments.find((entry) => entry.id === rescheduleId);
    setAppointments((prev) =>
      prev.map((entry) =>
        entry.id === rescheduleId
          ? { ...entry, date: rescheduleForm.date, time: rescheduleForm.time, status: "Requested" }
          : entry
      )
    );
    setRescheduleId("");
    if (selected) {
      showNotice(`Reschedule request sent for ${selected.doctorName}.`);
    }
  };

  const joinConsultation = (appointment, mode) => {
    setActiveConsultation({
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: appointment.time,
      mode
    });
    setConsultationDraftMessage("");

    setChatLog((prev) => [
      {
        id: `MSG-${Date.now()}`,
        message: `Started ${mode.toLowerCase()} consultation with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}.`
      },
      ...prev
    ]);
    showNotice(`${mode} consultation opened for ${appointment.doctorName}.`);
  };

  const sendConsultationMessage = () => {
    if (!activeConsultation) {
      return;
    }

    if (!consultationDraftMessage.trim()) {
      showNotice("Please enter a message before sending.");
      return;
    }

    setChatLog((prev) => [
      {
        id: `MSG-${Date.now()}`,
        message: `Message to ${activeConsultation.doctorName} (${activeConsultation.mode} room): ${consultationDraftMessage.trim()}`
      },
      ...prev
    ]);
    setConsultationDraftMessage("");
    showNotice("Message sent during consultation.");
  };

  const endConsultation = () => {
    if (activeConsultation) {
      setChatLog((prev) => [
        {
          id: `MSG-${Date.now()}`,
          message: `Ended ${activeConsultation.mode.toLowerCase()} consultation with ${activeConsultation.doctorName}.`
        },
        ...prev
      ]);
      showNotice(`${activeConsultation.mode} consultation ended.`);
    }

    setActiveConsultation(null);
    setConsultationDraftMessage("");
  };

  const sendSymptomsToDoctor = () => {
    if (!selectedConsultationId) {
      showNotice("Please select a doctor to report symptoms.");
      return;
    }

    if (!consultSymptoms.trim()) {
      showNotice("Please write your symptoms before sending.");
      return;
    }

    const consultation = reportableConsultations.find((entry) => entry.id === selectedConsultationId);
    if (!consultation) {
      showNotice("Selected doctor consultation was not found.");
      return;
    }

    setChatLog((prev) => [
      {
        id: `MSG-${Date.now()}`,
        message: `Symptoms sent to ${consultation.doctorName}: ${consultSymptoms.trim()}`
      },
      ...prev
    ]);
    setConsultSymptoms("");
    showNotice(`Symptoms sent to ${consultation.doctorName}.`);
  };

  const sendToPharmacist = (id) => {
    const prescription = prescriptions.find((entry) => entry.id === id);
    setPrescriptions((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, sentTo: "Pharmacist", refill: "Sent to pharmacist" } : entry))
    );
    if (prescription) {
      showNotice(`${prescription.medicine} forwarded to pharmacist.`);
    }
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
    showNotice(`Medicine order created for ${prescription.medicine}.`);
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

  const downloadUploadedFile = (entry) => {
    if (!entry.dataUrl) {
      showNotice("File data is not available for download.");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = entry.dataUrl;
    anchor.download = entry.fileName;
    anchor.click();
    showNotice(`Downloaded ${entry.fileName}.`);
  };

  const isPreviewableFile = (entry) => {
    const type = (entry.fileType || "").toLowerCase();
    return type.startsWith("image/") || type.includes("pdf") || type.startsWith("text/");
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

  useEffect(() => {
    if (reportableConsultations.length === 0) {
      if (selectedConsultationId) {
        setSelectedConsultationId("");
      }
      return;
    }

    const exists = reportableConsultations.some((entry) => entry.id === selectedConsultationId);
    if (!exists) {
      setSelectedConsultationId(reportableConsultations[0].id);
    }
  }, [reportableConsultations, selectedConsultationId]);

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
          <p>Search and find doctors by various filters.</p>

          <div className="erp-form-grid">
            {isSubSectionVisible(["search-by-name"]) ? (
            <label>
              Doctor Name
              <input
                name="name"
                value={doctorSearch.name}
                onChange={handleDoctorSearch}
                placeholder="Search by doctor name"
              />
            </label>
            ) : null}
            {isSubSectionVisible(["search-by-specialization"]) ? (
            <label>
              Specialization
              <select name="specialization" value={doctorSearch.specialization} onChange={handleDoctorSearch}>
                <option value="All">All Specializations</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </label>
            ) : null}
            {isSubSectionVisible(["search-by-availability"]) ? (
            <label>
              Availability
              <select name="availability" value={doctorSearch.availability} onChange={handleDoctorSearch}>
                <option value="All">All Times</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </label>
            ) : null}
          </div>

          <div className="patient-cards-grid">
            {filteredDoctors.map((doctor) => (
              <article key={doctor.id} className="patient-card">
                <h4>{doctor.name}</h4>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Availability:</strong> {doctor.availability}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Rating:</strong> {doctor.rating} / 5</p>
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
          <p>Book, manage and reschedule your appointments with doctors.</p>

          {isSubSectionVisible(["book-appointment"]) ? (
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
          ) : null}

          {isSubSectionVisible(["view-appointments", "cancel-reschedule"]) ? (
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
                            {isSubSectionVisible(["cancel-reschedule"]) ? (
                              <>
                                <button type="button" onClick={() => startReschedule(entry)}>
                                  Reschedule
                                </button>
                                <button type="button" className="danger" onClick={() => cancelAppointment(entry.id)}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <span>View only</span>
                            )}
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
          ) : null}
        </section>
      );
    }

    if (activeMenu === "virtual-consultation") {
      return (
        <section className="erp-panel">
          <h3>Virtual Consultation</h3>
          <p>Join online consultations and communicate with your doctor.</p>

          {isSubSectionVisible(["chat-symptoms"]) ? (
          <div className="consultation-report-box">
            <div className="consultation-report-row">
              <label className="doctor-notes-label consultation-target-label">
                Report To Doctor
                <select
                  value={selectedConsultationId}
                  onChange={(event) => setSelectedConsultationId(event.target.value)}
                  disabled={reportableConsultations.length === 0}
                >
                  {reportableConsultations.length > 0 ? (
                    reportableConsultations.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.doctorName} ({entry.date} {entry.time})
                      </option>
                    ))
                  ) : (
                    <option value="">No consultation available</option>
                  )}
                </select>
              </label>
            </div>
            <label className="doctor-notes-label">
              Symptoms / Message to Doctor
              <textarea
                value={consultSymptoms}
                onChange={(event) => setConsultSymptoms(event.target.value)}
                placeholder="Describe your current symptoms"
              />
            </label>
            <div className="consultation-send-row">
              <button className="erp-primary-btn" type="button" onClick={sendSymptomsToDoctor}>
                Send Symptoms
              </button>
            </div>
          </div>
          ) : null}

          {isSubSectionVisible(["join-consultation"]) ? (
          <div className="patient-cards-grid">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((entry) => (
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
              ))
            ) : (
              <article className="patient-card">
                <h4>No Upcoming Consultation</h4>
                <p>Book or confirm an appointment to start a consultation session.</p>
              </article>
            )}
          </div>
          ) : null}

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
                    {isSubSectionVisible(["download-reports"]) ? <th>Report</th> : null}
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
                      {isSubSectionVisible(["download-reports"]) ? (
                        <td>
                          <button type="button" onClick={() => downloadMedicalReport(entry)}>
                            Download
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="quick-section">
            <h4>Files Shared by Doctor</h4>
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Uploaded At</th>
                    <th>File</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myUploadedFiles.length > 0 ? (
                    myUploadedFiles.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.uploadedAt}</td>
                        <td>{entry.fileName}</td>
                        <td>{entry.fileType}</td>
                        <td>{formatFileSize(entry.fileSize || 0)}</td>
                        <td>{entry.uploadedBy || "Doctor"}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(entry)}
                              disabled={!isPreviewableFile(entry)}
                            >
                              Preview
                            </button>
                            <button type="button" onClick={() => downloadUploadedFile(entry)}>
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No files uploaded for your profile yet.</td>
                    </tr>
                  )}
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
          <p>View prescriptions, send to pharmacy, and order medicines.</p>
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
                        {isSubSectionVisible(["send-to-pharmacy"]) ? (
                          <button type="button" onClick={() => sendToPharmacist(entry.id)}>
                            Send to Pharmacist
                          </button>
                        ) : null}
                        {isSubSectionVisible(["view-prescriptions"]) ? (
                          <button type="button" onClick={() => orderMedicine(entry)}>Order Medicine</button>
                        ) : null}
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
                        <td>{formatCurrency(entry.amount)}</td>
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
                <p>{formatCurrency(pendingInvoices.reduce((sum, entry) => sum + entry.amount, 0))}</p>
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
                        <td>{formatCurrency(entry.amount)}</td>
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
                        <td>{formatCurrency(entry.amount)}</td>
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
            {notifications.length > 0 ? notifications.map((entry) => {
              const showAppointment = activeSubNavKey === "alert-appointment-confirmation" && entry.toLowerCase().includes("appointment");
              const showPrescription = activeSubNavKey === "alert-prescription-updates" && entry.toLowerCase().includes("prescription");
              const showAll = !activeSubNavKey || activeSubNavKey === "alerts-parent";

              if (!showAll && !showAppointment && !showPrescription) {
                return null;
              }
              return <li key={entry}>{entry}</li>;
            }) : <li>No notifications yet.</li>}
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

    if (activeMenu === "edit-profile") {
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
    }

    return (
      <section className="erp-panel">
        <h3>Section Not Available</h3>
        <p>Select a valid menu item from the left panel.</p>
      </section>
    );
  };

  const payingInvoice = invoices.find((entry) => entry.id === payingInvoiceId);

  return (
    <section className="admin-erp-shell">
      <aside className="admin-left-panel">
        <nav className="erp-side-nav admin-erp-side-nav">
          {MENU_GROUPS.map((group) => (
            <div key={group.key} className="erp-nav-group admin-erp-nav-group">
              <button
                type="button"
                className="erp-group-btn admin-erp-group-btn"
                onClick={() => {
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.key]: !prev[group.key]
                  }));
                  if (!openGroups[group.key]) {
                    setActiveSubNavKey("");
                    setActiveMenu(group.mainMenu);
                  }
                }}
                aria-expanded={openGroups[group.key]}
              >
                <span className="menu-label">
                  {group.label}
                </span>
                <span aria-hidden="true">{openGroups[group.key] ? "▼" : "▶"}</span>
              </button>

              {openGroups[group.key] ? (
                <div className="erp-group-items admin-erp-group-items">
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={activeSubNavKey === item.key ? "active" : ""}
                      onClick={() => {
                        setActiveSubNavKey(item.key);
                        setActiveMenu(item.targetMenu || item.key);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main-area">
        <header className="admin-title-row">
          <h2>{menuTitle}</h2>
        </header>

        {uiNotice ? <p className="admin-notice">{uiNotice}</p> : null}

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

      {activeConsultation ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card consultation-modal">
            <div className="consultation-modal-head">
              <h3>{activeConsultation.mode} Consultation Room</h3>
              <span className="consultation-patient-pill">Doctor: {activeConsultation.doctorName}</span>
            </div>
            <p className="consultation-modal-subtitle">
              Scheduled for {activeConsultation.date} at {activeConsultation.time}
            </p>

            <label className="doctor-notes-label">
              Message During Consultation
              <textarea
                className="consultation-textarea"
                value={consultationDraftMessage}
                onChange={(event) => setConsultationDraftMessage(event.target.value)}
                placeholder="Type your message to doctor"
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="danger-solid" onClick={endConsultation}>
                End Consultation
              </button>
              <button className="erp-primary-btn" type="button" onClick={sendConsultationMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewFile ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>File Preview</h3>
            <p>
              <strong>{previewFile.fileName}</strong>
            </p>
            <div className="file-preview-body">
              {(previewFile.fileType || "").toLowerCase().startsWith("image/") ? (
                <img className="file-preview-image" src={previewFile.dataUrl} alt={previewFile.fileName} />
              ) : isPreviewableFile(previewFile) ? (
                <iframe className="file-preview-frame" src={previewFile.dataUrl} title={previewFile.fileName} />
              ) : (
                <p>Preview not available for this file type.</p>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setPreviewFile(null)}>Close</button>
              <button className="erp-primary-btn" type="button" onClick={() => downloadUploadedFile(previewFile)}>
                Download
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
              Invoice: <strong>{payingInvoice.item}</strong> | Amount: <strong>{formatCurrency(payingInvoice.amount)}</strong>
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
