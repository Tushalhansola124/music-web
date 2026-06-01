const express = require("express");

const router = express.Router();

const likeController = require("../controller/likesong.contoller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const { checkRole} = require("../middlewares/role.middleware")


// Like Song
router.post(
  "/like/:songId",
  verifyJWT,
  checkRole("user","admin"),
  likeController.likeSong
);

// Unlike Song
router.delete(
  "/unlike/:songId",
  verifyJWT,
   checkRole("user","admin"),
  likeController.unlikeSong
);

// Check Liked
router.get(
  "/is-liked/:songId",
  verifyJWT,
  likeController.isLikedSong
);

// Get All Liked Songs
router.get(
  "/liked-songs",
  verifyJWT,
   checkRole("admin","artist","user"),
  likeController.getLikedSongs
);

module.exports = router;