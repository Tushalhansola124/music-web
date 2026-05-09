const express = require("express");
const multer = require("multer");

const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} = require("../controller/album.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");



const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// CREATE
router.post(
  "/create",
  verifyJWT,
  checkRole("admin", "artist"),
  upload.single("coverImage"),
  createAlbum
);

// GET ALL
router.get("/all",  verifyJWT,
  checkRole("admin", "artist","users"), getAllAlbums);

// GET BY ID
router.get("/:id",   verifyJWT,
  checkRole("admin","artist","user"),getAlbumById);

// UPDATE
router.put(
  "/update/:id",
  verifyJWT,
  checkRole("admin", "artist"),
  upload.single("coverImage"),
  updateAlbum
);

// DELETE
router.delete(
  "/delete/:id",
  verifyJWT,
  checkRole("admin", "artist"),
  deleteAlbum
);

module.exports = router;