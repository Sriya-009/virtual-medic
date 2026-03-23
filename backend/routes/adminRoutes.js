const express = require("express");
const { getPendingRequests, approveRequest, rejectRequest, getAllUsers } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admin only." });
};

// Apply token verification to all admin routes
router.use(verifyToken);
router.use(isAdmin);

// Get all pending signup requests
router.get("/pending-requests", getPendingRequests);

// Approve a signup request
router.post("/approve-request", approveRequest);

// Reject a signup request
router.post("/reject-request", rejectRequest);

// Get all users
router.get("/users", getAllUsers);

module.exports = router;
