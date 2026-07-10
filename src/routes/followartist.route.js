const express  = require('express');
const artistContoller = require('../controller/artist.controller');
const followContoller = require("../controller/followartist.controller")

const { checkRole } = require('../middlewares/role.middleware');
const {verifyJWT} =  require("../middlewares/auth.middleware")
const router = express.Router();
// router.post('/artistCreate',artistContoller.createArtist);


router.post(
  "/follow/:artistId",
  verifyJWT,
  checkRole("admin", "user"),
  followContoller.followArtist
);

router.delete(
  "/unfollow/:artistId",
  verifyJWT,
  checkRole("admin", "user"),
  followContoller.unfollowArtist
);

router.get(
  "/following",
  verifyJWT,
  checkRole("admin", "artist", "user"),
  followContoller.getFollowing
);

router.get(
  "/is-following/:artistId",
  verifyJWT,
  checkRole("admin", "artist", "user"),
  followContoller.isFollowing
);



module.exports = router;
