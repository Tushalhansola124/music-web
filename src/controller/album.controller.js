const albumModel = require("../models/album.model");
const artistModel = require("../models/artist.model");
const { uploadFile, deleteFile } = require("../services/storage.services");



// =========================
// CREATE ALBUM
// =========================
async function createAlbum(req, res) {
  try {
    const { title, artist, releaseDate } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!artist) {
      return res.status(400).json({
        success: false,
        message: "Artist is required",
      });
    }

    let imageUrl = "";
    let imageFileId = "";

    // Upload cover image
    if (req.file) {
      const result = await uploadFile(
        req.file.buffer.toString("base64"),
        "music_app/albums"
      );

      imageUrl = result.url;
      imageFileId = result.fileId;
    }

    const album = await albumModel.create({
      title,
      artist,
      releaseDate,
      coverImage: imageUrl,
      imageFileId,
    });

    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: album,
    });

  } catch (error) {
    console.log("createAlbum error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// =========================
// GET ALL ALBUMS
// =========================
async function getAllAlbums(req, res) {
  try {

    const albums = await albumModel
      .find()
      .populate("artist")
      .populate("songs");

    return res.status(200).json({
      success: true,
      total: albums.length,
      data: albums,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// Get The Albums for UserId to Login Artist 
async function getAllAlbumsForArtist(req, res) {
  try {
    console.log("JWT User:", req.user);

    // Find artist linked to logged-in user
    const artist = await artistModel.findOne({
      user: req.user._id,
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist profile not found",
      });
    }

    console.log("Artist:", artist);

    // Get all albums of this artist
    const albums = await albumModel
      .find({ artist: artist._id })
      .populate("artist")
      .select("-songs");

    return res.status(200).json({
      success: true,
      total: albums.length,
      data: albums,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// =========================
// GET ALBUM BY ID
// =========================
async function getAlbumById(req, res) {
  try {

    const { id } = req.params;

    const album = await albumModel
      .findById(id)
      .populate("artist")
      .populate("songs");

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: album,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// =========================
// UPDATE ALBUM
// =========================
async function updateAlbum(req, res) {
  try {

    const { id } = req.params;
    const { title, artist, releaseDate } = req.body;

    const album = await albumModel.findById(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Update fields
    if (title) album.title = title;
    if (artist) album.artist = artist;
    if (releaseDate) album.releaseDate = releaseDate;

    // Update image
    if (req.file) {

      // delete old image
      if (album.imageFileId) {
        await deleteFile(album.imageFileId);
      }

      // upload new image
      const result = await uploadFile(
        req.file.buffer.toString("base64"),
        "music_app/albums"
      );

      album.coverImage = result.url;
      album.imageFileId = result.fileId;
    }

    await album.save();

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: album,
    });

  } catch (error) {

    console.log("updateAlbum error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// =========================
// DELETE ALBUM
// =========================
async function deleteAlbum(req, res) {
  try {

    const { id } = req.params;

    const album = await albumModel.findById(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Delete image from ImageKit
    if (album.imageFileId) {
      await deleteFile(album.imageFileId);
    }

    await albumModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  getAllAlbumsForArtist,
};