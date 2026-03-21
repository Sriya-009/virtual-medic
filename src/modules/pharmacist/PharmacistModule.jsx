import { useEffect, useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    key: "prescriptions",
    label: "Prescriptions",
    items: [
      { key: "view-prescriptions", label: "View Prescriptions" },
      { key: "verify-prescription", label: "Verify Prescription" },
      { key: "prescription-history", label: "Prescription History" },
      { key: "prescription-details", label: "Prescription Details" }
    ]
  },
  {
    key: "order-management",
    label: "Order Management",
    items: [
      { key: "view-orders", label: "View Orders" },
      { key: "manage-order-status", label: "Accept / Reject & Update Status" }
    ]
  },
  {
    key: "medicine-dispensing",
    label: "Medicine Dispensing",
    items: [
      { key: "prepare-medicines", label: "Prepare Medicines" },
      { key: "dispatch-deliver", label: "Dispatch / Deliver" }
    ]
  },
  {
    key: "inventory-management",
    label: "Inventory Management",
    items: [
      { key: "add-medicines", label: "Add Medicines" },
      { key: "update-stock", label: "Update Stock" },
      { key: "remove-expired", label: "Remove Expired Items" }
    ]
  },
  {
    key: "finance-reports",
    label: "Finance & Reports",
    items: [
      { key: "payment-verification", label: "Payment Verification" },
      { key: "transaction-history", label: "Transaction History" },
      { key: "sales-reports", label: "Sales Reports" },
      { key: "revenue-summary", label: "Revenue Summary" }
    ]
  },
  {
    key: "account",
    label: "Account",
    items: [
      { key: "profile", label: "Profile" },
      { key: "edit-profile", label: "Edit Profile" },
      { key: "change-password", label: "Change Password" },
      { key: "notifications", label: "Notifications" },
    ]
  }
];

const CURRENT_PHARMACIST_NAME = "Pharmacist Pro";
const CURRENT_PHARMACIST_ID = "PH-001";

// Default medicines inventory
const DEFAULT_MEDICINE_INVENTORY = [
  { id: "MED-001", name: "Lisinopril 10mg", category: "Cardiovascular", stock: 450, minStock: 100, expiryDate: "2027-08-15", status: "In Stock", price: 2.5 },
  { id: "MED-002", name: "Metformin 500mg", category: "Diabetes", stock: 320, minStock: 150, expiryDate: "2027-06-20", status: "In Stock", price: 1.8 },
  { id: "MED-003", name: "Albuterol Inhaler", category: "Respiratory", stock: 45, minStock: 50, expiryDate: "2026-12-10", status: "Low Stock", price: 8.5 },
  { id: "MED-004", name: "Amoxicillin 250mg", category: "Antibiotic", stock: 180, minStock: 100, expiryDate: "2026-09-05", status: "In Stock", price: 1.2 },
  { id: "MED-005", name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 75, minStock: 100, expiryDate: "2027-03-12", status: "Low Stock", price: 3.2 },
  { id: "MED-006", name: "Atorvastatin 40mg", category: "Cardiovascular", stock: 290, minStock: 100, expiryDate: "2027-11-22", status: "In Stock", price: 4.1 }
];

// Default orders from patients
const DEFAULT_ORDERS = [
  { id: "ORD-001", prescriptionId: "RX-302", patientName: "John Doe", medicines: ["Metformin 500mg (Qty: 30)"], orderDate: "2026-03-20", status: "Pending", paymentStatus: "Verified", estimatedDelivery: "2026-03-23" },
  { id: "ORD-002", prescriptionId: "RX-301", patientName: "Jane Smith", medicines: ["Lisinopril 10mg (Qty: 30)"], orderDate: "2026-03-19", status: "Approved", paymentStatus: "Pending", estimatedDelivery: "2026-03-22" },
  { id: "ORD-003", prescriptionId: "RX-305", patientName: "Robert Johnson", medicines: ["Atorvastatin 40mg (Qty: 60)"], orderDate: "2026-03-21", status: "Dispatched", paymentStatus: "Verified", estimatedDelivery: "2026-03-24" }
];

// Default transaction history
const DEFAULT_TRANSACTIONS = [
  { id: "TRN-001", orderId: "ORD-045", patient: "Michael Brown", medicine: "Amoxicillin 250mg", quantity: "21 capsules", amount: 25.20, date: "2026-03-21", status: "Dispensed" },
  { id: "TRN-002", orderId: "ORD-044", patient: "Sarah Williams", medicine: "Atorvastatin 40mg", quantity: "30 tablets", amount: 123.00, date: "2026-03-21", status: "Dispensed" },
  { id: "TRN-003", orderId: "ORD-043", patient: "David Lee", medicine: "Omeprazole 20mg", quantity: "28 capsules", amount: 89.60, date: "2026-03-20", status: "Dispensed" },
  { id: "TRN-004", orderId: "ORD-042", patient: "Lisa Anderson", medicine: "Metformin 500mg", quantity: "60 tablets", amount: 108.00, date: "2026-03-20", status: "Dispensed" }
];

