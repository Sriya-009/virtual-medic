import { useMemo, useState } from "react";
import AdminModule from "./modules/admin/AdminModule";
import DoctorModule from "./modules/doctor/DoctorModule";
import PatientModule from "./modules/patient/PatientModule";
import PharmacistModule from "./modules/pharmacist/PharmacistModule";

const DEMO_CREDENTIALS = {
  admin: { username: "admin", password: "admin123", label: "Admin", phone: "+1-800-123-4567" },
  doctor: { username: "doctor", password: "doctor123", label: "Doctor", phone: "+1-800-223-4567" },
  patient: { username: "patient", password: "patient123", label: "Patient", phone: "+1-800-323-4567" },
  pharmacist: { username: "pharmacist", password: "pharmacist123", label: "Pharmacist", phone: "+1-800-423-4567" }
};

function App() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false
  });
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("");

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("username"); // username, otp, newpassword
  const [forgotUsername, setForgotUsername] = useState("");
  const [detectedRole, setDetectedRole] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

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

    if (activeRole === "pharmacist") {
      return PharmacistModule;
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

    if (!form.username.trim() || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    // Auto-detect role by checking credentials against all roles
    let matchedRole = null;
    for (const [roleKey, credentials] of Object.entries(DEMO_CREDENTIALS)) {
      if (
        form.username.trim() === credentials.username &&
        form.password === credentials.password
      ) {
        matchedRole = roleKey;
        break;
      }
    }

    if (!matchedRole) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
    setActiveRole(matchedRole);
  };

  const logout = () => {
    setActiveRole("");
    setForm((prev) => ({ ...prev, password: "" }));
  };

  // Forgot Password Handlers
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
    setForgotStep("username");
    setForgotError("");
    setForgotSuccess("");
  };

  const handleForgotUsernameSubmit = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotUsername.trim()) {
      setForgotError("Please enter your username");
      return;
    }

    // Auto-detect role from username
    let matchedRole = null;
    for (const [roleKey, credentials] of Object.entries(DEMO_CREDENTIALS)) {
      if (forgotUsername.trim() === credentials.username) {
        matchedRole = roleKey;
        break;
      }
    }

    if (!matchedRole) {
      setForgotError("Username not found in the system");
      return;
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setDetectedRole(matchedRole);
    setRegisteredPhone(DEMO_CREDENTIALS[matchedRole].phone);
    setForgotStep("otp");
    setForgotSuccess(`OTP sent to ${DEMO_CREDENTIALS[matchedRole].phone}`);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!otpInput) {
      setForgotError("Please enter OTP");
      return;
    }

    if (otpInput === generatedOtp) {
      setForgotSuccess("OTP verified successfully");
      setForgotStep("newpassword");
      setOtpInput("");
    } else {
      setForgotError("Invalid OTP. Please try again");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!newPassword || !confirmPassword) {
      setForgotError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    // In a real app, this would update the backend
    setForgotSuccess("Password reset successful! Redirecting to login...");
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotStep("username");
      setForgotUsername("");
      setDetectedRole("");
      setNewPassword("");
      setConfirmPassword("");
      setForgotSuccess("");
      setForgotError("");
    }, 2000);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotStep("username");
    setForgotUsername("");
    setDetectedRole("");
    setOtpInput("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  if (ActiveModule) {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-role">{DEMO_CREDENTIALS[activeRole].label} Dashboard</p>
            <h1>Medico</h1>
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

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="login-shell">
        <section className="login-card forgot-password-card">
          <div className="brand-badge" aria-hidden="true">
            ♥
          </div>

          <h1>Reset Password</h1>
          <p className="subtitle">Recover your account access</p>

          {/* STEP 1: Enter Username */}
          {forgotStep === "username" && (
            <form onSubmit={handleForgotUsernameSubmit}>
              <label htmlFor="forgot-username">Username</label>
              <input
                id="forgot-username"
                type="text"
                placeholder="Enter your username"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
              />

              {forgotError ? <p className="form-error">{forgotError}</p> : null}
              {forgotSuccess ? <p className="form-success">{forgotSuccess}</p> : null}

              <button className="primary-btn" type="submit">
                Send OTP
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                style={{ marginTop: "0.5rem", background: "#666", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer", width: "100%" }}
              >
                Back to Login
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP */}
          {forgotStep === "otp" && (
            <form onSubmit={handleOtpSubmit}>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "1rem" }}>
                Enter the OTP sent to <strong>{registeredPhone}</strong>
              </p>

              <label htmlFor="otp-input">One-Time Password (OTP)</label>
              <input
                id="otp-input"
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.slice(0, 4))}
                maxLength="4"
                autoComplete="off"
                style={{ textAlign: "center", fontSize: "24px", letterSpacing: "8px", fontWeight: "bold" }}
              />

              <p style={{ fontSize: "12px", color: "#999", marginTop: "0.5rem", textAlign: "center" }}>
                Demo OTP: <strong>{generatedOtp}</strong>
              </p>

              {forgotError ? <p className="form-error">{forgotError}</p> : null}
              {forgotSuccess ? <p className="form-success">{forgotSuccess}</p> : null}

              <button className="primary-btn" type="submit">
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                style={{ marginTop: "0.5rem", background: "#666", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer", width: "100%" }}
              >
                Back to Login
              </button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {forgotStep === "newpassword" && (
            <form onSubmit={handlePasswordReset}>
              <p style={{ color: "#0a7a1f", marginBottom: "1rem", textAlign: "center", fontWeight: "500" }}>
                ✓ OTP verified successfully
              </p>

              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <p style={{ fontSize: "12px", color: "#999", marginTop: "-0.5rem" }}>
                Password must be at least 6 characters
              </p>

              {forgotError ? <p className="form-error">{forgotError}</p> : null}
              {forgotSuccess ? <p className="form-success">{forgotSuccess}</p> : null}

              <button className="primary-btn" type="submit">
                Reset Password
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                style={{ marginTop: "0.5rem", background: "#666", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer", width: "100%" }}
              >
                Back to Login
              </button>
            </form>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="brand-badge" aria-hidden="true">
          ♥
        </div>

        <h1>Medico</h1>
        <p className="subtitle">Login to access your dashboard</p>

        <form onSubmit={handleSubmit}>
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
            <button className="link-btn" type="button" onClick={handleForgotPasswordClick}>
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
