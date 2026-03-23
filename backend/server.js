const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { verifyToken } = require("./middleware/authMiddleware");
const { ensureDefaultAdminUser } = require("./utils/adminSeed");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    return res.status(200).json({ message: "Server is running" });
  } catch (error) {
    return res.status(500).json({ message: "Database connection failed" });
  }
});

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureDefaultAdminUser();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
