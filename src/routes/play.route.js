const express = require("express");

const router = express.Router();

const songController = require("../controller/song.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");

/*
========================================
PLAY SONG
POST => /api/song/play/:id
========================================
*/

router.post(
  "/play/:id",
  verifyJWT,
  songController.playSong
);

module.exports = router;