


// const express  = require('express');
// const songContoller = require('../controller/song.controller')
// const multer = require('multer');
// const { checkRole } = require('../middlewares/role.middleware');
// const {verifyJWT} =  require("../middlewares/auth.middleware")

// const upload = multer({
//     storage: multer.memoryStorage(),
// });
// const router = express.Router();

// // router.post('/artistCreate',artistContoller.createArtist);

// router.post("/songCreate", upload.single("image"),verifyJWT,checkRole("admin"),songContoller.createSong);


// module.exports = router;


const express = require("express");
const songContoller = require("../controller/song.controller");

const multer = require("multer");
const { checkRole } = require("../middlewares/role.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");



const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/songCreate",

  verifyJWT,

  checkRole("admin", "artist"),

  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),

  songContoller.createSong
);

router.get("/songGetAll",verifyJWT,checkRole("admin","artist","user"),songContoller.getAllSong);
router.get("/getByIdSong/:id",verifyJWT,checkRole("admin","artist","user"),songContoller.getByIdSong);
router.delete("/deleteSong/:id",verifyJWT,checkRole("admin","artist"),songContoller.deleteSong);
router.put(
  "/updateSong/:id",
  verifyJWT,
  checkRole("admin", "artist"),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  songContoller.updateSong
);

module.exports = router;