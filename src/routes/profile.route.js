const express = require("express");
const multer = require("multer");

const router = express.Router();

const profileController = require("../controller/profile.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const {checkRole} = require("../middlewares/role.middleware")


const upload = multer({
  storage: multer.memoryStorage(),
});


router.get(
  "/me",
  verifyJWT,
  checkRole("admin","artist","user"),
  
  profileController.getProfile
);


router.put(
  "/update",
  verifyJWT,
  checkRole("admin","artist","user"),
  upload.single("profileImage"),
  profileController.updateProfile
);


router.delete(
  "/delete",
  verifyJWT,
  profileController.deleteProfile
);

module.exports = router;