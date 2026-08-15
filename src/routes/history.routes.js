const express = require("express");

const router = express.Router();

const {
  addToHistory,
  getHistory,
  deleteHistory,
  clearHistory,
} = require("../controller/history.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");


// Add song to history
router.post(
  "/add",
  verifyJWT,
  addToHistory
);


// Get logged-in user's history
router.get(
  "/",
  verifyJWT,
  getHistory
);


// Clear logged-in user's history
router.delete(
  "/clear",
  verifyJWT,
  clearHistory
);


// Delete single history
router.delete(
  "/:historyId",
  verifyJWT,
  deleteHistory
);


module.exports = router;