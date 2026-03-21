import { useMemo, useState } from "react";
import AdminModule from "./modules/admin/AdminModule";
import DoctorModule from "./modules/doctor/DoctorModule";
import PatientModule from "./modules/patient/PatientModule";

const DEMO_CREDENTIALS = {
  admin: { username: "admin", password: "admin123", label: "Admin" },
  doctor: { username: "doctor", password: "doctor123", label: "Doctor" },
  patient: { username: "patient", password: "patient123", label: "Patient" }
};

function App() {
  const [form, setForm] = useState({
    role: "",
    username: "",
    password: "",
    remember: false
  });
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("");

  const ActiveModule = useMemo(() => {
    if (activeRole === "admin") {
      return AdminModule;
    }

    if (activeRole === "doctor") {
      return DoctorModule;
    }

    if (activeRole === "patient") {
      return PatientModule;
    }

    return null;
  }, [activeRole]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedRole = DEMO_CREDENTIALS[form.role];
    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    const isValidUser =
      form.username.trim() === selectedRole.username &&
      form.password === selectedRole.password;

    if (!isValidUser) {
      setError("Invalid username or password for selected role.");
      return;
    }

    setError("");
    setActiveRole(form.role);
  };

  const logout = () => {
    setActiveRole("");
    setForm((prev) => ({ ...prev, password: "" }));
  };

  if (ActiveModule) {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-role">{DEMO_CREDENTIALS[activeRole].label} Dashboard</p>
            <h1>Virtual Medical System</h1>
          </div>
          <button className="logout-btn" type="button" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="dashboard-content">
          <ActiveModule />
        </main>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="brand-badge" aria-hidden="true">
          ♥
        </div>

        <h1>Virtual Medical System</h1>
        <p className="subtitle">Login to access your dashboard</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="">Select your role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
          />

          <div className="label-row">
            <label htmlFor="password">Password</label>
            <button className="link-btn" type="button">
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          <label className="remember-row" htmlFor="remember">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
            />
            Remember me
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>

        <p className="signup-copy">
          Don't have an account? <button type="button">Sign up here</button>
        </p>

        <hr />

        <section className="demo-section">
          <h2>Demo Credentials</h2>
          <div className="demo-grid">
            {Object.values(DEMO_CREDENTIALS).map((account) => (
              <article key={account.label} className="demo-card">
                <h3>{account.label}</h3>
                <p>
                  {account.username} / {account.password}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default App;
