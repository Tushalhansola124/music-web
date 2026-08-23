const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getDashboardCounts,
  getUsersByRole,
  
} = require("../controller/dashboard.controller");

const { checkRole } = require("../middlewares/role.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");

// ==============================
// ADMIN DASHBOARD
// ==============================
router.get("/stats", verifyJWT, checkRole("admin"), getDashboardStats);
// router.get("/users-by-role", verifyJWT, checkRole("admin"), getUsersByRole);

// ==============================
// ARTIST DASHBOARD
// ==============================
// router.get("/artist-stats", verifyJWT, checkRole("artist"), getArtistDashboardStats);

// ==============================
// OPTIONAL (Admin + Artist)
// ==============================
router.get("/counts", verifyJWT, checkRole("admin", "artist"), getDashboardCounts);

module.exports = router;