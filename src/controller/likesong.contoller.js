


const songModel = require("../models/song.model");

// ==============================
async function likeSong(req, res) {
  try {

    const { songId } = req.params;

    const userId = req.user._id;

    // 1. Find Song
    const song = await songModel.findById(songId);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // 2. Already liked check
    const alreadyLiked = song.likedBy.includes(userId);

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Song already liked",
      });
    }

    // 3. Add user in likedBy
    song.likedBy.push(userId);

    // 4. Increase likes count
    song.likes += 1;

    await song.save();

    return res.status(200).json({
      success: true,
      message: "Song liked successfully",
      totalLikes: song.likes,
      data: song,
    });

  } catch (error) {

    console.log("likeSong error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ==============================
// Unlike Song
// ==============================
async function unlikeSong(req, res) {
  try {

    const { songId } = req.params;

    const userId = req.user._id;

    // 1. Find Song
    const song = await songModel.findById(songId);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // 2. Check liked or not
    const alreadyLiked = song.likedBy.includes(userId);

    if (!alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Song not liked yet",
      });
    }

    // 3. Remove user from likedBy
    song.likedBy = song.likedBy.filter(
      (id) => id.toString() !== userId.toString()
    );

    // 4. Decrease likes
    if (song.likes > 0) {
      song.likes -= 1;
    }

    await song.save();

    return res.status(200).json({
      success: true,
      message: "Song unliked successfully",
      totalLikes: song.likes,
      data: song,
    });

  } catch (error) {

    console.log("unlikeSong error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ==============================
// Check Song Liked or Not
// ==============================
async function isLikedSong(req, res) {
  try {

    const { songId } = req.params;

    const userId = req.user._id;

    const song = await songModel.findById(songId);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    const isLiked = song.likedBy.includes(userId);

    return res.status(200).json({
      success: true,
      isLiked,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ==============================
// Get All Liked Songs
// ==============================
async function getLikedSongs(req, res) {
  try {

    const userId = req.user._id;

    const songs = await songModel.find({
      likedBy: userId,
    })
    .populate("artist")
    .populate("album")
    .populate("genre");

    return res.status(200).json({
      success: true,
      total: songs.length,
      data: songs,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  likeSong,
  unlikeSong,
  isLikedSong,
  getLikedSongs,
};