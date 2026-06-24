const playlistModel = require("../models/playlist.model");

// ======================================
// Create Playlist
// ======================================
async function createPlaylist(req, res) {
  try {
    const { name, description, songs } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required",
      });
    }

    let songArray = [];
    if (Array.isArray(songs)) {
      songArray = songs;
    } else if (typeof songs === "string") {
      songArray = songs.split(",").map((id) => id.trim()).filter(Boolean);
    }

    const playlist = await playlistModel.create({
      name,
      description: description || "",
      user: req.user._id,
      songs: songArray,
    });

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      data: playlist,
    });
  } catch (error) {
    console.log("createPlaylist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// Get All Playlists
// ✅ FIX: Only return playlists belonging to the logged-in user
// ======================================
async function getAllPlaylists(req, res) {
  try {
    // ← CHANGED: was .find() which returned ALL users' playlists
    const playlists = await playlistModel
      .find({ user: req.user._id })
      .populate("songs");

    return res.status(200).json({
      success: true,
      total: playlists.length,
      data: playlists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// Get Playlist By Id
// ======================================
async function getPlaylistById(req, res) {
  try {
    const { id } = req.params;

    const playlist = await playlistModel.findById(id).populate({
      path: "songs",
      select: "_id title",
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      data: playlist,
    });
  } catch (error) {
    console.error("getPlaylistById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// ======================================
// Update Playlist
// ======================================
async function updatePlaylist(req, res) {
  try {
    const { id } = req.params;
    const { name, description, songs } = req.body;

    const playlist = await playlistModel.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own playlist",
      });
    }

    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;

    if (songs !== undefined) {
      if (Array.isArray(songs)) {
        playlist.songs = songs;
      } else if (typeof songs === "string") {
        playlist.songs = songs.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        playlist.songs = [];
      }
      playlist.markModified("songs");
    }

    await playlist.save();

    const updatedPlaylist = await playlistModel.findById(id).populate("songs");

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      data: updatedPlaylist || playlist,
    });
  } catch (error) {
    console.log("updatePlaylist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

// ======================================
// Delete Playlist
// ======================================
async function deletePlaylist(req, res) {
  try {
    const { id } = req.params;

    const playlist = await playlistModel.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own playlist",
      });
    }

    await playlistModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.log("deletePlaylist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// Add Song To Playlist
// ======================================
async function addSongToPlaylist(req, res) {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // ✅ FIX: Now this will never fire because getAllPlaylists
    // only returns the user's own playlists
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify your own playlists.",
      });
    }

    if (playlist.songs.map((id) => id.toString()).includes(songId)) {
      return res.status(400).json({
        success: false,
        message: "Song already in playlist",
      });
    }

    playlist.songs.push(songId);
    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Song added successfully",
      data: playlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ======================================
// Remove Song From Playlist
// ======================================
async function removeSongFromPlaylist(req, res) {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify your own playlists.",
      });
    }

    playlist.songs = playlist.songs.filter(
      (id) => id.toString() !== songId
    );

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Song removed successfully",
      data: playlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};