import { useMemo, useState } from "react";

const MENU_ITEMS = [
  { key: "overview", label: "Admin Dashboard" },
  { key: "system-control", label: "System Control" },
  { key: "access-permissions", label: "Access & Permissions" },
  { key: "data-management", label: "Data Management" },
  { key: "security-management", label: "Security Management" },
  { key: "monitoring-reports", label: "Monitoring & Reports" },
  { key: "issue-handling", label: "Issue Handling" }
];

const PERMISSION_ROWS = [
  "View Users",
  "Create Users",
  "View Patients",
  "Edit Patient Records",
  "View Appointments",
  "Create Prescriptions",
  "Dispense Medications",
  "Manage Inventory",
  "View Reports",
  "Manage Settings",
  "Database Backup",
  "View Audit Logs"
];

const ROLE_ACCESS = {
  Admin: [
    "View Users",
    "Create Users",
    "View Patients",
    "Edit Patient Records",
    "View Appointments",
    "Create Prescriptions",
    "Dispense Medications",
    "Manage Inventory",
    "View Reports",
    "Manage Settings",
    "Database Backup",
    "View Audit Logs"
  ],
  Doctor: [
    "View Patients",
    "Edit Patient Records",
    "View Appointments",
    "Create Prescriptions",
    "View Reports"
  ],
  Pharmacist: ["View Patients", "Dispense Medications", "Manage Inventory"],
  Patient: ["View Appointments"]
};

const ISSUE_ROWS = [
  { id: "TKT-1001", user: "John Smith", issue: "Unable to book appointment", status: "Open" },
  { id: "TKT-1002", user: "Dr. Sarah", issue: "Prescription save failed", status: "In Progress" },
  { id: "TKT-1003", user: "Emily Parker", issue: "Wrong medicine in history", status: "Resolved" }
];

