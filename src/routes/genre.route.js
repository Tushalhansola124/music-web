const express = require("express");
const router = express.Router();

const genreController = require("../controller/genre.model");

router.post("/create", genreController.createGenre);

router.get("/getall", genreController.getAllGenres);

router.get("/:id", genreController.getGenreById);

router.put("/update/:id", genreController.updateGenre);

router.delete("/delete/:id", genreController.deleteGenre);

module.exports = router;