import { useMemo, useState } from "react";
import AdminModule from "./modules/admin/AdminModule";
import DoctorModule from "./modules/doctor/DoctorModule";
import PatientModule from "./modules/patient/PatientModule";
import PharmacistModule from "./modules/pharmacist/PharmacistModule";

const STORAGE_USERS_KEY = "medico.dummy.users";
const DEFAULT_DUMMY_USERS = [
  { username: "admin", password: "admin009", role: "admin", fullname: "Admin User", phone: "9000000001" },
  { username: "doctor", password: "doctor123", role: "doctor", fullname: "Doctor User", phone: "9000000002" },
  { username: "patient", password: "patient123", role: "patient", fullname: "Patient User", phone: "9000000003" },
  { username: "pharmacist", password: "pharma123", role: "pharmacist", fullname: "Pharmacist User", phone: "9000000004" }
];

const DEMO_USERS = [
  { role: "Admin", username: "admin", password: "admin009" },
  { role: "Doctor", username: "doctor", password: "doctor123" },
  { role: "Patient", username: "patient", password: "patient123" },
  { role: "Pharmacist", username: "pharmacist", password: "pharma123" }
];

const normalizeDummyUser = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const username = String(user.username || "").trim();
  const password = String(user.password || "");
  const role = String(user.role || "patient").toLowerCase();
  const fullname = String(user.fullname || username || "User").trim();
  const phone = String(user.phone || "").trim();

  if (!username || !password) {
    return null;
  }

  return {
    username,
    password,
    role,
    fullname,
    phone
  };
};

const mergeWithDefaultUsers = (inputUsers) => {
  const normalizedInput = Array.isArray(inputUsers)
    ? inputUsers.map(normalizeDummyUser).filter(Boolean)
    : [];

  const mergedByUsername = new Map(
    normalizedInput.map((user) => [user.username.toLowerCase(), user])
  );

  DEFAULT_DUMMY_USERS.forEach((defaultUser) => {
    const key = defaultUser.username.toLowerCase();
    if (!mergedByUsername.has(key)) {
      mergedByUsername.set(key, { ...defaultUser });
    }
  });

  return Array.from(mergedByUsername.values());
};

const loadDummyUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_DUMMY_USERS));
      return DEFAULT_DUMMY_USERS;
    }

    const parsed = JSON.parse(raw);
    const merged = mergeWithDefaultUsers(parsed);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_DUMMY_USERS));
    return DEFAULT_DUMMY_USERS;
  }
};

const saveDummyUsers = (users) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
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
  const [dummyUsers, setDummyUsers] = useState(() => loadDummyUsers());

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

  const resetDemoAccounts = () => {
    setDummyUsers(DEFAULT_DUMMY_USERS);
    saveDummyUsers(DEFAULT_DUMMY_USERS);
    setForm((prev) => ({ ...prev, username: "", password: "" }));
    setError("");
    setSignupError("");
    setSignupSuccess("Demo accounts reset.");
    setTimeout(() => setSignupSuccess(""), 1500);
  };

  const fillDemoCredentials = (username, password) => {
    setForm((prev) => ({ ...prev, username, password }));
    setError("");
  };

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

    const normalizedUsername = form.username.trim().toLowerCase();
    const foundUser = dummyUsers.find(
      (user) => user.username.toLowerCase() === normalizedUsername
    );

    if (!foundUser || foundUser.password !== form.password) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
    setActiveRole(foundUser.role);
    setActiveUsername(foundUser.username);
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

    const normalizedPhone = forgotPhone.trim();
    const foundUser = dummyUsers.find((user) => String(user.phone || "").trim() === normalizedPhone);
    if (!foundUser) {
      setForgotError("No account found for this phone number");
      return;
    }

    setDetectedRole(String(foundUser.role || "patient"));

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

    const updatedUsers = dummyUsers.map((user) => {
      if (String(user.phone || "").trim() !== registeredPhone) {
        return user;
      }
      return {
        ...user,
        password: newPassword
      };
    });

    setDummyUsers(updatedUsers);
    saveDummyUsers(updatedUsers);

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

    const normalizedUsername = signupForm.username.trim().toLowerCase();
    const normalizedRole = String(signupForm.role || "patient").toLowerCase();
    const allowedRoles = new Set(["admin", "doctor", "patient", "pharmacist"]);
    const roleToStore = allowedRoles.has(normalizedRole) ? normalizedRole : "patient";

    const exists = dummyUsers.some(
      (user) => user.username.toLowerCase() === normalizedUsername
    );

    if (exists) {
      setSignupError("Username already exists.");
      return;
    }

    const createdUser = {
      fullname: signupForm.fullname.trim(),
      phone: signupForm.phone.trim(),
      role: roleToStore,
      username: signupForm.username.trim(),
      password: signupForm.password
    };

    const updatedUsers = [...dummyUsers, createdUser];
    setDummyUsers(updatedUsers);
    saveDummyUsers(updatedUsers);

    setSignupSuccess("Account created successfully! Redirecting to dashboard...");
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
      setActiveRole(createdUser.role);
      setActiveUsername(createdUser.username);
      setError("");
    }, 700);
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
          <h2>Demo Role Logins</h2>
          <div className="demo-grid">
            {DEMO_USERS.map((entry) => (
              <article className="demo-card" key={entry.username}>
                <h3>{entry.role}</h3>
                <p>User: {entry.username}</p>
                <p>Pass: {entry.password}</p>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => fillDemoCredentials(entry.username, entry.password)}
                >
                  Use this login
                </button>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="link-btn"
            style={{ marginTop: "0.9rem", fontWeight: 700 }}
            onClick={resetDemoAccounts}
          >
            Reset demo accounts
          </button>
        </section>

      </section>
    </div>
  );
}

export default App;
