const express  = require('express');
const artistContoller = require('../controller/artist.controller');
const multer = require('multer');
const { checkRole } = require('../middlewares/role.middleware');
const {verifyJWT} =  require("../middlewares/auth.middleware")
const upload = multer({
    storage: multer.memoryStorage(),
});
const router = express.Router();

// router.post('/artistCreate',artistContoller.createArtist);

router.post("/artistCreate", upload.single("image"),verifyJWT,checkRole("admin"),artistContoller.createArtist);
router.put("/artistupdate/:id", upload.single("image"),verifyJWT,checkRole("admin","artist"), artistContoller.updateArtist);
router.get('/getallArtist',verifyJWT,checkRole("admin","artist","user"),artistContoller.getallArtist);
router.delete('/artistDelete/:id',verifyJWT,checkRole("admin"),artistContoller.deleteArtist);
router.get('/getArtistById/:id',verifyJWT,checkRole("admin","artist","user"),artistContoller.getArtistById);



module.exports = router;
