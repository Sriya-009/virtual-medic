const bcrypt = require("bcrypt");
const db = require("../config/db");

const DEFAULT_ADMIN = {
  name: "Admin",
  email: "admin1@gmail.com",
  password: "admin009",
  role: "admin"
};

const ensureDefaultAdminUser = async () => {
  try {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [DEFAULT_ADMIN.email]
    );

    if (rows.length > 0) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [DEFAULT_ADMIN.name, DEFAULT_ADMIN.email, hashedPassword, DEFAULT_ADMIN.role]
    );

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error ensuring admin user:", error);
    throw error;
  }
};

module.exports = {
  ensureDefaultAdminUser
};
