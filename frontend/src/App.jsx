import { useMemo, useState } from "react";
import AdminModule from "./modules/admin/AdminModule";
import DoctorModule from "./modules/doctor/DoctorModule";
import PatientModule from "./modules/patient/PatientModule";
import PharmacistModule from "./modules/pharmacist/PharmacistModule";

const API_BASE_URL = "http://localhost:5000";
const STORAGE_TOKEN_KEY = "medico.jwt.token";
const STORAGE_AUTH_USER_KEY = "medico.auth.user";

const authApiRequest = async (endpoint, payload) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("[Auth API] Request:", endpoint, payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    console.log("[Auth API] Response:", response.status, data);
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error("[Auth API] Network error:", error);
    return {
      ok: false,
      status: 0,
      data: {
        message: "Unable to connect to backend. Please check if server is running."
      }
    };
  }
};

function App() {
  const [form, setForm] = useState({
    email: "",
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
    name: "",
    phone: "",
    email: "",
    role: "patient",
    specialization: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

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
    setError("");
    setLoginSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    const backendLoginPayload = {
      email: form.email.trim(),
      password: form.password
    };

    const result = await authApiRequest("/api/auth/login", backendLoginPayload);

    if (!result.ok) {
      setError(result.data?.message || "Invalid email or password.");
      setLoginSuccess("");
      return;
    }

    const token = result.data?.token;
    const user = result.data?.user || {};

    if (token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    }
    localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(user));

    const userRole = String(user.role || "patient").toLowerCase();

    setError("");
    setLoginSuccess(result.data?.message || "Login successful");
    window.setTimeout(() => {
      setActiveRole(userRole);
      setActiveUsername(user.name || user.email || form.email.trim());
    }, 700);
  };

  const logout = () => {
    setActiveRole("");
    setActiveUsername("");
    setForm((prev) => ({ ...prev, password: "" }));
    setLoginSuccess("");
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_AUTH_USER_KEY);
  };

  // Forgot Password Handlers
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(false);
    setError("Forgot password is not available right now.");
  };

  const handleForgotPhoneSubmit = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotPhone.trim()) {
      setForgotError("Please enter your registered phone number");
      return;
    }

    const normalizedPhone = forgotPhone.trim();
    setDetectedRole("patient");

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setRegisteredPhone(normalizedPhone);
    setForgotStep("otp");
    setForgotSuccess(`OTP sent to ${normalizedPhone}`);
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

    setForgotError("Password reset is not available right now.");
    return;

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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupForm.name.trim() || !signupForm.phone.trim() || !signupForm.email.trim() || !signupForm.password || !signupForm.confirmPassword) {
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

    const selectedRole = String(signupForm.role || "patient").trim().toLowerCase();
    const allowedRoles = new Set(["doctor", "patient", "pharmacist"]);
    const roleToStore = allowedRoles.has(selectedRole) ? selectedRole : "patient";

    if (roleToStore === "doctor" && !signupForm.specialization.trim()) {
      setSignupError("Please enter your specialization");
      return;
    }

    const signupPayload = {
      name: signupForm.name.trim(),
      email: signupForm.email.trim(),
      password: signupForm.password,
      phone: signupForm.phone.trim(),
      role: roleToStore
    };

    if (roleToStore === "doctor") {
      signupPayload.specialization = signupForm.specialization.trim();
    }

    console.log("Sending signup:", signupPayload);

    const signupResult = await authApiRequest("/api/auth/signup", signupPayload);

    if (!signupResult.ok) {
      console.log("[Signup] Backend failure:", signupResult.status, signupResult.data);
      setSignupError(signupResult.data?.message || "Signup failed. Please try again.");
      return;
    }

    console.log("[Signup] Backend success:", signupResult.status, signupResult.data);

    const token = signupResult.data?.token;
    const backendUser = signupResult.data?.user || {};

    if (token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    }
    localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(backendUser));

    const roleFromBackend = String(backendUser.role || roleToStore || "patient").toLowerCase();
    const displayName = backendUser.name || backendUser.email || signupForm.email.trim();

    setSignupSuccess(signupResult.data?.message || "Account created successfully! Redirecting to dashboard...");
    setTimeout(() => {
      setShowSignup(false);
      setSignupForm({
        name: "",
        phone: "",
        email: "",
        role: "patient",
        specialization: "",
        username: "",
        password: "",
        confirmPassword: ""
      });
      setForm({ email: "", password: "", remember: false });
      setActiveRole(roleFromBackend);
      setActiveUsername(displayName);
      setError("");
    }, 700);
  };

  const handleBackToLoginFromSignup = () => {
    setShowSignup(false);
    setSignupForm({
      name: "",
      phone: "",
      email: "",
      role: "patient",
      specialization: "",
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
            <p className="dashboard-role">{activeUsername}</p>
          </div>
          <button className="logout-btn" type="button" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="dashboard-content">
          <ActiveModule currentUsername={activeUsername} />
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
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={signupForm.name}
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

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={signupForm.email}
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

            {signupForm.role === "doctor" && (
              <>
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  placeholder="Enter your specialization (e.g., Cardiology, Neurology)"
                  value={signupForm.specialization}
                  onChange={handleSignupChange}
                />
              </>
            )}

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
              <p style={{ textAlign: "center", color: "#4b5563", marginBottom: "1rem", fontSize: "0.92rem" }}>
                Account role detected: <strong>{detectedRole || "patient"}</strong>
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
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
          {loginSuccess ? <p className="form-success">{loginSuccess}</p> : null}

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>

        <p className="signup-copy">
          Don't have an account? <button type="button" onClick={handleSignupClick}>Sign up here</button>
        </p>

        <hr />

      </section>
    </div>
  );
}

export default App;
