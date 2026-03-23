import { useEffect, useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    key: "dashboard",
    label: "Admin Dashboard",
    items: [
      { key: "overview", label: "Admin Dashboard" },
      { key: "activity-summary", label: "Activity Summary" }
    ]
  },
  {
    key: "system-control",
    label: "System Control",
    items: [
      { key: "system-control", label: "Manage System Features" },
      { key: "app-settings", label: "Configure App Settings" },
      { key: "module-control", label: "Enable/Disable Modules" }
    ]
  },
  {
    key: "access-permissions",
    label: "Access & Permissions",
    items: [
      { key: "access-permissions", label: "Access & Permissions" },
      { key: "assign-permissions", label: "Assign/Revoke Permissions" },
      { key: "manage-user-roles", label: "Manage User Roles" }
    ]
  },
  {
    key: "data-management",
    label: "Data Management",
    items: [
      { key: "data-management", label: "View All System Data" },
      { key: "backup-restore", label: "Backup & Restore" },
      { key: "data-monitoring", label: "Data Monitoring" }
    ]
  },
  {
    key: "user-management",
    label: "User Management",
    items: [
      { key: "user-management", label: "Manage Users" },
      { key: "pending-approvals", label: "Pending Approvals" }
    ]
  },
  {
    key: "audit-logs",
    label: "Audit Logs",
    items: [
      { key: "audit-logs", label: "Track User Activities" }
    ]
  },
  {
    key: "compliance-security",
    label: "Compliance & Security",
    items: [
      { key: "compliance-security", label: "Compliance & Security" }
    ]
  },
  {
    key: "reports",
    label: "Reports",
    items: [
      { key: "reports", label: "System Reports" }
    ]
  },
  {
    key: "account",
    label: "Account",
    items: [
      { key: "profile", label: "Profile" },
      { key: "edit-profile", label: "Edit Profile" },
      { key: "change-password", label: "Change Password" },
      { key: "notifications", label: "Notifications" }
    ]
  }
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

const ISSUE_ROWS = [];

const ALL_USERS = [];

const STORAGE_KEYS = {
  roleAccess: "medico.admin.roleAccess"
};

