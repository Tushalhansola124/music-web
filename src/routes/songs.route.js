


// // const express  = require('express');
// // const songContoller = require('../controller/song.controller')
// // const multer = require('multer');
// // const { checkRole } = require('../middlewares/role.middleware');
// // const {verifyJWT} =  require("../middlewares/auth.middleware")

// // const upload = multer({
// //     storage: multer.memoryStorage(),
// // });
// // const router = express.Router();

// // // router.post('/artistCreate',artistContoller.createArtist);

// // router.post("/songCreate", upload.single("image"),verifyJWT,checkRole("admin"),songContoller.createSong);


// // module.exports = router;


// const express = require("express");
// const songContoller = require("../controller/song.controller");

// const multer = require("multer");
// const { checkRole } = require("../middlewares/role.middleware");
// const { verifyJWT } = require("../middlewares/auth.middleware");



// const router = express.Router();

// // const upload = multer({
// //   storage: multer.memoryStorage(),
// // });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024,
//   },
// });
// router.post(
//   "/songCreate",

//   verifyJWT,

//   checkRole("admin", "artist"),

//   upload.fields([
//     { name: "audio", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),

//   songContoller.createSong
// );

// router.get("/songGetAll",verifyJWT,checkRole("admin","artist","user"),songContoller.getAllSong);
// router.get("/getByIdSong/:id",verifyJWT,checkRole("admin","artist","user"),songContoller.getByIdSong);
// router.delete("/deleteSong/:id",verifyJWT,checkRole("admin","artist"),songContoller.deleteSong);
// router.put(
//   "/updateSong/:id",
//   verifyJWT,
//   checkRole("admin", "artist"),
//   upload.fields([
//     { name: "audio", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   songContoller.updateSong
// );
// router.post(
//   "/play/:id",
//   verifyJWT,
//   songContoller.playSong
// );


// module.exports = router;


const express = require("express");

const songContoller =
  require("../controller/song.controller");

const multer = require("multer");

const {
  checkRole,
} = require("../middlewares/role.middleware");

const {
  verifyJWT,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// =====================================
// MULTER CONFIG
// =====================================

const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024,
  },

});

// =====================================
// CREATE SONG
// =====================================

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

// =====================================
// GET ALL SONGS
// =====================================

router.get(
  "/songGetAll",
  verifyJWT,
  songContoller.getAllSong
);

// router.get(
//   "/songGetAll",
//   verifyJWT,
//   checkRole("admin", "artist"),
//   songContoller.getAllSong,  
// );

// router.get(
//   "/songsGetAll",
//     verifyJWT,
//    checkRole("admin", "artist"),
//   songContoller.getAllSongs,

// );

router.get("/songs/:artistId", verifyJWT, checkRole("admin", "artist"), songContoller.getAllSongs);

// =====================================
// GET SONG BY ID
// =====================================

router.get(
  "/getByIdSong/:id",
  verifyJWT,
  checkRole("admin", "artist","user"),
  songContoller.getByIdSong
);

// =====================================
// DELETE SONG
// =====================================

router.delete(
  "/deleteSong/:id",
  verifyJWT,
  checkRole("admin", "artist"),
  songContoller.deleteSong
);

// =====================================
// UPDATE SONG
// =====================================

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

// =====================================
// PLAY SONG
// =====================================

router.post(
  "/play/:id",
  verifyJWT,
  songContoller.playSong
);

module.exports = router;