const bcrypt = require("bcrypt");
const db = require("../config/db");
const { generateToken } = require("../utils/jwt");

const signup = async (req, res) => {
  let connection;

  try {
    const { name, email, password, role, phone, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedRole = String(role || "patient").trim().toLowerCase();
    const allowedRoles = new Set(["patient", "doctor", "pharmacist"]);
    const roleToStore = allowedRoles.has(normalizedRole) ? normalizedRole : "patient";
    const phoneToStore = phone ? String(phone).trim() : null;
    const specializationToStore = specialization ? String(specialization).trim() : null;

    // All users are auto-approved and can login immediately
    const approvalStatus = "approved";

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existingUsers] = await connection.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    try {
      const [insertResult] = await connection.query(
        "INSERT INTO users (name, email, password, role, phone, approval_status) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, roleToStore, phoneToStore, approvalStatus]
      );
      result = insertResult;
    } catch (insertError) {
      if (insertError && insertError.code === "ER_BAD_FIELD_ERROR") {
        const [fallbackResult] = await connection.query(
          "INSERT INTO users (name, email, password, role, approval_status) VALUES (?, ?, ?, ?, ?)",
          [name, email, hashedPassword, roleToStore, approvalStatus]
        );
        result = fallbackResult;
      } else {
        throw insertError;
      }
    }

    const userId = result.insertId;

    if (roleToStore === "patient") {
      await connection.query(
        "INSERT INTO patients (user_id, name, email) VALUES (?, ?, ?)",
        [userId, name, email]
      );
      console.log("Inserted full data into role table");
    } else if (roleToStore === "doctor") {
      await connection.query(
        "INSERT INTO doctors (user_id, name, email, specialization) VALUES (?, ?, ?, ?)",
        [userId, name, email, specializationToStore]
      );
      console.log("Inserted full data into role table");
    } else if (roleToStore === "pharmacist") {
      await connection.query(
        "INSERT INTO pharmacists (user_id, name, email) VALUES (?, ?, ?)",
        [userId, name, email]
      );
      console.log("Inserted full data into role table");
    }

    await connection.commit();

    const user = {
      id: userId,
      name,
      email,
      role: roleToStore,
      phone: phoneToStore,
      approval_status: approvalStatus
    };

    if (roleToStore === "doctor") {
      user.specialization = specializationToStore;
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: "Signup successful! Redirecting to dashboard...",
      token,
      user
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {
        // No-op.
      }
    }

    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ message: "Database error during signup" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await db.query(
      "SELECT id, name, email, password, role, approval_status FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userFromDb = rows[0];
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is approved (for doctors and pharmacists)
    if (userFromDb.approval_status === "rejected") {
      return res.status(403).json({ message: "Your account has been rejected. Please contact admin." });
    }

    if (userFromDb.approval_status === "pending") {
      return res.status(403).json({ message: "Your account is pending admin approval. Please wait." });
    }

    const user = {
      id: userFromDb.id,
      name: userFromDb.name,
      email: userFromDb.email,
      role: userFromDb.role || "patient",
      approval_status: userFromDb.approval_status
    };

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  signup,
  login
};
