const genreModel = require("../models/genre.model");

async function createGenre(req, res) {
  try {
    const { name } = req.body;

    const existingGenre = await genreModel.findOne({ name });

    if (existingGenre) {
      return res.status(400).json({
        success: false,
        message: "Genre already exists",
      });
    }

    const genre = await genreModel.create({ name });

    return res.status(201).json({
      success: true,
      message: "Genre created successfully",
      data: genre,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllGenres(req, res) {
  try {
    const genres = await genreModel.find();

    return res.status(200).json({
      success: true,
      data: genres,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
async function getGenreById(req, res) {
  try {
    const genre = await genreModel.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: genre,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
async function updateGenre(req, res) {
  try {
    const { name } = req.body;

    const genre = await genreModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      data: genre,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteGenre(req, res) {
  try {
    await genreModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Genre deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = { createGenre,getAllGenres,getGenreById,updateGenre,deleteGenre};