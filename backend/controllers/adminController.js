const db = require("../config/db");

// Get all pending signup requests for doctors and pharmacists
const getPendingRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, phone, approval_status, created_at FROM users 
       WHERE role IN ('doctor', 'pharmacist') AND approval_status = 'pending'
       ORDER BY created_at DESC`
    );

    // Get additional info for doctors
    const enrichedRows = await Promise.all(
      rows.map(async (user) => {
        if (user.role === "doctor") {
          const [doctorInfo] = await db.query(
            "SELECT specialization FROM doctors WHERE user_id = ? LIMIT 1",
            [user.id]
          );
          if (doctorInfo.length > 0) {
            return { ...user, specialization: doctorInfo[0].specialization };
          }
        }
        return user;
      })
    );

    return res.status(200).json({
      message: "Pending requests retrieved",
      data: enrichedRows
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ message: "Server error while fetching pending requests" });
  }
};

// Approve a signup request
const approveRequest = async (req, res) => {
  let connection;
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [userRows] = await connection.query(
      "SELECT id, role FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    if (user.role !== "doctor" && user.role !== "pharmacist") {
      await connection.rollback();
      return res.status(400).json({ message: "Only doctors and pharmacists can be approved" });
    }

    // Update approval status
    await connection.query(
      "UPDATE users SET approval_status = 'approved' WHERE id = ?",
      [userId]
    );

    await connection.commit();

    return res.status(200).json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account approved successfully`,
      userId
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {
        // No-op
      }
    }
    console.error("Error approving request:", error);
    return res.status(500).json({ message: "Server error while approving request" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Reject a signup request
const rejectRequest = async (req, res) => {
  let connection;
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [userRows] = await connection.query(
      "SELECT id, role FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    if (user.role !== "doctor" && user.role !== "pharmacist") {
      await connection.rollback();
      return res.status(400).json({ message: "Only doctors and pharmacists can be rejected" });
    }

    // Update approval status to rejected
    await connection.query(
      "UPDATE users SET approval_status = 'rejected' WHERE id = ?",
      [userId]
    );

    await connection.commit();

    return res.status(200).json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account rejected successfully`,
      userId,
      reason: reason || "No reason provided"
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {
        // No-op
      }
    }
    console.error("Error rejecting request:", error);
    return res.status(500).json({ message: "Server error while rejecting request" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Get all users with their approval status
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, phone, approval_status, created_at FROM users 
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      message: "Users retrieved",
      data: rows
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error while fetching users" });
  }
};

module.exports = {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getAllUsers
};
