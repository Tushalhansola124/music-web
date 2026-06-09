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

    // ✅ FIXED: Handle both Array and String safely
    let songArray = [];

    if (Array.isArray(songs)) {
      songArray = songs;
    } else if (typeof songs === "string") {
      songArray = songs.split(",").map(id => id.trim()).filter(Boolean);
    }

    const playlist = await playlistModel.create({
      name,
      description: description || "",
      user: req.user._id,
      songs: songArray,           // ← Now always an array
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
// ======================================
async function getAllPlaylists(req, res) {
  try {

    const playlists = await playlistModel
      .find()
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

    const playlist = await playlistModel
      .findById(id)
      .populate({
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
// async function updatePlaylist(req, res) {
//   try {
//     const { id } = req.params;
//     const { name, description, songs } = req.body;

//     const playlist = await playlistModel.findById(id);

//     if (!playlist) {
//       return res.status(404).json({
//         success: false,
//         message: "Playlist not found",
//       });
//     }

//     // Owner check
//     if (playlist.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You can update only your playlist",
//       });
//     }

//     // Update fields safely
//     if (name) playlist.name = name;
//     if (description !== undefined) playlist.description = description;

//     // FIXED: Handle both array and string for songs
//     if (songs !== undefined) {
//       if (Array.isArray(songs)) {
//         playlist.songs = songs;                    // Already array → use directly
//       } else if (typeof songs === "string") {
//         playlist.songs = songs.split(",").map(s => s.trim()).filter(Boolean);
//       } else {
//         playlist.songs = [];
//       }
//     }

//     await playlist.save();

//     return res.status(200).json({
//       success: true,
//       message: "Playlist updated successfully",
//       data: playlist,
//     });

//   } catch (error) {
//     console.log("updatePlaylist error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// }

async function updatePlaylist(req, res) {
  try {
    const { id } = req.params;
    const { name, description, songs } = req.body;

    // Find playlist
    const playlist = await playlistModel.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // Owner Check
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own playlist",
      });
    }

    // Update basic fields
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;

    // 🔥 FIXED: Handle songs array properly
    if (songs !== undefined) {
      if (Array.isArray(songs)) {
        playlist.songs = songs;                    // Direct array from frontend
      } else if (typeof songs === "string") {
        playlist.songs = songs.split(",").map(s => s.trim()).filter(Boolean);
      } else {
        playlist.songs = [];
      }

      // Important for Mongoose arrays
      playlist.markModified('songs');
    }

    // Save
    await playlist.save();

    // Optional: Populate songs if you want full data in response
    const updatedPlaylist = await playlistModel.findById(id)
      .populate('songs');

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

    // Owner check
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your playlist",
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

    // Owner check
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Already exists check
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: "Song already added",
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

    // Owner check
    if (playlist.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
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