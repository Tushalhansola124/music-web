const express = require("express");
const multer = require("multer");

const router = express.Router();

const userController = require("../controller/user.contoller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");

// multer setup
const upload = multer({
  storage: multer.memoryStorage(),
});

/*
=====================================
CREATE USER
POST => /api/users/create
(Admin)
=====================================
*/
router.post(
  "/create",
  verifyJWT,
  checkRole("admin"),
  upload.single("profileImage"), // IMPORTANT
  userController.createUser
);

/*
=====================================
GET ALL USERS
GET => /api/users
(Admin)
=====================================
*/
router.get(
  "/",
  verifyJWT,
  checkRole("admin"),
  userController.getAllUsers
);

/*
=====================================
GET USER BY ID
GET => /api/users/:id
(Admin)
=====================================
*/
router.get(
  "/:id",
  verifyJWT,
  checkRole("admin","artist","user"),
  userController.getUserById
);

/*
=====================================
UPDATE USER
PUT => /api/users/:id
(Admin)
=====================================
*/
router.put(
  "/update/:id",
  verifyJWT,
  checkRole("admin","artist","user"),
  upload.single("profileImage"), // IMPORTANT
  userController.updateUser
);

/*
=====================================
DELETE USER
DELETE => /api/users/:id
(Admin)
=====================================
*/
router.delete(
  "/:id",
  verifyJWT,
  checkRole("admin"),
  userController.deleteUser
);

module.exports = router;