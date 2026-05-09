const express  = require('express');
const artistContoller = require('../controller/artist.controller');
const followContoller = require("../controller/followartist.controller")

const { checkRole } = require('../middlewares/role.middleware');
const {verifyJWT} =  require("../middlewares/auth.middleware")
const router = express.Router();
// router.post('/artistCreate',artistContoller.createArtist);


router.post('/follow/:artistId',checkRole("user"),verifyJWT,followContoller.followArtist);
router.delete('/unfollow/:artistId',checkRole("user"),verifyJWT,followContoller.unfollowArtist)
router.get('/following',checkRole("admin","artist","user"),verifyJWT,followContoller.getFollowing)
router.get('/is-following/:artistId',checkRole("admin","artist","user"),verifyJWT,followContoller.isFollowing)



module.exports = router;