const DOCTORS_LIST = [
  { id: "D-1", name: "Dr. Sarah Johnson", specialization: "Cardiology", license: "LIC-001" },
  { id: "D-2", name: "Dr. Michael Chen", specialization: "Neurology", license: "LIC-002" },
  { id: "D-3", name: "Dr. Lisa Wong", specialization: "Pediatrics", license: "LIC-003" }
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
    sentTo: "Patient & Pharmacist",
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
  },
  {
    id: "RX-303",
    patientName: "Jane Smith",
    medicine: "Lisinopril 10mg",
    dosage: "Once daily",
    duration: "30 days",
    prescribedBy: "Dr. Sarah Johnson",
    refill: "Needed",
    status: "Active",
    sentTo: "Patient & Pharmacist",
    createdAt: "2026-03-19 14:00"
  }
];

const STORAGE_KEYS = {
  prescriptions: "medico.shared.prescriptions",
  inventory: "medico.pharmacist.inventory",
  orders: "medico.pharmacist.orders",
  transactions: "medico.pharmacist.transactions",
  profile: "medico.pharmacist.profile"
};

function readStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function normalizePrescription(entry) {
  return {
    id: entry.id || `RX-${Date.now()}`,
    patientName: entry.patientName || entry.patient || "Unknown",
    medicine: entry.medicine || "Unknown Medicine",
    dosage: entry.dosage || "As prescribed",
    duration: entry.duration || "30 days",
    prescribedBy: entry.prescribedBy || "Dr. Unknown",
    refill: entry.refill || "Not specified",
    status: entry.status || "Active",
    sentTo: entry.sentTo || "Patient",
    createdAt: entry.createdAt || new Date().toLocaleString()
  };
}