function AdminModule({ currentUsername = "admin" }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [openGroup, setOpenGroup] = useState("dashboard");
  const [uiNotice, setUiNotice] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(ALL_USERS);
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [deleteUserEmail, setDeleteUserEmail] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active"
  });
  const [adminProfile, setAdminProfile] = useState({
    name: currentUsername || "Admin",
    email: "",
    phone: "",
    department: "Administration"
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [roleAccess, setRoleAccess] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.roleAccess);
      if (!raw) {
        return ROLE_ACCESS;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return ROLE_ACCESS;
      }
      const normalized = Object.entries(parsed).reduce((acc, [role, permissions]) => {
        if (!Array.isArray(permissions)) {
          acc[role] = [];
          return acc;
        }
        acc[role] = permissions.filter((permission) => typeof permission === "string");
        return acc;
      }, {});

      return Object.keys(normalized).length > 0 ? normalized : ROLE_ACCESS;
    } catch {
      return ROLE_ACCESS;
    }
  });
  const [permissionAction, setPermissionAction] = useState({ role: "Doctor", permission: PERMISSION_ROWS[0] });
  const [editingRoleName, setEditingRoleName] = useState("");

  const roles = useMemo(() => Object.keys(roleAccess), [roleAccess]);

  const adminHomeCards = useMemo(() => {
    const totalUsers = users.length;
    const activeDoctors = users.filter((entry) => entry.role === "Doctor" && entry.status === "Active").length;
    const departments = new Set(users.map((entry) => entry.department).filter(Boolean)).size;
    const activePatients = users.filter((entry) => entry.role === "Patient" && entry.status === "Active").length;

    return [
      { key: "user-management", label: "Total Users", value: totalUsers, detail: "Based on current records" },
      { key: "user-management", label: "Active Doctors", value: activeDoctors, detail: "Based on current records" },
      { key: "system-control", label: "Departments", value: departments, detail: "Based on current records" },
      { key: "data-management", label: "Active Patients", value: activePatients, detail: "Based on current records" }
    ];
  }, [users]);

  const showNotice = (message) => {
    setUiNotice(message);
    window.setTimeout(() => setUiNotice(""), 2500);
  };

  const menuTitle = useMemo(() => {
    const item = MENU_GROUPS.flatMap((group) => group.items).find((entry) => entry.key === activeMenu);
    return item ? item.label : "Admin Dashboard";
  }, [activeMenu]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    });
  }, [userSearch, users]);

  const usersPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [currentPage, filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.roleAccess, JSON.stringify(roleAccess));
  }, [roleAccess]);

  // Fetch pending requests when activeMenu changes to "pending-approvals"
  useEffect(() => {
    if (activeMenu === "pending-approvals") {
      fetchPendingRequests();
    }
  }, [activeMenu]);

  const fetchPendingRequests = async () => {
    try {
      setLoadingPending(true);
      const token = localStorage.getItem("medico.jwt.token");
      const response = await fetch("http://localhost:5000/api/admin/pending-requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        setPendingRequests(data.data || []);
      } else {
        showNotice("Error fetching pending requests: " + (data.message || "Unknown error"));
        setPendingRequests([]);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      showNotice("Failed to fetch pending requests.");
      setPendingRequests([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      const token = localStorage.getItem("medico.jwt.token");
      const response = await fetch("http://localhost:5000/api/admin/approve-request", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      if (response.ok) {
        showNotice("Request approved successfully!");
        fetchPendingRequests();
      } else {
        showNotice("Error approving request: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error approving request:", error);
      showNotice("Failed to approve request.");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const token = localStorage.getItem("medico.jwt.token");
      const response = await fetch("http://localhost:5000/api/admin/reject-request", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, reason: "Rejected by admin" })
      });

      const data = await response.json();
      if (response.ok) {
        showNotice("Request rejected!");
        fetchPendingRequests();
      } else {
        showNotice("Error rejecting request: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showNotice("Failed to reject request.");
    }
  };

  const userToEdit = users.find((user) => user.email === editingUserEmail);
  const userToDelete = users.find((user) => user.email === deleteUserEmail);

  const startEditUser = (user) => {
    setEditingUserEmail(user.email);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
  };

  const handleEditField = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveUserEdit = () => {
    const trimmedName = editForm.name.trim();
    const trimmedEmail = editForm.email.trim();
    const trimmedDepartment = editForm.department.trim();

    if (!trimmedName || !trimmedEmail) {
      return;
    }

    const hasDuplicateEmail = users.some(
      (user) => user.email === trimmedEmail && user.email !== editingUserEmail
    );
    if (hasDuplicateEmail) {
      return;
    }

    setUsers((prev) =>
      prev.map((user) => {
        if (user.email !== editingUserEmail) {
          return user;
        }

        return {
          name: trimmedName,
          email: trimmedEmail,
          role: editForm.role,
          department: trimmedDepartment || "N/A",
          status: editForm.status
        };
      })
    );
    setEditingUserEmail("");
  };

  const confirmDeleteUser = () => {
    if (!deleteUserEmail) {
      return;
    }

    setUsers((prev) => prev.filter((user) => user.email !== deleteUserEmail));
    setDeleteUserEmail("");
    showNotice("User deleted.");
  };

  const savePassword = () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      showNotice("Please complete all password fields.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showNotice("New passwords do not match.");
      return;
    }
    if (passwordForm.next.length < 6) {
      showNotice("Password must be at least 6 characters.");
      return;
    }
    setPasswordForm({ current: "", next: "", confirm: "" });
    showNotice("Password updated.");
  };

  const toggleRolePermission = (role, permission) => {
    setRoleAccess((prev) => {
      const rolePermissions = prev[role] || [];
      const hasPermission = rolePermissions.includes(permission);
      return {
        ...prev,
        [role]: hasPermission
          ? rolePermissions.filter((item) => item !== permission)
          : [...rolePermissions, permission]
      };
    });
  };

  const assignPermission = () => {
    const { role, permission } = permissionAction;
    if (!role || !permission) {
      showNotice("Select role and permission first.");
      return;
    }
    setRoleAccess((prev) => {
      const rolePermissions = prev[role] || [];
      if (rolePermissions.includes(permission)) {
        return prev;
      }
      return { ...prev, [role]: [...rolePermissions, permission] };
    });
    showNotice(`${permission} assigned to ${role}.`);
  };

  const revokePermission = () => {
    const { role, permission } = permissionAction;
    if (!role || !permission) {
      showNotice("Select role and permission first.");
      return;
    }
    setRoleAccess((prev) => {
      const rolePermissions = prev[role] || [];
      return { ...prev, [role]: rolePermissions.filter((item) => item !== permission) };
    });
    showNotice(`${permission} revoked from ${role}.`);
  };

  const renderSection = () => {
    if (activeMenu === "activity-summary") {
      return (
        <section className="erp-panel">
          <h3>Activity Summary</h3>
          <p>Recent platform activity and operational summary.</p>
          <div className="erp-stats-grid">
            <article className="erp-stat-card"><h4>New Users Today</h4><p>24</p><span>Across all roles</span></article>
            <article className="erp-stat-card"><h4>Appointments Today</h4><p>138</p><span>All departments</span></article>
            <article className="erp-stat-card"><h4>Open Tickets</h4><p>11</p><span>Need follow-up</span></article>
            <article className="erp-stat-card"><h4>Active Sessions</h4><p>287</p><span>Current online users</span></article>
          </div>
        </section>
      );
    }

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
              <input value="Medico" readOnly />
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
          <button className="erp-primary-btn" type="button" onClick={() => showNotice("System settings saved.")}>
            Save System Settings
          </button>
        </section>
      );
    }

    if (activeMenu === "app-settings") {
      return (
        <section className="erp-panel">
          <h3>Configure App Settings</h3>
          <p>Update app-level settings and behavior controls.</p>
          <div className="erp-form-grid">
            <label>System Name<input defaultValue="Medico" /></label>
            <label>Timezone<input defaultValue="Eastern Time (ET)" /></label>
            <label>Date Format<input defaultValue="YYYY-MM-DD" /></label>
            <label>Session Timeout<input defaultValue="30 minutes" /></label>
          </div>
          <button className="erp-primary-btn" type="button" onClick={() => showNotice("App settings saved.")}>Save App Settings</button>
        </section>
      );
    }

    if (activeMenu === "module-control") {
      return (
        <section className="erp-panel">
          <h3>Enable / Disable Modules</h3>
          <p>Control module availability in the platform.</p>
          <div className="feature-grid">
            <label><input type="checkbox" defaultChecked /> Doctor Module</label>
            <label><input type="checkbox" defaultChecked /> Patient Module</label>
            <label><input type="checkbox" defaultChecked /> Pharmacist Module</label>
            <label><input type="checkbox" defaultChecked /> Admin Module</label>
          </div>
          <button className="erp-primary-btn" type="button" onClick={() => showNotice("Module settings updated.")}>Update Modules</button>
        </section>
      );
    }

    if (activeMenu === "access-permissions") {
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
                          checked={(roleAccess[role] || []).includes(permission)}
                          onChange={() => toggleRolePermission(role, permission)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="erp-primary-btn" type="button" onClick={() => showNotice("Permissions saved.")}>
            Save Permissions
          </button>
        </section>
      );
    }

    if (activeMenu === "assign-permissions") {
      return (
        <section className="erp-panel">
          <h3>Assign / Revoke Permissions</h3>
          <p>Grant or revoke role permissions securely.</p>
          <div className="erp-form-grid">
            <label>
              Role
              <select
                value={permissionAction.role}
                onChange={(event) =>
                  setPermissionAction((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>
            <label>
              Permission
              <select
                value={permissionAction.permission}
                onChange={(event) =>
                  setPermissionAction((prev) => ({ ...prev, permission: event.target.value }))
                }
              >
                {PERMISSION_ROWS.map((permission) => (
                  <option key={permission} value={permission}>{permission}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="inline-actions">
            <button type="button" onClick={assignPermission}>Assign Permissions</button>
            <button type="button" onClick={revokePermission}>Revoke Permissions</button>
          </div>
          <p>Use the Access & Permissions matrix to configure permission-level control.</p>
        </section>
      );
    }

    if (activeMenu === "manage-user-roles") {
      return (
        <section className="erp-panel">
          <h3>Manage User Roles</h3>
          <p>Create and update role assignment rules.</p>
          <div className="table-wrap">
            <table className="erp-table">
              <thead><tr><th>Role</th><th>Users</th><th>Action</th></tr></thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role}>
                    <td>{role}</td>
                    <td>{users.filter((user) => user.role === role).length}</td>
                    <td>
                      <button type="button" onClick={() => setEditingRoleName(role)}>Edit Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <button type="button" onClick={() => showNotice("Restore initiated.")}>Restore</button>
            <button className="erp-primary-btn" type="button" onClick={() => showNotice("Backup started.")}>
              Backup Now
            </button>
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

    if (activeMenu === "backup-restore") {
      return (
        <section className="erp-panel">
          <h3>Backup & Restore</h3>
          <p>Run backup and recovery operations.</p>
          <div className="inline-actions">
            <button type="button" onClick={() => showNotice("Restore initiated.")}>Restore</button>
            <button className="erp-primary-btn" type="button" onClick={() => showNotice("Backup started.")}>Backup Now</button>
          </div>
        </section>
      );
    }

    if (activeMenu === "data-monitoring") {
      return (
        <section className="erp-panel">
          <h3>Data Monitoring</h3>
          <p>Monitor record updates and table health.</p>
          <div className="table-wrap">
            <table className="erp-table">
              <thead><tr><th>Table</th><th>Records</th><th>Last Updated</th><th>Status</th></tr></thead>
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

    if (activeMenu === "user-management") {
      return (
        <section className="erp-panel">
          <h3>User Management</h3>
          <p>Add users, edit details, activate/deactivate accounts, and delete users.</p>

          <div className="quick-section">
            <div className="users-heading-row">
              <h4>All Users</h4>
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />
            </div>

            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={`${user.email}-${user.role}`}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.department}</td>
                        <td>
                          <span className={user.status === "Active" ? "status-badge active" : "status-badge inactive"}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button type="button" onClick={() => startEditUser(user)}>Edit</button>
                            <button type="button" className="danger" onClick={() => setDeleteUserEmail(user.email)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6">No users found for this search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    }

    if (activeMenu === "pending-approvals") {
      return (
        <section className="erp-panel">
          <h3>Pending Approvals</h3>
          <p>Review and approve/reject signup requests from doctors and pharmacists.</p>

          {loadingPending ? (
            <p>Loading pending requests...</p>
          ) : pendingRequests.length > 0 ? (
            <div className="table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td className="badge">{request.role}</td>
                      <td>{request.specialization || "N/A"}</td>
                      <td>{request.phone || "N/A"}</td>
                      <td>
                        <span className="status-badge pending">{request.approval_status}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            type="button" 
                            className="erp-primary-btn" 
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            Accept
                          </button>
                          <button 
                            type="button" 
                            className="danger"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No pending approval requests at this time.</p>
          )}
        </section>
      );
    }

    if (activeMenu === "audit-logs") {
      return (
        <section className="erp-panel">
          <h3>Audit Logs</h3>
          <p>Track user activities and monitor system usage.</p>
          <ul className="alert-list">
            <li>11:45 - Admin exported monthly report</li>
            <li>10:50 - Doctor role permissions updated</li>
            <li>09:35 - Backup completed successfully</li>
          </ul>
        </section>
      );
    }

    if (activeMenu === "compliance-security") {
      return (
        <section className="erp-panel">
          <h3>Compliance & Security</h3>
          <p>Manage data protection settings, security policies, and access logs.</p>
          <div className="feature-grid">
            <label><input type="checkbox" defaultChecked /> Data Encryption Enabled</label>
            <label><input type="checkbox" defaultChecked /> Retention Policy Active</label>
            <label><input type="checkbox" defaultChecked /> Access Log Monitoring</label>
            <label><input type="checkbox" defaultChecked /> Security Alerts Enabled</label>
          </div>
        </section>
      );
    }

    if (activeMenu === "reports") {
      return (
        <section className="erp-panel">
          <h3>Reports</h3>
          <p>Generate system reports, usage analytics, and performance reports.</p>
          <div className="inline-actions">
            <button type="button" onClick={() => showNotice("System report exported.")}>System Reports</button>
            <button type="button" onClick={() => showNotice("Usage analytics exported.")}>Usage Analytics</button>
            <button className="erp-primary-btn" type="button" onClick={() => showNotice("Performance report generated.")}>Performance Reports</button>
          </div>
        </section>
      );
    }

    if (activeMenu === "profile") {
      return (
        <section className="erp-panel">
          <h3>Profile</h3>
          <p>View account profile details.</p>
          <div className="erp-form-grid">
            <label>Name<input value={adminProfile.name} readOnly /></label>
            <label>Email<input value={adminProfile.email} readOnly /></label>
            <label>Phone<input value={adminProfile.phone} readOnly /></label>
            <label>Department<input value={adminProfile.department} readOnly /></label>
          </div>
        </section>
      );
    }

    if (activeMenu === "edit-profile") {
      return (
        <section className="erp-panel">
          <h3>Edit Profile</h3>
          <p>Update account profile fields.</p>
          <div className="erp-form-grid">
            <label>Name<input value={adminProfile.name} onChange={(e) => setAdminProfile((p) => ({ ...p, name: e.target.value }))} /></label>
            <label>Email<input value={adminProfile.email} onChange={(e) => setAdminProfile((p) => ({ ...p, email: e.target.value }))} /></label>
            <label>Phone<input value={adminProfile.phone} onChange={(e) => setAdminProfile((p) => ({ ...p, phone: e.target.value }))} /></label>
            <label>Department<input value={adminProfile.department} onChange={(e) => setAdminProfile((p) => ({ ...p, department: e.target.value }))} /></label>
          </div>
          <button className="erp-primary-btn" type="button" onClick={() => showNotice("Profile updated.")}>Save Profile</button>
        </section>
      );
    }

    if (activeMenu === "change-password") {
      return (
        <section className="erp-panel">
          <h3>Change Password</h3>
          <p>Update account password.</p>
          <div className="erp-form-grid">
            <label>Current Password<input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} /></label>
            <label>New Password<input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))} /></label>
            <label>Confirm Password<input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} /></label>
          </div>
          <button className="erp-primary-btn" type="button" onClick={savePassword}>Change Password</button>
        </section>
      );
    }

    if (activeMenu === "notifications") {
      return (
        <section className="erp-panel">
          <h3>Notifications</h3>
          <p>Admin alerts and important system updates.</p>
          <ul className="alert-list">
            <li>3 open support tickets need review</li>
            <li>Daily backup completed successfully</li>
            <li>2 users requested account reactivation</li>
          </ul>
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
            <button type="button" onClick={() => showNotice("Activity report exported.")}>Export Activity Report</button>
            <button type="button" onClick={() => showNotice("Appointment report exported.")}>Export Appointment Report</button>
            <button className="erp-primary-btn" type="button" onClick={() => showNotice("Monthly PDF generated.")}>
              Generate Monthly PDF
            </button>
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
                    <td>
                      <button type="button" onClick={() => showNotice(`Opened ${row.id}.`)}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    return (
      <section className="erp-panel patient-home-panel">
        <h3 className="patient-welcome">Welcome {currentUsername}</h3>
        <div className="patient-home-grid">
          {adminHomeCards.map((card) => (
            <button
              key={`${card.key}-${card.label}`}
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
        <div className="quick-section">
          <h4>Quick Actions</h4>
          <div className="inline-actions">
            <button type="button" onClick={() => setActiveMenu("access-permissions")}>Manage Role Access</button>
            <button type="button" onClick={() => setActiveMenu("backup-restore")}>Backup & Restore</button>
            <button type="button" onClick={() => setActiveMenu("audit-logs")}>Audit Logs</button>
          </div>
        </div>

        <div className="quick-section">
          <div className="users-heading-row">
            <h4>All Users</h4>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={`${user.email}-${user.role}`}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.department}</td>
                      <td>
                        <span className={user.status === "Active" ? "status-badge active" : "status-badge inactive"}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            aria-label={`Edit ${user.name}`}
                            onClick={() => startEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger"
                            aria-label={`Delete ${user.name}`}
                            onClick={() => setDeleteUserEmail(user.email)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found for this search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <p>
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </p>
            <div>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <section className="admin-erp-shell">
      <aside className="admin-left-panel">
        <nav className="erp-side-nav admin-erp-side-nav">
          {MENU_GROUPS.map((group) => (
            <div key={group.key} className="erp-nav-group admin-erp-nav-group">
              <button
                type="button"
                className="erp-group-btn admin-erp-group-btn"
                onClick={() => setOpenGroup((prev) => (prev === group.key ? "" : group.key))}
              >
                <span>{group.label}</span>
                <span aria-hidden="true">{openGroup === group.key ? "▼" : "▶"}</span>
              </button>
              {openGroup === group.key ? (
                <div className="erp-group-items admin-erp-group-items">
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={activeMenu === item.key ? "active" : ""}
                      onClick={() => setActiveMenu(item.key)}
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
        {renderSection()}
      </div>

      {userToEdit ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Edit User</h3>
            <p>Update user details and save changes.</p>

            <div className="modal-form-grid">
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={handleEditField}
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditField}
                />
              </label>

              <label>
                Role
                <select name="role" value={editForm.role} onChange={handleEditField}>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Patient">Patient</option>
                </select>
              </label>

              <label>
                Department
                <input
                  name="department"
                  type="text"
                  value={editForm.department}
                  onChange={handleEditField}
                />
              </label>

              <label>
                Status
                <select name="status" value={editForm.status} onChange={handleEditField}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditingUserEmail("")}>Cancel</button>
              <button className="erp-primary-btn" type="button" onClick={saveUserEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {userToDelete ? (
        <div className="modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="modal-card delete-modal">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <strong>{userToDelete.name}</strong>?
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteUserEmail("")}>Cancel</button>
              <button className="danger-solid" type="button" onClick={confirmDeleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingRoleName ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Edit Role Permissions</h3>
            <p>Role: <strong>{editingRoleName}</strong></p>

            <div className="table-wrap" style={{ maxHeight: "320px" }}>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>Allowed</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_ROWS.map((permission) => (
                    <tr key={`${editingRoleName}-${permission}`}>
                      <td>{permission}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={(roleAccess[editingRoleName] || []).includes(permission)}
                          onChange={() => toggleRolePermission(editingRoleName, permission)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditingRoleName("")}>Close</button>
              <button
                className="erp-primary-btn"
                type="button"
                onClick={() => {
                  setEditingRoleName("");
                  showNotice(`${editingRoleName} role permissions updated.`);
                }}
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminModule;
