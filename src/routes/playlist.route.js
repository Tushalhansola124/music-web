const express = require("express");

const router = express.Router();

const playlistController = require("../controller/paylist.contoller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const {checkRole} = require("../middlewares/role.middleware")

// Create Playlist
router.post(
  "/create",
  verifyJWT,
  checkRole("admin","user"),
  playlistController.createPlaylist
);

// Get All Playlists
router.get(
  "/getall",
  verifyJWT,

  playlistController.getAllPlaylists
);

// Get Playlist By Id
router.get(
  "/:id",
  verifyJWT,
  playlistController.getPlaylistById
);

// Update Playlist
router.put(
  "/update/:id",
  verifyJWT,
  checkRole("admin","user"),
  playlistController.updatePlaylist
);

// Delete Playlist
router.delete(
  "/delete/:id",
  verifyJWT,
  checkRole("admin","user"),
  playlistController.deletePlaylist
);

// Add Song
router.post(
  "/add-song/:playlistId/:songId",
  verifyJWT,
  checkRole("admin","user"),
  playlistController.addSongToPlaylist
);

// Remove Song
router.delete(
  "/remove-song/:playlistId/:songId",
  verifyJWT,
  checkRole("admin","user"),
  playlistController.removeSongFromPlaylist
);

module.exports = router;