function PharmacistModule({ currentUsername = "pharmacist" }) {
  const [activeMenu, setActiveMenu] = useState("view-prescriptions");
  const [openGroup, setOpenGroup] = useState("prescriptions");
  const [uiNotice, setUiNotice] = useState("");

  // Prescriptions data
  const [prescriptions, setPrescriptions] = useState(() => {
    const shared = readStorage(STORAGE_KEYS.prescriptions, SHARED_DEFAULT_PRESCRIPTIONS);
    return shared.map(normalizePrescription);
  });

  // Inventory management
  const [inventory, setInventory] = useState(() => readStorage(STORAGE_KEYS.inventory, DEFAULT_MEDICINE_INVENTORY));

  // Orders management
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, DEFAULT_ORDERS));

  // Transactions
  const [transactions, setTransactions] = useState(() => readStorage(STORAGE_KEYS.transactions, DEFAULT_TRANSACTIONS));

  // Verification states
  const [verificationForm, setVerificationForm] = useState({ prescriptionId: "", verificationNotes: "", approved: false });
  const [approvedPrescriptions, setApprovedPrescriptions] = useState([]);

  // Order management
  const [orderAction, setOrderAction] = useState({ orderId: "", action: "", notes: "" });

  // Dispensing
  const [dispensingForm, setDispensingForm] = useState({ orderId: "", dispensingNotes: "" });

  // Inventory form
  const [inventoryForm, setInventoryForm] = useState({ medicineId: "", quantity: "", action: "" });
  const [addMedicineForm, setAddMedicineForm] = useState({
    name: "",
    category: "General",
    stock: "",
    minStock: "",
    expiryDate: "",
    price: ""
  });

  // Payment verification
  const [paymentForm, setPaymentForm] = useState({ orderId: "", verificationNotes: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  // Profile
  const [profile, setProfile] = useState(() => {
    return readStorage(STORAGE_KEYS.profile, {
      name: CURRENT_PHARMACIST_NAME,
      id: CURRENT_PHARMACIST_ID,
      email: "pharmacist@medico.com",
      phone: "+1-888-123-4567",
      license: "PH-LIC-001",
      facility: "Medico Pharmacy"
    });
  });

  const showNotice = (message) => {
    setUiNotice(message);
    window.setTimeout(() => setUiNotice(""), 2500);
  };

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.prescriptions, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  // Sidebar toggle
  const toggleGroup = (groupKey) => {
    setOpenGroup(openGroup === groupKey ? "" : groupKey);
  };

  // Prescription verification
  const handleVerifyPrescription = () => {
    if (!verificationForm.prescriptionId || !verificationForm.approved) {
      showNotice("Please select a prescription and approve it.");
      return;
    }

    const presc = prescriptions.find((p) => p.id === verificationForm.prescriptionId);
    if (presc) {
      const updatedPresc = { ...presc, status: "Verified by Pharmacist" };
      setApprovedPrescriptions((prev) => [...prev, updatedPresc]);
      setVerificationForm({ prescriptionId: "", verificationNotes: "", approved: false });
      showNotice("Prescription verified successfully.");
    }
  };

  // Order management
  const handleOrderAction = () => {
    if (!orderAction.orderId || !orderAction.action) {
      showNotice("Please select an order and action.");
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderAction.orderId
          ? { ...o, status: orderAction.action === "accept" ? "Approved" : orderAction.action === "dispatch" ? "Dispatched" : "Rejected" }
          : o
      )
    );
    const actionLabel =
      orderAction.action === "accept" ? "approved" : orderAction.action === "dispatch" ? "dispatched" : "rejected";
    setOrderAction({ orderId: "", action: "", notes: "" });
    showNotice(`Order ${actionLabel}.`);
  };

  // Update inventory
  const handleInventoryUpdate = () => {
    if (!inventoryForm.medicineId || !inventoryForm.quantity || !inventoryForm.action) {
      showNotice("Please fill all fields.");
      return;
    }

    const qty = parseInt(inventoryForm.quantity, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      showNotice("Quantity must be a positive number.");
      return;
    }

    setInventory((prev) =>
      prev.map((med) =>
        med.id === inventoryForm.medicineId
          ? (() => {
              const updatedStock = inventoryForm.action === "add" ? med.stock + qty : Math.max(0, med.stock - qty);
              return {
                ...med,
                stock: updatedStock,
                status: updatedStock <= med.minStock ? "Low Stock" : "In Stock"
              };
            })()
          : med
      )
    );
    setInventoryForm({ medicineId: "", quantity: "", action: "" });
    showNotice("Inventory updated.");
  };

  // Dispense medicine
  const handleDispenseMedicine = () => {
    if (!dispensingForm.orderId) {
      showNotice("Please select an order.");
      return;
    }

    const order = orders.find((o) => o.id === dispensingForm.orderId);
    if (order) {
      setOrders((prev) => prev.map((o) => (o.id === dispensingForm.orderId ? { ...o, status: "Delivered" } : o)));

      // Add transaction
      setTransactions((prev) => [
        ...prev,
        {
          id: `TRN-${Date.now()}`,
          orderId: dispensingForm.orderId,
          patient: order.patientName,
          medicine: order.medicines[0],
          quantity: "As per prescription",
          amount: Math.random() * 100 + 20,
          date: new Date().toISOString().split("T")[0],
          status: "Dispensed"
        }
      ]);

      setDispensingForm({ orderId: "", dispensingNotes: "" });
      showNotice("Medicine dispensed successfully.");
    }
  };

  // Verify payment
  const handleVerifyPayment = () => {
    if (!paymentForm.orderId) {
      showNotice("Please select an order.");
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === paymentForm.orderId ? { ...o, paymentStatus: "Verified" } : o))
    );
    setPaymentForm({ orderId: "", verificationNotes: "" });
    showNotice("Payment verified.");
  };

  const handleAddMedicine = () => {
    if (!addMedicineForm.name.trim() || !addMedicineForm.stock || !addMedicineForm.expiryDate) {
      showNotice("Please enter medicine name, stock, and expiry date.");
      return;
    }

    const stock = parseInt(addMedicineForm.stock, 10) || 0;
    const minStock = parseInt(addMedicineForm.minStock, 10) || 0;
    const price = parseFloat(addMedicineForm.price) || 0;

    setInventory((prev) => [
      {
        id: `MED-${Date.now()}`,
        name: addMedicineForm.name.trim(),
        category: addMedicineForm.category,
        stock,
        minStock,
        expiryDate: addMedicineForm.expiryDate,
        status: stock <= minStock ? "Low Stock" : "In Stock",
        price
      },
      ...prev
    ]);

    setAddMedicineForm({
      name: "",
      category: "General",
      stock: "",
      minStock: "",
      expiryDate: "",
      price: ""
    });
    showNotice("Medicine added to inventory.");
  };

  const removeExpiredItems = () => {
    const today = new Date().toISOString().slice(0, 10);
    let removedCount = 0;
    setInventory((prev) => {
      const filtered = prev.filter((item) => item.expiryDate >= today);
      removedCount = prev.length - filtered.length;
      return filtered;
    });
    showNotice(`${removedCount} expired item(s) removed.`);
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      showNotice("Please complete all password fields.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showNotice("New passwords do not match.");
      return;
    }
    if (passwordForm.next.length < 6) {
      showNotice("New password must be at least 6 characters.");
      return;
    }

    showNotice("Password changed successfully.");
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  const saveProfileEdits = () => {
    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
      showNotice("Please complete name, email, and phone.");
      return;
    }

    showNotice("Profile updated successfully.");
  };

  // Computed values
  const pendingPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => p.sentTo.includes("Pharmacist") && p.status === "Active");
  }, [prescriptions]);

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => o.status === "Pending");
  }, [orders]);

  const lowStockItems = useMemo(() => {
    return inventory.filter((m) => m.stock <= m.minStock);
  }, [inventory]);

  const pendingPayments = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === "Pending");
  }, [orders]);

  const salesReport = useMemo(() => {
    const totalSales = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const soldItems = transactions.length;
    const avgOrderValue = soldItems ? totalSales / soldItems : 0;
    return { totalSales, soldItems, avgOrderValue };
  }, [transactions]);

  const stats = useMemo(
    () => ({
      pendingPrescriptions: pendingPrescriptions.length,
      pendingOrders: pendingOrders.length,
      lowStockItems: lowStockItems.length,
      totalInventory: inventory.reduce((acc, m) => acc + m.stock, 0)
    }),
    [pendingPrescriptions, pendingOrders, lowStockItems, inventory]
  );

  // Notifications
  const notifications = useMemo(() => {
    const notif = [];
    if (stats.pendingPrescriptions > 0) notif.push(`${stats.pendingPrescriptions} new prescription(s) awaiting verification`);
    if (stats.pendingOrders > 0) notif.push(`${stats.pendingOrders} pending order(s) requiring action`);
    if (stats.lowStockItems > 0) notif.push(`${stats.lowStockItems} medicine(s) low on stock`);
    if (pendingPayments.length > 0) notif.push(`${pendingPayments.length} order(s) awaiting payment verification`);
    return notif;
  }, [stats, pendingPayments]);

  return (
    <>
      <div className="patient-erp-shell pharmacist-erp-shell">
        {/* Left Sidebar */}
        <aside className="patient-left-panel pharmacist-left-panel">
          <h2>Pharmacist Portal</h2>
          <p>ERP Navigation</p>

          {uiNotice ? <p className="pharmacist-notice">{uiNotice}</p> : null}

          <nav className="erp-side-nav pharmacist-erp-side-nav">
          {/* Role Card */}
          <div className="role-card">
            <div style={{ fontSize: "12px", color: "#666" }}>Role</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#0066cc" }}>Pharmacist</div>
            <div style={{ fontSize: "12px", color: "#666" }}>User: {currentUsername}</div>
            <div style={{ fontSize: "11px", color: "#666" }}>Pharmacy Management</div>
          </div>

          {/* Navigation Groups */}
          {MENU_GROUPS.map((group) => (
            <div key={group.key} className="erp-nav-group pharmacist-erp-nav-group">
              <button
                className="erp-group-btn pharmacist-erp-group-btn"
                type="button"
                onClick={() => toggleGroup(group.key)}
              >
                <span>{group.label}</span>
                <span style={{ marginLeft: "auto" }} aria-hidden="true">{openGroup === group.key ? "v" : ">"}</span>
              </button>

              {openGroup === group.key && (
                <div className="erp-group-items pharmacist-erp-group-items">
                  {group.items.map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      className={activeMenu === item.key ? "active" : ""}
                      onClick={() => setActiveMenu(item.key)}
                    >
                      {"> "}{item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="pharmacist-main-area" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Header Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #ddd" }}>
            <h2 style={{ margin: 0 }}>
              {MENU_GROUPS.flatMap((g) => g.items)
                .find((item) => item.key === activeMenu)
                ?.label || "Dashboard"}
            </h2>
            <span style={{ color: "#64748b", fontWeight: 600 }}>Signed in as: {currentUsername}</span>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="stat-card" style={{ borderLeft: "4px solid #0066cc" }}>
              <div className="stat-label">Pending Prescriptions</div>
              <div className="stat-value">{stats.pendingPrescriptions}</div>
              <div className="stat-subtitle">Awaiting verification</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "4px solid #00aa88" }}>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value">{stats.pendingOrders}</div>
              <div className="stat-subtitle">Awaiting approval</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "4px solid #ff6b35" }}>
              <div className="stat-label">Low Stock Items</div>
              <div className="stat-value">{stats.lowStockItems}</div>
              <div className="stat-subtitle">Require restocking</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "4px solid #667eea" }}>
              <div className="stat-label">Total Inventory</div>
              <div className="stat-value">{stats.totalInventory}</div>
              <div className="stat-subtitle">Unique medicines</div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, background: "#fff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            {/* VIEW PRESCRIPTIONS */}
            {activeMenu === "view-prescriptions" && (
              <div>
                <h3>View Prescriptions</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Prescriptions received from doctors for dispensing</p>

                {pendingPrescriptions.length === 0 ? (
                  <p style={{ color: "#999" }}>No pending prescriptions</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #ddd" }}>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Rx ID</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Patient</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicine</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Dosage</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Duration</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Prescribed By</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingPrescriptions.map((presc) => (
                          <tr key={presc.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "0.75rem" }}>{presc.id}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.patientName}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.medicine}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.dosage}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.duration}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.prescribedBy}</td>
                            <td style={{ padding: "0.75rem", fontSize: "12px", color: "#666" }}>{presc.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PRESCRIPTION VERIFICATION */}
            {activeMenu === "verify-prescription" && (
              <div>
                <h3>Prescription Verification</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Verify authenticity and availability of prescribed medicines</p>

                <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Prescription:</label>
                    <select
                      value={verificationForm.prescriptionId}
                      onChange={(e) => setVerificationForm({ ...verificationForm, prescriptionId: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select a prescription --</option>
                      {pendingPrescriptions.map((presc) => (
                        <option key={presc.id} value={presc.id}>
                          {presc.id} - {presc.patientName} ({presc.medicine})
                        </option>
                      ))}
                    </select>
                  </div>

                  {verificationForm.prescriptionId && (
                    <>
                      {(() => {
                        const presc = prescriptions.find((p) => p.id === verificationForm.prescriptionId);
                        return presc ? (
                          <div style={{ background: "#fff", padding: "1rem", borderRadius: "4px", marginBottom: "1rem", border: "1px solid #ddd" }}>
                            <p>
                              <strong>Patient Name:</strong> {presc.patientName}
                            </p>
                            <p>
                              <strong>Medicine:</strong> {presc.medicine}
                            </p>
                            <p>
                              <strong>Dosage:</strong> {presc.dosage}
                            </p>
                            <p>
                              <strong>Duration:</strong> {presc.duration}
                            </p>
                            <p>
                              <strong>Prescribed By:</strong> {presc.prescribedBy}
                            </p>

                            {(() => {
                              const doctor = DOCTORS_LIST.find((d) => d.name === presc.prescribedBy);
                              return doctor ? (
                                <p style={{ color: "#0a7a1f", margin: "0.5rem 0" }}>
                                  ✓ Doctor Verified - License: {doctor.license}
                                </p>
                              ) : (
                                <p style={{ color: "#d32f2f", margin: "0.5rem 0" }}>✗ Doctor details not found</p>
                              );
                            })()}

                            {(() => {
                              const med = inventory.find((m) => m.name.includes(presc.medicine.split(" ")[0]));
                              return med ? (
                                <p style={{ color: med.stock > 0 ? "#0a7a1f" : "#d32f2f", margin: "0.5rem 0" }}>
                                  {med.stock > 0 ? "✓" : "✗"} Medicine Available - Stock: {med.stock}
                                </p>
                              ) : (
                                <p style={{ color: "#ff9800", margin: "0.5rem 0" }}>⚠ Medicine not in inventory</p>
                              );
                            })()}
                          </div>
                        ) : null;
                      })()}

                      <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Verification Notes:</label>
                        <textarea
                          value={verificationForm.verificationNotes}
                          onChange={(e) => setVerificationForm({ ...verificationForm, verificationNotes: e.target.value })}
                          placeholder="Add verification notes..."
                          style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "100px" }}
                        />
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <input
                          type="checkbox"
                          checked={verificationForm.approved}
                          onChange={(e) => setVerificationForm({ ...verificationForm, approved: e.target.checked })}
                        />
                        <span>Approve prescription for dispensing</span>
                      </label>

                      <button
                        onClick={handleVerifyPrescription}
                        style={{
                          background: "#0066cc",
                          color: "#fff",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "500"
                        }}
                      >
                        Verify & Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* APPROVED PRESCRIPTIONS */}
            {activeMenu === "prescription-history" && (
              <div>
                <h3>Prescription History</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Prescriptions verified and approved for dispensing</p>

                {approvedPrescriptions.length === 0 ? (
                  <p style={{ color: "#999" }}>No approved prescriptions yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #ddd" }}>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Rx ID</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Patient</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicine</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Status</th>
                          <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Approved Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedPrescriptions.map((presc) => (
                          <tr key={presc.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "0.75rem" }}>{presc.id}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.patientName}</td>
                            <td style={{ padding: "0.75rem" }}>{presc.medicine}</td>
                            <td style={{ padding: "0.75rem" }}>
                              <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "12px" }}>
                                {presc.status}
                              </span>
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "12px", color: "#666" }}>{new Date().toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ORDER MANAGEMENT */}
            {activeMenu === "view-orders" && (
              <div>
                <h3>View Orders</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Review all medicine orders from patients</p>

                <div style={{ marginBottom: "2rem" }}>
                  <h4>Pending Orders</h4>
                  {pendingOrders.length === 0 ? (
                    <p style={{ color: "#999" }}>No pending orders</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #ddd" }}>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Order ID</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Patient</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicines</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Order Date</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Status</th>
                            <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingOrders.map((order) => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "0.75rem" }}>{order.id}</td>
                              <td style={{ padding: "0.75rem" }}>{order.patientName}</td>
                              <td style={{ padding: "0.75rem" }}>{order.medicines.join(", ")}</td>
                              <td style={{ padding: "0.75rem" }}>{order.orderDate}</td>
                              <td style={{ padding: "0.75rem" }}>
                                <span style={{ background: "#fff3e0", color: "#e65100", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "12px" }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: "0.75rem" }}>{order.paymentStatus}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeMenu === "manage-order-status" && (
              <div>
                <h3>Accept / Reject & Update Status</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Accept or reject orders and update delivery status.</p>

                <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px" }}>
                  <h4>Order Action</h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Order:</label>
                    <select
                      value={orderAction.orderId}
                      onChange={(e) => setOrderAction({ ...orderAction, orderId: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select an order --</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.id} - {order.patientName} ({order.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Action:</label>
                    <select
                      value={orderAction.action}
                      onChange={(e) => setOrderAction({ ...orderAction, action: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select action --</option>
                      <option value="accept">Accept Order (Approved)</option>
                      <option value="dispatch">Dispatch Order</option>
                      <option value="reject">Reject Order</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Notes:</label>
                    <textarea
                      value={orderAction.notes}
                      onChange={(e) => setOrderAction({ ...orderAction, notes: e.target.value })}
                      placeholder="Add action notes..."
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }}
                    />
                  </div>

                  <button
                    onClick={handleOrderAction}
                    style={{
                      background: "#00aa88",
                      color: "#fff",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Update Order Status
                  </button>
                </div>
              </div>
            )}

            {/* INVENTORY MANAGEMENT */}
            {(activeMenu === "update-stock" || activeMenu === "add-medicines" || activeMenu === "remove-expired") && (
              <div>
                <h3>Inventory Management</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Track and manage medicine stock levels</p>

                <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicine</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Category</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Stock</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Min Stock</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Expiry Date</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Status</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((med) => (
                        <tr key={med.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "0.75rem" }}>{med.name}</td>
                          <td style={{ padding: "0.75rem" }}>{med.category}</td>
                          <td style={{ padding: "0.75rem", fontWeight: "bold" }}>{med.stock}</td>
                          <td style={{ padding: "0.75rem" }}>{med.minStock}</td>
                          <td style={{ padding: "0.75rem" }}>{med.expiryDate}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                background: med.status === "In Stock" ? "#e8f5e9" : "#fff3e0",
                                color: med.status === "In Stock" ? "#2e7d32" : "#e65100",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "12px",
                                fontSize: "12px"
                              }}
                            >
                              {med.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>${med.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeMenu === "add-medicines" && (
                  <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
                    <h4>Add Medicines</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
                      <input placeholder="Medicine name" value={addMedicineForm.name} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, name: e.target.value })} />
                      <input placeholder="Category" value={addMedicineForm.category} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, category: e.target.value })} />
                      <input type="number" placeholder="Stock" value={addMedicineForm.stock} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, stock: e.target.value })} />
                      <input type="number" placeholder="Min Stock" value={addMedicineForm.minStock} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, minStock: e.target.value })} />
                      <input type="date" value={addMedicineForm.expiryDate} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, expiryDate: e.target.value })} />
                      <input type="number" step="0.01" placeholder="Price" value={addMedicineForm.price} onChange={(e) => setAddMedicineForm({ ...addMedicineForm, price: e.target.value })} />
                    </div>
                    <button onClick={handleAddMedicine} style={{ marginTop: "1rem", background: "#0066cc", color: "#fff", border: "none", padding: "0.75rem 1rem", borderRadius: "4px" }}>
                      Add Medicine
                    </button>
                  </div>
                )}

                {activeMenu === "update-stock" && (
                  <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px" }}>
                    <h4>Update Stock</h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Medicine:</label>
                    <select
                      value={inventoryForm.medicineId}
                      onChange={(e) => setInventoryForm({ ...inventoryForm, medicineId: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select medicine --</option>
                      {inventory.map((med) => (
                        <option key={med.id} value={med.id}>
                          {med.name} (Current: {med.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Quantity:</label>
                    <input
                      type="number"
                      value={inventoryForm.quantity}
                      onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Action:</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="radio"
                          name="action"
                          value="add"
                          checked={inventoryForm.action === "add"}
                          onChange={(e) => setInventoryForm({ ...inventoryForm, action: e.target.value })}
                        />
                        <span>Add Stock</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="radio"
                          name="action"
                          value="remove"
                          checked={inventoryForm.action === "remove"}
                          onChange={(e) => setInventoryForm({ ...inventoryForm, action: e.target.value })}
                        />
                        <span>Remove Stock</span>
                      </label>
                    </div>
                  </div>

                    <button
                      onClick={handleInventoryUpdate}
                      style={{
                        background: "#667eea",
                        color: "#fff",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      Update Inventory
                    </button>
                  </div>
                )}

                {activeMenu === "remove-expired" && (
                  <div style={{ background: "#fff3e0", padding: "1rem", borderRadius: "6px" }}>
                    <h4>Remove Expired Items</h4>
                    <p style={{ color: "#666" }}>Clean up medicines whose expiry date has passed.</p>
                    <button onClick={removeExpiredItems} style={{ background: "#e65100", color: "#fff", border: "none", padding: "0.75rem 1rem", borderRadius: "4px" }}>
                      Remove Expired Medicines
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MEDICINE DISPENSING */}
            {(activeMenu === "prepare-medicines" || activeMenu === "dispatch-deliver") && (
              <div>
                <h3>Medicine Dispensing</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Prepare and dispense medicines to patients</p>

                <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px", marginBottom: "2rem" }}>
                  <h4>{activeMenu === "prepare-medicines" ? "Prepare Medicines" : "Dispatch / Deliver"}</h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Approved Order:</label>
                    <select
                      value={dispensingForm.orderId}
                      onChange={(e) => setDispensingForm({ ...dispensingForm, orderId: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select order --</option>
                      {orders
                        .filter((o) => o.status === "Approved" || o.status === "Pending")
                        .map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.id} - {order.patientName} ({order.medicines[0]})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Dispensing Notes:</label>
                    <textarea
                      value={dispensingForm.dispensingNotes}
                      onChange={(e) => setDispensingForm({ ...dispensingForm, dispensingNotes: e.target.value })}
                      placeholder="Add dispensing notes, delivery details, etc..."
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "100px" }}
                    />
                  </div>

                  <button
                    onClick={handleDispenseMedicine}
                    style={{
                      background: "#ff6b35",
                      color: "#fff",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    {activeMenu === "prepare-medicines" ? "Prepare Medicines" : "Dispatch / Deliver"}
                  </button>
                </div>

                <div>
                  <h4>Ready for Dispensing</h4>
                  {orders
                    .filter((o) => o.status === "Approved")
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} style={{ background: "#fff", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", border: "1px solid #ddd" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <strong>{order.id}</strong>
                          <span style={{ color: "#666", fontSize: "12px" }}>{order.orderDate}</span>
                        </div>
                        <p style={{ margin: "0.25rem 0" }}>
                          <strong>Patient:</strong> {order.patientName}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          <strong>Medicines:</strong> {order.medicines.join(", ")}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          <strong>Est. Delivery:</strong> {order.estimatedDelivery}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PAYMENT VERIFICATION */}
            {activeMenu === "payment-verification" && (
              <div>
                <h3>Payment Verification</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Confirm and verify patient payments</p>

                <div style={{ marginBottom: "2rem" }}>
                  <h4>Pending Payments</h4>
                  {pendingPayments.length === 0 ? (
                    <p style={{ color: "#999" }}>No pending payments</p>
                  ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {pendingPayments.map((order) => (
                        <div key={order.id} style={{ background: "#fff3e0", padding: "1rem", borderRadius: "6px", border: "1px solid #ffe0b2" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                            <div>
                              <strong>{order.id}</strong>
                              <p style={{ margin: "0.25rem 0", color: "#666" }}>Patient: {order.patientName}</p>
                            </div>
                            <span style={{ background: "#fff9c4", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                              PENDING
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "6px" }}>
                  <h4>Verify Payment</h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Order:</label>
                    <select
                      value={paymentForm.orderId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}
                    >
                      <option value="">-- Select order --</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.id} - {order.patientName} (Payment: {order.paymentStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Verification Notes:</label>
                    <textarea
                      value={paymentForm.verificationNotes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, verificationNotes: e.target.value })}
                      placeholder="Add payment verification details..."
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }}
                    />
                  </div>

                  <button
                    onClick={handleVerifyPayment}
                    style={{
                      background: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Verify Payment
                  </button>
                </div>
              </div>
            )}

            {/* REPORTS & TRACKING */}
            {activeMenu === "transaction-history" && (
              <div>
                <h3>Transaction History</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>View transaction history and track dispensed medicines</p>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Tx ID</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Order ID</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Patient</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicine</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Quantity</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Amount</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Date</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "0.75rem" }}>{tx.id}</td>
                          <td style={{ padding: "0.75rem" }}>{tx.orderId}</td>
                          <td style={{ padding: "0.75rem" }}>{tx.patient}</td>
                          <td style={{ padding: "0.75rem" }}>{tx.medicine}</td>
                          <td style={{ padding: "0.75rem" }}>{tx.quantity}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <strong>${tx.amount.toFixed(2)}</strong>
                          </td>
                          <td style={{ padding: "0.75rem" }}>{tx.date}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "12px" }}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeMenu === "sales-reports" && (
              <div>
                <h3>Sales Reports</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Overview of medicines sold and average order value.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem" }}>
                  <div className="stat-card"><div className="stat-label">Items Sold</div><div className="stat-value">{salesReport.soldItems}</div></div>
                  <div className="stat-card"><div className="stat-label">Average Order Value</div><div className="stat-value">${salesReport.avgOrderValue.toFixed(2)}</div></div>
                  <div className="stat-card"><div className="stat-label">Low Stock Count</div><div className="stat-value">{lowStockItems.length}</div></div>
                </div>
              </div>
            )}

            {activeMenu === "revenue-summary" && (
              <div>
                <h3>Revenue Summary</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Total revenue from dispensed orders.</p>
                <div className="stat-card" style={{ maxWidth: "420px" }}>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">${salesReport.totalSales.toFixed(2)}</div>
                  <div className="stat-subtitle">Based on transaction history</div>
                </div>
              </div>
            )}

            {activeMenu === "prescription-details" && (
              <div>
                <h3>Prescription Details</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Detailed view of prescriptions from doctors.</p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #ddd" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Rx ID</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Patient</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Medicine</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Dosage & Duration</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Doctor</th>
                        <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "bold" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((p) => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "0.75rem" }}>{p.id}</td>
                          <td style={{ padding: "0.75rem" }}>{p.patientName}</td>
                          <td style={{ padding: "0.75rem" }}>{p.medicine}</td>
                          <td style={{ padding: "0.75rem" }}>{p.dosage} / {p.duration}</td>
                          <td style={{ padding: "0.75rem" }}>{p.prescribedBy}</td>
                          <td style={{ padding: "0.75rem" }}>{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeMenu === "notifications" && (
              <div>
                <h3>Notifications</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>System alerts and important updates</p>

                {notifications.length === 0 ? (
                  <p style={{ color: "#999" }}>No notifications</p>
                ) : (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {notifications.map((notif, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#e3f2fd",
                          border: "1px solid #bbdefb",
                          borderLeft: "4px solid #0066cc",
                          padding: "1rem",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem"
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>ℹ</span>
                        <span>{notif}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE MANAGEMENT */}
            {activeMenu === "profile" && (
              <div>
                <h3>Profile</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>View pharmacist profile information</p>

                <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "6px", maxWidth: "500px" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>Pharmacist Name:</strong> {profile.name}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>Pharmacist ID:</strong> {profile.id}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>License:</strong> {profile.license}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>Facility:</strong> {profile.facility}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p style={{ margin: "0.5rem 0", fontSize: "14px", color: "#666" }}>
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => showNotice("Open Edit Profile to update details.")}
                    style={{
                      background: "#0066cc",
                      color: "#fff",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {activeMenu === "edit-profile" && (
              <div>
                <h3>Edit Profile</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Update pharmacist account details.</p>
                <div style={{ maxWidth: "560px", display: "grid", gap: "0.75rem" }}>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
                  <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" />
                  <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
                  <input value={profile.facility} onChange={(e) => setProfile({ ...profile, facility: e.target.value })} placeholder="Facility" />
                  <button onClick={saveProfileEdits} style={{ background: "#0066cc", color: "#fff", border: "none", padding: "0.75rem 1rem", borderRadius: "4px", width: "fit-content" }}>
                    Save Profile
                  </button>
                </div>
              </div>
            )}

            {activeMenu === "change-password" && (
              <div>
                <h3>Change Password</h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>Update your account password securely.</p>
                <div style={{ maxWidth: "520px", display: "grid", gap: "0.75rem" }}>
                  <input type="password" placeholder="Current password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
                  <input type="password" placeholder="New password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} />
                  <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
                  <button onClick={handlePasswordChange} style={{ background: "#4CAF50", color: "#fff", border: "none", padding: "0.75rem 1rem", borderRadius: "4px", width: "fit-content" }}>
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PharmacistModule;