function AdminModule() {
  const [activeMenu, setActiveMenu] = useState("overview");

  const menuTitle = useMemo(() => {
    const item = MENU_ITEMS.find((entry) => entry.key === activeMenu);
    return item ? item.label : "Admin Dashboard";
  }, [activeMenu]);

  const renderSection = () => {
    if (activeMenu === "system-control") {
      return (
        <section className="erp-panel">
          <h3>System Control</h3>
          <p>Manage overall system functionality and configure core behavior.</p>
          <div className="feature-grid">
            <label><input type="checkbox" defaultChecked /> Enable Appointments</label>
            <label><input type="checkbox" defaultChecked /> Enable Consultations</label>
            <label><input type="checkbox" defaultChecked /> Enable E-Prescriptions</label>
            <label><input type="checkbox" defaultChecked /> Enable Pharmacy Sync</label>
            <label><input type="checkbox" /> Maintenance Mode</label>
            <label><input type="checkbox" defaultChecked /> Send System Alerts</label>
          </div>
          <div className="erp-form-grid">
            <div>
              <label>System Name</label>
              <input value="Virtual Medical System" readOnly />
            </div>
            <div>
              <label>Timezone</label>
              <input value="Eastern Time (ET)" readOnly />
            </div>
            <div>
              <label>Date Format</label>
              <input value="YYYY-MM-DD" readOnly />
            </div>
          </div>
          <button className="erp-primary-btn" type="button">Save System Settings</button>
        </section>
      );
    }

    if (activeMenu === "access-permissions") {
      const roles = Object.keys(ROLE_ACCESS);
      return (
        <section className="erp-panel">
          <h3>Access & Permissions</h3>
          <p>Define role access and ensure only authorized users can perform actions.</p>
          <div className="table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map((role) => (
                    <th key={role}>{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_ROWS.map((permission) => (
                  <tr key={permission}>
                    <td>{permission}</td>
                    {roles.map((role) => (
                      <td key={`${role}-${permission}`}>
                        <input
                          type="checkbox"
                          checked={ROLE_ACCESS[role].includes(permission)}
                          readOnly
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="erp-primary-btn" type="button">Save Permissions</button>
        </section>
      );
    }

    if (activeMenu === "data-management") {
      return (
        <section className="erp-panel">
          <h3>Data Management</h3>
          <p>Monitor data integrity, backups, and recovery operations.</p>
          <div className="erp-stats-grid">
            <article className="erp-stat-card">
              <h4>Total Records</h4>
              <p>14,305</p>
              <span>+245 this week</span>
            </article>
            <article className="erp-stat-card">
              <h4>Database Size</h4>
              <p>305.9 MB</p>
              <span>Across 8 tables</span>
            </article>
            <article className="erp-stat-card">
              <h4>Last Backup</h4>
              <p>2 hours ago</p>
              <span>2026-03-21 02:00</span>
            </article>
          </div>
          <div className="inline-actions">
            <button type="button">Restore</button>
            <button className="erp-primary-btn" type="button">Backup Now</button>
          </div>
          <div className="table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Records</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>users</td><td>1,234</td><td>2026-03-21 10:30</td><td>Healthy</td></tr>
                <tr><td>appointments</td><td>3,450</td><td>2026-03-21 10:05</td><td>Healthy</td></tr>
                <tr><td>prescriptions</td><td>2,811</td><td>2026-03-21 09:58</td><td>Healthy</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activeMenu === "security-management") {
      return (
        <section className="erp-panel">
          <h3>Security Management</h3>
          <p>Protect sensitive medical data and monitor suspicious activity.</p>
          <div className="feature-grid">
            <label><input type="checkbox" defaultChecked /> Multi-Factor Authentication</label>
            <label><input type="checkbox" defaultChecked /> Session Timeout (30 mins)</label>
            <label><input type="checkbox" defaultChecked /> Login Attempt Lockout</label>
            <label><input type="checkbox" defaultChecked /> Encrypt Medical Records</label>
          </div>
          <h4>Recent Security Alerts</h4>
          <ul className="alert-list">
            <li>11:45 - Failed login from unknown_user (203.45.67.89)</li>
            <li>10:30 - New device login for admin account</li>
            <li>09:10 - Unusual API traffic detected and blocked</li>
          </ul>
        </section>
      );
    }

    if (activeMenu === "monitoring-reports") {
      return (
        <section className="erp-panel">
          <h3>Monitoring & Reports</h3>
          <p>Track usage, appointments, and overall system performance.</p>
          <div className="erp-stats-grid">
            <article className="erp-stat-card"><h4>Total Users</h4><p>1,234</p><span>+12% from last month</span></article>
            <article className="erp-stat-card"><h4>Monthly Appointments</h4><p>2,145</p><span>+18% from last month</span></article>
            <article className="erp-stat-card"><h4>Avg API Response</h4><p>180 ms</p><span>Within target</span></article>
          </div>
          <div className="inline-actions">
            <button type="button">Export Activity Report</button>
            <button type="button">Export Appointment Report</button>
            <button className="erp-primary-btn" type="button">Generate Monthly PDF</button>
          </div>
        </section>
      );
    }

    if (activeMenu === "issue-handling") {
      return (
        <section className="erp-panel">
          <h3>Issue Handling</h3>
          <p>Resolve user complaints, errors, and operational issues.</p>
          <div className="table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>User</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ISSUE_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.user}</td>
                    <td>{row.issue}</td>
                    <td>{row.status}</td>
                    <td><button type="button">Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    return (
      <section className="erp-panel">
        <h3>Admin Dashboard</h3>
        <p>Manage users, departments, database, and settings.</p>
        <div className="erp-stats-grid">
          <article className="erp-stat-card"><h4>Total Users</h4><p>1,234</p><span>+12% from last month</span></article>
          <article className="erp-stat-card"><h4>Active Doctors</h4><p>156</p><span>+5% from last month</span></article>
          <article className="erp-stat-card"><h4>Departments</h4><p>12</p><span>0% from last month</span></article>
          <article className="erp-stat-card"><h4>Active Patients</h4><p>892</p><span>+18% from last month</span></article>
        </div>
        <div className="quick-section">
          <h4>Quick Actions</h4>
          <div className="inline-actions">
            <button type="button" onClick={() => setActiveMenu("access-permissions")}>Manage Role Access</button>
            <button type="button" onClick={() => setActiveMenu("data-management")}>Backup & Restore</button>
            <button type="button" onClick={() => setActiveMenu("issue-handling")}>Resolve Open Tickets</button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <section className="admin-erp-shell">
      <aside className="admin-left-panel">
        <h2>Admin Portal</h2>
        <p>ERP Navigation</p>
        <nav>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeMenu === item.key ? "active" : ""}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main-area">
        <header className="admin-title-row">
          <h2>{menuTitle}</h2>
          <p>Virtual Medical System Administration</p>
        </header>
        {renderSection()}
      </div>
    </section>
  );
}

export default AdminModule;
