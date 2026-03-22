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
  const [activeUsername, setActiveUsername] = useState("");

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("phone"); // phone, otp, newpassword
  const [forgotPhone, setForgotPhone] = useState("");
  const [detectedRole, setDetectedRole] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Sign Up States
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    fullname: "",
    phone: "",
    role: "patient",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

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
    setActiveUsername(form.username.trim());
  };

  const logout = () => {
    setActiveRole("");
    setActiveUsername("");
    setForm((prev) => ({ ...prev, password: "" }));
  };

  // Forgot Password Handlers
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
    setForgotStep("phone");
    setForgotError("");
    setForgotSuccess("");
  };

  const handleForgotPhoneSubmit = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotPhone.trim()) {
      setForgotError("Please enter your registered phone number");
      return;
    }

    // Auto-detect role from phone number
    let matchedRole = null;
    for (const [roleKey, credentials] of Object.entries(DEMO_CREDENTIALS)) {
      if (forgotPhone.trim() === credentials.phone) {
        matchedRole = roleKey;
        break;
      }
    }

    if (!matchedRole) {
      setForgotError("Phone number not found in registered accounts");
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
      setForgotStep("phone");
      setForgotPhone("");
      setDetectedRole("");
      setNewPassword("");
      setConfirmPassword("");
      setForgotSuccess("");
      setForgotError("");
    }, 2000);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotStep("phone");
    setForgotPhone("");
    setDetectedRole("");
    setOtpInput("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  // Sign Up Handlers
  const handleSignupClick = (e) => {
    e.preventDefault();
    setShowSignup(true);
    setSignupError("");
    setSignupSuccess("");
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupForm.fullname.trim() || !signupForm.phone.trim() || !signupForm.username.trim() || !signupForm.password || !signupForm.confirmPassword) {
      setSignupError("Please fill all fields");
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    // Check if user already exists
    const userExists = Object.values(DEMO_CREDENTIALS).some(
      (cred) => cred.username === signupForm.username
    );

    if (userExists) {
      setSignupError("Username already exists. Please choose a different username.");
      return;
    }

    // In a real app, this would save to the backend
    setSignupSuccess("Account created successfully! Redirecting to login...");
    setTimeout(() => {
      setShowSignup(false);
      setSignupForm({
        fullname: "",
        phone: "",
        role: "patient",
        username: "",
        password: "",
        confirmPassword: ""
      });
      setForm({ username: "", password: "", remember: false });
      setError("");
    }, 2000);
  };

  const handleBackToLoginFromSignup = () => {
    setShowSignup(false);
    setSignupForm({
      fullname: "",
      phone: "",
      role: "patient",
      username: "",
      password: "",
      confirmPassword: ""
    });
    setSignupError("");
    setSignupSuccess("");
  };

  if (ActiveModule) {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div>
            <h1>Medico</h1>
            <p className="dashboard-role">{activeUsername || DEMO_CREDENTIALS[activeRole].username}</p>
          </div>
          <button className="logout-btn" type="button" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="dashboard-content">
          <ActiveModule currentUsername={activeUsername || DEMO_CREDENTIALS[activeRole].username} />
        </main>
      </div>
    );
  }

  // Sign Up Modal
  if (showSignup) {
    return (
      <div className="login-shell">
        <section className="login-card signup-card">
          <div className="brand-badge" aria-hidden="true">
            ♥
          </div>

          <h1>Create Account</h1>
          <p className="subtitle">Join Medico to access healthcare services</p>

          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Enter your full name"
              value={signupForm.fullname}
              onChange={handleSignupChange}
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={signupForm.phone}
              onChange={handleSignupChange}
            />

            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={signupForm.role}
              onChange={handleSignupChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
            </select>

            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={signupForm.username}
              onChange={handleSignupChange}
            />

            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showSignupPassword ? "text" : "password"}
                placeholder="Create a password"
                value={signupForm.password}
                onChange={handleSignupChange}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                aria-label={showSignupPassword ? "Hide password" : "Show password"}
              >
                {showSignupPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "-0.5rem" }}>
              Password must be at least 6 characters
            </p>

            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showSignupConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={signupForm.confirmPassword}
                onChange={handleSignupChange}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
              >
                {showSignupConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {signupError ? <p className="form-error">{signupError}</p> : null}
            {signupSuccess ? <p className="form-success">{signupSuccess}</p> : null}

            <button className="primary-btn" type="submit">
              Sign Up
            </button>

            <button
              type="button"
              onClick={handleBackToLoginFromSignup}
              style={{ marginTop: "0.5rem", background: "#666", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer", width: "100%" }}
            >
              Back to Login
            </button>
          </form>
        </section>
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

          {/* STEP 1: Enter Registered Phone */}
          {forgotStep === "phone" && (
            <form onSubmit={handleForgotPhoneSubmit}>
              <label htmlFor="forgot-phone">Registered Phone Number</label>
              <input
                id="forgot-phone"
                type="tel"
                placeholder="Enter your registered phone number"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
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
              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={showForgotNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  aria-label={showForgotNewPassword ? "Hide password" : "Show password"}
                >
                  {showForgotNewPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="confirm-password"
                  type={showForgotConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                  aria-label={showForgotConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showForgotConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

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
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showLoginPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              aria-label={showLoginPassword ? "Hide password" : "Show password"}
            >
              {showLoginPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

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
          Don't have an account? <button type="button" onClick={handleSignupClick}>Sign up here</button>
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
